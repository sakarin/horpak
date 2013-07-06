class CreateProvinces < ActiveRecord::Migration
  def change
    create_table :provinces do |t|
      t.string :code
      t.string :name
      t.integer :geo_id


    end
  end
end
