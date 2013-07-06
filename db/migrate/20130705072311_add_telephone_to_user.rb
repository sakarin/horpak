class AddTelephoneToUser < ActiveRecord::Migration
  def change
    add_column :users, :telephone, :string
    add_column :users, :email_notice, :boolean
  end
end
