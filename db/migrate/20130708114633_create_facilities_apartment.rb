class CreateFacilitiesApartment < ActiveRecord::Migration
  def change
    create_table :facilities_apartments do |t|
      t.integer :facility_id
      t.integer :apartment_id

      t.timestamps
    end
  end
end
