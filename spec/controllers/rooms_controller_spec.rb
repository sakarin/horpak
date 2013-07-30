require 'spec_helper'

describe RoomsController do

  describe "GET 'sort'" do
    it "returns http success" do
      get 'sort'
      response.should be_success
    end
  end

end
