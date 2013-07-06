class Apartment < ActiveRecord::Base
  attr_accessible :address, :amphur_id, :description, :district_id, :email, :latitude, :longitude, :name, :postcode, :province_id, :road, :staff, :street, :telephone

  validates_presence_of :name, :province_id, :amphur_id, :district_id, :latitude

  belongs_to :district
  belongs_to :amphur
  belongs_to :province
end
