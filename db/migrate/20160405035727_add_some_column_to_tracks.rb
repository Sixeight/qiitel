class AddSomeColumnToTracks < ActiveRecord::Migration[4.2]
  require 'ostruct'
  require_relative '../../lib/lookup'
  require_relative '../../model/track'

  def change
    rename_column :tracks, :title, :track_name
    rename_column :tracks, :artist, :artist_name
    rename_column :tracks, :album, :collection_name
    rename_column :tracks, :product_id, :track_id
    rename_column :tracks, :store_url, :track_view_url
    add_column :tracks, :artist_id, :string
    add_column :tracks, :collection_id, :string
    add_column :tracks, :artist_view_url, :string
    add_column :tracks, :collection_view_url, :string
    add_column :tracks, :genre_name, :string
    add_column :tracks, :released_at, :datetime

    track_infos = Track.all.map do |track|
      lookup = Lookup.new(track.track_id)
      OpenStruct.new(lookup.execute['results'].first)
    end
    Track.delete_all
    track_infos.each do |track_info|
      Track.create_from_track_info(track_info)
    end

    change_column :tracks, :artist_id, :string, null: false
    change_column :tracks, :collection_id, :string, null: false
    change_column :tracks, :artist_view_url, :string, null: false
    change_column :tracks, :collection_view_url, :string, null: false
    change_column :tracks, :genre_name, :string, null: false
    change_column :tracks, :released_at, :datetime, null: false
  end
end
