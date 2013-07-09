class CentralFacility < ActiveRecord::Base
  attr_accessible :name

  has_many :central_facilities_apartments
  has_many :apartments, through: :central_facilities_apartments
end
