# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :apartment do
    name "MyString"
    staff "MyString"
    telephone "MyString"
    email "MyString"
    address "MyString"
    road "MyString"
    street "MyString"
    province_id 1
    amphur_id 1
    district_id 1
    postcode 1
    latitude "MyString"
    longitude "MyString"
    description "MyText"
  end
end
