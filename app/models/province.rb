class Province < ActiveRecord::Base
  attr_accessible :code, :geo_id, :name

  has_many :districts
  has_many :amphurs

  has_one :apartment
end
