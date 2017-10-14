
Bundler.require

if ENV["RACK_ENV"] == "production"
  use Rack::Deflater, include: %w( application/json text/json application/javascript text/css image/svg+xml )
end

if ENV["RACK_ENV"] == "production" || ENV["APP_ENV"] == "production"
  use Rack::Static,
    urls: ["/js", "/css", "/image"],
    root: "static",
    header_rules: [
      [:all, { "Cache-Control" => "public, max-age=31536000" }],
    ]
end

require_relative "app"
run Playlist

