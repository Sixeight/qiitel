
require 'bundler'
Bundler.require

require 'net/https'
require 'uri'
require 'json'
require 'cgi'
require 'ostruct'
require_relative 'db/setup'

Dir['model/**/*.rb'].each do |path|
  require_relative path
end

Dir['lib/**/*.rb'].each do |path|
  require_relative path
end

class Playlist < Sinatra::Base
  # configure :development do
  #   register Sinatra::Reloader
  # end

  set :views, settings.root + '/view'
  set :public_folder, settings.root + '/static'

  set :limit, 50

  helpers do
    def u(str)
      CGI.escape(str)
    end
  end

  get '/' do
    @tracks = Track.limit(settings.limit)
    erb :index
  end

  get '/genre/:genre_name' do
    @genre_name = params[:genre_name]
    @tracks = Track.where(genre_name: @genre_name).page(params[:page]).per(settings.limit)
    erb :index
  end

  get '/recents' do
    limit = params[:limit].to_i
    limit = [[1, limit].max, 10].min
    tracks = Track.limit(limit)
    content_type 'application/json'
    JSON.dump tracks.map(&:hash_for_recents)
  end

  get '/tracks' do
    track_ids = Track.select('track_id').limit(settings.limit)
    content_type 'application/json'
    JSON.dump track_ids.map(&:track_id).shuffle
  end

  post '/listen' do
    track_id = params[:product_id]
    if track_id.nil? || track_id.empty?
        return status(400)
    end
    return status(400) if track_id !~ /\A\d+\z/
    track = Track.find_by(track_id: track_id)
    # すでに聴いてる曲だったらupdated_atを更新する
    track.touch if track
    track ||= create_track(track_id)
    return status(201) if track.nil?
    post_to_slack track
    status(201)
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
end
