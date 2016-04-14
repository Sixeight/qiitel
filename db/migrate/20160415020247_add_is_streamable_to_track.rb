class AddIsStreamableToTrack < ActiveRecord::Migration
  require_relative '../../model/track'

  def change
    add_column :tracks, :is_streamable, :boolean, defualt: false
    Track.update_all(is_streamable: true)
  end
end
