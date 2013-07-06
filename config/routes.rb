Horpak::Application.routes.draw do
  authenticated :user do
    root :to => 'home#index'
  end



  devise_for :users, path_names: {sign_in: "login", sign_out: "logout"},
             controllers: {omniauth_callbacks: "omniauth_callbacks"}

  #match "/users/auth/failure" => redirect("/")


  root :to => "home#index"

  resources :users

  namespace :dashboard do

  end

  namespace :admin do

  end


end