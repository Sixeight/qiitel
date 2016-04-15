
require 'bundler'
Bundler.require

require 'digest'
require 'securerandom'

module Secret
  # ひとまず適当に
  def self.generate
    Digest::SHA1.new.hexdigest(SecureRandom.uuid)
  end
end
