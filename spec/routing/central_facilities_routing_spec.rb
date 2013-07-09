require "spec_helper"

describe CentralFacilitiesController do
  describe "routing" do

    it "routes to #index" do
      get("/central_facilities").should route_to("central_facilities#index")
    end

    it "routes to #new" do
      get("/central_facilities/new").should route_to("central_facilities#new")
    end

    it "routes to #show" do
      get("/central_facilities/1").should route_to("central_facilities#show", :id => "1")
    end

    it "routes to #edit" do
      get("/central_facilities/1/edit").should route_to("central_facilities#edit", :id => "1")
    end

    it "routes to #create" do
      post("/central_facilities").should route_to("central_facilities#create")
    end

    it "routes to #update" do
      put("/central_facilities/1").should route_to("central_facilities#update", :id => "1")
    end

    it "routes to #destroy" do
      delete("/central_facilities/1").should route_to("central_facilities#destroy", :id => "1")
    end

  end
end
