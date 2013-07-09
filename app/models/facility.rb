class Facility < ActiveRecord::Base
  attr_accessible :name

  has_many :facilities_apartments
  has_many :apartments, through: :facilities_apartments

  validates_presence_of :name
end
