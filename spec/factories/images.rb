# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :image do
    name "MyString"
    attachment "MyString"
    position 1
    apartment_id 1
  end
end
