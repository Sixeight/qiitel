
require 'bundler'
Bundler.require

require 'uri'
require 'net/https'
require 'ostruct'
require 'json'

class Lookup
  ENDPOINT = 'itunes.apple.com'
  COUNTRY  = 'JP'

  def initialize(track_id)
    @track_id = track_id
  end

  def execute
    query = { country: COUNTRY, id: @track_id }.to_a.map {|parts| parts.join('=') }.join('&')
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
