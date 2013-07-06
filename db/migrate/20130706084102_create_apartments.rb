class CreateApartments < ActiveRecord::Migration
  def change
    create_table :apartments do |t|
      t.string :name
      t.string :staff
      t.string :telephone
      t.string :email
      t.string :address
      t.string :road
      t.string :street
      t.integer :province_id
      t.integer :amphur_id
      t.integer :district_id
      t.integer :postcode
      t.string :latitude
      t.string :longitude
      t.text :description

      t.timestamps
    end
  end
end
