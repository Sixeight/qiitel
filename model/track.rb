
require 'bundler'
Bundler.require

require 'time'

class Track < ActiveRecord::Base
  validates :track_id, uniqueness: true

  has_one :last_listener
  has_one :user, through: :last_listener

  default_scope do
    order 'tracks.updated_at DESC'
  end

  def self.create_from_track_info(track_info)
    hash = {
      track_name:          track_info.trackName,
      artist_name:         track_info.artistName,
      collection_name:     track_info.collectionName,
      track_id:            track_info.trackId,
      artist_id:           track_info.artistId,
      collection_id:       track_info.collectionId,
      preview_url:         track_info.previewUrl,
      thumbnail_url:       track_info.artworkUrl100,
      track_view_url:      track_info.trackViewUrl,
      artist_view_url:     track_info.artistViewUrl,
      collection_view_url: track_info.collectionViewUrl,
      genre_name:          track_info.primaryGenreName,
      released_at:         Time.parse(track_info.releaseDate),
      is_streamable:       track_info.isStreamable,
    }
    create hash
  end

  def app_type
    is_streamable ? 'music' : 'itunes'
  end

  def hash_for_recents
    {
      track_name:      self.track_name,
      artist_name:     self.artist_name,
      collection_name: self.collection_name,
      track_view_url:  self.track_view_url,
      is_streamable:   self.is_streamable,
    }
  end

  def to_hash
    hash = {
      track_id:            self.track_id,
      track_name:          self.track_name,
      artist_name:         self.artist_name,
      collection_name:     self.collection_name,
      genre_name:          self.genre_name,
      released_at:         self.released_at.to_i,
      updated_at:          self.updated_at.to_i,
      thumbnail_url:       self.thumbnail_url,
      track_view_url:      self.track_view_url,
      artist_view_url:     self.artist_view_url,
      collection_view_url: self.collection_view_url,
      preview_url:         self.preview_url,
      app_type:            self.app_type,
      is_streamable:       self.is_streamable,
    }
    if self.user.present?
      hash[:user] = self.user.to_hash
    end
    hash
  end
end

__END__
{
      "wrapperType": "track",
      "kind": "song",
      "artistId": 74572627,
      "collectionId": 720363815,
      "trackId": 720364416,
      "artistName": "ハナレグミ",
      "collectionName": "音タイム",
      "trackName": "家族の風景",
      "collectionCensoredName": "音タイム",
      "trackCensoredName": "家族の風景",
      "artistViewUrl": "https://itunes.apple.com/jp/artist/hanaregumi/id74572627?uo=4",
      "collectionViewUrl": "https://itunes.apple.com/jp/album/jia-zuno-feng-jing/id720363815?i=720364416&uo=4",
      "trackViewUrl": "https://itunes.apple.com/jp/album/jia-zuno-feng-jing/id720363815?i=720364416&uo=4",
      "previewUrl": "http://a1689.phobos.apple.com/us/r30/Music6/v4/02/13/cc/0213cc43-7fdb-ef3b-c05a-32800b50a04b/mzaf_4637413569113810776.plus.aac.p.m4a",
      "artworkUrl30": "http://is4.mzstatic.com/image/thumb/Music4/v4/ca/73/21/ca73210d-f6f7-c805-08ca-41e7f2ee5cbf/source/30x30bb.jpg",
      "artworkUrl60": "http://is4.mzstatic.com/image/thumb/Music4/v4/ca/73/21/ca73210d-f6f7-c805-08ca-41e7f2ee5cbf/source/60x60bb.jpg",
      "artworkUrl100": "http://is4.mzstatic.com/image/thumb/Music4/v4/ca/73/21/ca73210d-f6f7-c805-08ca-41e7f2ee5cbf/source/100x100bb.jpg",
      "collectionPrice": 1600,
      "trackPrice": 250,
      "releaseDate": "2004-04-01T08:00:00Z",
      "collectionExplicitness": "notExplicit",
      "trackExplicitness": "notExplicit",
      "discCount": 1,
      "discNumber": 1,
      "trackCount": 9,
      "trackNumber": 4,
      "trackTimeMillis": 277293,
      "country": "JPN",
      "currency": "JPY",
      "primaryGenreName": "ポップ",
      "isStreamable": true
    }
