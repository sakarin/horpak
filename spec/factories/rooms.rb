# Read about factories at https://github.com/thoughtbot/factory_girl

FactoryGirl.define do
  factory :room do
    apartment_id 1
    name "MyString"
    type 1
    size "MyString"
    monthly false
    min_price_permonth 1
    max_price_permonth 1
    daily false
    min_price_perday 1
    max_price_perday 1
    available false
  end
end
