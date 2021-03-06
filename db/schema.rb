# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20171007212101) do

  create_table "activities", force: :cascade do |t|
    t.integer "track_id", null: false
    t.integer "user_id", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id", "updated_at"], name: "index_activities_on_user_id_and_updated_at"
  end

  create_table "last_listeners", force: :cascade do |t|
    t.integer "track_id", null: false
    t.integer "user_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["track_id"], name: "index_last_listeners_on_track_id", unique: true
  end

  create_table "tracks", force: :cascade do |t|
    t.string "track_id", null: false
    t.string "track_name", null: false
    t.string "artist_name", null: false
    t.string "collection_name", null: false
    t.string "preview_url", null: false
    t.string "thumbnail_url", null: false
    t.string "track_view_url", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "artist_id", null: false
    t.string "collection_id", null: false
    t.string "artist_view_url", null: false
    t.string "collection_view_url", null: false
    t.string "genre_name", null: false
    t.datetime "released_at", null: false
    t.boolean "is_streamable"
    t.index ["artist_id", "updated_at"], name: "index_tracks_on_artist_id_and_updated_at"
    t.index ["genre_name", "updated_at"], name: "index_tracks_on_genre_name_and_updated_at"
    t.index ["track_id"], name: "index_tracks_on_track_id", unique: true
    t.index ["updated_at"], name: "index_tracks_on_updated_at"
  end

  create_table "users", force: :cascade do |t|
    t.string "twitter_id", null: false
    t.string "name", null: false
    t.boolean "visible", default: true, null: false
    t.string "image_url"
    t.string "url"
    t.string "token", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_users_on_name", unique: true
    t.index ["token"], name: "index_users_on_token", unique: true
    t.index ["twitter_id"], name: "index_users_on_twitter_id", unique: true
  end

end
