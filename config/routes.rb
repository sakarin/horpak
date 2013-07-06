Horpak::Application.routes.draw do
  resources :apartments


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

  namespace :admin do

  end


end