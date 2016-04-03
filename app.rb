
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

  get '/' do
    tracks = Track.order('created_at DESC')
    JSON.dump tracks.map(&:attributes)
  end

  post '/listen' do
    product_id = params[:product_id]
    if product_id.nil? || product_id.empty?
        return status(400)
    end
    lookup = Lookup.new(product_id)
    res = lookup.execute
    return status(201) if res.nil?
    return status(201) unless res.resultCount == 1
    track_info = OpenStruct.new(res.results.first)
    return status(201) unless track_info.isStreamable
    Track.create_from_track_info(track_info)
    status(201)
  end
end