class FacilitiesApartment < ActiveRecord::Base
  belongs_to :facility
  belongs_to :apartment
end