class ApartmentsController < ApplicationController
  load_and_authorize_resource

  def index

    #@current_user.apartments.draft.each {|a| a.destroy}


    @search = @current_user.apartments.search(params[:q])
    @apartments = @search.result.paginate(:page => params[:page], :per_page => 5)

    @apartment = Apartment.new(:user_id => @current_user.id)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @apartments }
    end
  end

  def new
    #@apartment = Apartment.create(:user_id => @current_user.id)
    #redirect_to edit_apartment_url(@apartment)
    #@apartment = Apartment.new(:user_id => @current_user.id)

  end

  def edit
    @apartment = Apartment.find(params[:id])

  end

  def create
    @apartment = Apartment.new(params[:apartment])
    @apartment.user = @current_user

    if @apartment.save

      redirect_to edit_apartment_url(@apartment)
    else
      #render action: "index"
      redirect_to apartments_path
    end



  end

  def update
    @apartment = Apartment.find(params[:id])

    respond_to do |format|
      if @apartment.update_attributes(params[:apartment])
        format.html { redirect_to apartments_url, notice: "#{t('activerecord.models.apartment')}#{t('notice.updated')}" }
        format.js { render 'images/create', :locals => {:image => @apartment.images.last } }
      else
        format.html { render action: "edit", notice: @apartment.errors }
        format.json { render json: @apartment.errors, status: :unprocessable_entity }
      end
    end
  end

  def destroy
    @apartment = Apartment.find(params[:id])
    @apartment.destroy

    respond_to do |format|
      format.html { redirect_to apartments_url }
      format.json { head :no_content }
    end
  end

  def dynamic_amphurs
    @amphurs = Amphur.where(:province_id => params[:province_id]).order("name")
    respond_to do |format|
      format.js
    end
  end

  def dynamic_districts
    @districts = District.where(:amphur_id => params[:amphur_id]).order("name")
    respond_to do |format|
      format.js
    end
  end

  def show
    @apartment = Apartment.find(params[:id])
    @commentable = @apartment
    @comments = @commentable.comments
    @comment = Comment.new
  end

end
