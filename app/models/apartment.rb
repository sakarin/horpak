class Apartment < ActiveRecord::Base
  attr_accessible :address, :amphur_id, :description, :district_id, :email, :latitude, :longitude, :name, :postcode, :province_id, :road, :staff, :street, :telephone

  attr_accessible :facility_ids, :central_facility_ids

  validates_presence_of :name, :province_id, :amphur_id, :district_id

  belongs_to :district
  belongs_to :amphur
  belongs_to :province



  has_many :facilities_apartments
  has_many :facilities, through: :facilities_apartments

  has_many :central_facilities_apartments
  has_many :central_facilities, through: :central_facilities_apartments


end
