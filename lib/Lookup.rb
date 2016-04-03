
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