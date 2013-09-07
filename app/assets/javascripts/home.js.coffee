# Place all the behaviors and hooks related to the matching controller here.
# All this logic will automatically be available in application.js.
# You can use CoffeeScript in this file: http://jashkenas.github.com/coffee-script/

$ ->
  $("#tabs").tab()

#  $("#myTab a").click (e) ->
#  e.preventDefault()
#  $(this).tab "show"


  $("#q_province_id_eq").change ->
    $("#q_amphur_id_eq").empty()
    data $("#q_province_id_eq").val()
    $.ajax
      type: "POST"
      url: "/dynamic_amphurs/" + data
      data: data
      success: (response) ->
        $("#q_amphur_id_eq").html


   #q_rooms_min_price_permonth_gteq
    #q_rooms_max_price_permonth_lteq
    #q_rooms_min_price_perday_gteq
   #q_rooms_max_price_perday_lteq
  $("#room-price").change ->
    price = $("#room-price").val()

    switch parseInt(price)
      when 1
        $("#q_rooms_min_price_permonth_gteq").val ""
        $("#q_rooms_max_price_permonth_lteq").val 2000
      when 2
        alert(price)
        $("#q_rooms_min_price_permonth_gteq").val 2000
        $("#q_rooms_max_price_permonth_lteq").val 4000
      when 3
        $("#q_rooms_min_price_permonth_gteq").val 4000
        $("#q_rooms_max_price_permonth_lteq").val 8000
      when 4
        $("#q_rooms_min_price_permonth_gteq").val 8000
        $("#q_rooms_max_price_permonth_lteq").val ""
      when 5
        $("#q_rooms_min_price_perday_gteq").val ""
        $("#q_rooms_max_price_perday_lteq").val 500
      when 6
        $("#q_rooms_min_price_perday_gteq").val 500
        $("#q_rooms_max_price_perday_lteq").val 1000
      when 7
        $("#q_rooms_min_price_perday_gteq").val 1000
        $("#q_rooms_max_price_perday_lteq").val 1500
      when 8
        $("#q_rooms_min_price_perday_gteq").val 1500
        $("#q_rooms_max_price_perday_lteq").val ""

