class AddPriceToApartment < ActiveRecord::Migration
  def change
    add_column :apartments, :water_price_type, :integer
    add_column :apartments, :water_price, :string
    add_column :apartments, :water_price_monthly_per_person, :string
    add_column :apartments, :water_price_monthly_per_room, :string
    add_column :apartments, :water_price_remark, :string

    add_column :apartments, :electric_price_type, :integer
    add_column :apartments, :electric_price, :string
    add_column :apartments, :electric_price_remark, :string

    add_column :apartments, :deposit, :string
    add_column :apartments, :advance_fee, :string
    add_column :apartments, :phone_price, :string
    add_column :apartments, :internet_price, :string
  end
end
