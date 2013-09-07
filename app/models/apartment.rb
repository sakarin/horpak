class Apartment < ActiveRecord::Base
  attr_accessible :address, :amphur_id, :description, :district_id, :email, :latitude, :longitude, :name, :postcode, :province_id, :road, :staff, :street, :telephone
  attr_accessible :water_price_type, :water_price, :water_price_monthly_per_person, :water_price_monthly_per_room, :water_price_remark
  attr_accessible :electric_price_type, :electric_price, :electric_price_remark, :deposit, :advance_fee, :phone_price, :internet_price
  attr_accessible :facility_ids, :central_facility_ids

  attr_accessible :latitude, :longitude, :gmaps_zoom
  attr_accessible :user_id

  attr_accessible :images_attributes

  attr_accessible :rooms_attributes
  has_many :rooms
  accepts_nested_attributes_for :rooms, allow_destroy: true

  validates_presence_of :name, :province_id, :amphur_id, :district_id, :postcode, on: :update, if: :update_image_with_out_filed?
  validates_presence_of :address, :street, :road, :telephone, on: :update, if: :update_image_with_out_filed?

  acts_as_commentable



  belongs_to :district
  belongs_to :amphur
  belongs_to :province

  belongs_to :user


  has_many :images
  accepts_nested_attributes_for :images, :allow_destroy => true

  has_many :facilities_apartments
  has_many :facilities, through: :facilities_apartments

  has_many :central_facilities_apartments
  has_many :central_facilities, through: :central_facilities_apartments

  def update_image_with_out_filed?
    if self.name.blank? and !self.images.blank?
      false
    else
      true
    end
  end

  scope :belongs_to_user, lambda { |user| where("user_id = ?", user.id) }

  scope :name_is_nil, where("name is null")

  #scope :discontinued, where(:discontinued => true)
  #
  #def self.cheaper_than(price)
  #  where("price < ?", price)
  #end
  #
  #scope :cheap, cheaper_than(5)

end
