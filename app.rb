
require 'bundler'
Bundler.require

require 'net/https'
require 'uri'
require 'json'
require 'cgi'
require 'ostruct'

# DBの接続設定
require_relative 'db/setup'

Dir['model/**/*.rb'].each do |path|
  require_relative path
end

Dir['lib/**/*.rb'].each do |path|
  require_relative path
end

class Playlist < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
    also_reload 'model/**/*.rb'
    also_reload 'view/**/*.rb'
    also_reload 'lib/**/*.rb'

    ActiveRecord::Base.logger = Logger.new(STDOUT)

    # 本番ではキャッシュヘッダをつけるためにRackから返している
    set :public_folder, settings.root + '/static'

    # Docker上ではデーモン起動するのでファイルに書く
    # see also: http://recipes.sinatrarb.com/p/middleware/rack_commonlogger
    enable :logging
    file = File.new("#{settings.root}/log/#{settings.environment}.log", 'a+')
    file.sync = true
    use Rack::CommonLogger, file
  end

  configure :production do
  end

  configure do
    enable :sessions

    set :manifest, JSON.load(
      File.read(File.expand_path('./config/manifest.json', __dir__))
    )

    use OmniAuth::Builder do
      provider :twitter, ENV['TWITTER_CONSUMER_KEY'], ENV['TWITTER_CONSUMER_SECRET']
    end

    set :views, settings.root + '/view'

    # 一回で読み込む曲数
    set :limit, 25

    if ENV['TWEET_CONSUMER_KEY'].present?    &&
        ENV['TWEET_CONSUMER_SECRET'].present? &&
        ENV['TWEET_ACCESS_TOKEN'].present?    &&
        ENV['TWEET_ACCESS_SECRET'].present?

        client = Twitter::REST::Client.new do |config|
            config.consumer_key        = ENV['TWEET_CONSUMER_KEY']
            config.consumer_secret     = ENV['TWEET_CONSUMER_SECRET']
            config.access_token        = ENV['TWEET_ACCESS_TOKEN']
            config.access_token_secret = ENV['TWEET_ACCESS_SECRET']
        end
        set :twitter, client
      end

    if ENV['PROFILE_CONSUMER_KEY'].present?    &&
        ENV['PROFILE_CONSUMER_SECRET'].present? &&
        ENV['PROFILE_ACCESS_TOKEN'].present?    &&
        ENV['PROFILE_ACCESS_SECRET'].present?

        my_client = Twitter::REST::Client.new do |config|
            config.consumer_key        = ENV['PROFILE_CONSUMER_KEY']
            config.consumer_secret     = ENV['PROFILE_CONSUMER_SECRET']
            config.access_token        = ENV['PROFILE_ACCESS_TOKEN']
            config.access_token_secret = ENV['PROFILE_ACCESS_SECRET']
        end
        set :my_twitter, my_client
      end
  end

  helpers do
    def u(str)
      CGI.escape(str)
    end

    def production?
      settings.production?
    end

    def static_file(key)
      settings.manifest[key] || ""
    end
  end

  private def json(raw)
    content_type 'application/json; charset=utf8'
    JSON.dump raw
  end

  before do
    @user = User.find_by(token: params[:token] || session[:qlsc])
  end

  get '/' do
    erb :index, layout: nil
  end

  get '/genres/:genre_name' do
    erb :index, layout: nil
  end

  get '/users/:user_name' do
    erb :index, layout: nil
  end

  get '/api/tracks' do
    @tracks = Track.eager_load(:user).page(params[:page]).per(settings.limit)
    json({ tracks: @tracks.map(&:to_hash), next_page: @tracks.next_page })
  end

  get '/api/genres/:genre_name' do
    @genre_name = params[:genre_name]
    @tracks = Track.
      eager_load(:user).
      where(genre_name: @genre_name).
      page(params[:page]).
      per(settings.limit)
    json({ tracks: @tracks.map(&:to_hash), next_page: @tracks.next_page })
  end

  get '/api/users/:user_name' do
    user_name = params[:user_name]
    user = User.find_by(name: user_name)
    if user.nil?
      status(404)
      return json({ tracks: [] })
    end
    activities = Activity.
      eager_load(:track, :user).
      where(user_id: user.id).
      page(params[:page]).
      per(settings.limit)
    next_page = activities.next_page
    activities = activities.uniq {|a| a.track_id }
    json({ tracks: activities.map(&:to_hash), next_page: next_page })
  end

  get '/api/genres' do
    tracks = Track.select('genre_name').distinct.unscope(:order)
    json({ genre_names: tracks.map(&:genre_name) })
  end

  get '/register' do
    return redirect to('/') if @user.nil?
    session[:qlsc] = nil
    erb :register, layout: nil
  end

  get '/login' do
    redirect to('/auth/twitter')
  end

  get '/logout' do
    session[:qlsc] = nil
    redirect to('/')
  end

  get '/recent_streamables.json' do
    track_ids = Track.where(is_streamable: true).limit(settings.limit).pluck(:track_id)
    json track_ids
  end

  post '/listen' do
    track_id = params[:product_id]
    if track_id.nil? || track_id.empty?
        return status(400)
    end
    return status(400) if track_id !~ /\A\d+\z/

    latest_track = Track.first

    track = Track.find_by(track_id: track_id)
    # すでに聴いてる曲だったらupdated_atを更新する
    track.touch if track
    track ||= create_track(track_id)

    return status(400) if track.nil?

    update_last_listener track, @user

    if @user.present?
      # ログインしているときで、前回違う曲を聴いた場合は
      # アクティビティを更新して、Slack/Twitterに投稿する
      last_activity = @user.activities.first
      if last_activity.nil? || last_activity.track != track
        create_activity(track, @user)
        if latest_track != track
          post_to_slack track
          tweet track
        end
      end

      if @user.twitter_id == ENV['MY_TWITTER_ID']
        update_profile(track)
      end
    else
      # ゲストの場合は1つ前の曲と違う曲を聴いたときに
      # Slack/Twitterに投稿する
      if latest_track != track
        post_to_slack track
        tweet track
      end
    end

    status(201)
  end

  get '/auth/twitter/callback' do
    auth_hash = env.dig('omniauth.auth', 'extra', 'raw_info')
    return status(401) unless auth_hash

    twitter_id  = auth_hash['id_str']
    screen_name = auth_hash['screen_name']
    image_url   = auth_hash['profile_image_url']
    url         = "https://twitter.com/#{screen_name}"
    token       = Token.generate

    params = {
      twitter_id: twitter_id,
      name:       screen_name,
      image_url:  image_url,
      url:        url,
      token:      token,
    }

    user = User.find_by(twitter_id: twitter_id)
    if user.present?
        user.update(params)
    else
        user = User.create(params)
    end
    return status(401) if user.nil?

    session[:qlsc] = user.token
    redirect to('/register')
  end

  private

  def create_track(track_id)
    lookup = Lookup.new(track_id)
    res = lookup.execute
    return nil if res.nil?
    return nil if res.resultCount != 1
    track_info = OpenStruct.new(res.results.first)
    return Track.create_from_track_info(track_info)
  end

  def update_last_listener(track, user)
    last_listener = if track.last_listener.nil?
                      track.build_last_listener
                    else
                      track.last_listener
                    end
    last_listener.user = user
    last_listener.save
  end

  def create_activity(track, user)
    activity = Activity.new
    activity.track = track
    activity.user  = user
    activity.save
  end

  def post_to_slack(track)
    return if ENV['SLACK_WEBHOOK'].nil?

    require 'net/https'

    payload = {
      channel: '#music',
      username: track.track_name,
      # FIXME: パラメータ適当につないでるのよくない
      text: "#{track.artist_name} - #{track.collection_name}  #{track.track_view_url}&app=#{track.app_type}&at=#{ENV['AT']}",
      icon_url: track.thumbnail_url,
    }

    Net::HTTP.post_form(URI.parse(ENV['SLACK_WEBHOOK']), payload: JSON.dump(payload))
  end

  def tweet(track)
    return unless settings.respond_to?(:twitter)

    # アートワークの更新止める
    # require 'open-uri'
    # require 'base64'

    # base64_artwork = Base64.encode64(open(track.thumbnail_url).read)
    # settings.twitter.update_profile_image(base64_artwork)
    settings.twitter.update("#{track.track_name} / #{track.artist_name} - #{track.collection_name} #AppleMusic #{track.track_view_url}&app=#{track.app_type}")
  end

  def update_profile(track)
    return unless settings.respond_to?(:my_twitter)

    # ユーザー名は20文字まで
    name = track.track_name.truncate(20, separator: /(\s|\b)/)

    # URLは100文字まで
    # - 以下のようにトラックの名前が入ってしまうので取り除く
    # - https://itunes.apple.com/jp/album/dribble/id1102272883?i=1102272899&uo=4&app=itunes
    track_view_url = URI.parse(track.track_view_url)
    paths = track_view_url.path.split('/')
    track_view_url.path = (paths[0..-3] + [paths[-1]]).join('/')
    url = track_view_url.to_s[0, 100]

    # see also: https://developer.twitter.com/en/docs/accounts-and-users/manage-account-settings/api-reference/post-account-update_profile
    settings.my_twitter.update_profile(name: name, url: url)
  end
end
