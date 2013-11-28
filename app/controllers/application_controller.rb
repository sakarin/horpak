class ApplicationController < ActionController::Base
  protect_from_forgery

  rescue_from CanCan::AccessDenied do |exception|
    redirect_to root_path, :alert => exception.message
  end

  def after_sign_in_path_for(resource)
    #request.env['omniauth.origin'] || stored_location_for(resource) || root_path
    apartments_path
  end

end
