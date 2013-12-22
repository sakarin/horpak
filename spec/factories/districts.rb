# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :district do
    code "MyString"
    name "MyString"
    geo_id 1
    province_id 1
    amphur_id 1
  end
end
