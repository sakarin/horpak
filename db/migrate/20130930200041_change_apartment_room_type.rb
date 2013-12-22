class ChangeApartmentRoomType < ActiveRecord::Migration
  def change
    change_column :rooms, :room_type, :string
  end
end
