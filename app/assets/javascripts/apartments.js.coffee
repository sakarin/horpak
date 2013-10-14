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

  $(".image").live "mouseover mouseout", (event) ->
    if event.type is "mouseover"
      $(this).find("a:first").show()
    else
      $(this).find("a:first").hide()


  $(".monthly-rate").live "click", ->
    $(this).closest(".rental_fee").find(".rental_monthly_rate").toggle()

  $(".daily-rate").live "click", ->
    $(this).closest(".rental_fee").find(".rental_daily_rate").toggle()


  $('#room-table').sortable
    items: "tbody tr"
    axis: "y"
    update: ->
      $.post($(this).data('update-url'), $(this).sortable('serialize'))

  water_price_click = ->
    other_text = $(this).closest('#price-water').find('.water-price-input')
    this_text = $(this).closest('.row-fluid').find('.water-price-input')
    other_selected = $(this).closest('#price-water').find('.water-price-select')
    this_selected = $(this).closest('.row-fluid').find('.water-price-select')
    other_text.val('')
    other_text.attr('readonly','true')

    this_text.removeAttr('readonly')
    this_text.val('')

    this_selected.attr('checked','checked')
    other_selected.removeAttr('disabled')

  $('.water-price-select').on('click', water_price_click);
  $('.water-price-input').on('click', water_price_click);

  electric_price_click = ->
    other_text = $(this).closest('#price-electric').find('.electric-price-input')
    this_text = $(this).closest('.row-fluid').find('.electric-price-input')
    other_selected = $(this).closest('#price-electric').find('.electric-price-select')
    this_selected = $(this).closest('.row-fluid').find('.electric-price-select')
    other_text.val('')
    other_text.attr('readonly','true')

    this_text.removeAttr('readonly')
    this_text.val('')

    this_selected.attr('checked','checked')
    other_selected.removeAttr('disabled')

  $('.electric-price-select').on('click', electric_price_click);
  $('.electric-price-input').on('click', electric_price_click);

  $(".new_apartment_button").click ->
    $("#new-apartment-form").toggle()

#  $("#apartment_name").keyup ->
#    name = $("#apartment_name").val()
#    if name.length > 1
#      $("#btn_apartment_submit").enable()
#    else
#      $("#btn_apartment_submit").disable()

  $("#btn_apartment_submit").attr "disabled", "disabled"
  $("#apartment_name").keyup ->
    unless $(this).val() is ""
      $("#btn_apartment_submit").removeAttr "disabled"
    else
      $("#btn_apartment_submit").attr "disabled", "disabled"


