class CentralFacilitiesApartment < ActiveRecord::Base
  belongs_to :central_facility
  belongs_to :apartment
end