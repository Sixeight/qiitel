
require 'bundler'
Bundler.require

class User < ActiveRecord::Base
  validates :twitter_id, uniqueness: true, presence: true
  validates :token,      uniqueness: true, presence: true

  validates :name,      length: { maximum: 15, minimum: 1 }, presence: true
  validates :url,       format: { with: %r!\Ahttps?://! }
  validates :image_url, format: { with: %r!\Ahttps?://.+\.(png|jpg|jpeg|gif|svg)\z! }

  has_many :activities
end
