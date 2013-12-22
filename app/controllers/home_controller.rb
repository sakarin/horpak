class HomeController < ApplicationController
  layout 'home'

  def index
    if params[:within].present?
      @search = Apartment.show.search(params[:q])
      @apartments = Apartment.near(params[:within])
    else
      @search = Apartment.show.search(params[:q])
      @apartments = @search.result.paginate(:page => params[:page], :per_page => 10)
    end

  end
  #
  #def search
  #  if params[:within].present?
  #    @search = Apartment.show.search(params[:q])
  #    @apartments = Apartment.near(params[:within])
  #  else
  #    @search = Apartment.show.search(params[:q])
  #    @apartments = @search.result.paginate(:page => params[:page], :per_page => 40)
  #  end
  #end

  def show
    @apartment = Apartment.find(params[:id])
    @json = @apartment.to_gmaps4rails
  end


end
