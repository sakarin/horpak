class Amphur < ActiveRecord::Base
  attr_accessible :code, :geo_id, :name, :province_id

  has_many :districts
  belongs_to :province
  has_one :apartment

  default_scope order('name ASC')
end
