class AddGmapsBooleanToApartment < ActiveRecord::Migration
  def change
    add_column :apartments, :gmaps, :boolean #not mandatory, see wiki
  end
end
