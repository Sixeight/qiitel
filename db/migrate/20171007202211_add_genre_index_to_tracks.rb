class AddGenreIndexToTracks < ActiveRecord::Migration[4.2]
  def change
    add_index :tracks, :genre_name
  end
end
