class CommentsController < ApplicationController
  before_filter :load_commentable, :except => :index

  #def index
  #  @comments = @commentable.comments
  #end

  def index
    @search = Comment.search(params[:q])
    @comments = @search.result.paginate(:page => params[:page], :per_page => 10)
    respond_to do |format|
      format.html
      format.json  { render :json => @comments }
    end
  end

  def new
    @comment = @commentable.comments.new
  end

  def create
    @comment = @commentable.comments.new(params[:comment])
    if @comment.save
      redirect_to @commentable, notice: "Comment created."
    else
      render :new
    end
  end

  def destroy
    @comment = Comment.find(params[:id])
    @comment.destroy

    respond_to do |format|
      format.html { redirect_to listing_comments_url }
      format.json { head :no_content }
    end
  end

  private

  # see more http://railscasts.com/episodes/154-polymorphic-association-revised
  def load_commentable
    resource, id = request.path.split('/')[1, 2]
    @commentable = resource.singularize.classify.constantize.find(id)
  end

 
end
