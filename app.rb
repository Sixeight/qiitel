
require 'bundler'
Bundler.require

require 'net/https'
require 'uri'
require 'json'
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

  get '/' do
    @tracks = Track.limit(50)
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
    track_ids = Track.select('track_id')
    content_type 'application/json'
    JSON.dump track_ids.map(&:track_id).shuffle.take(50)
  end

  post '/listen' do
    track_id = params[:product_id]
    if track_id.nil? || track_id.empty?
        return status(400)
    end
    return status(400) if track_id !~ /\A\d+\z/
    track = Track.find_by(track_id: track_id)
    unless track.nil?
      track.touch
      return status(201)
    end
    lookup = Lookup.new(track_id)
    res = lookup.execute
    return status(201) if res.nil?
    return status(201) unless res.resultCount == 1
    track_info = OpenStruct.new(res.results.first)
    return status(201) unless track_info.isStreamable
    Track.create_from_track_info(track_info)
    status(201)
  end
end
