class CreateCentralFacilities < ActiveRecord::Migration
  def change
    create_table :central_facilities do |t|
      t.string :name

      t.timestamps
    end
  end
end
