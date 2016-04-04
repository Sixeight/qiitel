# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20160405035727) do

  create_table "tracks", force: :cascade do |t|
    t.string   "track_id",            null: false
    t.string   "track_name",          null: false
    t.string   "artist_name",         null: false
    t.string   "collection_name",     null: false
    t.string   "preview_url",         null: false
    t.string   "thumbnail_url",       null: false
    t.string   "track_view_url",      null: false
    t.datetime "created_at",          null: false
    t.datetime "updated_at",          null: false
    t.string   "artist_id",           null: false
    t.string   "collection_id",       null: false
    t.string   "artist_view_url",     null: false
    t.string   "collection_view_url", null: false
    t.string   "genre_name",          null: false
    t.datetime "released_at",         null: false
  end

  add_index "tracks", ["artist_name"], name: "index_tracks_on_artist_name"
  add_index "tracks", ["collection_name"], name: "index_tracks_on_collection_name"
  add_index "tracks", ["created_at"], name: "index_tracks_on_created_at"
  add_index "tracks", ["track_id"], name: "index_tracks_on_track_id", unique: true
  add_index "tracks", ["track_name"], name: "index_tracks_on_track_name"

end
