# encoding: utf-8

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

  #get 'locations', to: 'locations#index'
  #get 'locations/:id', to: 'locations#show'

  resource :locations, :path => Rack::Utils.escape('อพาร์ทเม้นท์-ห้องพัก-หอพัก-บริเวณ')

  get Rack::Utils.escape('อพาร์ทเม้นท์-ห้องพัก-หอพัก-บริเวณ'), to: 'locations#index'
  get Rack::Utils.escape('อพาร์ทเม้นท์-ห้องพัก-หอพัก-บริเวณ') + '/:id', to: 'locations#show'

  #get Rack::Utils.escape('หอพัก'), to: 'users#index'
  #get 'หอพัก', to: 'home#index'

  resources :home ,:path => Rack::Utils.escape('อพาร์ทเม้นท์-ห้องพัก-หอพัก')
  #resources :locations do
  #  match 'search' => 'locations#search', :via => [:get, :post], :as => :search
  #end
  resources :users
  resources :comments


  namespace :dashboard do

  end

  resources :apartments do
    resources :comments

    resources :images do
      collection do
        post :sort
      end
    end

    resource :rooms do
      collection do
        post :sort
      end
    end
  end

  resources :images







end