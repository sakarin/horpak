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