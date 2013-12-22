class CreateDistricts < ActiveRecord::Migration
  def change
    create_table :districts do |t|
      t.string :code
      t.string :name
      t.integer :amphur_id
      t.integer :province_id

      t.integer :geo_id


    end
  end
end
