class CentralFacilitiesController < ApplicationController
  # GET /central_facilities
  # GET /central_facilities.json
  def index

    @search = CentralFacility.search(params[:q])
    @central_facilities = @search.result.paginate(:page => params[:page], :per_page => 5)

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @central_facilities }
    end
  end

  # GET /central_facilities/1
  # GET /central_facilities/1.json
  def show
    @central_facility = CentralFacility.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @central_facility }
    end
  end

  # GET /central_facilities/new
  # GET /central_facilities/new.json
  def new
    @central_facility = CentralFacility.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @central_facility }
    end
  end

  # GET /central_facilities/1/edit
  def edit
    @central_facility = CentralFacility.find(params[:id])
  end

  # POST /central_facilities
  # POST /central_facilities.json
  def create
    @central_facility = CentralFacility.new(params[:central_facility])

    respond_to do |format|
      if @central_facility.save
        format.html { redirect_to central_facilities_url, notice: "#{t('activerecord.models.central_facility')}#{t('notice.created')}" }
        format.json { render json: @central_facility, status: :created, location: @central_facility }
      else
        format.html { render action: "new" }
        format.json { render json: @central_facility.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /central_facilities/1
  # PUT /central_facilities/1.json
  def update
    @central_facility = CentralFacility.find(params[:id])

    respond_to do |format|
      if @central_facility.update_attributes(params[:central_facility])
        format.html { redirect_to central_facilities_url, notice: "#{t('activerecord.models.central_facility')}#{t('notice.updated')}" }
        format.json { head :no_content }
      else
        format.html { render action: "edit" }
        format.json { render json: @central_facility.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /central_facilities/1
  # DELETE /central_facilities/1.json
  def destroy
    @central_facility = CentralFacility.find(params[:id])
    @central_facility.destroy

    respond_to do |format|
      format.html { redirect_to central_facilities_url }
      format.json { head :no_content }
    end
  end
end
