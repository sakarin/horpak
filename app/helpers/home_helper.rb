module HomeHelper
  def price_rate_permonth(apartment)
    "#{number_with_delimiter(apartment.rooms.minimum(:min_price_permonth))} - #{number_with_delimiter(apartment.rooms.maximum(:max_price_permonth))}"
  end

  def price_rate_perday(apartment)
    "#{number_with_delimiter(apartment.rooms.minimum(:min_price_perday))} - #{number_with_delimiter(apartment.rooms.maximum(:max_price_perday))}"
  end

  def price_rate_permonth_full(apartment)
    "#{number_with_delimiter(apartment.rooms.minimum(:min_price_permonth))} - #{number_with_delimiter(apartment.rooms.maximum(:max_price_permonth))}"
  end

  def price_rate_perday_full(apartment)
    "#{number_with_delimiter(apartment.rooms.minimum(:min_price_perday))} - #{number_with_delimiter(apartment.rooms.maximum(:max_price_perday))}"
  end

  def facilities_helper(a)
    Facility.all.each do |fac|
      check = false
      a.facilities.each do |f|
        if fac == f
          check = true
          break
        end
      end

      "<span><b class='#{check.to_s}'></b>#{fac.name}</span>"

    end

  end
end
