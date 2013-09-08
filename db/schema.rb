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
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20130908222228) do

  create_table "_apartments_old_20130715", :force => true do |t|
    t.string   "name"
    t.string   "staff"
    t.string   "telephone"
    t.string   "email"
    t.string   "address"
    t.string   "road"
    t.string   "street"
    t.integer  "province_id"
    t.integer  "amphur_id"
    t.integer  "district_id"
    t.integer  "postcode"
    t.string   "latitude"
    t.string   "longitude"
    t.text     "description"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.integer  "water_price_type"
    t.string   "water_price"
    t.string   "water_price_monthly_per_person"
    t.string   "water_price_monthly_per_room"
    t.string   "water_price_remark"
    t.integer  "electric_price_type"
    t.string   "electric_price"
    t.string   "electric_price_remark"
    t.string   "deposit"
    t.string   "advance_fee"
    t.string   "phone_price"
    t.string   "internet_price"
  end

  create_table "_rooms_old_20130728", :force => true do |t|
    t.integer  "apartment_id"
    t.string   "name"
    t.integer  "type"
    t.string   "size"
    t.boolean  "monthly"
    t.integer  "min_price_permonth"
    t.integer  "max_price_permonth"
    t.boolean  "daily"
    t.integer  "min_price_perday"
    t.integer  "max_price_perday"
    t.boolean  "available"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "amphurs", :force => true do |t|
    t.string  "code"
    t.string  "name"
    t.integer "geo_id"
    t.integer "province_id"
  end

  create_table "apartments", :force => true do |t|
    t.string   "name"
    t.string   "staff"
    t.string   "telephone"
    t.string   "email"
    t.string   "address"
    t.string   "road"
    t.string   "street"
    t.integer  "province_id"
    t.integer  "amphur_id"
    t.integer  "district_id"
    t.integer  "postcode"
    t.text     "description"
    t.datetime "created_at",                     :null => false
    t.datetime "updated_at",                     :null => false
    t.integer  "water_price_type"
    t.string   "water_price"
    t.string   "water_price_monthly_per_person"
    t.string   "water_price_monthly_per_room"
    t.string   "water_price_remark"
    t.integer  "electric_price_type"
    t.string   "electric_price"
    t.string   "electric_price_remark"
    t.string   "deposit"
    t.string   "advance_fee"
    t.string   "phone_price"
    t.string   "internet_price"
    t.boolean  "gmaps"
    t.integer  "gmaps_zoom"
    t.float    "latitude"
    t.float    "longitude"
    t.integer  "user_id"
    t.string   "state"
    t.datetime "published_at"
  end

  create_table "central_facilities", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "central_facilities_apartments", :force => true do |t|
    t.integer  "central_facility_id"
    t.integer  "apartment_id"
    t.datetime "created_at",          :null => false
    t.datetime "updated_at",          :null => false
  end

  create_table "comments", :force => true do |t|
    t.string   "title",            :limit => 50, :default => ""
    t.text     "comment"
    t.integer  "commentable_id"
    t.string   "commentable_type"
    t.integer  "user_id"
    t.datetime "created_at",                                     :null => false
    t.datetime "updated_at",                                     :null => false
  end

  add_index "comments", ["commentable_id"], :name => "index_comments_on_commentable_id"
  add_index "comments", ["commentable_type"], :name => "index_comments_on_commentable_type"
  add_index "comments", ["user_id"], :name => "index_comments_on_user_id"

  create_table "districts", :force => true do |t|
    t.string  "code"
    t.string  "name"
    t.integer "amphur_id"
    t.integer "province_id"
    t.integer "geo_id"
  end

  create_table "facilities", :force => true do |t|
    t.string   "name"
    t.datetime "created_at", :null => false
    t.datetime "updated_at", :null => false
  end

  create_table "facilities_apartments", :force => true do |t|
    t.integer  "facility_id"
    t.integer  "apartment_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "images", :force => true do |t|
    t.string   "name"
    t.string   "attachment"
    t.integer  "position"
    t.integer  "apartment_id"
    t.datetime "created_at",   :null => false
    t.datetime "updated_at",   :null => false
  end

  create_table "provinces", :force => true do |t|
    t.string  "code"
    t.string  "name"
    t.integer "geo_id"
  end

  create_table "roles", :force => true do |t|
    t.string   "name"
    t.integer  "resource_id"
    t.string   "resource_type"
    t.datetime "created_at",    :null => false
    t.datetime "updated_at",    :null => false
  end

  add_index "roles", ["name", "resource_type", "resource_id"], :name => "index_roles_on_name_and_resource_type_and_resource_id"
  add_index "roles", ["name"], :name => "index_roles_on_name"

  create_table "rooms", :force => true do |t|
    t.integer  "apartment_id"
    t.string   "name"
    t.integer  "room_type"
    t.string   "size"
    t.boolean  "monthly"
    t.integer  "min_price_permonth"
    t.integer  "max_price_permonth"
    t.boolean  "daily"
    t.integer  "min_price_perday"
    t.integer  "max_price_perday"
    t.integer  "position"
    t.boolean  "available"
    t.datetime "created_at",         :null => false
    t.datetime "updated_at",         :null => false
  end

  create_table "users", :force => true do |t|
    t.string   "email",                  :default => "", :null => false
    t.string   "encrypted_password",     :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",          :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at",                             :null => false
    t.datetime "updated_at",                             :null => false
    t.string   "name"
    t.string   "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string   "unconfirmed_email"
    t.string   "telephone"
    t.boolean  "email_notice"
    t.string   "provider"
    t.string   "uid"
    t.string   "avatar"
    t.string   "remote_avatar_url"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "users_roles", :id => false, :force => true do |t|
    t.integer "user_id"
    t.integer "role_id"
  end

  add_index "users_roles", ["user_id", "role_id"], :name => "index_users_roles_on_user_id_and_role_id"

end
