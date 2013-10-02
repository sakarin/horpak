module ApplicationHelper

  def display_base_errors resource
    return '' if (resource.errors.empty?) or (resource.errors[:base].empty?)
    messages = resource.errors[:base].map { |msg| content_tag(:p, msg) }.join
    html = <<-HTML

        <div class="alert alert-error alert-block">
          <button type="button" class="close" data-dismiss="alert">&#215;</button>
          #{messages}
        </div>

    HTML
    html.html_safe
  end


  def link_to_remove_fields(name, f)
    f.hidden_field(:_destroy) + link_to_function(name, "remove_fields(this)")
  end

  def link_to_add_fields(name, f, association)
    new_object = f.object.send(association).klass.new
    id = new_object.object_id
    fields = f.fields_for(association, new_object, child_index: id) do |builder|
      render(association.to_s.singularize + "_fields", f: builder)
    end
    link_to(name, '#', class: "add_fields", data: {id: id, fields: fields.gsub("\n", "")})
  end

  #def link_to_add_fields(name, f, association, child_association = nil)
  #  new_object = f.object.class.reflect_on_association(association).klass.new
  #  child_object = f.object.class.reflect_on_association(association).klass.reflect_on_association(child_association).klass.new
  #  new_object.wireless_client = child_object
  #
  #  fields = f.fields_for(association, new_object, :child_index => "new_#{association}") do |builder|
  #    render(association.to_s.singularize + "_fields", :f => builder)
  #  end
  #  button_to_function(name, h("add_fields(this, \"#{association}\", \"#{escape_javascript(fields)}\")"))
  #end

   #see more http://stackoverflow.com/questions/4791538/rails-3-submit-form-with-link
  def link_to_submit(*args, &block)
    link_to_function (block_given? ? capture(&block) : args[0]), "$(this).closest('form').submit()", args.extract_options!
  end

  def to_address(a)
    "#{a.street} #{a.road} #{a.district.name} #{a.amphur.name} #{a.province.name}"
  end




end
