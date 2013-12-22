class District < ActiveRecord::Base
  attr_accessible :amphur_id, :code, :geo_id, :name, :province_id

  belongs_to :province
  belongs_to :amphur

  has_one :apartment

  default_scope order('name ASC')
end
