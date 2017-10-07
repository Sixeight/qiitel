
Bundler.require

use Rack::Deflater, include: %w( application/json text/json application/javascript text/css image/svg+xml )

require_relative 'app'
run Playlist

