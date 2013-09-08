module HomeHelper
  def price_rate_permonth(apartment)
    "#{number_with_delimiter(apartment.rooms.minimum(:min_price_permonth))} - #{number_with_delimiter(apartment.rooms.maximum(:max_price_permonth))}"
  end

  def price_rate_perday(apartment)
    "#{number_with_delimiter(apartment.rooms.minimum(:min_price_perday))} - #{number_with_delimiter(apartment.rooms.maximum(:max_price_perday))}"
  end
end
