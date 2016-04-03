
Bundler.require

class Track < ActiveRecord::Base
  def self.create_from_response(response)
    hash = {
      title: response.trackName,
      artist: response.artistName,
      album: response.collectionName,
      product_id: response.trackId,
      preview_url: response.previewUrl,
      thumbnail_url: response.artworkUrl100,
    }
    self.create(hash)
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
