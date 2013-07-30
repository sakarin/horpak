class RoomsController < ApplicationController
  #def index
  #  @rooms = Room.order("position")
  #end

  def sort
    params[:room].each_with_index do |id, index|
      Room.update_all({position: index+1}, {id: id})
    end
    render nothing: true
  end
end
