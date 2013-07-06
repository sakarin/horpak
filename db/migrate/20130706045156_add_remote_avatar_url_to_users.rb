class AddRemoteAvatarUrlToUsers < ActiveRecord::Migration
  def change
    add_column :users, :remote_avatar_url, :string
  end
end
