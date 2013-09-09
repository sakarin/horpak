class HomeController < ApplicationController
  layout 'home'

  def index
    @search = Apartment.show.search(params[:q])
    @apartments = @search.result.paginate(:page => params[:page], :per_page => 40)
  end

  def search
    index

    #@search = Apartment.search(params[:q])
    @search = Apartment.show.all
    @apartments = @search.result.paginate(:page => params[:page], :per_page => 40)
  end


end
