class Image < ActiveRecord::Base
  attr_accessible :apartment_id, :attachment, :name, :position

  mount_uploader :attachment, AttachmentUploader

  belongs_to :apartment

  before_create :default_name

  def default_name
    self.name ||= File.basename(attachment.filename, '.*').titleize if attachment
  end
end
