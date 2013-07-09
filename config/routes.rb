Horpak::Application.routes.draw do

  resources :central_facilities


  # http://guides.rubyonrails.org/routing.html#non-resourceful-routes
  #namespace :admin do
  #  resources :apartments
  #end

  # If you want to route /admin/apartments to ApartmentsController (without the Admin:: module prefix), you could use:
  #scope '/admin' do
  #  resources :apartments
  #end

  # If you want to route /apartments (without the prefix /admin) to Admin::ApartmentsController, you could use:
  #scope module: 'admin' do
  #  resources :apartments
  #end

  resources :facilities

  authenticated :user do
    root :to => 'home#index'
  end

  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
             controllers: {omniauth_callbacks: "omniauth_callbacks"}

  match "/dynamic_amphurs/:province_id" => "apartments#dynamic_amphurs", :via => :post
  match "/dynamic_districts/:amphur_id" => "apartments#dynamic_districts", :via => :post


  root :to => "home#index"

  resources :users

  namespace :dashboard do

  end

  resources :apartments







end