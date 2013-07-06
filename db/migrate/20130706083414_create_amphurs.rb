class CreateAmphurs < ActiveRecord::Migration
  def change
    create_table :amphurs do |t|
      t.string :code
      t.string :name
      t.integer :geo_id
      t.integer :province_id


    end
  end
end
