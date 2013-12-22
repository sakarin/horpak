class Room < ActiveRecord::Base
  attr_accessible :apartment_id, :available, :daily, :max_price_perday, :max_price_permonth, :min_price_perday, :min_price_permonth, :monthly, :name, :size, :room_type, :position

  belongs_to :apartment


end
