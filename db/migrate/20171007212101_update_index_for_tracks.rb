class UpdateIndexForTracks < ActiveRecord::Migration[4.2]
  def change
    remove_index :tracks, :created_at
    remove_index :tracks, :track_name
    remove_index :tracks, :artist_name
    remove_index :tracks, :collection_name
    remove_index :tracks, :genre_name

    add_index :tracks, :updated_at
    add_index :tracks, [:genre_name, :updated_at]
    add_index :tracks, [:artist_id, :updated_at]

    add_index :activities, [:user_id, :updated_at]
    add_index :last_listeners, :track_id, unique: true
  end
end
