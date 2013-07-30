# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

jQuery ->
  $("#apartment_province_id").change ->
    $("#apartment_district_id").empty()
    data = $("#apartment_province_id").val()
    $.ajax
      type: "POST"
      url: "/dynamic_amphurs/" + data
      data: data
      success: (response) ->
        $("#apartment_amphur_id").html
  #        updateMapCenter(district_lat, district_lng, 13)


  $("#apartment_amphur_id").change ->
    data = $("#apartment_amphur_id").val()
    $.ajax
      type: "POST"
      url: "/dynamic_districts/" + data
      data: data
      success: (response) ->
        $("#apartment_district_id").html

  $(".wysihtml5").each (i, elem) ->
    $(elem).wysihtml5()

  $('form').fileupload
    dataType: "script"
    add: (e, data) ->
      types = /(\.|\/)(gif|jpe?g|png)$/i
      file = data.files[0]
      if types.test(file.type) || types.test(file.name)
        data.context = $(tmpl("template-upload", file))
        $('form').append(data.context)

        data.submit()
      else
        alert("#{file.name} is not a gif, jpeg, or png image file")
    progress: (e, data) ->
      $("#spinner").show()
    success: (data, status) =>
      $("#spinner").hide()
      $("#calltouploadpic").hide()

  $('.best_in_place').best_in_place()

  $('#images').sortable
    axis: 'xy'
    handle: '.handle'
    refreshPositions: true
    opacity: 0.6
    scroll:true

    placeholder: 'sortable_placeholder'
    containment: 'parent'
    update: ->
      $.post($(this).data('update-url'), $(this).sortable('serialize'))

  $(".image").bind "mouseover mouseout", (event) ->
    if event.type is "mouseover"
      $(this).find("a:first").show()
    else
      $(this).find("a:first").hide()


#  $("#apartment_rooms_attributes_0_monthly").click ->
#      $(".rental_input").toggle()

  $('#room-table').sortable
    items: "tbody tr"
    axis: "y"
    update: ->
      $.post($(this).data('update-url'), $(this).sortable('serialize'))


