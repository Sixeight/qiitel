
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

class Lookup
  ENDPOINT = 'itunes.apple.com'
  COUNTRY  = 'JP'

  def initialize(product_id)
    @product_id = product_id
  end

  def execute
    query = { country: COUNTRY, id: @product_id }.to_a.map {|parts| parts.join('=') }.join('&')
    response = Net::HTTP.start(ENDPOINT) do |http|
      uri = URI.parse('/lookup')
      uri.query = query
      http.get uri.to_s
    end
    if response.code == '200'
      return OpenStruct.new JSON.parse(response.body)
    else
      return nil
    end
  end
end

class Playlist < Sinatra::Base
  configure :development do
    register Sinatra::Reloader
  end

  get '/' do
    tracks = Track.all
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
    Track.create_from_response(track_info)
    status(201)
  end
end
