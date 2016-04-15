class CreateUser < ActiveRecord::Migration
  def change
    create_table :users do |t|
      t.string  :twitter_id, null: false
      t.string  :name,       null: false
      t.boolean :visible,   null: false, default: true
      t.string  :image_url
      t.string  :url

      # アプリからこれを指定する
      t.string :token, null: false

      t.timestamps null: false

      t.index :twitter_id, unique: true
      t.index :token,      unique: true
      t.index :name,       unique: true
    end
  end
end
