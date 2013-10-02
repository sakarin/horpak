class LocationsController < ApplicationController
  layout 'home'

  def index
    if params[:within].present?
      @search = Apartment.show.search(params[:q])
      @apartments = Apartment.near(params[:within])
    else
      @search = Apartment.show.search(params[:q])
      @apartments = @search.result.paginate(:page => params[:page], :per_page => 15)
    end

  end

  def show
    @search = Apartment.show.search(params[:q])
    @apartments = Apartment.near(params[:id])
  end

  #def search
  #  if params[:within].present?
  #    @search = Apartment.show.search(params[:q])
  #    @apartments = Apartment.near(params[:within])
  #  else
  #    @search = Apartment.show.search(params[:q])
  #    @apartments = @search.result.paginate(:page => params[:page], :per_page => 40)
  #  end
  #
  #end
end
