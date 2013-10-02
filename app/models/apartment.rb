class Apartment < ActiveRecord::Base
  extend ::Geocoder::Model::ActiveRecord

  attr_accessible :address, :amphur_id, :description, :district_id, :email, :latitude, :longitude, :name, :postcode, :province_id, :road, :staff, :street, :telephone
  attr_accessible :water_price_type, :water_price, :water_price_monthly_per_person, :water_price_monthly_per_room, :water_price_remark
  attr_accessible :electric_price_type, :electric_price, :electric_price_remark, :deposit, :advance_fee, :phone_price, :internet_price
  attr_accessible :facility_ids, :central_facility_ids
  attr_accessible :published_at

  attr_accessible :latitude, :longitude, :gmaps_zoom
  attr_accessible :user_id

  attr_accessible :images_attributes

  attr_accessible :rooms_attributes



  has_many :rooms
  accepts_nested_attributes_for :rooms, allow_destroy: true, reject_if: proc { |attributes| attributes['name'].blank? }

  validates_presence_of :name, :province_id, :amphur_id, :district_id, :postcode, on: :update, if: :update_image_with_out_filed?
  validates_presence_of :address, :street, :road, :telephone, on: :update, if: :update_image_with_out_filed?

  ROOM_TYPE = [:R0, :R1, :R2, :R3, :R4]

  acts_as_commentable

  acts_as_gmappable :validation => false

  scope :with_state, lambda { |s| where(:state => s) }

  scope :show, with_state('show')
  scope :hidden, with_state('hidden')
  scope :draft, with_state('draft')
  scope :exclusive, with_state('exclusive')

  after_save :after_update_apartment


  belongs_to :district
  belongs_to :amphur
  belongs_to :province

  belongs_to :user


  #geocoded_by :gmaps4rails_address
  #after_validation :geocode, :if => :address_changed?

  geocoded_by :address_for_geocode
  reverse_geocoded_by :latitude, :longitude

  def gmaps4rails_address
    ""
      #"#{self.address} #{self.district.name} #{self.amphur.name} #{self.province.name} #{self.postcode}"
  end

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

  #scope :available, room_available

  def room_available
    !self.rooms.where(available: true).blank?
  end

  def room_price_rate
    #self.rooms
  end


  ransacker :location do |parent|
    Arel::Nodes::SqlLiteral.new("date(routes.created_at)")
  end

  # shipment state machine (see http://github.com/pluginaweek/state_machine/tree/master for details)
  state_machine :initial => 'draft', :use_transactions => false do

    event :show do
      transition :from => 'draft', :to => 'show'
      transition :from => 'hidden', :to => 'show'
    end
    event :complete do
      transition :from => 'show', :to => 'complete'
    end
    event :hidden do
      transition :from => 'show', :to => 'hidden'
      transition :from => 'exclusive', :to => 'hidden'
    end
    event :expire do
      transition :from => 'show', :to => 'expire'
      transition :from => 'exclusive', :to => 'expire'
    end
    event :exclusive do
      transition :from => 'show', :to => 'exclusive'
      transition :from => 'hidden', :to => 'exclusive'
    end
    after_transition :to => 'show', :do => :after_show
    after_transition :to => 'exclusive', :do => :after_show
  end

  def after_show
    touch :published_at
  end

  def after_update_apartment
    self.show
  end

end
