class CreateRooms < ActiveRecord::Migration
  def change
    create_table :rooms do |t|
      t.integer :apartment_id
      t.string :name
      t.integer :room_type
      t.string :size
      t.boolean :monthly
      t.integer :min_price_permonth
      t.integer :max_price_permonth
      t.boolean :daily
      t.integer :min_price_perday
      t.integer :max_price_perday
      t.integer :position
      t.boolean :available

      t.timestamps
    end
  end
end
