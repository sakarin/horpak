class AddGmapsToApartment < ActiveRecord::Migration
  def change
    add_column :apartments, :gmaps_zoom, :integer
    add_column :apartments, :latitude,  :float
    add_column :apartments, :longitude,  :float
    add_column :apartments, :gmaps, :boolean #not mandatory, see wiki
  end
end
