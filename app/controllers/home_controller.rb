class HomeController < ApplicationController
  layout 'home'

  def index
    @search = Apartment.search(params[:q])
    @apartments = @search.result.paginate(:page => params[:page], :per_page => 5)
  end

  def search
    index

    #@search = Apartment.search(params[:q])
    @search = Apartment.all
    @apartments = @search.result.paginate(:page => params[:page], :per_page => 5)
  end


end
