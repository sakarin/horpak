# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :province do
    code "MyString"
    name "MyString"
    geo_id 1
  end
end
