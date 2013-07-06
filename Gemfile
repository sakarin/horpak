source 'https://rubygems.org'
ruby '1.9.3'
gem 'rails', '3.2.13'
gem 'sqlite3'
group :assets do
  gem 'sass-rails', '~> 3.2.3'
  gem 'coffee-rails', '~> 3.2.1'
  gem 'uglifier', '>= 1.0.3'
end
gem 'jquery-rails'
gem 'cancan'

gem 'figaro'
gem 'libv8'
gem 'rolify'
gem 'simple_form'
group :assets do
  gem 'less-rails'
  gem 'therubyracer', :platform => :ruby, :require => "v8"
  gem 'twitter-bootstrap-rails'
  gem 'bootstrap-google-sass'
  gem 'jasny_bootstrap_extension_rails'
end
group :development do
  gem 'better_errors'
  gem 'binding_of_caller', :platforms => [:mri_19, :rbx]
  gem 'guard-bundler'
  gem 'guard-rails'
  gem 'guard-rspec'
  gem 'hub', :require => nil
  gem 'quiet_assets'
  gem 'rb-fchange', :require => false
  gem 'rb-fsevent', :require => false
  gem 'rb-inotify', :require => false
end
group :development, :test do
  gem 'factory_girl_rails'
  gem 'rspec-rails'
  gem 'thin'
end
group :production do
  gem 'unicorn'
end
group :test do
  gem 'capybara'
  gem 'database_cleaner'
  gem 'email_spec'
end

gem 'devise', '2.1.2'
gem "omniauth-facebook", "1.4.1"

gem 'carrierwave', '0.6.2'
gem "rmagick"