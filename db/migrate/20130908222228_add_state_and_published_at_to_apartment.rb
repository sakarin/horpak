class AddStateAndPublishedAtToApartment < ActiveRecord::Migration
  def change
    add_column :apartments, :state, :string
    add_column :apartments, :published_at, :datetime
  end
end
