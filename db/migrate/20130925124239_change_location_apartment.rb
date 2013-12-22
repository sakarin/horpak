class ChangeLocationApartment < ActiveRecord::Migration
 def change
   change_column :apartments, :latitude, :float
   change_column :apartments, :longitude, :float
 end
end
