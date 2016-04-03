class CreateTrack < ActiveRecord::Migration
  def change
    create_table :tracks do |t|
      t.string :title,         null: false, index: true
      t.string :artist,        null: false, index: true
      t.string :album,         null: false, index: true
      t.string :product_id,    null: false
      t.string :preview_url,   null: false
      t.string :thumbnail_url, null: false

      t.timestamps null: false
    end
  end
end
