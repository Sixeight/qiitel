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

ActiveRecord::Schema.define(version: 20160404012756) do

  create_table "tracks", force: :cascade do |t|
    t.string   "product_id",    null: false
    t.string   "title",         null: false
    t.string   "artist",        null: false
    t.string   "album",         null: false
    t.string   "preview_url",   null: false
    t.string   "thumbnail_url", null: false
    t.string   "store_url",     null: false
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  add_index "tracks", ["album"], name: "index_tracks_on_album"
  add_index "tracks", ["artist"], name: "index_tracks_on_artist"
  add_index "tracks", ["created_at"], name: "index_tracks_on_created_at"
  add_index "tracks", ["product_id"], name: "index_tracks_on_product_id", unique: true
  add_index "tracks", ["title"], name: "index_tracks_on_title"

end
