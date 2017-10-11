class CreateListener < ActiveRecord::Migration[4.2]
  def change
    create_table :last_listeners do |t|
      t.belongs_to :track, null: false
      t.belongs_to :user

      t.timestamps null: false
    end

    create_table :activities do |t|
      t.belongs_to :track, null: false
      t.belongs_to :user,  null: false

      t.timestamps null: false
    end
  end
end
