class CreateCentralFacilitiesApartment < ActiveRecord::Migration
  def change
    create_table :central_facilities_apartments do |t|
      t.integer :central_facility_id
      t.integer :apartment_id

      t.timestamps
    end
  end
end
