/*!
 * jQuery JavaScript Library v1.8.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2012 jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: Tue Nov 13 2012 08:20:33 GMT-0500 (Eastern Standard Time)
 */
function onSubmit() {
    var e = $("#admin_apartment_search input, #admin_apartment_search select").fieldSerialize();
    return e && (fadeOutPanel(), $.ajax({type: "GET", cache: !1, url: "/admin/apartments", data: e, dataType: "html", beforeSend: function (e) {
        e.setRequestHeader("Accept", "text/javascript")
    }}).done(function (e) {
        fadeInPanel(e)
    })), !1
}
function initAdminSearch() {
    var e = 1;
    provinceObserve(), $("#admin_apartment_search").submit(function () {
        var e = $("#apartment_name").val().split(";");
        $.each(e, function (e, t) {
            t != "" && $("#admin_apartment_search").append("<input name='split_name[]' type='hidden' value='" + $.trim(t) + "'>")
        })
    })
}
function enableSeletion() {
    $("#result_panel ul").multiSelect({unselectOn: "body", keepSelection: !1}), $("#toggle_all").click(function () {
        return $(this).hasClass("select") ? ($(this).removeClass("select").addClass("unselect"), $(this).text("ยกเลิกที่เลือกทั้งหมด"), $("#result_panel li").addClass("selected")) : ($(this).removeClass("unselect").addClass("select"), $(this).text("เลือกทั้งหมด"), $("#result_panel li").removeClass("selected")), !1
    })
}
function initAdminActiveDeactiveButton() {
    $(".active_delete").on("mousedown", function () {
        var e = $(this), t = $(this).parent().parent().parent(), n = t.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/admin/apartments/active_toggle", data: {apt_id: n}}).done(function (n) {
            e.parent().siblings(".parent_id").html("MODERATED"), n == "not_active" ? (e.html("<span></span>แสดงประกาศ"), t.addClass("not_active")) : (e.html("<span></span>ยกเลิก"), t.removeClass("not_active"))
        }), !1
    })
}
function updateFeatured() {
    function refreshFeature() {
        $.each(featured, function (e, t) {
            var n = $("#apartment_" + t + " .buttonicon .star");
            n.removeClass("not-favorited").addClass("favorited")
        })
    }

    featured === undefined ? $.ajax({type: "GET", cache: !1, url: "/admin/featured/get_featured", dataType: "json"}).done(function (data) {
        featured = eval(data.featured), updateFeatured()
    }) : refreshFeature()
}
function initAdminFeaturedApartment() {
    initAdminSearch(), updateFeatured(), $("#result_panel li .star").live("click", function () {
        var e, t = $(this), n = t.parent().parent().parent().attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/admin/featured/toggle", data: {id: n}, success: function (e) {
            e == "favorited" ? t.removeClass("not-favorited").addClass(e) : t.addClass(e).removeClass("favorited")
        }}), !1
    })
}
function initAdminAdvertisements() {
    initAdminSearch()
}
function initAdminApartment() {
    initAdminSearch(), enableSeletion(), $(".edit").on("mousedown", function () {
        var e = $(this).parent().parent().parent().attr("id").split("_")[1];
        return window.open("/apartments/" + e + "/edit"), !1
    }), initAdminActiveDeactiveButton(), $(".showgraph").on("mousedown", function () {
        var e = $(this), t = $(this).parent().parent().parent();
        return showgraph(t), !1
    }), $(".refresh").on("mousedown", function () {
        var e = $(this), t = $(this).parent().parent().parent(), n = t.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/dashboard/apartments/refresh", data: {apt_id: n}}).done(function (t) {
            e.html("<i>" + t + "</i>"), e.removeClass("refresh").addClass("ok")
        }).fail(function (t) {
            e.html("<i>" + t.responseText + "</i>"), e.removeClass("refresh").addClass("errors")
        }), !1
    }), $(".merge").on("mousedown", function (e) {
        var t = $(this), n = t.parent().parent().parent().attr("id").split("_")[1], r = t.parent().parent().parent().siblings(".selected"), i = r.map(function () {
            return this.id.split("_")[1]
        }).get().join(",");
        return $.ajax({type: "POST", url: "/admin/apartments/merge", data: {parent_apt_id: n, merging_apt_id: i}}).done(function (e) {
            t.parent().siblings(".parent_id").html("MODERATED"), t.parent().parent().parent().removeClass("not_active"), r.slideUp(function () {
                $(this).remove()
            })
        }), !1
    }), $(".status_action a").on("mousedown", function () {
        return!1
    }), $(".status_action a").click(function () {
        var e = $(this), t = $(this).parent().parent().parent().parent(), n = t.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/admin/apartments/update_status", data: {apt_id: n, status: e.attr("class")}}).done(function (n) {
            n.apartment_status == "Rejected" ? t.addClass("not_active") : t.removeClass("not_active"), e.hasClass("highlight") ? e.text(n.apartment_status).removeClass("highlight") : e.text(n.apartment_status).addClass("highlight"), e.siblings().removeClass("highlight"), e.parent().parent().siblings(".parent_id").html("MODERATED")
        }), !1
    })
}
function initRoom() {
    $(".rental_fee .pretty-checkbox input").each(function () {
        $(this).val() == "true" && $(this).parent().next().show()
    }), $(".rental_input input").each(function () {
        $(this).val() == "0" && $(this).val("")
    }), $(".available .pretty-checkbox").live("click", function () {
        return prettyCheckboxState(this), !1
    }), $(".delete_room").live("click", function () {
        var e = $(this).parent().parent();
        return e.siblings().length > 0 && e.slideUp().remove(), !1
    }), $(".rental_fee .pretty-checkbox").live("click", function () {
        prettyCheckboxState(this), $(this).next().toggle();
        var e = $(this).parent().parent().children(".rental_fee");
        return e.find(".rental_input:visible").length > 0 ? (e.find('input[name*="room_has_rental"]').val(1), e.find("a").removeClass("error"), $("#form-for-aparment").validate().element(e.find('input[name*="room_has_rental"]'))) : e.find('input[name*="room_has_rental"]').val(""), $(this).next(":visible").find("input").each(function () {
            $(this).rules("add", {required: !0, number: !0, messages: {required: "", number: "ระบุตัวเลขเท่านั้น"}})
        }), $(this).next(":hidden").find("input").each(function () {
            $(this).rules("remove")
        }), !1
    }), $("#add_room").click(function () {
        var e = [];
        return $("#room-table td.name input").each(function () {
            e.push($(this).attr("name"))
        }), $.ajax({url: "/apartment_rooms/new", data: {room_no: e}, success: function (e) {
            $("#add_room").prev().find("tbody").append(e), $("#room-table tr").last().find('input[name*="room_name"]').each(function () {
                $(this).rules("add", {required: !0, messages: {required: "กรุณาระบุประเภทห้อง"}})
            }), $("#room-table tr").last().find('select[name*="room_type"]').each(function () {
                $(this).rules("add", {required: !0, messages: {required: "กรุณาระบุรูปแบบห้อง"}})
            }), $("#room-table tr").last().find('input[name*="room_has_rental"]').each(function () {
                $(this).rules("add", {required: !0})
            }), $("#room-table tr").last().find('input[name*="room_size"]').each(function () {
                $(this).rules("add", {number: !0, messages: {number: "ตัวเลขเท่านั้น"}})
            })
        }}), !1
    })
}
function initMainInfoForm() {
    var e = $("#form-for-aparment").validate({ignore: [], userCustomFocusInvalid: !0, customFocusInvalid: function (t) {
        t[0].element.id == "nofacility_check" ? $("html, body").animate({scrollTop: $("#nofacility").offset().top - 40}, 500) : t[0].element.id == "nopicture_check" ? $("html, body").animate({scrollTop: $("#nopicture").offset().top - 40}, 250) : t[0].element.id == "lng" ? $("html, body").animate({scrollTop: $("#maplookup").offset().top - 120}, 500) : e.focusInvalid()
    }, rules: {"apartment[name]": {required: !0, maxlength: 100}, "apartment[contact_person]": {required: !0}, "apartment[phone]": {required: !0, minlength: 9}, "apartment[email]": {required: !0, email: !0, minlength: 5}, "apartment[province_code]": {required: !0}, "apartment[district_code]": {required: !0}, "apartment[subdistrict_code]": {required: !0}, "apartment[water_price]": {number: !0, required: function () {
        return $("#apartment_water_price_type_1").is(":checked") ? !0 : !1
    }}, "apartment[water_price_monthly_per_person]": {number: !0, required: function () {
        return $("#apartment_water_price_type_2").is(":checked") ? !0 : !1
    }}, "apartment[water_price_monthly_per_room]": {number: !0, required: function () {
        return $("#apartment_water_price_type_3").is(":checked") ? !0 : !1
    }}, "apartment[electric_price]": {number: !0, required: function () {
        return $("#apartment_electric_price_type_1").is(":checked") ? !0 : !1
    }}, "apartment[phone_price]": {required: !0}, "apartment[deposit]": {required: !0}, "apartment[advance_fee]": {required: !0}, "temp[lng]": {required: !0}, "temp[nofacility]": {required: function () {
        var e = 0;
        return $(".facility_choice input").each(function () {
            e += Number($(this).val())
        }), e > 0 && $("#nofacility").hide(), e == 0 && $("#nofacility_check").val() != 1
    }}, "temp[nopicture]": {required: function () {
        var e = $("#preview .thumbnail").length;
        return e > 0 && ($("#nopicture").hide(), uploader.refresh()), e == 0 && $("#nopicture_check").val() != 1
    }}}, messages: {"apartment[name]": {required: "กรุณาระบุชื่อที่พัก", maxlength: "ระบุเฉพาะชื่อที่พัก ความยาวไม่เกิน 100 ตัวอักษร"}, "apartment[contact_person]": {required: "ระบุชื่อผู้ดูแล เพื่อติดต่อสอบถาม"}, "apartment[phone]": {required: "ระบุเบอร์ที่พัก เพื่อติดต่อสอบถาม", minlength: "เบอร์โทรศัพท์ ต้องยาวอย่างน้อย 9 หลัก"}, "apartment[email]": {required: "ระบุอีเมลสำหรับรับข้อความ (เพื่อป้องกัน spam อีเมลจะไม่ถูกแสดงในประกาศ)", email: "รูปแบบ อีเมลจะไม่ถูกต้อง (ตัวอย่างที่ถูกต้อง name@email.com)", minlength: "ความยาวต้องไม่น้อยกว่า 5 ตัวอักษร"}, "apartment[province_code]": {required: "กรุณาเลือกจังหวัด"}, "apartment[district_code]": {required: "กรุณาเลือกเขต/อำเภอ"}, "apartment[subdistrict_code]": {required: "กรุณาเลือกแขวง/ตำบล"}, "apartment[water_price]": {required: "กรุณาระบุค่าน้ำต่อยูนิต หรือ ใส่ 0 เพื่อให้ติดต่อสอบถาม", number: "ตัวเลขเท่านั้น"}, "apartment[water_price_monthly_per_person]": {required: "กรุณาระบุค่าน้ำต่อเดือน หรือ ใส่ 0 เพื่อให้ติดต่อสอบถาม", number: "ตัวเลขเท่านั้น"}, "apartment[water_price_monthly_per_room]": {required: "กรุณาระบุค่าน้ำต่อเดือน หรือ ใส่ 0 เพื่อให้ติดต่อสอบถาม", number: "ตัวเลขเท่านั้น"}, "apartment[electric_price]": {required: "กรุณาระบุค่าไฟฟ้าต่อยูนิต หรือ ใส่ 0 เพื่อให้ติดต่อสอบถาม", number: "ตัวเลขเท่านั้น"}, "apartment[phone_price]": {required: "กรุณาระบุค่าโทรศัพท์ (ตัวอย่างเช่น 5 บาท/นาที) หรือ ใส่ 0 เพื่อให้ติดต่อสอบถาม"}, "apartment[deposit]": {required: "ระบุค่ามัดจำ (ตัวอย่างเช่น 3 เดือน หรือ 5,000 บาท) หรือ ใส่ 0 เพื่อให้ติดต่อสอบถาม"}, "apartment[advance_fee]": {required: "ระบุเงินล่วงหน้า (ตัวอย่างเช่น 1 เดือน หรือ 5,000 บาท) หรือ ใส่ 0 เพื่อให้ติดต่อสอบถาม"}, "temp[lng]": {required: "ต้องระบุตำแหน่งในแผนที่!!"}, "temp[nofacility]": {required: ""}, "temp[nopicture]": {required: ""}}, errorPlacement: function (e, t) {
        t.attr("id") == "apartment_province_code" || t.attr("id") == "apartment_district_code" || t.attr("id") == "apartment_subdistrict_code" ? e.appendTo(t.parent().parent()).css({"margin-left": "0", width: "115px"}) : t.attr("id") == "lng" ? (e.appendTo($("#map_error")).css({margin: "0", "-moz-border-radius-bottomleft": "0", "-moz-border-radius-bottomright": "0", "border-bottom-left-radius": "0", "border-bottom-right-radius": "0"}), $("#mapholder").addClass("error")) : t.attr("id") == "nofacility_check" ? ($("#nofacility").show(), e.appendTo(t.parent())) : t.attr("id") == "nopicture_check" ? ($("#nopicture").show(), e.appendTo(t.parent()), uploader.refresh()) : t.attr("name").indexOf("room_has_rental") == 0 ? $(t).parent().parent().children(".rental_fee").find("a").addClass("error") : t.attr("name").indexOf("price_per") > 0 ? $(t).after(e) : e.text() != "" && e.appendTo(t.parent())
    }, submitHandler: function (e) {
        var t = $("#preview").sortable("toArray");
        return $("#picture_order").attr("value", t), e.submit(), !1
    }});
    $('#room-table input[name*="room_name"]').each(function () {
        $(this).rules("add", {required: !0, messages: {required: "กรุณาระบุประเภทห้อง"}})
    }), $('#room-table input[name*="room_size"]').each(function () {
        $(this).rules("add", {number: !0, messages: {number: "ตัวเลขเท่านั้น"}})
    }), $("#room-table select").each(function () {
        $(this).rules("add", {required: !0, messages: {required: "กรุณาระบุรูปแบบห้อง"}})
    }), $('#room-table input[name*="room_has_rental"]').each(function () {
        $(this).rules("add", {required: !0})
    }), $("#room-table .rental_input:visible input").each(function () {
        $(this).rules("add", {required: !0, number: !0, messages: {required: "", number: "ระบุตัวเลขเท่านั้น"}})
    }), $("#nopicture a").click(function () {
        return $("#nopicture_check").val(1), $("#nopicture").slideUp(function () {
            uploader.refresh()
        }), !1
    }), $(".fee input[type*='radio']").change(function () {
        var e = $(this).parent().siblings(".dashed_row").find("input[type*='text']");
        e.val(""), $("#form-for-aparment").validate().element(e)
    }), $(".actions").show()
}
function initEditApartment() {
    $(".facility_choice .pretty-checkbox").click(function () {
        return prettyCheckboxState(this), $("#form-for-aparment").validate().element($("#nofacility_check")), $("#nofacility_check").hasClass("error") && $("#nofacility").show(), !1
    }), initRoom(), initPictureUpload();
    var e = new wysihtml5.Editor("wysihtml5-textarea", {toolbar: "wysihtml5-toolbar", parserRules: wysihtml5ParserRules}), t = function (e, t) {
        return t.children().each(function () {
            $(this).width($(this).width())
        }), t
    };
    $("#room-table").sortable({items: "tbody tr", helper: t, axis: "y", placeholder: "room_placeholder", start: function (e, t) {
        t.placeholder.html('<td colspan="8">&nbsp;</td>'), t.placeholder.height(t.helper.height())
    }}), initMainInfoForm()
}
function appendComment(e) {
    var t = new Date(e.created_at), n = t.getDate() + "/" + t.getMonth() + "/" + t.getFullYear();
    comment_html = "<div id='comment_" + e.id + "' class='comment'> \n", comment_html += "<div class='top'> <img src='" + e.avatar + "' width='32' /> <div class='contact'><b>" + e.name + "</b></div> \n", comment_html += "<span class='created_at'>เมื่อ " + n + " - " + e.ipaddr + "</span> \n", comment_html += "</div>", comment_html += "<div class='message'>\n", comment_html += e.message, comment_html += "</div>\n", comment_html += "<div class='action'>\n", comment_html += "<a href='/comments/new?apartment_id=" + e.apartment_id + "&amp;parent_id=" + e.id + "' class='reply'>ตอบกลับ</a> | ", comment_html += "<a href='#' class='delete'>ลบ</a>\n", comment_html += "</div>\n", comment_html += "</div>", e.ancestry == null ? ($("#comments").length == 0 && comment_form.after("<div id='comments'></div>"), $("#comments").prepend(comment_html)) : (comment_form.next(".nested_comments").length == 0 && comment_form.after("<div class='nested_comments'></div>"), comment_form.next(".nested_comments").prepend(comment_html)), $("#comment_" + e.id).find(".message, .action ").css({"background-color": "#FFFEDD"}), _gaq.push(["_trackEvent", "Apartment", "comment", "append comment (all)"])
}
function initCommentForm() {
    comment_form = $("#parent_comment_form");
    if ($.cookie("user_identity") != null) {
        var user_identity = $.cookie("user_identity").split("--");
        $("#commenter-info").find("img").attr("src", user_identity[1]), $("#comment_name").val(user_identity[0]).trigger("change", [!0]), $("#comment_email").val(user_identity[2]).trigger("change", [!0]), $("#comment_phone").val(user_identity[3]).trigger("change", [!0]), $("#commenter-info").find("span.commenter-input").hide(), $("#commenter-info").find("img").after("<p><span>" + user_identity[0] + "</span> | " + user_identity[2] + " | " + user_identity[3] + "</p>"), $(".jq_watermark").watermark()
    }
    var comment_button = $("#commenter-info button"), options = {error: function (xhr, statusText) {
        data = eval("(" + xhr.responseText + ")"), $("#commenter-info").append('<label class="error" id="message_error">' + data.error + "</label>")
    }, success: function (e, t) {
        appendComment(e), e.user_id == null && ($("#comment_" + e.id + " .message").append("<div class='preapproval_notice'><h4>คุณส่งข้อความโดยยังไม่ Login</h4><p>ระบบได้รับข้อความของคุณแล้วค่ะ</br>แต่เนื่องจากคุณยังไม่ได้ Login ทีมงานจะตรวจสอบข้อความก่อนจะส่งไปยังผู้ดูแลที่พักและก่อนแสดงในประกาศ เพื่อป้องกันข้อความที่ไม่เหมาะสม ขอบคุณค่ะ</p> <p><span>Tip</span> : ถ้า <a href='/login'>Login</a> ก่อนข้อความจะถูกส่งทันที และยังสามารถลบข้อความของคุณได้เองในอนาคต</p></div>"), _gaq.push(["_trackEvent", "Apartment", "comment", "append comment (guest)"])), $(".cancel_reply").click(), $("#comment_message").val("")
    }, beforeSubmit: function () {
    }, resetForm: !1, dataType: "json"}, validator = $("#new_comment").validate({rules: {"comment[message]": {required: !0}, "comment[name]": {required: !0}, "comment[email]": {required: !0, email: !0, minlength: 5}, "comment[phone]": {required: !0, minlength: 9}}, messages: {"comment[message]": {required: "กรุณาใส่ข้อความ"}, "comment[name]": {required: "กรุณาชื่อเพื่อติดต่อกลับ"}, "comment[email]": {required: "กรุณาใส่อีเมลเพื่อติดต่อกลับ", email: "รูปแบบ อีเมลจะไม่ถูกต้อง (ตัวอย่างที่ถูกต้อง name@email.com)", minlength: "ความยาวต้องไม่น้อยกว่า 5 ตัวอักษร"}, "comment[phone]": {required: "กรุณาใส่เบอร์เพื่อติดต่อกลับ", minlength: "เบอร์โทรศัพท์ ต้องยาวอย่างน้อย 9 หลัก"}}, errorPlacement: function (e, t) {
        t.attr("id") == "comment_message" ? (e.prependTo(t.parent()), t.prev(".watermark").css("top", "28px")) : e.text() != "" && e.appendTo(t.parent())
    }, submitHandler: function (e) {
        if ($.cookie("user_identity") == null) {
            var t = "<span>กรุณา Login เพื่อส่งข้อความ</span><a class='login_with facebook medium' href='/users/auth/facebook'>Login with Facebook</a><div id='post_as_guest_div'><span>หรือ ส่งข้อความโดยไม่ Login<br/>(รอตรวจสอบจากทีมงานก่อนส่งแสดง)</span><a id='post_as_guest' class='button small gray' href='#'>ส่งข้อความโดยไม่ Login</a></div>";
            last_popover !== undefined && last_popover.popover("hide"), comment_button.popover({title: "กรุณา Login <a href='#' class='cancel'>ยกเลิก</a>", content: t, placement: "top", html: !0, trigger: "manual"}), comment_button.popover("show"), last_popover = comment_button, $(".popover").offset().top < $(window).scrollTop() && $("html, body").animate({scrollTop: $(".popover").offset().top - 10}, 100), _gaq.push(["_trackEvent", "Apartment", "comment", "not login popup"]), $(".popover .cancel").live("click", function () {
                return comment_button.popover("hide"), _gaq.push(["_trackEvent", "Apartment", "comment", "cancel popup"]), !1
            })
        } else $(e).ajaxSubmit(options);
        return!1
    }});
    $("#post_as_guest").live("click", function () {
        return comment_button.popover("hide"), $("#new_comment").ajaxSubmit(options), !1
    })
}
function initCommentDelete() {
    $(".comment .delete").live("click", function () {
        var e = $(this).parent().parent(), t = e.attr("id").split("_")[1], n = $(this).attr("class");
        return $.ajax({type: "POST", data: {_method: "PUT", "comment[deleted]": !0, "comment[remark]": n}, url: "/comments/" + t, dataType: "json"}).done(function (t) {
            e.add(e.next(".nested_comments")).wrapAll("<div id='sliding' />"), $("#sliding").slideUp(300, function () {
                $(this).remove()
            })
        }), !1
    })
}
function initCommentNotify() {
    $(".action .notify").live("click", function () {
        var e = $(this), t = $(this).parent().parent(), n = t.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/admin/comments/notify", data: {id: n}, dataType: "html", beforeSend: function (e) {
            e.setRequestHeader("Accept", "text/javascript")
        }}).done(function (t) {
            e.replaceWith("<span style='color : #F44; font-size: 12px;'>Done</span>")
        }), !1
    })
}
function initCommentModerate() {
    $(".comment .reject").live("click", function () {
        var e = $(this).parent().parent(), t = e.attr("id").split("_")[1], n = $(this).attr("class");
        return $.ajax({type: "POST", data: {_method: "PUT", "comment[deleted]": !0, "comment[remark]": n, moderated: !0}, url: "/comments/" + t, dataType: "json"}).done(function (t) {
            e.add(e.next(".nested_comments")).wrapAll("<div id='sliding' />"), $("#sliding").slideUp(300, function () {
                $(this).remove()
            })
        }), !1
    }), $(".comment .approve").live("click", function () {
        var e = $(this).parent().parent(), t = e.attr("id").split("_")[1], n = $(this).attr("class");
        return $.ajax({type: "POST", data: {_method: "PUT", moderated: !0, "comment[remark]": n}, url: "/admin/comments/approve/" + t, dataType: "json"}).done(function (t) {
            e.add(e.next(".nested_comments")).wrapAll("<div id='sliding' />"), $("#sliding").slideUp(300, function () {
                $(this).remove()
            })
        }), !1
    })
}
function initCommentEdit() {
    $(".action .edit").live("click", function () {
        var e = $(this), t = e.parent().parent(), n = t.attr("id").split("_")[1], r = e.parent().prev(".message");
        return holding = r.html(), e.hide(), $.ajax({type: "GET", url: "/comments/" + n, dataType: "json"}).done(function (t) {
            var i = "<form accept-charset='UTF-8' action='/comments/" + n + "' id='edit_comment' method='post'>\n";
            i += "<textarea id='comment_message' cols='60' row='5' name='comment[message]'></textarea>\n", i += "<button class='button small gray save'><span></span>บันทึก</button><button class='button small gray cancel'><span></span>ยกเลิก</button> </form>", r.html(i), r.find("#comment_message").val(t.message), r.find(".cancel").click(function () {
                return r.html(holding), e.show(), !1
            });
            var s = $("#edit_comment").validate({rules: {"comment[message]": {required: !0}}, messages: {"comment[message]": {required: "กรุณาใส่ข้อความ"}}, errorPlacement: function (e, t) {
                e.prependTo(t.parent())
            }, submitHandler: function (t) {
                var n = {data: {_method: "PUT"}, error: function (e, t) {
                }, success: function (t, n) {
                    r.html(t.message), e.show()
                }, beforeSubmit: function () {
                }, resetForm: !0, dataType: "json"};
                return $(t).ajaxSubmit(n), !1
            }})
        }).fail(function (e) {
        }), !1
    })
}
function initDashboardCommentPaginate() {
    function e(e) {
        $("html").hasClass("ie8") ? e.prepend("<div id='fading-box'></div>") : e.fadeTo("fast", .3), $("html, body").animate({scrollTop: e.offset().top - 20}, 100)
    }

    function t(e, t) {
        t.html(e), $("#fading-box").remove(), t.fadeTo("def", 1)
    }

    $(".pagination a").live("click", function () {
        var n = $(this).attr("href"), r = $(this).parent().parent();
        return $.ajax({url: n, dataType: "html", beforeSend: function (t) {
            e(r), t.setRequestHeader("Accept", "text/javascript")
        }}).done(function (e) {
            t(e, r)
        }).fail(function (e) {
        }), !1
    })
}
function initComment() {
    initCommentForm(), initCommentDelete(), $(".action .reply").live("click", function () {
        var e = $(this).parent().parent(), t = e.attr("id").split("_")[1];
        return comment_form.prev(".replying").removeClass("replying"), e.addClass("replying"), $("#comment_parent_id").val(t), comment_form.insertAfter(e), !1
    }), $(".comment .flag").live("click", function () {
        flag_link = $(this);
        var e = "กรุณาระบุเหตุผลในการแจ้งลบ <ul id='flag_reason'><li><a class='flag_by_comment_owner' href='#'>คุณเป็นผู้ค้นหาที่พัก ต้องการลบข้อความที่คุณลงไว้เอง</a></li><li><a class='flag_by_apartment_owner' href='#'>คุณเป็นผู้ดูแลที่พัก และต้องการลบข้อความในประกาศของคุณ</a></li><li><a class='flag_by_user' href='#'>ข้อความไม่เหมาะสม</a></li></ul>";
        return last_popover !== undefined && last_popover.popover("hide"), flag_link.popover({title: "แจ้งลบข้อความ <a href='#' class='cancel'>ยกเลิก</a>", content: e, placement: "top", html: !0, trigger: "manual"}), flag_link.popover("show"), last_popover = flag_link, $(".popover").offset().top < $(window).scrollTop() && $("html, body").animate({scrollTop: $(".popover").offset().top - 10}, 100), $(".popover .cancel").live("click", function () {
            return flag_link.popover("hide"), !1
        }), !1
    }), $("#flag_reason .flag_by_apartment_owner").live("click", function () {
        var e = flag_link.data("popover");
        return e.options.content = "<div class='apartment_owner_tip'><b>Tip</b> : ผู้ดูแลที่พักสามารถลบข้อความได้เอง<br/><br/>โดย <a href='/login'>Login</a> เข้าระบบก่อน และกด 'ลบ' ใต้ข้อความที่ต้องการลบ ในหน้าประกาศ</div>", e.setContent(), e.$tip.addClass(e.options.placement), actualWidth = e.$tip[0].offsetWidth, actualHeight = e.$tip[0].offsetHeight, pos = e.getPosition(), tp = {top: pos.top - actualHeight - 10, left: pos.left + pos.width / 2 - actualWidth / 2}, e.$tip.offset(tp), !1
    }), $("#flag_reason .flag_by_comment_owner").live("click", function () {
        var e = flag_link.data("popover");
        return e.options.content = "ระบุอีเมลที่คุณใช้ตอนส่งข้อความ<br/><input style='margin-bottom: 10px' class='short' id='commenter_email' name='commenter_email' size='29' type='text'><a id='delete_by_commenter_with_email' class='button small gray' href='#'>แจ้งลบข้อความ</a>", e.setContent(), e.$tip.addClass(e.options.placement), actualWidth = e.$tip[0].offsetWidth, actualHeight = e.$tip[0].offsetHeight, pos = e.getPosition(), tp = {top: pos.top - actualHeight - 10, left: pos.left + pos.width / 2 - actualWidth / 2}, e.$tip.offset(tp), !1
    }), $("#delete_by_commenter_with_email").live("click", function () {
        var e = flag_link.parent().parent(), t = e.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/comments/delete_with_email", data: {id: t, email: $("#commenter_email").val()}, dataType: "html", beforeSend: function (e) {
            e.setRequestHeader("Accept", "text/javascript")
        }}).done(function (t) {
            flag_link.popover("hide"), e.add(e.next(".nested_comments")).wrapAll("<div id='sliding' />"), $("#sliding").slideUp(300, function () {
                $(this).remove()
            })
        }).fail(function (e) {
            flag_link.popover("hide"), flag_link.replaceWith("<span style='color : #F44; font-size: 12px;'>อีเมลไม่ถูกต้อง</span>")
        }), !1
    }), $("#flag_reason .flag_by_user").live("click", function () {
        var e = flag_link.parent().parent(), t = e.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/comments/flag", data: {id: t}, dataType: "html", beforeSend: function (e) {
            e.setRequestHeader("Accept", "text/javascript")
        }}).done(function (e) {
            flag_link.popover("hide"), flag_link.replaceWith("<span style='color : #F44; font-size: 12px;'>แจ้งลบแล้ว</span>")
        }).fail(function (e) {
            flag_link.popover("hide"), flag_link.replaceWith("<span style='color : #F44; font-size: 12px;'>แจ้งลบแล้ว</span>")
        }), !1
    }), $(".cancel_reply").live("click", function () {
        return $("#comment_parent_id").val(""), comment_form.prev(".replying").removeClass("replying"), comment_form.insertBefore($("#comments")), !1
    })
}
function css_browser_selector(e) {
    var t = e.toLowerCase(), n = function (e) {
        return t.indexOf(e) > -1
    }, r = "gecko", i = "webkit", s = "safari", o = "opera", u = "mobile", a = document.documentElement, f = [!/opera|webtv/i.test(t) && /msie\s(\d)/.test(t) ? "ie ie" + RegExp.$1 : n("firefox/2") ? r + " ff2" : n("firefox/3.5") ? r + " ff3 ff3_5" : n("firefox/3.6") ? r + " ff3 ff3_6" : n("firefox/3") ? r + " ff3" : n("gecko/") ? r : n("opera") ? o + (/version\/(\d+)/.test(t) ? " " + o + RegExp.$1 : /opera(\s|\/)(\d+)/.test(t) ? " " + o + RegExp.$2 : "") : n("konqueror") ? "konqueror" : n("blackberry") ? u + " blackberry" : n("android") ? u + " android" : n("chrome") ? i + " chrome" : n("iron") ? i + " iron" : n("applewebkit/") ? i + " " + s + (/version\/(\d+)/.test(t) ? " " + s + RegExp.$1 : "") : n("mozilla/") ? r : "", n("j2me") ? u + " j2me" : n("iphone") ? u + " iphone" : n("ipod") ? u + " ipod" : n("ipad") ? u + " ipad" : n("mac") ? "mac" : n("darwin") ? "mac" : n("webtv") ? "webtv" : n("win") ? "win" + (n("windows nt 6.0") ? " vista" : "") : n("freebsd") ? "freebsd" : n("x11") || n("linux") ? "linux" : "", "js"];
    return c = f.join(" "), a.className += " " + c, c
}
function showgraph(e) {
    var t = e.attr("id").split("_")[1];
    $.ajax({url: "/dashboard/apartments/statistic", data: {apt_id: t}, dataType: "json", success: function (t) {
        $("#result_panel").find("li.display_graph").removeClass("display_graph").find(".showgraph").show(), e.append($("#apartment_graph").show()), e.addClass("display_graph").find(".showgraph").hide(), $.plot($("#apartment_graph"), [
            {data: t, label: "จำนวนผู้เข้าชม 30 วันล่าสุด"}
        ], {xaxis: {mode: "time", tickLength: 0, minTickSize: [3, "day"], monthNames: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."], timeformat: "%e %b"}, yaxis: {minTickSize: 1, tickDecimals: 0, tickColor: "rgba(100, 100, 100, 0.1)"}, series: {lines: {show: !0, lineWidth: 3, fill: !0, fillColor: "rgba(5, 141, 199, 0.15)"}, points: {show: !0, radius: 3, fill: !0, fillColor: "#1D95CB"}}, colors: ["#1D95CB"], grid: {hoverable: !0, clickable: !0, borderWidth: 1, borderColor: {top: "#FFF", right: "#FFF", bottom: "#444", left: "#FFF"}, backgroundColor: "#F4F3F0"}, tooltip: !0, tooltipOpts: {content: "<span class='date'>%x</span><div>เข้าชม: <span class='value'>%y</span></div>", xDateFormat: "%e/%m/%Y", defaultTheme: !1}})
    }})
}
function initDashboardApartmentsStatistic() {
    var e = $("#result_panel li:first");
    showgraph(e), $(".showgraph").live("click", function () {
        var e = $(this), t = $(this).parent().parent().parent();
        return showgraph(t), !1
    })
}
function initDashboardApartmentsButton() {
    $(".refresh").live("click", function () {
        var e = $(this), t = $(this).parent().parent().parent(), n = t.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/dashboard/apartments/refresh", data: {apt_id: n}}).done(function (t) {
            e.html("<i>" + t + "</i>"), e.removeClass("refresh").addClass("ok"), _gaq.push(["_trackEvent", "Dashboard", "Refresh-Done", n.toString()]), mixpanel.track("Apartment Refresh - User Dashboard")
        }).fail(function (t) {
            e.html("<i>" + t.responseText + "</i>"), e.removeClass("refresh").addClass("errors"), _gaq.push(["_trackEvent", "Dashboard", "Refresh-Fail", n.toString()])
        }), !1
    }), $(".edit").live("click", function () {
        var e = $(this).parent().parent().parent().attr("id").split("_")[1];
        return window.open("/apartments/" + e + "/edit"), !1
    }), $(".active_delete").live("click", function () {
        var e = $(this), t = $(this).parent().parent().parent(), n = t.attr("id").split("_")[1];
        return $.ajax({type: "POST", url: "/dashboard/apartments/active_toggle", data: {apt_id: n}}).done(function (n) {
            n == "not_active" ? (e.html("<span></span>แสดงประกาศ"), t.addClass("not_active")) : (e.html("<span></span>ยกเลิก"), t.removeClass("not_active"))
        }).fail(function (e) {
        }), !1
    })
}
function initChangPasswordForm(e) {
    $("." + e).validate({rules: {"user[password]": {required: !0, minlength: 6}, "user[password_confirmation]": {required: !0, equalTo: "#user_password", minlength: 6}}, messages: {"user[password]": {required: "กรุณาใส่ password ที่ต้องการ", minlength: "password ต้องยาวอย่างน้อย 6 ตัวอักษร"}, "user[password_confirmation]": {required: "กรุณายืนยัน password", minlength: "password ต้องยาวอย่างน้อย 6 ตัวอักษร", equalTo: "การยืนยัน password ไม่ต้องตรงกับ password ใหม่"}}, errorPlacement: function (e, t) {
        e.appendTo(t.parent())
    }, submitHandler: function (e) {
        e.submit()
    }})
}
function initUserAccountForm(e) {
    $("." + e).validate({rules: {"user[name]": {required: !0}, "user[email]": {required: !0, email: !0, minlength: 5}, "user[phone]": {required: !0, minlength: 9}, "user[password]": {required: !0, minlength: 6}, "user[password_confirmation]": {required: !0, equalTo: "#user_password", minlength: 6}}, messages: {"user[name]": {required: "กรุณาใส่ชื่อสมาชิก"}, "user[email]": {required: "กรุณาใส่อีเมลสมาชิก", email: "รูปแบบ อีเมลจะไม่ถูกต้อง (ตัวอย่างที่ถูกต้อง name@email.com)", minlength: "ความยาวต้องไม่น้อยกว่า 5 ตัวอักษร"}, "user[phone]": {required: "กรุณาระบุเบอร์โทรเพื่อติดต่อ", minlength: "เบอร์โทรศัพท์ ต้องยาวอย่างน้อย 9 หลัก"}, "user[password]": {required: "กรุณาใส่ password ที่ต้องการ", minlength: "password ต้องยาวอย่างน้อย 6 ตัวอักษร"}, "user[password_confirmation]": {required: "กรุณายืนยัน password", minlength: "password ต้องยาวอย่างน้อย 6 ตัวอักษร", equalTo: "การยืนยัน password ไม่ต้องตรงกับ password ใหม่"}}, errorPlacement: function (e, t) {
        t.after(e)
    }, submitHandler: function (e) {
        e.submit()
    }}), $("#canel_unconfirmed_email").click(function () {
        var e = $(this);
        return $.ajax({type: "POST", url: "/dashboard/setting/user_cancel_email", beforeSend: function (t) {
            e.html("<img src='/assets/loading-dot.gif' />")
        }}).done(function () {
            e.parent().fadeOut(100).remove()
        }), !1
    })
}
function initProfilePictureUpload() {
    var e, t = $("input[name=authenticity_token]").val();
    jQuery.event.props.push("dataTransfer");
    var n = new plupload.Uploader({runtimes: "html5, flash", browse_button: "pickfiles", container: "avatar_upload", max_file_size: "10mb", multi_selection: !1, autostart: !0, url: "/dashboard/setting/user_picture", flash_swf_url: "/assets/plupload.flash.swf", resize: {width: 500, quality: 100}, multipart: !0, filters: [
        {title: "Image files", extensions: "jpg,gif,png"}
    ]});
    n.bind("Init", function (t, n) {
        e = n.runtime
    }), n.init(), n.bind("FilesAdded", function (e, t) {
        $(".thumb_img_wrap img").hide().css("opacity", "0"), e.refresh(), n.start()
    }), n.bind("BeforeUpload", function (e, n) {
        e.settings.multipart_params = {authenticity_token: t, fileid: n.id}
    }), n.bind("Error", function (e, t) {
        e.refresh()
    }), n.bind("FileUploaded", function (t, r, i) {
        if (e == "html5") {
            if (i.status == 201) {
                var s = jQuery.parseJSON(i.response);
                $(".thumb_img_wrap img").removeClass("noavatar").attr("src", s.thumbnail), $(".thumb_img_wrap img").show().fadeTo("fast", "1"), $("#avatar_container").removeClass("noavatar")
            }
        } else {
            var s = jQuery.parseJSON(i.response);
            $(".thumb_img_wrap img").removeClass("noavatar").attr("src", s.thumbnail), $(".thumb_img_wrap img").show().fadeTo("fast", "1"), $("#avatar_container").removeClass("noavatar")
        }
        touch(!0), n.refresh()
    }), $(".thumb_img_wrap img.noavatar").length > 0 && $("#avatar_container").addClass("noavatar"), $("#avatar_container .delete").click(function () {
        var e = $(this);
        return $.ajax({type: "POST", url: "/dashboard/setting/user_picture_delete", beforeSend: function (e) {
            $(".thumb_img_wrap img").fadeTo(200, "0.4")
        }}).done(function () {
            var e = $(".thumb_img_wrap img");
            e.attr("src", "/assets/noavatar100.png"), e.addClass("noavatar"), $("#avatar_container").addClass("noavatar"), e.fadeTo(100, "1"), touch(!0)
        }), !1
    }), touch(!0)
}
function renderEducationSuggestions(e) {
    var t = $("#education_search .autocomplete"), n = t.val();
    h = "";
    var r = null;
    return jQuery.each(e, function (e, t) {
        t.type !== r && (r !== null && (h += "  </ul>\n </li>"), r = t.type, h += '<li class="soulmate-type-container">\n  <ul class="soulmate-type-suggestions"> <li class="soulmate-type "><h3>' + suggestion_type[r] + "</h3></li>\n"), h += '<li id="' + t.id + '" class="soulmate-suggestion">\n  ';
        var i = "(" + n.replace(reEscape, "\\$1") + ")";
        h += t.term.replace(new RegExp(i, "gi"), "<strong>$1</strong>"), h += "\n</li>"
    }), h += "  </ul>\n </li>", $(".soulmate-suggestion").attr("unselectable", "on").css("user-select", "none").on("selectstart", !1), h
}
function renderZoneSuggestions(e) {
    var t = $("#zone_search .autocomplete"), n = t.val();
    h = "";
    var r = null;
    return jQuery.each(e, function (e, t) {
        t.type !== r && (r !== null && (h += "  </ul>\n </li>"), r = t.type, h += '<li class="soulmate-type-container">\n  <ul class="soulmate-type-suggestions"> <li class="soulmate-type "><h3>' + suggestion_type[r] + "</h3></li>\n"), h += '<li id="' + t.id + '" class="soulmate-suggestion">\n  ';
        var i = "(" + n.replace(reEscape, "\\$1") + ")";
        h += t.term.replace(new RegExp(i, "gi"), "<strong>$1</strong>"), h += "\n</li>"
    }), h += "  </ul>\n </li>", h
}
function onEducationSelect(e, t, n) {
    var r = $("#education_search .autocomplete");
    n == "apartment" ? window.location.href = t.url : n == "zone" && (r.val(e), r.parent().parent().find(".home_zone_url").val(t.url), $(".soulmate").fadeOut(100, function () {
        $(this).hide()
    }))
}
function onZoneSelect(e, t, n) {
    var r = $("#zone_search .autocomplete");
    n == "apartment" ? window.location.href = t.url : n == "zone" && (r.val(e), r.parent().parent().find(".home_zone_url").val(t.url), $(".soulmate").fadeOut(100, function () {
        $(this).hide()
    }))
}
function displayStaionName() {
    var e = $("#station_name");
    $(".train a").hover(function () {
        e.html("สถานี " + $(this).html())
    })
}
function initHome() {
    $(".home_zone_url").val(""), $(".home_monthly_price_range").val(""), $(".home_daily_price_range").val(""), $(".autocomplete").val(""), $("#zone_search .autocomplete").soulmate({url: "http://www.renthub.in.th/autocomplete/search", types: ["zone"], renderCallback: renderZoneSuggestions, container_class: "zone_suggestion", selectCallback: onZoneSelect, beforeSend: function () {
        $(".home_zone_url").val("")
    }, minQueryLength: 1, maxResults: 8}), $("#education_search .autocomplete").soulmate({url: "http://www.renthub.in.th/autocomplete/search", types: ["zone"], renderCallback: renderEducationSuggestions, container_class: "education_suggestion", selectCallback: onEducationSelect, beforeSend: function () {
        $(".home_zone_url").val("")
    }, minQueryLength: 1, maxResults: 8});
    var e = $("#zone_search").validate({rules: {"search[query]": {required: !0}}, messages: {"search[query]": {required: "กรุณาระบุทำเลที่ต้องการ"}}, errorPlacement: function (e, t) {
        e.appendTo(t.parent())
    }, submitHandler: function (e) {
        return e.submit(), !1
    }}), e = $("#education_search").validate({rules: {"search[query]": {required: !0}}, messages: {"search[query]": {required: "กรุณาระบุทำเลที่ต้องการ"}}, errorPlacement: function (e, t) {
        e.appendTo(t.parent())
    }, submitHandler: function (e) {
        return e.submit(), !1
    }});
    provinceDropdownObserve();
    var t = $("#province_search .price_choices .dropdown-menu span");
    t.click(function () {
        $(this).parent().parent().siblings(".dropdown-toggle").find("i").html($(this).html());
        var e = t.index($(this));
        e == 0 ? ($(".home_monthly_price_range").val(""), $(".home_daily_price_range").val("")) : e > 4 ? ($("#province_search .home_daily_price_range").val(e - 4), $(".home_monthly_price_range").val("")) : ($("#province_search .home_monthly_price_range").val(e), $(".home_daily_price_range").val(""))
    });
    var n = $("#education_search .price_choices .dropdown-menu span");
    n.click(function () {
        $(this).parent().parent().siblings(".dropdown-toggle").find("i").html($(this).html());
        var e = n.index($(this));
        e == 0 ? ($(".home_monthly_price_range").val(""), $(".home_daily_price_range").val("")) : e > 4 ? ($("#education_search .home_daily_price_range").val(e - 4), $(".home_monthly_price_range").val("")) : ($("#education_search .home_monthly_price_range").val(e), $(".home_daily_price_range").val(""))
    });
    var r = $("#zone_search .price_choices .dropdown-menu span");
    r.click(function () {
        $(this).parent().parent().siblings(".dropdown-toggle").find("i").html($(this).html());
        var e = r.index($(this));
        e == 0 ? ($(".home_monthly_price_range").val(""), $(".home_daily_price_range").val("")) : e > 4 ? ($("#zone_search .home_daily_price_range").val(e - 4), $(".home_monthly_price_range").val("")) : ($("#zone_search .home_monthly_price_range").val(e), $(".home_daily_price_range").val(""))
    }), insertPremiumBanner(), initListClick(), initListFavorite(), randomSponsorPosition(), $("li.article .thumbnial").click(function () {
        return window.open($(this).parent().find("span.title a").attr("href")), !1
    }), $("#suggestion_link a").click(function () {
        return $("html, body").animate({scrollTop: $(".home").offset().top - 10}, 100), $(".tab span").eq($("#suggestion_link a").index($(this))).click(), !1
    }), $(".dropdown-menu li").attr("unselectable", "on").css("user-select", "none").on("selectstart", !1), displayStaionName()
}
function multiSelect(e) {
    var t = e.e.target, n = e.element, r = e.list;
    if ($(n).hasClass("ui-sortable-helper"))return!1;
    if (e.start != 0) {
        var s = e.start(e.e, $(n));
        if (s == 0)return!1
    }
    if (e.e.shiftKey && e.multiselect) {
        $(n).addClass(e.selected), first = $(e.list).find("." + e.selected).first().index(), last = $(e.list).find("." + e.selected).last().index(), last < first && (firstHolder = first, first = last, last = firstHolder);
        if (first == -1 || last == -1)return!1;
        $(e.list).find("." + e.selected).removeClass(e.selected);
        var o = last - first, u = first;
        for (i = 0; i <= o; i++)$(r).find(e.filter).eq(u).addClass(e.selected), u++
    } else(e.e.ctrlKey || e.e.metaKey) && e.multiselect ? $(n).hasClass(e.selected) ? $(n).removeClass(e.selected) : $(n).addClass(e.selected) : e.keepSelection && !$(n).hasClass(e.selected) ? ($(r).find("." + e.selected).removeClass(e.selected), $(n).addClass(e.selected)) : ($(r).find("." + e.selected).removeClass(e.selected), $(n).addClass(e.selected));
    e.stop != 0 && e.stop($(r).find("." + e.selected), $(n))
}
function updateMapCenter(e, t, n) {
    if (typeof google != "undefined") {
        var r = new google.maps.LatLng(e, t);
        map.setCenter(r), map.setZoom(n)
    }
}
function updateLatLng() {
    mkctn ? ($("#lat").val(mk.getPosition().lat()), $("#lng").val(mk.getPosition().lng()), $("#form-for-aparment").validate().element("#lng"), $("#mapholder").removeClass("error")) : ($("#lat").val(null), $("#lng").val(null), $("#form-for-aparment").validate().element("#lng"))
}
function toggleMarker() {
    mkctn ? (mk.setMap(null), mkctn = 0, updateLatLng()) : (mk.setPosition(map.getCenter()), mk.setMap(map), mkctn = 1, updateLatLng())
}
function provinceObserve() {
    function e() {
        updateMapCenter(district_lat, district_lng, 13)
    }

    function t() {
        updateMapCenter(subdistrict_lat, subdistrict_lng, 14)
    }

    $("#apartment_province_code").live("change", function () {
        $("#district-select, #subdistrict-select").empty().html('<select disabled class="short"><option value="">กำลังโหลด ...</option></select>'), $("#district-select").load("/misc/on_province_changed", {province_code: $(this).val()}, function () {
            $("#subdistrict-select").html('<select class="short" id="apartment_subdistrict_code" name="apartment[subdistrict_code]"><option value="">ตำบล/แขวง</option></select>'), e()
        })
    }), $("#apartment_district_code").live("change", function () {
        $("#subdistrict-select").empty().html('<select disabled class="short"><option value="">กำลังโหลด ...</option></select>'), $("#subdistrict-select").load("/misc/on_district_changed", {district_code: $(this).val()}, t)
    }), $("#apartment_subdistrict_code").live("change", function () {
        $.get("/misc/on_subdistrict_changed", {subdistrict_code: $(this).val()}, function (e) {
            updateMapCenter(e.lat, e.lng, 15)
        }, "json")
    })
}
function provinceDropdownObserve() {
    var e = $(".province_option .dropdown-menu span");
    e.click(function () {
        var t = $(this).parent().parent().siblings(".dropdown-toggle").find("i");
        t.html($(this).html());
        var n = e.index($(this)), r = $(this).attr("rel"), i = $(".district_option .dropdown-toggle");
        n == 0 ? ($("#search_province_code").val(""), $("#search_district_code").val(""), i.find("i").html("เขต/อำเภอ"), $(".district_option .dropdown-menu").remove()) : ($("#search_province_code").val(r), i.find("i").html("กำลังโหลด ..."), $.get("/misc/on_drowdown_province_changed", {province_code: r}, function (e) {
            r == "10" ? i.find("i").html("กรุณาเลือกเขต") : i.find("i").html("กรุณาเลือกอำเภอ"), $(".district_option .dropdown-menu").length > 0 ? $(".district_option .dropdown-menu").replaceWith(e) : i.after(e)
        }), $(".district_option .dropdown-menu li").attr("unselectable", "on").css("user-select", "none").on("selectstart", !1))
    }), $(".district_option .dropdown-menu span").live("click", function () {
        var e = $(".district_option .dropdown-menu span"), t = $(this).parent().parent().siblings(".dropdown-toggle").find("i"), n = e.index($(this));
        if (n == 0) {
            $("#search_district_code").val("");
            var r = $("#search_province_code").val();
            r == "10" ? t.html("กรุณาเลือกเขต") : t.html("กรุณาเลือกอำเภอ")
        } else {
            var i = $(this).attr("rel");
            t.html($(this).html()), $("#search_district_code").val(i)
        }
    })
}
function latlngLookup(e) {
    geocoder.geocode({address: e, region: "th"}, function (e, t) {
        t == google.maps.GeocoderStatus.OK ? (map.panTo(e[0].geometry.location), mkctn ? (mk.setPosition(e[0].geometry.location), updateLatLng()) : toggleMarker()) : alert("Google หาตำแหน่งที่ระบุไม่พบ")
    })
}
function initMap() {
    provinceObserve();
    var e, t = $("#lat").val(), n = $("#lng").val();
    t ? e = new google.maps.LatLng(t, n) : e = new google.maps.LatLng(13.7541, 100.4939);
    var r = {zoom: 10, center: e, mapTypeControlOptions: {mapTypeIds: [google.maps.MapTypeId.ROADMAP, google.maps.MapTypeId.HYBRID]}, noClear: !0, mapTypeId: google.maps.MapTypeId.ROADMAP, disableDoubleClickZoom: !0, scrollwheel: !1, streetViewControl: !1};
    geocoder = new google.maps.Geocoder, map = new google.maps.Map(document.getElementById("mapholder"), r);
    var i = "http://a3.static.in.th/assets/pin_blue_selected.png";
    mk = new google.maps.Marker({draggable: !0, icon: i, map: map}), google.maps.event.addListener(mk, "dragend", function () {
        updateLatLng()
    }), google.maps.event.addListener(map, "click", function (e) {
        mk.setPosition(e.latLng), map.panTo(e.latLng), mkctn ? updateLatLng() : toggleMarker()
    });
    var s = google.maps.event.addListener(map, "idle", function () {
        google.maps.event.removeListener(s), t && (toggleMarker(), map.setZoom(13))
    });
    $("#maplookup").click(function () {
        var e = $("#apartment_address").val() + " , ", t = $("#apartment_street").val() + " , ", n = $("#apartment_road").val() + " , ", r = $("#apartment_province_code option:selected").text(), i = $("#apartment_district_code option:selected").text() + " , ", s = $("#apartment_subdistrict_code option:selected").text() + " , ", o = t + n + s + i + r;
        return latlngLookup(o), !1
    })
}
function loadMapScript() {
    var e = document.createElement("script");
    e.type = "text/javascript", e.src = "http://maps.googleapis.com/maps/api/js?sensor=true&language=th&callback=initMap", document.body.appendChild(e)
}
function navRenderSuggestions(e) {
    var t = $("#nav_zone_search"), n = t.val();
    h = "";
    var r = null;
    return jQuery.each(e, function (e, t) {
        t.type !== r && (r !== null && (h += "  </ul>\n </li>"), r = t.type, h += '<li class="soulmate-type-container">\n  <ul class="soulmate-type-suggestions"> <li class="soulmate-type "><h3>' + suggestion_type[r] + "</h3></li>\n"), h += '<li id="' + t.id + '" class="soulmate-suggestion">\n  ';
        var i = "(" + n.replace(reEscape, "\\$1") + ")";
        h += t.term.replace(new RegExp(i, "gi"), "<strong>$1</strong>"), h += "\n</li>"
    }), h += "  </ul>\n </li>", h
}
function onNavSelect(e, t, n) {
    n == "zone" ? window.location.href = "/อพาร์ทเม้นท์-ห้องพัก-หอพัก/" + t.url : window.location.href = t.url
}
function initNavZone() {
    $("#nav_zone_search").soulmate({url: "http://www.renthub.in.th/autocomplete/search", types: ["zone", "apartment"], container_class: "nav_suggestion", renderCallback: navRenderSuggestions, selectCallback: onNavSelect, minQueryLength: 1, maxResults: 5})
}
function initContactForm() {
    $("#client_infomation").val($("html").attr("class"));
    var e = $("#contact_form").validate({rules: {"contact[message]": {required: !0}, "contact[name]": {required: !0}, "contact[email]": {required: !0, email: !0, minlength: 5}, "contact[phone]": {required: !0, minlength: 9}}, messages: {"contact[message]": {required: "กรุณาใส่ข้อความ"}, "contact[name]": {required: "กรุณาชื่อเพื่อติดต่อกลับ"}, "contact[email]": {required: "กรุณาใส่อีเมลเพื่อติดต่อกลับ", email: "รูปแบบ อีเมลจะไม่ถูกต้อง (ตัวอย่างที่ถูกต้อง name@email.com)", minlength: "ความยาวต้องไม่น้อยกว่า 5 ตัวอักษร"}, "contact[phone]": {required: "กรุณาใส่เบอร์เพื่อติดต่อกลับ", minlength: "เบอร์โทรศัพท์ ต้องยาวอย่างน้อย 9 หลัก"}}, errorPlacement: function (e, t) {
        e.text() != "" && e.appendTo(t.parent())
    }, submitHandler: function (e) {
        return e.submit(), !1
    }})
}
function initPictureUpload() {
    function n(e) {
        function s(t) {
            var n = e[t].nativeFile, r = /image.*/, i;
            return n.type.match(r) ? (n.slice ? i = n.slice(0, 131072) : n.webkitSlice ? i = n.webkitSlice(0, 131072) : n.mozSlice ? i = n.mozSlice(0, 131072) : i = n, i) : !1
        }

        var t = new Worker("/javascripts/workertest.js");
        t.onmessage = function (e) {
            var t = e.data;
            if (t.thumbnail) {
                var n = $("#pic_" + t.fileid + " img");
                n.attr("src", t.thumbnail), t.Orientation == 6 ? n.addClass("rotate90") : t.Orientation == 8 && n.addClass("rotate270")
            }
        };
        var n = 0, r = e.length, i, o = new FileReader;
        o.onload = function () {
            t.postMessage({fileid: e[n].id, binary_string: this.result}), n++;
            if (n < r) {
                var i = s(n);
                i && o.readAsBinaryString(i)
            }
        }, i = s(n), i && o.readAsBinaryString(i)
    }

    var e, t = $("input[name=authenticity_token]").val();
    jQuery.event.props.push("dataTransfer"), uploader = new plupload.Uploader({runtimes: "html5, flash", browse_button: "pickfiles", container: "picture_upload_section", drop_element: "preview", max_file_size: "10mb", chunk_size: "256kb", autostart: !0, url: "/apartment_pictures", flash_swf_url: "/assets/plupload.flash.swf", resize: {width: 1200, quality: 100}, multipart: !0, filters: [
        {title: "Image files", extensions: "jpg,gif,png"}
    ]}), uploader.bind("Init", function (t, n) {
        e = n.runtime
    }), $("#uploadfiles").click(function (e) {
        uploader.start(), e.preventDefault()
    }), $("#preview").bind("dragenter",function (e) {
        $(this).addClass("hover"), e.preventDefault()
    }).bind("dragleave drop", function (e) {
        $(this).removeClass("hover"), e.preventDefault()
    }), uploader.init(), uploader.bind("FilesAdded", function (t, r) {
        $("#calltouploadpic").hide();
        for (var i = 0; i < r.length; i++) {
            var s = document.createElement("img");
            s.src = "/assets/placeholder.png", $("#preview").append("<div class='thumbnail' id='pic_" + r[i].id + "'><a href='#' class='delete'></a><div class='thumb_img_wrap'></div></div>"), $("#pic_" + r[i].id + " .thumb_img_wrap").append(s), $("#pic_" + r[i].id).append("<div class='progress progress-success progress-striped'><div class='bar' style='width: 0%'>0%</div></div>")
        }
        e == "html5" && n(r), t.refresh(), setTimeout(function () {
            t.start()
        }, 50)
    }), uploader.bind("BeforeUpload", function (e, n) {
        e.settings.multipart_params = {authenticity_token: t, fileid: n.id}
    }), uploader.bind("UploadProgress", function (e, t) {
        $("#pic_" + t.id + " .bar ").css("width", t.percent + "%").html(t.percent + "%")
    }), uploader.bind("Error", function (e, t) {
        e.refresh()
    }), uploader.bind("FileUploaded", function (t, n, r) {
        if (e == "html5") {
            if (r.status == 201) {
                var i = jQuery.parseJSON(r.response);
                $("#pic_" + n.id + " img").removeClass().attr("src", i.thumbnail), $("#pic_" + n.id).addClass("sortable").attr("id", "pic_" + i.id), $("#form-for-aparment").validate().element($("#nopicture_check"))
            }
        } else {
            var i = jQuery.parseJSON(r.response);
            $("#pic_" + n.id + " img").removeClass().attr("src", i.thumbnail), $("#pic_" + n.id).addClass("sortable").attr("id", "pic_" + i.id), $("#form-for-aparment").validate().element($("#nopicture_check"))
        }
        uploader.refresh()
    }), $("#preview").sortable({items: ".sortable", placeholder: "sortable_placeholder", connectWith: "#child_preview"}), $("#child_preview").sortable({items: ".sortable", connectWith: "#preview", placeholder: "sortable_placeholder"}), $(".sortable .delete").live("click", function () {
        return $(this).parent().fadeOut("fast", function () {
            $(this).remove(), $("#form-for-aparment").validate().element($("#nopicture_check")), $("#nopicture_check").hasClass("error") && $("#nopicture").show(), $("#preview .thumbnail").length == 0 && $("#calltouploadpic").show(), uploader.refresh()
        }), !1
    })
}
function fadeOutPanel() {
    $("html").hasClass("ie8") ? $("#result_panel").prepend("<div id='fading-box'></div>") : $("#result_panel").fadeTo("fast", .3), $("html, body").animate({scrollTop: $("#zone_header").offset().top - 10}, 100)
}
function fadeInPanel(e) {
    var t = $("#result_panel");
    t.html(e), insertPremiumBanner(), $("#fading-box").remove(), t.fadeTo("def", 1), typeof facility_facets != "undefined" && refreshFacets(), updateFavorite(), randomSponsorPosition()
}
function onFilterChange() {
    clearInterval(onChangeInterval);
    var e = $("#filter_form input:checked, #zone_id,  #zone_name, #query_string, #district_code, #by_province").fieldSerialize();
    e && (fadeOutPanel(), $.ajax({type: "GET", cache: !1, url: "/search/filter", data: e, dataType: "html"}).done(function (t) {
        fadeInPanel(t), _gaq.push(["_trackPageview", "/search/filter?" + e])
    }))
}
function initFilter() {
    var e = 1, t = $("#search_monthly input:checkbox"), n = $("#search_daily input:checkbox"), r = $("#display_option input:checkbox"), i = $(".search_facility input:checkbox"), s = $(".group_head input:radio");
    $("#filter_form")[0].reset();
    if (price_range.indexOf("monthly_price_price_range") == 0) {
        var o = $("#" + price_range);
        o.attr("checked", !0), o.parent().siblings(".group_head").find("input:radio").attr("checked", !0).removeAttr("disabled"), n.removeAttr("checked"), $("#search_daily .group_head input:radio").attr("disabled", "disabled")
    } else if (price_range.indexOf("daily_price_price_range") == 0) {
        var o = $("#" + price_range);
        o.attr("checked", !0), o.parent().siblings(".group_head").find("input:radio").attr("checked", !0).removeAttr("disabled"), t.removeAttr("checked"), $("#search_monthly .group_head input:radio").attr("disabled", "disabled")
    }
    r.change(function () {
        clearInterval(onChangeInterval), onChangeInterval = setInterval(function () {
            onFilterChange()
        }, delayTime)
    }), $("#search_price_all").change(function () {
        clearInterval(onChangeInterval), $.each(t, function () {
            $(this).removeAttr("checked")
        }), $.each(n, function () {
            $(this).removeAttr("checked")
        }), $("#search_daily .group_head input:radio").attr("disabled", "disabled"), $("#search_monthly .group_head input:radio").attr("disabled", "disabled"), onChangeInterval = setInterval(function () {
            onFilterChange()
        }, delayTime)
    }), t.change(function () {
        clearInterval(onChangeInterval), o = $(this), $.each(s, function () {
            $(this).removeAttr("checked")
        }), o.parent().siblings(".group_head").find("input:radio").attr("checked", !0).removeAttr("disabled"), n.removeAttr("checked"), $("#search_daily .group_head input:radio").attr("disabled", "disabled"), t.filter(":checked").length == 0 && $("#search_price_all").attr("checked", !0), onChangeInterval = setInterval(function () {
            onFilterChange()
        }, delayTime)
    }), n.change(function () {
        clearInterval(onChangeInterval), o = $(this), $.each(s, function () {
            $(this).removeAttr("checked")
        }), o.parent().siblings(".group_head").find("input:radio").attr("checked", !0).removeAttr("disabled"), t.removeAttr("checked"), $("#search_monthly .group_head input:radio").attr("disabled", "disabled"), n.filter(":checked").length == 0 && $("#search_price_all").attr("checked", !0), onChangeInterval = setInterval(function () {
            onFilterChange()
        }, delayTime)
    }), i.change(function () {
        clearInterval(onChangeInterval), onChangeInterval = setInterval(function () {
            onFilterChange()
        }, delayTime)
    }), $("#filter_form input").change(function () {
        e && (initPaginate(), e = 0)
    }), $(".allchoice").click(function () {
        return $(this).parent().siblings().find("input:checkbox").attr("checked", !0), !1
    }), $(".clearchoice").click(function () {
        return $(this).parent().siblings().find("input:checkbox").removeAttr("checked"), !1
    })
}
function initPaginate() {
    $("#result_panel .pagination a").live("click", function () {
        fadeOutPanel();
        var e = $(this).attr("href"), t = e.indexOf("_"), n = e.indexOf("&"), r = "/filter";
        return t >= 0 && (r = e.replace(e.substring(t, n + 1), "")), $.ajax({type: "GET", cache: !1, url: e, dataType: "html"}).done(function (e) {
            fadeInPanel(e), _gaq.push(["_trackPageview", r])
        }), !1
    })
}
function refreshFacets() {
    $.each(facility_facets, function (e, t) {
        if (e == "total" || e == "monthly_rental" || e == "daily_rental")$("#" + e + "_count").html(t); else {
            if (e == "has_picture" || e == "available")var n = $("#display_" + e); else var n = $("#facility_" + e);
            n.next().find("span").html(" (" + t + ")"), t == 0 ? n.attr("disabled", "disable").parent().addClass("disablefacet") : n.removeAttr("disabled").parent().removeClass("disablefacet")
        }
    }), $.each(price_facets, function (e, t) {
        $.each(t, function (e, t) {
            $("#" + e).next().find("span").html(" (" + t + ")")
        })
    })
}
function updateFavorite() {
    function e() {
        $.each(favorites, function (e, t) {
            var n = $("#apartment_" + t + " .buttonicon .star , #exclusive_" + t + " .buttonicon .star");
            n.removeClass("not-favorited").addClass("favorited")
        })
    }

    favorites !== undefined && e()
}
function initListFavorite() {
    $("#result_panel li .star").live("click", function () {
        var type, fav_button = $(this), fav_apt_id = fav_button.parent().parent().attr("id").split("_")[1], login_alert_html = "<span>กรุณา Login เพื่อ Save Favorite</span><a class='login_with facebook medium' href='/users/auth/facebook'>Login with Facebook</a><a class='login_by_email' href='/login'>หรือ Login ด้วย Email</a>";
        return fav_button.hasClass("favorited") ? (type = "DELETE", favorites !== undefined && fav_button.addClass("not-favorited").removeClass("favorited")) : (type = "POST", favorites !== undefined && fav_button.removeClass("not-favorited").addClass("favorited")), $.ajax({type: type, url: "/favorites/apartment/" + fav_apt_id, success: function (data) {
            data.item_class == "favorited" ? (favorites = eval(data.favorites), fav_button.removeClass("not-favorited").addClass(data.item_class)) : (favorites = eval(data.favorites), fav_button.addClass(data.item_class).removeClass("favorited")), $.cookie("user_favorites", data.favorites, {path: "/"})
        }, statusCode: {401: function () {
            last_popover !== undefined && last_popover.popover("hide"), fav_button.popover("show"), last_popover = fav_button, $(".popover").offset().top < $(window).scrollTop() && $("html, body").animate({scrollTop: $(".popover").offset().top - 10}, 100), $(".popover .cancel").live("click", function () {
                return fav_button.popover("hide"), last_popover = undefined, !1
            })
        }}}), $("#result_panel li .star").popover({title: "กรุณา Login <a href='#' class='cancel'>ยกเลิก</a>", placement: "top", content: login_alert_html, html: !0, trigger: "manual"}), !1
    }), updateFavorite()
}
function initListClick() {
    $("#result_panel li").live("click", function () {
        return window.open($(this).find("span.name a").attr("href")), !1
    })
}
function randomSponsorPosition() {
    $(".exclusive_listing").shuffle(), $(".exclusive_shuffle").shuffle(), $(".premium").shuffle(), $(".standard").shuffle()
}
function insertPremiumBanner() {
    var e = '<li id="premium_ads_banner"><span class="name"><a href="/advertise"></a></span><button class="button green normal">ดูรายละเอียดเพิ่มเติม</button></li>';
    $("#result_panel li.standard:last").length > 0 ? $("#result_panel li.standard:last").after(e) : $("#result_panel li.premium:last").length > 0 ? $("#result_panel li.premium:last").after(e) : $("#exclusive_container").length > 0 ? $(".exclusive_shuffle").length > 0 ? $("#result_panel ul:last").prepend(e) : $("#exclusive_container").css("border-bottom", "2px solid #F0E49B") : typeof display_ads_banner != "undefined" && ($("#result_panel li.exclusive_listing:last").length > 0 ? $("#result_panel li.exclusive_listing:last").after(e) : $("#result_panel ul").prepend(e))
}
function initApartmentList() {
    insertPremiumBanner(), initFilter(), refreshFacets(), initListClick(), initListFavorite(), randomSponsorPosition(), $(".nearby_zones a").click(function () {
        var e = this;
        return _gaq.push(["_set", "hitCallback", function () {
            window.location.href = $(e).attr("href")
        }]), _gaq.push(["_trackEvent", "Zone/Nearby Zones", "click"]), !window._gat
    })
}
function initGallery() {
    function h() {
        for (var e = 1; e < s; e++) {
            var i = document.createElement("span"), o = document.createElement("img"), u = t.eq(e);
            o.src = u.attr("src").replace("square", "normal"), $(o).attr("rel", u.attr("rel")), $(i).append(o).css("display", "none"), n.append(i)
        }
        r = n.find("span"), s = r.length
    }

    function p(e) {
        i.css({top: "411px"}), i.find("div").html("รูป " + (e + 1) + "/" + s + ": <br/>" + r.eq(e).find("img").attr("rel")), i.animate({top: "351px"}, 400)
    }

    function d(e) {
        r.eq(o).fadeOut(500), r.eq(e).fadeIn(500), t.eq(o).removeClass("current").css("opacity", "0.65").parent().find("#current-border").remove(), t.eq(e).addClass("current").css("opacity", "1").parent().append("<div id='current-border'></div>"), o = e
    }

    function v() {
        if (f < l) {
            var t = f * 528 * -1;
            e.animate({left: t + "px"}, {queue: !1, duration: 400}), d(f * 12), f++
        }
    }

    function m() {
        if (f > 1) {
            f--;
            var t = (f - 1) * 528 * -1;
            e.animate({left: t + "px"}, {queue: !1, duration: 400}), d((f - 1) * 12)
        }
    }

    var e = $("#thumbs-wrapper ul"), t = e.find("img"), n = $("#stage"), r, i = $("#caption"), s = t.length, o = 0, u = $("#thumbs-nav a.next-arrow"), a = $("#thumbs-nav a.prev-arrow"), f = 1, l = Math.ceil(s / 12), c = $("#hover-nav a");
    h(), t.css("opacity", "0.65"), t.eq(0).addClass("current").css("opacity", "1").parent().append("<div id='current-border'></div>"), i.css("opacity", "0.65"), t.hover(function () {
        $(this).hasClass("current") || $(this).animate({opacity: 1}, {queue: !1, duration: 200})
    }, function () {
        $(this).hasClass("current") || $(this).animate({opacity: .65}, {queue: !1, duration: 200})
    }), t.click(function () {
        if (!$(this).hasClass("current")) {
            var e = t.index($(this));
            d(e)
        }
        return!1
    }), u.click(function () {
        return v(), !1
    }), a.click(function () {
        return m(), !1
    }), l > 1 && $("#thumbs-nav a").hover(function () {
        $(this).addClass("hover")
    }, function () {
        $(this).removeClass("hover")
    }), c.css("opacity", "0"), s > 1 ? (c.hover(function () {
        $(this).css("opacity", "0.65")
    }, function () {
        $(this).css("opacity", "0")
    }), c.eq(0).click(function () {
        return o < s - 1 && (Math.ceil((o + 2) / 12) > f ? v() : d(o + 1)), !1
    }), c.eq(1).click(function () {
        if (o > 0) {
            if (Math.ceil(o / 12) < f) {
                f--;
                var t = (f - 1) * 528 * -1;
                e.animate({left: t + "px"}, {queue: !1, duration: 400})
            }
            d(o - 1)
        }
        return!1
    })) : c.parent().remove()
}
function initShowMap() {
    if (typeof loc != "undefined" && loc != null) {
        var e = dcp(loc), t = new google.maps.LatLng(e[0][0], e[0][1]), n = {zoom: 15, center: t, mapTypeId: google.maps.MapTypeId.ROADMAP, disableDefaultUI: !0, zoomControl: !0, zoomControlOptions: {style: google.maps.ZoomControlStyle.SMALL}, noClear: !1};
        map = new google.maps.Map(document.getElementById("showmap"), n), google.maps.event.addListenerOnce(map, "resize", function () {
            $("#showmap > div").children("div").eq(2).find("a, span").css("font-size", "10px")
        });
        var r = "/assets/pin_blue_selected.png", i = new google.maps.Marker({position: t, draggable: !1, icon: r});
        i.setMap(map)
    }
}
function loadShowMapScript() {
    var e = document.createElement("script");
    e.type = "text/javascript", e.src = "http://maps.googleapis.com/maps/api/js?sensor=true&language=th&callback=initShowMap", document.body.appendChild(e)
}
function showMoreZone(e) {
    var t = $("#morezones_popup");
    if (!insertZone) {
        var n = $("#apartment_sidebar .nearby_zones").children(), r = n.not(".more_zone"), i = r.index($("h3.nearby_bts_mrt")), s = r.index($("h3.nearby_area")), o = r.index($("h3.nearby_education")), u = r.index($("h3.nearby_landmark")), a = t.find(".nearby_zones");
        i >= 0 ? r.slice(i, s).clone().removeClass("lowzone").appendTo(a.first()) : a.first().html("<h3 class='nozone'>ไม่มีรถไฟฟ้าใกล้เคียง</h3>"), s >= 0 ? r.slice(s, o).clone().removeClass("lowzone").appendTo(a.eq(1)) : a.eq(1).html("<h3 class='nozone'>ไม่มีทำเลเด่นใกล้เคียง</h3>"), o >= 0 ? r.slice(o, u).clone().removeClass("lowzone").appendTo(a.eq(2)) : a.eq(2).html("<h3 class='nozone'>ไม่มีสถานศึกษาใกล้เคียง</h3>"), u >= 0 ? r.slice(u, r.size()).clone().removeClass("lowzone").appendTo(a.last()) : a.last.html("<h3 class='nozone'>ไม่มีสถานที่สำคัญใกล้เคียง</h3>"), insertZone = !0
    }
    var f = e.parent().prevAll("h3").first().attr("class"), l = t.find(".apartment_box_header li." + f + " span");
    l.click(), $(".modal-backdrop").show().addClass("fadein"), t.show().css({"margin-left": function () {
        return-($(this).width() / 2)
    }, "margin-top": function () {
        return-($(this).height() / 2)
    }}), $(".modal-backdrop").click(function () {
        $(this).hide().removeClass("fadein"), t.hide()
    })
}
function initShowApartment() {
    $("span.phone a").click(function () {
        var e = $(this).parent();
        return e.html("<img src='/assets/loading-dot.gif' />"), _gaq.push(["_trackEvent", "Apartment", "request phone"]), $.ajax({type: "POST", cache: !1, url: "/apartments/phone/" + apartment_id, dataType: "json"}).done(function (t) {
            e.html(t.phone + t.message)
        }), !1
    }), initGallery();
    var allrec_li = $("#rec_apartment li"), allrec_a = $("#rec_apartment li a");
    $(".facility_choice a").click(function () {
        return!1
    }), $("#rec_apartment li").live("click", function () {
        var e = allrec_li.index($(this)) + 1, t = this;
        return _gaq.push(["_set", "hitCallback", function () {
            window.location.href = $(t).find("span.name a").attr("href")
        }]), _gaq.push(["_trackEvent", "Apartment/Nearby", "click", e.toString() + "/" + allrec_li.length]), !window._gat
    }), $("#rec_apartment li a").live("click", function () {
        var e = allrec_a.index($(this)) + 1, t = this;
        return _gaq.push(["_set", "hitCallback", function () {
            window.location.href = $(t).attr("href")
        }]), _gaq.push(["_trackEvent", "Apartment/Nearby", "click", e.toString() + "/" + allrec_li.length]), !window._gat
    }), $(".nearby_zones a").live("click", function () {
        var e = this;
        return _gaq.push(["_set", "hitCallback", function () {
            window.location.href = $(e).attr("href")
        }]), _gaq.push(["_trackEvent", "Apartment/Nearby Zones", "click"]), !window._gat
    }), $("#apartment_actions .star").click(function () {
        var type;
        $(this).hasClass("favorited") ? type = "DELETE" : type = "POST";
        var star_button = $(this);
        return $.ajax({type: type, url: "/favorites/apartment/" + apartment_id, success: function (data) {
            data.item_class == "favorited" ? (favorites = eval(data.favorites), $("#apartment_actions .star").removeClass("not-favorited").addClass(data.item_class), _gaq.push(["_trackEvent", "Apartment/Favorite", "save"])) : (favorites = eval(data.favorites), $("#apartment_actions .star").addClass(data.item_class).removeClass("favorited"), _gaq.push(["_trackEvent", "Apartment/Favorite", "un save"])), $.cookie("user_favorites", data.favorites, {path: "/"})
        }, statusCode: {401: function () {
            _gaq.push(["_trackEvent", "Apartment/Favorite", "not login"]);
            var e = "<span>กรุณา Login เพื่อ Save Favorite</span><a class='login_with facebook medium' href='/users/auth/facebook'>Login with Facebook</a><a class='login_by_email' href='/login'>หรือ Login ด้วย Email</a>";
            last_popover !== undefined && last_popover.popover("hide"), star_button.popover({title: "กรุณา Login <a href='#' class='cancel'>ยกเลิก</a>", content: e, html: !0, trigger: "manual"}), star_button.popover("show"), last_popover = star_button, $(".popover").offset().top < $(window).scrollTop() && $("html, body").animate({scrollTop: $(".popover").offset().top - 10}, 100), $(".popover .cancel").live("click", function () {
                return star_button.popover("hide"), _gaq.push(["_trackEvent", "Apartment/Favorite/Popup", "cancel popup"]), !1
            })
        }}}), !1
    }), favorites !== undefined && jQuery.inArray(apartment_id, favorites) >= 0 && $("#apartment_actions .star").addClass("favorited"), initComment(), $(".more_zone a").click(function () {
        return showMoreZone($(this)), !1
    }), $("#description_table > li:odd").addClass("odd"), $(function () {
        virtual_tour_url !== undefined && embedpano({target: "virtual_tour", swf: virtual_tour_url})
    })
}
function dcp(e) {
    var t = e.substr(0, e.length - 7), n = t.length, r = 0, i = [], s = 0, o = 0;
    while (r < n) {
        var u, a = 0, f = 0;
        do u = t.charCodeAt(r++) - 63, f |= (u & 31) << a, a += 5; while (u >= 32);
        var l = f & 1 ? ~(f >> 1) : f >> 1;
        s += l, a = 0, f = 0;
        do u = t.charCodeAt(r++) - 63, f |= (u & 31) << a, a += 5; while (u >= 32);
        var c = f & 1 ? ~(f >> 1) : f >> 1;
        o += c, i.push([s * 1e-5, o * 1e-5])
    }
    return i
}
function prettyCheckboxState(e) {
    t = $("input", e), b = $("b", e), v = t.attr("value");
    switch (v) {
        case"":
            b.eq(0).removeClass("false"), b.eq(0).addClass("true"), t.attr("value", "1");
            break;
        case"0":
            b.eq(0).removeClass("false"), b.eq(0).addClass("true"), t.attr("value", "1");
            break;
        case"false":
            b.eq(0).removeClass("false"), b.eq(0).addClass("true"), t.attr("value", "1");
            break;
        case"1":
            b.eq(0).removeClass("true"), b.eq(0).addClass("false"), t.attr("value", "0");
            break;
        case"true":
            b.eq(0).removeClass("true"), b.eq(0).addClass("false"), t.attr("value", "0")
    }
}
function initCheckbox() {
    $(".pretty-checkbox").live("click", function () {
        t = $("input", this), b = $("b", this), v = t.attr("value");
        switch (v) {
            case"":
                b.eq(0).removeClass("false"), b.eq(0).addClass("true"), t.attr("value", "1");
                break;
            case"0":
                b.eq(0).removeClass("false"), b.eq(0).addClass("true"), t.attr("value", "1");
                break;
            case"false":
                b.eq(0).removeClass("false"), b.eq(0).addClass("true"), t.attr("value", "1");
                break;
            case"1":
                b.eq(0).removeClass("true"), b.eq(0).addClass("false"), t.attr("value", "0");
                break;
            case"true":
                b.eq(0).removeClass("true"), b.eq(0).addClass("false"), t.attr("value", "0")
        }
        return!1
    })
}
function setThreeState() {
    $(".three-state").map(function () {
        t = $("input", this), b = $("b", this), v = t.attr("value");
        switch (v) {
            case"1":
                b.eq(0).addClass("true");
                break;
            case"2":
                b.eq(0).addClass("false")
        }
        return!1
    })
}
function initVTourUpload() {
    var e, t = $("input[name=authenticity_token]").val();
    jQuery.event.props.push("dataTransfer"), vtour_uploader = new plupload.Uploader({runtimes: "html5, flash", browse_button: "pick_vtour", container: "vtour_upload_section", drop_element: "vtour_preview", max_file_size: "50mb", chunk_size: "256kb", autostart: !0, url: "/apartment_tours", flash_swf_url: "/assets/plupload.flash.swf", multipart: !0, filters: [
        {title: "Virtual Tour File", extensions: "swf"}
    ]}), vtour_uploader.bind("Init", function (t, n) {
        e = n.runtime
    }), $("#vtour_preview").bind("dragenter",function (e) {
        $(this).addClass("hover"), e.preventDefault()
    }).bind("dragleave drop", function (e) {
        $(this).removeClass("hover"), e.preventDefault()
    }), vtour_uploader.init(), vtour_uploader.bind("FilesAdded", function (e, t) {
        for (var n = 0; n < t.length; n++) {
            var r = document.createElement("img");
            r.src = "/assets/placeholder.png", $("#vtour_preview").append("<div class='thumbnail' id='vtour_" + t[n].id + "'><a href='#' class='delete'></a><div class='thumb_img_wrap'></div></div>"), $("#vtour_" + t[n].id + " .thumb_img_wrap").append(r), $("#vtour_" + t[n].id).append("<div class='progress progress-success progress-striped'><div class='bar' style='width: 0%'>0%</div></div>")
        }
        e.refresh(), setTimeout(function () {
            e.start()
        }, 50)
    }), vtour_uploader.bind("BeforeUpload", function (e, n) {
        e.settings.multipart_params = {authenticity_token: t, fileid: n.id}
    }), vtour_uploader.bind("UploadProgress", function (e, t) {
        $("#vtour_" + t.id + " .bar ").css("width", t.percent + "%").html(t.percent + "%")
    }), vtour_uploader.bind("Error", function (e, t) {
        e.refresh()
    }), vtour_uploader.bind("FileUploaded", function (t, n, r) {
        if (e == "html5") {
            if (r.status == 201) {
                var i = jQuery.parseJSON(r.response);
                $("#vtour_" + n.id).attr("id", "vtour_" + i.id)
            }
        } else {
            var i = jQuery.parseJSON(r.response);
            $("#vtour_" + n.id).attr("id", "vtour_" + i.id)
        }
        vtour_uploader.refresh()
    })
}
function initTab() {
    $(".tab span").click(function () {
        var e = $(this).parent(), t = e.parent(), n = t.find("li").index(e), r = t.next().find(".tab_content");
        e.addClass("selected").siblings().removeClass("selected"), r.addClass("hide"), r.eq(n).removeClass("hide"), typeof google != "undefined" && google.maps.event.trigger(map, "resize")
    })
}
function get_token() {
    var e = $("#description_table .value:first"), t
        ;
    e.length > 0 && (t = {apartment_id: e.html()}, $.cookie("user_identity") != null && $.extend(t, {logged_in: !0})), $.ajax({type: "GET", cache: !1, url: "/misc/token", data: t, dataType: "json", beforeSend: function (e) {
        e.setRequestHeader("Accept", "text/javascript")
    }}).done(function (e) {
        $("meta[name='csrf-param']").attr("content", e.param), $("meta[name='csrf-token']").attr("content", e.token), e.view_count > 0 && $("#view_count").html("เข้าชม : " + e.view_count), e.apartment_owner != null && $(".action a.flag").addClass("delete by_apartment_owner in_apartment_show").removeClass("flag").html("ลบ"), e.is_admin != null && $(".action a.flag").addClass("delete by_admin in_apartment_show").removeClass("flag").html("ลบ")
    })
}
function touch(refresh) {
    if ($.cookie("user_identity") == null || refresh)$.ajax({type: "GET", cache: !1, url: "/misc/touch", dataType: "json", beforeSend: function (e) {
        e.setRequestHeader("Accept", "text/javascript")
    }}).done(function (data) {
        if (data.identity != null) {
            var user_dropdown = $("#user_dropdown");
            user_dropdown.is(":hidden") && (user_dropdown.find(".dropdown-toggle").prepend("<img src='" + data.identity.avatar + "' width='25' />" + data.identity.name), user_dropdown.show()), favorites = eval(data.favorites), $.cookie("user_identity", data.identity.name + "--" + data.identity.avatar + "--" + data.identity.email + "--" + data.identity.phone, {path: "/"}), $.cookie("user_favorites", data.favorites, {path: "/"})
        }
    }).fail(function () {
        $(".login_link").show()
    }); else {
        var user_identity = $.cookie("user_identity").split("--"), user_dropdown = $("#user_dropdown");
        user_dropdown.find(".dropdown-toggle").prepend("<img src='" + user_identity[1] + "' width='25' />" + user_identity[0]), user_dropdown.show(), favorites = eval($.cookie("user_favorites"))
    }
}
function initNotify() {
    $.cookie("acknowledge_changename") == null && $("#notification").show(), $("#notification a.close").click(function () {
        return $("#notification").animate({height: 0, opacity: 0}, "fast", function () {
            $(this).remove()
        }), $.cookie("acknowledge_changename", !0, {path: "/"}), !1
    })
}
(function (e, t) {
    function _(e) {
        var t = M[e] = {};
        return v.each(e.split(y), function (e, n) {
            t[n] = !0
        }), t
    }

    function H(e, n, r) {
        if (r === t && e.nodeType === 1) {
            var i = "data-" + n.replace(P, "-$1").toLowerCase();
            r = e.getAttribute(i);
            if (typeof r == "string") {
                try {
                    r = r === "true" ? !0 : r === "false" ? !1 : r === "null" ? null : +r + "" === r ? +r : D.test(r) ? v.parseJSON(r) : r
                } catch (s) {
                }
                v.data(e, n, r)
            } else r = t
        }
        return r
    }

    function B(e) {
        var t;
        for (t in e) {
            if (t === "data" && v.isEmptyObject(e[t]))continue;
            if (t !== "toJSON")return!1
        }
        return!0
    }

    function et() {
        return!1
    }

    function tt() {
        return!0
    }

    function ut(e) {
        return!e || !e.parentNode || e.parentNode.nodeType === 11
    }

    function at(e, t) {
        do e = e[t]; while (e && e.nodeType !== 1);
        return e
    }

    function ft(e, t, n) {
        t = t || 0;
        if (v.isFunction(t))return v.grep(e, function (e, r) {
            var i = !!t.call(e, r, e);
            return i === n
        });
        if (t.nodeType)return v.grep(e, function (e, r) {
            return e === t === n
        });
        if (typeof t == "string") {
            var r = v.grep(e, function (e) {
                return e.nodeType === 1
            });
            if (it.test(t))return v.filter(t, r, !n);
            t = v.filter(t, r)
        }
        return v.grep(e, function (e, r) {
            return v.inArray(e, t) >= 0 === n
        })
    }

    function lt(e) {
        var t = ct.split("|"), n = e.createDocumentFragment();
        if (n.createElement)while (t.length)n.createElement(t.pop());
        return n
    }

    function Lt(e, t) {
        return e.getElementsByTagName(t)[0] || e.appendChild(e.ownerDocument.createElement(t))
    }

    function At(e, t) {
        if (t.nodeType !== 1 || !v.hasData(e))return;
        var n, r, i, s = v._data(e), o = v._data(t, s), u = s.events;
        if (u) {
            delete o.handle, o.events = {};
            for (n in u)for (r = 0, i = u[n].length; r < i; r++)v.event.add(t, n, u[n][r])
        }
        o.data && (o.data = v.extend({}, o.data))
    }

    function Ot(e, t) {
        var n;
        if (t.nodeType !== 1)return;
        t.clearAttributes && t.clearAttributes(), t.mergeAttributes && t.mergeAttributes(e), n = t.nodeName.toLowerCase(), n === "object" ? (t.parentNode && (t.outerHTML = e.outerHTML), v.support.html5Clone && e.innerHTML && !v.trim(t.innerHTML) && (t.innerHTML = e.innerHTML)) : n === "input" && Et.test(e.type) ? (t.defaultChecked = t.checked = e.checked, t.value !== e.value && (t.value = e.value)) : n === "option" ? t.selected = e.defaultSelected : n === "input" || n === "textarea" ? t.defaultValue = e.defaultValue : n === "script" && t.text !== e.text && (t.text = e.text), t.removeAttribute(v.expando)
    }

    function Mt(e) {
        return typeof e.getElementsByTagName != "undefined" ? e.getElementsByTagName("*") : typeof e.querySelectorAll != "undefined" ? e.querySelectorAll("*") : []
    }

    function _t(e) {
        Et.test(e.type) && (e.defaultChecked = e.checked)
    }

    function Qt(e, t) {
        if (t in e)return t;
        var n = t.charAt(0).toUpperCase() + t.slice(1), r = t, i = Jt.length;
        while (i--) {
            t = Jt[i] + n;
            if (t in e)return t
        }
        return r
    }

    function Gt(e, t) {
        return e = t || e, v.css(e, "display") === "none" || !v.contains(e.ownerDocument, e)
    }

    function Yt(e, t) {
        var n, r, i = [], s = 0, o = e.length;
        for (; s < o; s++) {
            n = e[s];
            if (!n.style)continue;
            i[s] = v._data(n, "olddisplay"), t ? (!i[s] && n.style.display === "none" && (n.style.display = ""), n.style.display === "" && Gt(n) && (i[s] = v._data(n, "olddisplay", nn(n.nodeName)))) : (r = Dt(n, "display"), !i[s] && r !== "none" && v._data(n, "olddisplay", r))
        }
        for (s = 0; s < o; s++) {
            n = e[s];
            if (!n.style)continue;
            if (!t || n.style.display === "none" || n.style.display === "")n.style.display = t ? i[s] || "" : "none"
        }
        return e
    }

    function Zt(e, t, n) {
        var r = Rt.exec(t);
        return r ? Math.max(0, r[1] - (n || 0)) + (r[2] || "px") : t
    }

    function en(e, t, n, r) {
        var i = n === (r ? "border" : "content") ? 4 : t === "width" ? 1 : 0, s = 0;
        for (; i < 4; i += 2)n === "margin" && (s += v.css(e, n + $t[i], !0)), r ? (n === "content" && (s -= parseFloat(Dt(e, "padding" + $t[i])) || 0), n !== "margin" && (s -= parseFloat(Dt(e, "border" + $t[i] + "Width")) || 0)) : (s += parseFloat(Dt(e, "padding" + $t[i])) || 0, n !== "padding" && (s += parseFloat(Dt(e, "border" + $t[i] + "Width")) || 0));
        return s
    }

    function tn(e, t, n) {
        var r = t === "width" ? e.offsetWidth : e.offsetHeight, i = !0, s = v.support.boxSizing && v.css(e, "boxSizing") === "border-box";
        if (r <= 0 || r == null) {
            r = Dt(e, t);
            if (r < 0 || r == null)r = e.style[t];
            if (Ut.test(r))return r;
            i = s && (v.support.boxSizingReliable || r === e.style[t]), r = parseFloat(r) || 0
        }
        return r + en(e, t, n || (s ? "border" : "content"), i) + "px"
    }

    function nn(e) {
        if (Wt[e])return Wt[e];
        var t = v("<" + e + ">").appendTo(i.body), n = t.css("display");
        t.remove();
        if (n === "none" || n === "") {
            Pt = i.body.appendChild(Pt || v.extend(i.createElement("iframe"), {frameBorder: 0, width: 0, height: 0}));
            if (!Ht || !Pt.createElement)Ht = (Pt.contentWindow || Pt.contentDocument).document, Ht.write("<!doctype html><html><body>"), Ht.close();
            t = Ht.body.appendChild(Ht.createElement(e)), n = Dt(t, "display"), i.body.removeChild(Pt)
        }
        return Wt[e] = n, n
    }

    function fn(e, t, n, r) {
        var i;
        if (v.isArray(t))v.each(t, function (t, i) {
            n || sn.test(e) ? r(e, i) : fn(e + "[" + (typeof i == "object" ? t : "") + "]", i, n, r)
        }); else if (!n && v.type(t) === "object")for (i in t)fn(e + "[" + i + "]", t[i], n, r); else r(e, t)
    }

    function Cn(e) {
        return function (t, n) {
            typeof t != "string" && (n = t, t = "*");
            var r, i, s, o = t.toLowerCase().split(y), u = 0, a = o.length;
            if (v.isFunction(n))for (; u < a; u++)r = o[u], s = /^\+/.test(r), s && (r = r.substr(1) || "*"), i = e[r] = e[r] || [], i[s ? "unshift" : "push"](n)
        }
    }

    function kn(e, n, r, i, s, o) {
        s = s || n.dataTypes[0], o = o || {}, o[s] = !0;
        var u, a = e[s], f = 0, l = a ? a.length : 0, c = e === Sn;
        for (; f < l && (c || !u); f++)u = a[f](n, r, i), typeof u == "string" && (!c || o[u] ? u = t : (n.dataTypes.unshift(u), u = kn(e, n, r, i, u, o)));
        return(c || !u) && !o["*"] && (u = kn(e, n, r, i, "*", o)), u
    }

    function Ln(e, n) {
        var r, i, s = v.ajaxSettings.flatOptions || {};
        for (r in n)n[r] !== t && ((s[r] ? e : i || (i = {}))[r] = n[r]);
        i && v.extend(!0, e, i)
    }

    function An(e, n, r) {
        var i, s, o, u, a = e.contents, f = e.dataTypes, l = e.responseFields;
        for (s in l)s in r && (n[l[s]] = r[s]);
        while (f[0] === "*")f.shift(), i === t && (i = e.mimeType || n.getResponseHeader("content-type"));
        if (i)for (s in a)if (a[s] && a[s].test(i)) {
            f.unshift(s);
            break
        }
        if (f[0]in r)o = f[0]; else {
            for (s in r) {
                if (!f[0] || e.converters[s + " " + f[0]]) {
                    o = s;
                    break
                }
                u || (u = s)
            }
            o = o || u
        }
        if (o)return o !== f[0] && f.unshift(o), r[o]
    }

    function On(e, t) {
        var n, r, i, s, o = e.dataTypes.slice(), u = o[0], a = {}, f = 0;
        e.dataFilter && (t = e.dataFilter(t, e.dataType));
        if (o[1])for (n in e.converters)a[n.toLowerCase()] = e.converters[n];
        for (; i = o[++f];)if (i !== "*") {
            if (u !== "*" && u !== i) {
                n = a[u + " " + i] || a["* " + i];
                if (!n)for (r in a) {
                    s = r.split(" ");
                    if (s[1] === i) {
                        n = a[u + " " + s[0]] || a["* " + s[0]];
                        if (n) {
                            n === !0 ? n = a[r] : a[r] !== !0 && (i = s[0], o.splice(f--, 0, i));
                            break
                        }
                    }
                }
                if (n !== !0)if (n && e["throws"])t = n(t); else try {
                    t = n(t)
                } catch (l) {
                    return{state: "parsererror", error: n ? l : "No conversion from " + u + " to " + i}
                }
            }
            u = i
        }
        return{state: "success", data: t}
    }

    function Fn() {
        try {
            return new e.XMLHttpRequest
        } catch (t) {
        }
    }

    function In() {
        try {
            return new e.ActiveXObject("Microsoft.XMLHTTP")
        } catch (t) {
        }
    }

    function $n() {
        return setTimeout(function () {
            qn = t
        }, 0), qn = v.now()
    }

    function Jn(e, t) {
        v.each(t, function (t, n) {
            var r = (Vn[t] || []).concat(Vn["*"]), i = 0, s = r.length;
            for (; i < s; i++)if (r[i].call(e, t, n))return
        })
    }

    function Kn(e, t, n) {
        var r, i = 0, s = 0, o = Xn.length, u = v.Deferred().always(function () {
            delete a.elem
        }), a = function () {
            var t = qn || $n(), n = Math.max(0, f.startTime + f.duration - t), r = n / f.duration || 0, i = 1 - r, s = 0, o = f.tweens.length;
            for (; s < o; s++)f.tweens[s].run(i);
            return u.notifyWith(e, [f, i, n]), i < 1 && o ? n : (u.resolveWith(e, [f]), !1)
        }, f = u.promise({elem: e, props: v.extend({}, t), opts: v.extend(!0, {specialEasing: {}}, n), originalProperties: t, originalOptions: n, startTime: qn || $n(), duration: n.duration, tweens: [], createTween: function (t, n, r) {
            var i = v.Tween(e, f.opts, t, n, f.opts.specialEasing[t] || f.opts.easing);
            return f.tweens.push(i), i
        }, stop: function (t) {
            var n = 0, r = t ? f.tweens.length : 0;
            for (; n < r; n++)f.tweens[n].run(1);
            return t ? u.resolveWith(e, [f, t]) : u.rejectWith(e, [f, t]), this
        }}), l = f.props;
        Qn(l, f.opts.specialEasing);
        for (; i < o; i++) {
            r = Xn[i].call(f, e, l, f.opts);
            if (r)return r
        }
        return Jn(f, l), v.isFunction(f.opts.start) && f.opts.start.call(e, f), v.fx.timer(v.extend(a, {anim: f, queue: f.opts.queue, elem: e})), f.progress(f.opts.progress).done(f.opts.done, f.opts.complete).fail(f.opts.fail).always(f.opts.always)
    }

    function Qn(e, t) {
        var n, r, i, s, o;
        for (n in e) {
            r = v.camelCase(n), i = t[r], s = e[n], v.isArray(s) && (i = s[1], s = e[n] = s[0]), n !== r && (e[r] = s, delete e[n]), o = v.cssHooks[r];
            if (o && "expand"in o) {
                s = o.expand(s), delete e[r];
                for (n in s)n in e || (e[n] = s[n], t[n] = i)
            } else t[r] = i
        }
    }

    function Gn(e, t, n) {
        var r, i, s, o, u, a, f, l, c, h = this, p = e.style, d = {}, m = [], g = e.nodeType && Gt(e);
        n.queue || (l = v._queueHooks(e, "fx"), l.unqueued == null && (l.unqueued = 0, c = l.empty.fire, l.empty.fire = function () {
            l.unqueued || c()
        }), l.unqueued++, h.always(function () {
            h.always(function () {
                l.unqueued--, v.queue(e, "fx").length || l.empty.fire()
            })
        })), e.nodeType === 1 && ("height"in t || "width"in t) && (n.overflow = [p.overflow, p.overflowX, p.overflowY], v.css(e, "display") === "inline" && v.css(e, "float") === "none" && (!v.support.inlineBlockNeedsLayout || nn(e.nodeName) === "inline" ? p.display = "inline-block" : p.zoom = 1)), n.overflow && (p.overflow = "hidden", v.support.shrinkWrapBlocks || h.done(function () {
            p.overflow = n.overflow[0], p.overflowX = n.overflow[1], p.overflowY = n.overflow[2]
        }));
        for (r in t) {
            s = t[r];
            if (Un.exec(s)) {
                delete t[r], a = a || s === "toggle";
                if (s === (g ? "hide" : "show"))continue;
                m.push(r)
            }
        }
        o = m.length;
        if (o) {
            u = v._data(e, "fxshow") || v._data(e, "fxshow", {}), "hidden"in u && (g = u.hidden), a && (u.hidden = !g), g ? v(e).show() : h.done(function () {
                v(e).hide()
            }), h.done(function () {
                var t;
                v.removeData(e, "fxshow", !0);
                for (t in d)v.style(e, t, d[t])
            });
            for (r = 0; r < o; r++)i = m[r], f = h.createTween(i, g ? u[i] : 0), d[i] = u[i] || v.style(e, i), i in u || (u[i] = f.start, g && (f.end = f.start, f.start = i === "width" || i === "height" ? 1 : 0))
        }
    }

    function Yn(e, t, n, r, i) {
        return new Yn.prototype.init(e, t, n, r, i)
    }

    function Zn(e, t) {
        var n, r = {height: e}, i = 0;
        t = t ? 1 : 0;
        for (; i < 4; i += 2 - t)n = $t[i], r["margin" + n] = r["padding" + n] = e;
        return t && (r.opacity = r.width = e), r
    }

    function tr(e) {
        return v.isWindow(e) ? e : e.nodeType === 9 ? e.defaultView || e.parentWindow : !1
    }

    var n, r, i = e.document, s = e.location, o = e.navigator, u = e.jQuery, a = e.$, f = Array.prototype.push, l = Array.prototype.slice, c = Array.prototype.indexOf, h = Object.prototype.toString, p = Object.prototype.hasOwnProperty, d = String.prototype.trim, v = function (e, t) {
        return new v.fn.init(e, t, n)
    }, m = /[\-+]?(?:\d*\.|)\d+(?:[eE][\-+]?\d+|)/.source, g = /\S/, y = /\s+/, b = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, w = /^(?:[^#<]*(<[\w\W]+>)[^>]*$|#([\w\-]*)$)/, E = /^<(\w+)\s*\/?>(?:<\/\1>|)$/, S = /^[\],:{}\s]*$/, x = /(?:^|:|,)(?:\s*\[)+/g, T = /\\(?:["\\\/bfnrt]|u[\da-fA-F]{4})/g, N = /"[^"\\\r\n]*"|true|false|null|-?(?:\d\d*\.|)\d+(?:[eE][\-+]?\d+|)/g, C = /^-ms-/, k = /-([\da-z])/gi, L = function (e, t) {
        return(t + "").toUpperCase()
    }, A = function () {
        i.addEventListener ? (i.removeEventListener("DOMContentLoaded", A, !1), v.ready()) : i.readyState === "complete" && (i.detachEvent("onreadystatechange", A), v.ready())
    }, O = {};
    v.fn = v.prototype = {constructor: v, init: function (e, n, r) {
        var s, o, u, a;
        if (!e)return this;
        if (e.nodeType)return this.context = this[0] = e, this.length = 1, this;
        if (typeof e == "string") {
            e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 ? s = [null, e, null] : s = w.exec(e);
            if (s && (s[1] || !n)) {
                if (s[1])return n = n instanceof v ? n[0] : n, a = n && n.nodeType ? n.ownerDocument || n : i, e = v.parseHTML(s[1], a, !0), E.test(s[1]) && v.isPlainObject(n) && this.attr.call(e, n, !0), v.merge(this, e);
                o = i.getElementById(s[2]);
                if (o && o.parentNode) {
                    if (o.id !== s[2])return r.find(e);
                    this.length = 1, this[0] = o
                }
                return this.context = i, this.selector = e, this
            }
            return!n || n.jquery ? (n || r).find(e) : this.constructor(n).find(e)
        }
        return v.isFunction(e) ? r.ready(e) : (e.selector !== t && (this.selector = e.selector, this.context = e.context), v.makeArray(e, this))
    }, selector: "", jquery: "1.8.3", length: 0, size: function () {
        return this.length
    }, toArray: function () {
        return l.call(this)
    }, get: function (e) {
        return e == null ? this.toArray() : e < 0 ? this[this.length + e] : this[e]
    }, pushStack: function (e, t, n) {
        var r = v.merge(this.constructor(), e);
        return r.prevObject = this, r.context = this.context, t === "find" ? r.selector = this.selector + (this.selector ? " " : "") + n : t && (r.selector = this.selector + "." + t + "(" + n + ")"), r
    }, each: function (e, t) {
        return v.each(this, e, t)
    }, ready: function (e) {
        return v.ready.promise().done(e), this
    }, eq: function (e) {
        return e = +e, e === -1 ? this.slice(e) : this.slice(e, e + 1)
    }, first: function () {
        return this.eq(0)
    }, last: function () {
        return this.eq(-1)
    }, slice: function () {
        return this.pushStack(l.apply(this, arguments), "slice", l.call(arguments).join(","))
    }, map: function (e) {
        return this.pushStack(v.map(this, function (t, n) {
            return e.call(t, n, t)
        }))
    }, end: function () {
        return this.prevObject || this.constructor(null)
    }, push: f, sort: [].sort, splice: [].splice}, v.fn.init.prototype = v.fn, v.extend = v.fn.extend = function () {
        var e, n, r, i, s, o, u = arguments[0] || {}, a = 1, f = arguments.length, l = !1;
        typeof u == "boolean" && (l = u, u = arguments[1] || {}, a = 2), typeof u != "object" && !v.isFunction(u) && (u = {}), f === a && (u = this, --a);
        for (; a < f; a++)if ((e = arguments[a]) != null)for (n in e) {
            r = u[n], i = e[n];
            if (u === i)continue;
            l && i && (v.isPlainObject(i) || (s = v.isArray(i))) ? (s ? (s = !1, o = r && v.isArray(r) ? r : []) : o = r && v.isPlainObject(r) ? r : {}, u[n] = v.extend(l, o, i)) : i !== t && (u[n] = i)
        }
        return u
    }, v.extend({noConflict: function (t) {
        return e.$ === v && (e.$ = a), t && e.jQuery === v && (e.jQuery = u), v
    }, isReady: !1, readyWait: 1, holdReady: function (e) {
        e ? v.readyWait++ : v.ready(!0)
    }, ready: function (e) {
        if (e === !0 ? --v.readyWait : v.isReady)return;
        if (!i.body)return setTimeout(v.ready, 1);
        v.isReady = !0;
        if (e !== !0 && --v.readyWait > 0)return;
        r.resolveWith(i, [v]), v.fn.trigger && v(i).trigger("ready").off("ready")
    }, isFunction: function (e) {
        return v.type(e) === "function"
    }, isArray: Array.isArray || function (e) {
        return v.type(e) === "array"
    }, isWindow: function (e) {
        return e != null && e == e.window
    }, isNumeric: function (e) {
        return!isNaN(parseFloat(e)) && isFinite(e)
    }, type: function (e) {
        return e == null ? String(e) : O[h.call(e)] || "object"
    }, isPlainObject: function (e) {
        if (!e || v.type(e) !== "object" || e.nodeType || v.isWindow(e))return!1;
        try {
            if (e.constructor && !p.call(e, "constructor") && !p.call(e.constructor.prototype, "isPrototypeOf"))return!1
        } catch (n) {
            return!1
        }
        var r;
        for (r in e);
        return r === t || p.call(e, r)
    }, isEmptyObject: function (e) {
        var t;
        for (t in e)return!1;
        return!0
    }, error: function (e) {
        throw new Error(e)
    }, parseHTML: function (e, t, n) {
        var r;
        return!e || typeof e != "string" ? null : (typeof t == "boolean" && (n = t, t = 0), t = t || i, (r = E.exec(e)) ? [t.createElement(r[1])] : (r = v.buildFragment([e], t, n ? null : []), v.merge([], (r.cacheable ? v.clone(r.fragment) : r.fragment).childNodes)))
    }, parseJSON: function (t) {
        if (!t || typeof t != "string")return null;
        t = v.trim(t);
        if (e.JSON && e.JSON.parse)return e.JSON.parse(t);
        if (S.test(t.replace(T, "@").replace(N, "]").replace(x, "")))return(new Function("return " + t))();
        v.error("Invalid JSON: " + t)
    }, parseXML: function (n) {
        var r, i;
        if (!n || typeof n != "string")return null;
        try {
            e.DOMParser ? (i = new DOMParser, r = i.parseFromString(n, "text/xml")) : (r = new ActiveXObject("Microsoft.XMLDOM"), r.async = "false", r.loadXML(n))
        } catch (s) {
            r = t
        }
        return(!r || !r.documentElement || r.getElementsByTagName("parsererror").length) && v.error("Invalid XML: " + n), r
    }, noop: function () {
    }, globalEval: function (t) {
        t && g.test(t) && (e.execScript || function (t) {
            e.eval.call(e, t)
        })(t)
    }, camelCase: function (e) {
        return e.replace(C, "ms-").replace(k, L)
    }, nodeName: function (e, t) {
        return e.nodeName && e.nodeName.toLowerCase() === t.toLowerCase()
    }, each: function (e, n, r) {
        var i, s = 0, o = e.length, u = o === t || v.isFunction(e);
        if (r) {
            if (u) {
                for (i in e)if (n.apply(e[i], r) === !1)break
            } else for (; s < o;)if (n.apply(e[s++], r) === !1)break
        } else if (u) {
            for (i in e)if (n.call(e[i], i, e[i]) === !1)break
        } else for (; s < o;)if (n.call(e[s], s, e[s++]) === !1)break;
        return e
    }, trim: d && !d.call("﻿ ") ? function (e) {
        return e == null ? "" : d.call(e)
    } : function (e) {
        return e == null ? "" : (e + "").replace(b, "")
    }, makeArray: function (e, t) {
        var n, r = t || [];
        return e != null && (n = v.type(e), e.length == null || n === "string" || n === "function" || n === "regexp" || v.isWindow(e) ? f.call(r, e) : v.merge(r, e)), r
    }, inArray: function (e, t, n) {
        var r;
        if (t) {
            if (c)return c.call(t, e, n);
            r = t.length, n = n ? n < 0 ? Math.max(0, r + n) : n : 0;
            for (; n < r; n++)if (n in t && t[n] === e)return n
        }
        return-1
    }, merge: function (e, n) {
        var r = n.length, i = e.length, s = 0;
        if (typeof r == "number")for (; s < r; s++)e[i++] = n[s]; else while (n[s] !== t)e[i++] = n[s++];
        return e.length = i, e
    }, grep: function (e, t, n) {
        var r, i = [], s = 0, o = e.length;
        n = !!n;
        for (; s < o; s++)r = !!t(e[s], s), n !== r && i.push(e[s]);
        return i
    }, map: function (e, n, r) {
        var i, s, o = [], u = 0, a = e.length, f = e instanceof v || a !== t && typeof a == "number" && (a > 0 && e[0] && e[a - 1] || a === 0 || v.isArray(e));
        if (f)for (; u < a; u++)i = n(e[u], u, r), i != null && (o[o.length] = i); else for (s in e)i = n(e[s], s, r), i != null && (o[o.length] = i);
        return o.concat.apply([], o)
    }, guid: 1, proxy: function (e, n) {
        var r, i, s;
        return typeof n == "string" && (r = e[n], n = e, e = r), v.isFunction(e) ? (i = l.call(arguments, 2), s = function () {
            return e.apply(n, i.concat(l.call(arguments)))
        }, s.guid = e.guid = e.guid || v.guid++, s) : t
    }, access: function (e, n, r, i, s, o, u) {
        var a, f = r == null, l = 0, c = e.length;
        if (r && typeof r == "object") {
            for (l in r)v.access(e, n, l, r[l], 1, o, i);
            s = 1
        } else if (i !== t) {
            a = u === t && v.isFunction(i), f && (a ? (a = n, n = function (e, t, n) {
                return a.call(v(e), n)
            }) : (n.call(e, i), n = null));
            if (n)for (; l < c; l++)n(e[l], r, a ? i.call(e[l], l, n(e[l], r)) : i, u);
            s = 1
        }
        return s ? e : f ? n.call(e) : c ? n(e[0], r) : o
    }, now: function () {
        return(new Date).getTime()
    }}), v.ready.promise = function (t) {
        if (!r) {
            r = v.Deferred();
            if (i.readyState === "complete")setTimeout(v.ready, 1); else if (i.addEventListener)i.addEventListener("DOMContentLoaded", A, !1), e.addEventListener("load", v.ready, !1); else {
                i.attachEvent("onreadystatechange", A), e.attachEvent("onload", v.ready);
                var n = !1;
                try {
                    n = e.frameElement == null && i.documentElement
                } catch (s) {
                }
                n && n.doScroll && function o() {
                    if (!v.isReady) {
                        try {
                            n.doScroll("left")
                        } catch (e) {
                            return setTimeout(o, 50)
                        }
                        v.ready()
                    }
                }()
            }
        }
        return r.promise(t)
    }, v.each("Boolean Number String Function Array Date RegExp Object".split(" "), function (e, t) {
        O["[object " + t + "]"] = t.toLowerCase()
    }), n = v(i);
    var M = {};
    v.Callbacks = function (e) {
        e = typeof e == "string" ? M[e] || _(e) : v.extend({}, e);
        var n, r, i, s, o, u, a = [], f = !e.once && [], l = function (t) {
            n = e.memory && t, r = !0, u = s || 0, s = 0, o = a.length, i = !0;
            for (; a && u < o; u++)if (a[u].apply(t[0], t[1]) === !1 && e.stopOnFalse) {
                n = !1;
                break
            }
            i = !1, a && (f ? f.length && l(f.shift()) : n ? a = [] : c.disable())
        }, c = {add: function () {
            if (a) {
                var t = a.length;
                (function r(t) {
                    v.each(t, function (t, n) {
                        var i = v.type(n);
                        i === "function" ? (!e.unique || !c.has(n)) && a.push(n) : n && n.length && i !== "string" && r(n)
                    })
                })(arguments), i ? o = a.length : n && (s = t, l(n))
            }
            return this
        }, remove: function () {
            return a && v.each(arguments, function (e, t) {
                var n;
                while ((n = v.inArray(t, a, n)) > -1)a.splice(n, 1), i && (n <= o && o--, n <= u && u--)
            }), this
        }, has: function (e) {
            return v.inArray(e, a) > -1
        }, empty: function () {
            return a = [], this
        }, disable: function () {
            return a = f = n = t, this
        }, disabled: function () {
            return!a
        }, lock: function () {
            return f = t, n || c.disable(), this
        }, locked: function () {
            return!f
        }, fireWith: function (e, t) {
            return t = t || [], t = [e, t.slice ? t.slice() : t], a && (!r || f) && (i ? f.push(t) : l(t)), this
        }, fire: function () {
            return c.fireWith(this, arguments), this
        }, fired: function () {
            return!!r
        }};
        return c
    }, v.extend({Deferred: function (e) {
        var t = [
            ["resolve", "done", v.Callbacks("once memory"), "resolved"],
            ["reject", "fail", v.Callbacks("once memory"), "rejected"],
            ["notify", "progress", v.Callbacks("memory")]
        ], n = "pending", r = {state: function () {
            return n
        }, always: function () {
            return i.done(arguments).fail(arguments), this
        }, then: function () {
            var e = arguments;
            return v.Deferred(function (n) {
                v.each(t, function (t, r) {
                    var s = r[0], o = e[t];
                    i[r[1]](v.isFunction(o) ? function () {
                        var e = o.apply(this, arguments);
                        e && v.isFunction(e.promise) ? e.promise().done(n.resolve).fail(n.reject).progress(n.notify) : n[s + "With"](this === i ? n : this, [e])
                    } : n[s])
                }), e = null
            }).promise()
        }, promise: function (e) {
            return e != null ? v.extend(e, r) : r
        }}, i = {};
        return r.pipe = r.then, v.each(t, function (e, s) {
            var o = s[2], u = s[3];
            r[s[1]] = o.add, u && o.add(function () {
                n = u
            }, t[e ^ 1][2].disable, t[2][2].lock), i[s[0]] = o.fire, i[s[0] + "With"] = o.fireWith
        }), r.promise(i), e && e.call(i, i), i
    }, when: function (e) {
        var t = 0, n = l.call(arguments), r = n.length, i = r !== 1 || e && v.isFunction(e.promise) ? r : 0, s = i === 1 ? e : v.Deferred(), o = function (e, t, n) {
            return function (r) {
                t[e] = this, n[e] = arguments.length > 1 ? l.call(arguments) : r, n === u ? s.notifyWith(t, n) : --i || s.resolveWith(t, n)
            }
        }, u, a, f;
        if (r > 1) {
            u = new Array(r), a = new Array(r), f = new Array(r);
            for (; t < r; t++)n[t] && v.isFunction(n[t].promise) ? n[t].promise().done(o(t, f, n)).fail(s.reject).progress(o(t, a, u)) : --i
        }
        return i || s.resolveWith(f, n), s.promise()
    }}), v.support = function () {
        var t, n, r, s, o, u, a, f, l, c, h, p = i.createElement("div");
        p.setAttribute("className", "t"), p.innerHTML = "  <link/><table></table><a href='/a'>a</a><input type='checkbox'/>", n = p.getElementsByTagName("*"), r = p.getElementsByTagName("a")[0];
        if (!n || !r || !n.length)return{};
        s = i.createElement("select"), o = s.appendChild(i.createElement("option")), u = p.getElementsByTagName("input")[0], r.style.cssText = "top:1px;float:left;opacity:.5", t = {leadingWhitespace: p.firstChild.nodeType === 3, tbody: !p.getElementsByTagName("tbody").length, htmlSerialize: !!p.getElementsByTagName("link").length, style: /top/.test(r.getAttribute("style")), hrefNormalized: r.getAttribute("href") === "/a", opacity: /^0.5/.test(r.style.opacity), cssFloat: !!r.style.cssFloat, checkOn: u.value === "on", optSelected: o.selected, getSetAttribute: p.className !== "t", enctype: !!i.createElement("form").enctype, html5Clone: i.createElement("nav").cloneNode(!0).outerHTML !== "<:nav></:nav>", boxModel: i.compatMode === "CSS1Compat", submitBubbles: !0, changeBubbles: !0, focusinBubbles: !1, deleteExpando: !0, noCloneEvent: !0, inlineBlockNeedsLayout: !1, shrinkWrapBlocks: !1, reliableMarginRight: !0, boxSizingReliable: !0, pixelPosition: !1}, u.checked = !0, t.noCloneChecked = u.cloneNode(!0).checked, s.disabled = !0, t.optDisabled = !o.disabled;
        try {
            delete p.test
        } catch (d) {
            t.deleteExpando = !1
        }
        !p.addEventListener && p.attachEvent && p.fireEvent && (p.attachEvent("onclick", h = function () {
            t.noCloneEvent = !1
        }), p.cloneNode(!0).fireEvent("onclick"), p.detachEvent("onclick", h)), u = i.createElement("input"), u.value = "t", u.setAttribute("type", "radio"), t.radioValue = u.value === "t", u.setAttribute("checked", "checked"), u.setAttribute("name", "t"), p.appendChild(u), a = i.createDocumentFragment(), a.appendChild(p.lastChild), t.checkClone = a.cloneNode(!0).cloneNode(!0).lastChild.checked, t.appendChecked = u.checked, a.removeChild(u), a.appendChild(p);
        if (p.attachEvent)for (l in{submit: !0, change: !0, focusin: !0})f = "on" + l, c = f in p, c || (p.setAttribute(f, "return;"), c = typeof p[f] == "function"), t[l + "Bubbles"] = c;
        return v(function () {
            var n, r, s, o, u = "padding:0;margin:0;border:0;display:block;overflow:hidden;", a = i.getElementsByTagName("body")[0];
            if (!a)return;
            n = i.createElement("div"), n.style.cssText = "visibility:hidden;border:0;width:0;height:0;position:static;top:0;margin-top:1px", a.insertBefore(n, a.firstChild), r = i.createElement("div"), n.appendChild(r), r.innerHTML = "<table><tr><td></td><td>t</td></tr></table>", s = r.getElementsByTagName("td"), s[0].style.cssText = "padding:0;margin:0;border:0;display:none", c = s[0].offsetHeight === 0, s[0].style.display = "", s[1].style.display = "none", t.reliableHiddenOffsets = c && s[0].offsetHeight === 0, r.innerHTML = "", r.style.cssText = "box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box;padding:1px;border:1px;display:block;width:4px;margin-top:1%;position:absolute;top:1%;", t.boxSizing = r.offsetWidth === 4, t.doesNotIncludeMarginInBodyOffset = a.offsetTop !== 1, e.getComputedStyle && (t.pixelPosition = (e.getComputedStyle(r, null) || {}).top !== "1%", t.boxSizingReliable = (e.getComputedStyle(r, null) || {width: "4px"}).width === "4px", o = i.createElement("div"), o.style.cssText = r.style.cssText = u, o.style.marginRight = o.style.width = "0", r.style.width = "1px", r.appendChild(o), t.reliableMarginRight = !parseFloat((e.getComputedStyle(o, null) || {}).marginRight)), typeof r.style.zoom != "undefined" && (r.innerHTML = "", r.style.cssText = u + "width:1px;padding:1px;display:inline;zoom:1", t.inlineBlockNeedsLayout = r.offsetWidth === 3, r.style.display = "block", r.style.overflow = "visible", r.innerHTML = "<div></div>", r.firstChild.style.width = "5px", t.shrinkWrapBlocks = r.offsetWidth !== 3, n.style.zoom = 1), a.removeChild(n), n = r = s = o = null
        }), a.removeChild(p), n = r = s = o = u = a = p = null, t
    }();
    var D = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/, P = /([A-Z])/g;
    v.extend({cache: {}, deletedIds: [], uuid: 0, expando: "jQuery" + (v.fn.jquery + Math.random()).replace(/\D/g, ""), noData: {embed: !0, object: "clsid:D27CDB6E-AE6D-11cf-96B8-444553540000", applet: !0}, hasData: function (e) {
        return e = e.nodeType ? v.cache[e[v.expando]] : e[v.expando], !!e && !B(e)
    }, data: function (e, n, r, i) {
        if (!v.acceptData(e))return;
        var s, o, u = v.expando, a = typeof n == "string", f = e.nodeType, l = f ? v.cache : e, c = f ? e[u] : e[u] && u;
        if ((!c || !l[c] || !i && !l[c].data) && a && r === t)return;
        c || (f ? e[u] = c = v.deletedIds.pop() || v.guid++ : c = u), l[c] || (l[c] = {}, f || (l[c].toJSON = v.noop));
        if (typeof n == "object" || typeof n == "function")i ? l[c] = v.extend(l[c], n) : l[c].data = v.extend(l[c].data, n);
        return s = l[c], i || (s.data || (s.data = {}), s = s.data), r !== t && (s[v.camelCase(n)] = r), a ? (o = s[n], o == null && (o = s[v.camelCase(n)])) : o = s, o
    }, removeData: function (e, t, n) {
        if (!v.acceptData(e))return;
        var r, i, s, o = e.nodeType, u = o ? v.cache : e, a = o ? e[v.expando] : v.expando;
        if (!u[a])return;
        if (t) {
            r = n ? u[a] : u[a].data;
            if (r) {
                v.isArray(t) || (t in r ? t = [t] : (t = v.camelCase(t), t in r ? t = [t] : t = t.split(" ")));
                for (i = 0, s = t.length; i < s; i++)delete r[t[i]];
                if (!(n ? B : v.isEmptyObject)(r))return
            }
        }
        if (!n) {
            delete u[a].data;
            if (!B(u[a]))return
        }
        o ? v.cleanData([e], !0) : v.support.deleteExpando || u != u.window ? delete u[a] : u[a] = null
    }, _data: function (e, t, n) {
        return v.data(e, t, n, !0)
    }, acceptData: function (e) {
        var t = e.nodeName && v.noData[e.nodeName.toLowerCase()];
        return!t || t !== !0 && e.getAttribute("classid") === t
    }}), v.fn.extend({data: function (e, n) {
        var r, i, s, o, u, a = this[0], f = 0, l = null;
        if (e === t) {
            if (this.length) {
                l = v.data(a);
                if (a.nodeType === 1 && !v._data(a, "parsedAttrs")) {
                    s = a.attributes;
                    for (u = s.length; f < u; f++)o = s[f].name, o.indexOf("data-") || (o = v.camelCase(o.substring(5)), H(a, o, l[o]));
                    v._data(a, "parsedAttrs", !0)
                }
            }
            return l
        }
        return typeof e == "object" ? this.each(function () {
            v.data(this, e)
        }) : (r = e.split(".", 2), r[1] = r[1] ? "." + r[1] : "", i = r[1] + "!", v.access(this, function (n) {
            if (n === t)return l = this.triggerHandler("getData" + i, [r[0]]), l === t && a && (l = v.data(a, e), l = H(a, e, l)), l === t && r[1] ? this.data(r[0]) : l;
            r[1] = n, this.each(function () {
                var t = v(this);
                t.triggerHandler("setData" + i, r), v.data(this, e, n), t.triggerHandler("changeData" + i, r)
            })
        }, null, n, arguments.length > 1, null, !1))
    }, removeData: function (e) {
        return this.each(function () {
            v.removeData(this, e)
        })
    }}), v.extend({queue: function (e, t, n) {
        var r;
        if (e)return t = (t || "fx") + "queue", r = v._data(e, t), n && (!r || v.isArray(n) ? r = v._data(e, t, v.makeArray(n)) : r.push(n)), r || []
    }, dequeue: function (e, t) {
        t = t || "fx";
        var n = v.queue(e, t), r = n.length, i = n.shift(), s = v._queueHooks(e, t), o = function () {
            v.dequeue(e, t)
        };
        i === "inprogress" && (i = n.shift(), r--), i && (t === "fx" && n.unshift("inprogress"), delete s.stop, i.call(e, o, s)), !r && s && s.empty.fire()
    }, _queueHooks: function (e, t) {
        var n = t + "queueHooks";
        return v._data(e, n) || v._data(e, n, {empty: v.Callbacks("once memory").add(function () {
            v.removeData(e, t + "queue", !0), v.removeData(e, n, !0)
        })})
    }}), v.fn.extend({queue: function (e, n) {
        var r = 2;
        return typeof e != "string" && (n = e, e = "fx", r--), arguments.length < r ? v.queue(this[0], e) : n === t ? this : this.each(function () {
            var t = v.queue(this, e, n);
            v._queueHooks(this, e), e === "fx" && t[0] !== "inprogress" && v.dequeue(this, e)
        })
    }, dequeue: function (e) {
        return this.each(function () {
            v.dequeue(this, e)
        })
    }, delay: function (e, t) {
        return e = v.fx ? v.fx.speeds[e] || e : e, t = t || "fx", this.queue(t, function (t, n) {
            var r = setTimeout(t, e);
            n.stop = function () {
                clearTimeout(r)
            }
        })
    }, clearQueue: function (e) {
        return this.queue(e || "fx", [])
    }, promise: function (e, n) {
        var r, i = 1, s = v.Deferred(), o = this, u = this.length, a = function () {
            --i || s.resolveWith(o, [o])
        };
        typeof e != "string" && (n = e, e = t), e = e || "fx";
        while (u--)r = v._data(o[u], e + "queueHooks"), r && r.empty && (i++, r.empty.add(a));
        return a(), s.promise(n)
    }});
    var j, F, I, q = /[\t\r\n]/g, R = /\r/g, U = /^(?:button|input)$/i, z = /^(?:button|input|object|select|textarea)$/i, W = /^a(?:rea|)$/i, X = /^(?:autofocus|autoplay|async|checked|controls|defer|disabled|hidden|loop|multiple|open|readonly|required|scoped|selected)$/i, V = v.support.getSetAttribute;
    v.fn.extend({attr: function (e, t) {
        return v.access(this, v.attr, e, t, arguments.length > 1)
    }, removeAttr: function (e) {
        return this.each(function () {
            v.removeAttr(this, e)
        })
    }, prop: function (e, t) {
        return v.access(this, v.prop, e, t, arguments.length > 1)
    }, removeProp: function (e) {
        return e = v.propFix[e] || e, this.each(function () {
            try {
                this[e] = t, delete this[e]
            } catch (n) {
            }
        })
    }, addClass: function (e) {
        var t, n, r, i, s, o, u;
        if (v.isFunction(e))return this.each(function (t) {
            v(this).addClass(e.call(this, t, this.className))
        });
        if (e && typeof e == "string") {
            t = e.split(y);
            for (n = 0, r = this.length; n < r; n++) {
                i = this[n];
                if (i.nodeType === 1)if (!i.className && t.length === 1)i.className = e; else {
                    s = " " + i.className + " ";
                    for (o = 0, u = t.length; o < u; o++)s.indexOf(" " + t[o] + " ") < 0 && (s += t[o] + " ");
                    i.className = v.trim(s)
                }
            }
        }
        return this
    }, removeClass: function (e) {
        var n, r, i, s, o, u, a;
        if (v.isFunction(e))return this.each(function (t) {
            v(this).removeClass(e.call(this, t, this.className))
        });
        if (e && typeof e == "string" || e === t) {
            n = (e || "").split(y);
            for (u = 0, a = this.length; u < a; u++) {
                i = this[u];
                if (i.nodeType === 1 && i.className) {
                    r = (" " + i.className + " ").replace(q, " ");
                    for (s = 0, o = n.length; s < o; s++)while (r.indexOf(" " + n[s] + " ") >= 0)r = r.replace(" " + n[s] + " ", " ");
                    i.className = e ? v.trim(r) : ""
                }
            }
        }
        return this
    }, toggleClass: function (e, t) {
        var n = typeof e, r = typeof t == "boolean";
        return v.isFunction(e) ? this.each(function (n) {
            v(this).toggleClass(e.call(this, n, this.className, t), t)
        }) : this.each(function () {
            if (n === "string") {
                var i, s = 0, o = v(this), u = t, a = e.split(y);
                while (i = a[s++])u = r ? u : !o.hasClass(i), o[u ? "addClass" : "removeClass"](i)
            } else if (n === "undefined" || n === "boolean")this.className && v._data(this, "__className__", this.className), this.className = this.className || e === !1 ? "" : v._data(this, "__className__") || ""
        })
    }, hasClass: function (e) {
        var t = " " + e + " ", n = 0, r = this.length;
        for (; n < r; n++)if (this[n].nodeType === 1 && (" " + this[n].className + " ").replace(q, " ").indexOf(t) >= 0)return!0;
        return!1
    }, val: function (e) {
        var n, r, i, s = this[0];
        if (!arguments.length) {
            if (s)return n = v.valHooks[s.type] || v.valHooks[s.nodeName.toLowerCase()], n && "get"in n && (r = n.get(s, "value")) !== t ? r : (r = s.value, typeof r == "string" ? r.replace(R, "") : r == null ? "" : r);
            return
        }
        return i = v.isFunction(e), this.each(function (r) {
            var s, o = v(this);
            if (this.nodeType !== 1)return;
            i ? s = e.call(this, r, o.val()) : s = e, s == null ? s = "" : typeof s == "number" ? s += "" : v.isArray(s) && (s = v.map(s, function (e) {
                return e == null ? "" : e + ""
            })), n = v.valHooks[this.type] || v.valHooks[this.nodeName.toLowerCase()];
            if (!n || !("set"in n) || n.set(this, s, "value") === t)this.value = s
        })
    }}), v.extend({valHooks: {option: {get: function (e) {
        var t = e.attributes.value;
        return!t || t.specified ? e.value : e.text
    }}, select: {get: function (e) {
        var t, n, r = e.options, i = e.selectedIndex, s = e.type === "select-one" || i < 0, o = s ? null : [], u = s ? i + 1 : r.length, a = i < 0 ? u : s ? i : 0;
        for (; a < u; a++) {
            n = r[a];
            if ((n.selected || a === i) && (v.support.optDisabled ? !n.disabled : n.getAttribute("disabled") === null) && (!n.parentNode.disabled || !v.nodeName(n.parentNode, "optgroup"))) {
                t = v(n).val();
                if (s)return t;
                o.push(t)
            }
        }
        return o
    }, set: function (e, t) {
        var n = v.makeArray(t);
        return v(e).find("option").each(function () {
            this.selected = v.inArray(v(this).val(), n) >= 0
        }), n.length || (e.selectedIndex = -1), n
    }}}, attrFn: {}, attr: function (e, n, r, i) {
        var s, o, u, a = e.nodeType;
        if (!e || a === 3 || a === 8 || a === 2)return;
        if (i && v.isFunction(v.fn[n]))return v(e)[n](r);
        if (typeof e.getAttribute == "undefined")return v.prop(e, n, r);
        u = a !== 1 || !v.isXMLDoc(e), u && (n = n.toLowerCase(), o = v.attrHooks[n] || (X.test(n) ? F : j));
        if (r !== t) {
            if (r === null) {
                v.removeAttr(e, n);
                return
            }
            return o && "set"in o && u && (s = o.set(e, r, n)) !== t ? s : (e.setAttribute(n, r + ""), r)
        }
        return o && "get"in o && u && (s = o.get(e, n)) !== null ? s : (s = e.getAttribute(n), s === null ? t : s)
    }, removeAttr: function (e, t) {
        var n, r, i, s, o = 0;
        if (t && e.nodeType === 1) {
            r = t.split(y);
            for (; o < r.length; o++)i = r[o], i && (n = v.propFix[i] || i, s = X.test(i), s || v.attr(e, i, ""), e.removeAttribute(V ? i : n), s && n in e && (e[n] = !1))
        }
    }, attrHooks: {type: {set: function (e, t) {
        if (U.test(e.nodeName) && e.parentNode)v.error("type property can't be changed"); else if (!v.support.radioValue && t === "radio" && v.nodeName(e, "input")) {
            var n = e.value;
            return e.setAttribute("type", t), n && (e.value = n), t
        }
    }}, value: {get: function (e, t) {
        return j && v.nodeName
            (e, "button") ? j.get(e, t) : t in e ? e.value : null
    }, set: function (e, t, n) {
        if (j && v.nodeName(e, "button"))return j.set(e, t, n);
        e.value = t
    }}}, propFix: {tabindex: "tabIndex", readonly: "readOnly", "for": "htmlFor", "class": "className", maxlength: "maxLength", cellspacing: "cellSpacing", cellpadding: "cellPadding", rowspan: "rowSpan", colspan: "colSpan", usemap: "useMap", frameborder: "frameBorder", contenteditable: "contentEditable"}, prop: function (e, n, r) {
        var i, s, o, u = e.nodeType;
        if (!e || u === 3 || u === 8 || u === 2)return;
        return o = u !== 1 || !v.isXMLDoc(e), o && (n = v.propFix[n] || n, s = v.propHooks[n]), r !== t ? s && "set"in s && (i = s.set(e, r, n)) !== t ? i : e[n] = r : s && "get"in s && (i = s.get(e, n)) !== null ? i : e[n]
    }, propHooks: {tabIndex: {get: function (e) {
        var n = e.getAttributeNode("tabindex");
        return n && n.specified ? parseInt(n.value, 10) : z.test(e.nodeName) || W.test(e.nodeName) && e.href ? 0 : t
    }}}}), F = {get: function (e, n) {
        var r, i = v.prop(e, n);
        return i === !0 || typeof i != "boolean" && (r = e.getAttributeNode(n)) && r.nodeValue !== !1 ? n.toLowerCase() : t
    }, set: function (e, t, n) {
        var r;
        return t === !1 ? v.removeAttr(e, n) : (r = v.propFix[n] || n, r in e && (e[r] = !0), e.setAttribute(n, n.toLowerCase())), n
    }}, V || (I = {name: !0, id: !0, coords: !0}, j = v.valHooks.button = {get: function (e, n) {
        var r;
        return r = e.getAttributeNode(n), r && (I[n] ? r.value !== "" : r.specified) ? r.value : t
    }, set: function (e, t, n) {
        var r = e.getAttributeNode(n);
        return r || (r = i.createAttribute(n), e.setAttributeNode(r)), r.value = t + ""
    }}, v.each(["width", "height"], function (e, t) {
        v.attrHooks[t] = v.extend(v.attrHooks[t], {set: function (e, n) {
            if (n === "")return e.setAttribute(t, "auto"), n
        }})
    }), v.attrHooks.contenteditable = {get: j.get, set: function (e, t, n) {
        t === "" && (t = "false"), j.set(e, t, n)
    }}), v.support.hrefNormalized || v.each(["href", "src", "width", "height"], function (e, n) {
        v.attrHooks[n] = v.extend(v.attrHooks[n], {get: function (e) {
            var r = e.getAttribute(n, 2);
            return r === null ? t : r
        }})
    }), v.support.style || (v.attrHooks.style = {get: function (e) {
        return e.style.cssText.toLowerCase() || t
    }, set: function (e, t) {
        return e.style.cssText = t + ""
    }}), v.support.optSelected || (v.propHooks.selected = v.extend(v.propHooks.selected, {get: function (e) {
        var t = e.parentNode;
        return t && (t.selectedIndex, t.parentNode && t.parentNode.selectedIndex), null
    }})), v.support.enctype || (v.propFix.enctype = "encoding"), v.support.checkOn || v.each(["radio", "checkbox"], function () {
        v.valHooks[this] = {get: function (e) {
            return e.getAttribute("value") === null ? "on" : e.value
        }}
    }), v.each(["radio", "checkbox"], function () {
        v.valHooks[this] = v.extend(v.valHooks[this], {set: function (e, t) {
            if (v.isArray(t))return e.checked = v.inArray(v(e).val(), t) >= 0
        }})
    });
    var $ = /^(?:textarea|input|select)$/i, J = /^([^\.]*|)(?:\.(.+)|)$/, K = /(?:^|\s)hover(\.\S+|)\b/, Q = /^key/, G = /^(?:mouse|contextmenu)|click/, Y = /^(?:focusinfocus|focusoutblur)$/, Z = function (e) {
        return v.event.special.hover ? e : e.replace(K, "mouseenter$1 mouseleave$1")
    };
    v.event = {add: function (e, n, r, i, s) {
        var o, u, a, f, l, c, h, p, d, m, g;
        if (e.nodeType === 3 || e.nodeType === 8 || !n || !r || !(o = v._data(e)))return;
        r.handler && (d = r, r = d.handler, s = d.selector), r.guid || (r.guid = v.guid++), a = o.events, a || (o.events = a = {}), u = o.handle, u || (o.handle = u = function (e) {
            return typeof v == "undefined" || !!e && v.event.triggered === e.type ? t : v.event.dispatch.apply(u.elem, arguments)
        }, u.elem = e), n = v.trim(Z(n)).split(" ");
        for (f = 0; f < n.length; f++) {
            l = J.exec(n[f]) || [], c = l[1], h = (l[2] || "").split(".").sort(), g = v.event.special[c] || {}, c = (s ? g.delegateType : g.bindType) || c, g = v.event.special[c] || {}, p = v.extend({type: c, origType: l[1], data: i, handler: r, guid: r.guid, selector: s, needsContext: s && v.expr.match.needsContext.test(s), namespace: h.join(".")}, d), m = a[c];
            if (!m) {
                m = a[c] = [], m.delegateCount = 0;
                if (!g.setup || g.setup.call(e, i, h, u) === !1)e.addEventListener ? e.addEventListener(c, u, !1) : e.attachEvent && e.attachEvent("on" + c, u)
            }
            g.add && (g.add.call(e, p), p.handler.guid || (p.handler.guid = r.guid)), s ? m.splice(m.delegateCount++, 0, p) : m.push(p), v.event.global[c] = !0
        }
        e = null
    }, global: {}, remove: function (e, t, n, r, i) {
        var s, o, u, a, f, l, c, h, p, d, m, g = v.hasData(e) && v._data(e);
        if (!g || !(h = g.events))return;
        t = v.trim(Z(t || "")).split(" ");
        for (s = 0; s < t.length; s++) {
            o = J.exec(t[s]) || [], u = a = o[1], f = o[2];
            if (!u) {
                for (u in h)v.event.remove(e, u + t[s], n, r, !0);
                continue
            }
            p = v.event.special[u] || {}, u = (r ? p.delegateType : p.bindType) || u, d = h[u] || [], l = d.length, f = f ? new RegExp("(^|\\.)" + f.split(".").sort().join("\\.(?:.*\\.|)") + "(\\.|$)") : null;
            for (c = 0; c < d.length; c++)m = d[c], (i || a === m.origType) && (!n || n.guid === m.guid) && (!f || f.test(m.namespace)) && (!r || r === m.selector || r === "**" && m.selector) && (d.splice(c--, 1), m.selector && d.delegateCount--, p.remove && p.remove.call(e, m));
            d.length === 0 && l !== d.length && ((!p.teardown || p.teardown.call(e, f, g.handle) === !1) && v.removeEvent(e, u, g.handle), delete h[u])
        }
        v.isEmptyObject(h) && (delete g.handle, v.removeData(e, "events", !0))
    }, customEvent: {getData: !0, setData: !0, changeData: !0}, trigger: function (n, r, s, o) {
        if (!s || s.nodeType !== 3 && s.nodeType !== 8) {
            var u, a, f, l, c, h, p, d, m, g, y = n.type || n, b = [];
            if (Y.test(y + v.event.triggered))return;
            y.indexOf("!") >= 0 && (y = y.slice(0, -1), a = !0), y.indexOf(".") >= 0 && (b = y.split("."), y = b.shift(), b.sort());
            if ((!s || v.event.customEvent[y]) && !v.event.global[y])return;
            n = typeof n == "object" ? n[v.expando] ? n : new v.Event(y, n) : new v.Event(y), n.type = y, n.isTrigger = !0, n.exclusive = a, n.namespace = b.join("."), n.namespace_re = n.namespace ? new RegExp("(^|\\.)" + b.join("\\.(?:.*\\.|)") + "(\\.|$)") : null, h = y.indexOf(":") < 0 ? "on" + y : "";
            if (!s) {
                u = v.cache;
                for (f in u)u[f].events && u[f].events[y] && v.event.trigger(n, r, u[f].handle.elem, !0);
                return
            }
            n.result = t, n.target || (n.target = s), r = r != null ? v.makeArray(r) : [], r.unshift(n), p = v.event.special[y] || {};
            if (p.trigger && p.trigger.apply(s, r) === !1)return;
            m = [
                [s, p.bindType || y]
            ];
            if (!o && !p.noBubble && !v.isWindow(s)) {
                g = p.delegateType || y, l = Y.test(g + y) ? s : s.parentNode;
                for (c = s; l; l = l.parentNode)m.push([l, g]), c = l;
                c === (s.ownerDocument || i) && m.push([c.defaultView || c.parentWindow || e, g])
            }
            for (f = 0; f < m.length && !n.isPropagationStopped(); f++)l = m[f][0], n.type = m[f][1], d = (v._data(l, "events") || {})[n.type] && v._data(l, "handle"), d && d.apply(l, r), d = h && l[h], d && v.acceptData(l) && d.apply && d.apply(l, r) === !1 && n.preventDefault();
            return n.type = y, !o && !n.isDefaultPrevented() && (!p._default || p._default.apply(s.ownerDocument, r) === !1) && (y !== "click" || !v.nodeName(s, "a")) && v.acceptData(s) && h && s[y] && (y !== "focus" && y !== "blur" || n.target.offsetWidth !== 0) && !v.isWindow(s) && (c = s[h], c && (s[h] = null), v.event.triggered = y, s[y](), v.event.triggered = t, c && (s[h] = c)), n.result
        }
        return
    }, dispatch: function (n) {
        n = v.event.fix(n || e.event);
        var r, i, s, o, u, a, f, c, h, p, d = (v._data(this, "events") || {})[n.type] || [], m = d.delegateCount, g = l.call(arguments), y = !n.exclusive && !n.namespace, b = v.event.special[n.type] || {}, w = [];
        g[0] = n, n.delegateTarget = this;
        if (b.preDispatch && b.preDispatch.call(this, n) === !1)return;
        if (m && (!n.button || n.type !== "click"))for (s = n.target; s != this; s = s.parentNode || this)if (s.disabled !== !0 || n.type !== "click") {
            u = {}, f = [];
            for (r = 0; r < m; r++)c = d[r], h = c.selector, u[h] === t && (u[h] = c.needsContext ? v(h, this).index(s) >= 0 : v.find(h, this, null, [s]).length), u[h] && f.push(c);
            f.length && w.push({elem: s, matches: f})
        }
        d.length > m && w.push({elem: this, matches: d.slice(m)});
        for (r = 0; r < w.length && !n.isPropagationStopped(); r++) {
            a = w[r], n.currentTarget = a.elem;
            for (i = 0; i < a.matches.length && !n.isImmediatePropagationStopped(); i++) {
                c = a.matches[i];
                if (y || !n.namespace && !c.namespace || n.namespace_re && n.namespace_re.test(c.namespace))n.data = c.data, n.handleObj = c, o = ((v.event.special[c.origType] || {}).handle || c.handler).apply(a.elem, g), o !== t && (n.result = o, o === !1 && (n.preventDefault(), n.stopPropagation()))
            }
        }
        return b.postDispatch && b.postDispatch.call(this, n), n.result
    }, props: "attrChange attrName relatedNode srcElement altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "), fixHooks: {}, keyHooks: {props: "char charCode key keyCode".split(" "), filter: function (e, t) {
        return e.which == null && (e.which = t.charCode != null ? t.charCode : t.keyCode), e
    }}, mouseHooks: {props: "button buttons clientX clientY fromElement offsetX offsetY pageX pageY screenX screenY toElement".split(" "), filter: function (e, n) {
        var r, s, o, u = n.button, a = n.fromElement;
        return e.pageX == null && n.clientX != null && (r = e.target.ownerDocument || i, s = r.documentElement, o = r.body, e.pageX = n.clientX + (s && s.scrollLeft || o && o.scrollLeft || 0) - (s && s.clientLeft || o && o.clientLeft || 0), e.pageY = n.clientY + (s && s.scrollTop || o && o.scrollTop || 0) - (s && s.clientTop || o && o.clientTop || 0)), !e.relatedTarget && a && (e.relatedTarget = a === e.target ? n.toElement : a), !e.which && u !== t && (e.which = u & 1 ? 1 : u & 2 ? 3 : u & 4 ? 2 : 0), e
    }}, fix: function (e) {
        if (e[v.expando])return e;
        var t, n, r = e, s = v.event.fixHooks[e.type] || {}, o = s.props ? this.props.concat(s.props) : this.props;
        e = v.Event(r);
        for (t = o.length; t;)n = o[--t], e[n] = r[n];
        return e.target || (e.target = r.srcElement || i), e.target.nodeType === 3 && (e.target = e.target.parentNode), e.metaKey = !!e.metaKey, s.filter ? s.filter(e, r) : e
    }, special: {load: {noBubble: !0}, focus: {delegateType: "focusin"}, blur: {delegateType: "focusout"}, beforeunload: {setup: function (e, t, n) {
        v.isWindow(this) && (this.onbeforeunload = n)
    }, teardown: function (e, t) {
        this.onbeforeunload === t && (this.onbeforeunload = null)
    }}}, simulate: function (e, t, n, r) {
        var i = v.extend(new v.Event, n, {type: e, isSimulated: !0, originalEvent: {}});
        r ? v.event.trigger(i, null, t) : v.event.dispatch.call(t, i), i.isDefaultPrevented() && n.preventDefault()
    }}, v.event.handle = v.event.dispatch, v.removeEvent = i.removeEventListener ? function (e, t, n) {
        e.removeEventListener && e.removeEventListener(t, n, !1)
    } : function (e, t, n) {
        var r = "on" + t;
        e.detachEvent && (typeof e[r] == "undefined" && (e[r] = null), e.detachEvent(r, n))
    }, v.Event = function (e, t) {
        if (!(this instanceof v.Event))return new v.Event(e, t);
        e && e.type ? (this.originalEvent = e, this.type = e.type, this.isDefaultPrevented = e.defaultPrevented || e.returnValue === !1 || e.getPreventDefault && e.getPreventDefault() ? tt : et) : this.type = e, t && v.extend(this, t), this.timeStamp = e && e.timeStamp || v.now(), this[v.expando] = !0
    }, v.Event.prototype = {preventDefault: function () {
        this.isDefaultPrevented = tt;
        var e = this.originalEvent;
        if (!e)return;
        e.preventDefault ? e.preventDefault() : e.returnValue = !1
    }, stopPropagation: function () {
        this.isPropagationStopped = tt;
        var e = this.originalEvent;
        if (!e)return;
        e.stopPropagation && e.stopPropagation(), e.cancelBubble = !0
    }, stopImmediatePropagation: function () {
        this.isImmediatePropagationStopped = tt, this.stopPropagation()
    }, isDefaultPrevented: et, isPropagationStopped: et, isImmediatePropagationStopped: et}, v.each({mouseenter: "mouseover", mouseleave: "mouseout"}, function (e, t) {
        v.event.special[e] = {delegateType: t, bindType: t, handle: function (e) {
            var n, r = this, i = e.relatedTarget, s = e.handleObj, o = s.selector;
            if (!i || i !== r && !v.contains(r, i))e.type = s.origType, n = s.handler.apply(this, arguments), e.type = t;
            return n
        }}
    }), v.support.submitBubbles || (v.event.special.submit = {setup: function () {
        if (v.nodeName(this, "form"))return!1;
        v.event.add(this, "click._submit keypress._submit", function (e) {
            var n = e.target, r = v.nodeName(n, "input") || v.nodeName(n, "button") ? n.form : t;
            r && !v._data(r, "_submit_attached") && (v.event.add(r, "submit._submit", function (e) {
                e._submit_bubble = !0
            }), v._data(r, "_submit_attached", !0))
        })
    }, postDispatch: function (e) {
        e._submit_bubble && (delete e._submit_bubble, this.parentNode && !e.isTrigger && v.event.simulate("submit", this.parentNode, e, !0))
    }, teardown: function () {
        if (v.nodeName(this, "form"))return!1;
        v.event.remove(this, "._submit")
    }}), v.support.changeBubbles || (v.event.special.change = {setup: function () {
        if ($.test(this.nodeName)) {
            if (this.type === "checkbox" || this.type === "radio")v.event.add(this, "propertychange._change", function (e) {
                e.originalEvent.propertyName === "checked" && (this._just_changed = !0)
            }), v.event.add(this, "click._change", function (e) {
                this._just_changed && !e.isTrigger && (this._just_changed = !1), v.event.simulate("change", this, e, !0)
            });
            return!1
        }
        v.event.add(this, "beforeactivate._change", function (e) {
            var t = e.target;
            $.test(t.nodeName) && !v._data(t, "_change_attached") && (v.event.add(t, "change._change", function (e) {
                this.parentNode && !e.isSimulated && !e.isTrigger && v.event.simulate("change", this.parentNode, e, !0)
            }), v._data(t, "_change_attached", !0))
        })
    }, handle: function (e) {
        var t = e.target;
        if (this !== t || e.isSimulated || e.isTrigger || t.type !== "radio" && t.type !== "checkbox")return e.handleObj.handler.apply(this, arguments)
    }, teardown: function () {
        return v.event.remove(this, "._change"), !$.test(this.nodeName)
    }}), v.support.focusinBubbles || v.each({focus: "focusin", blur: "focusout"}, function (e, t) {
        var n = 0, r = function (e) {
            v.event.simulate(t, e.target, v.event.fix(e), !0)
        };
        v.event.special[t] = {setup: function () {
            n++ === 0 && i.addEventListener(e, r, !0)
        }, teardown: function () {
            --n === 0 && i.removeEventListener(e, r, !0)
        }}
    }), v.fn.extend({on: function (e, n, r, i, s) {
        var o, u;
        if (typeof e == "object") {
            typeof n != "string" && (r = r || n, n = t);
            for (u in e)this.on(u, n, r, e[u], s);
            return this
        }
        r == null && i == null ? (i = n, r = n = t) : i == null && (typeof n == "string" ? (i = r, r = t) : (i = r, r = n, n = t));
        if (i === !1)i = et; else if (!i)return this;
        return s === 1 && (o = i, i = function (e) {
            return v().off(e), o.apply(this, arguments)
        }, i.guid = o.guid || (o.guid = v.guid++)), this.each(function () {
            v.event.add(this, e, i, r, n)
        })
    }, one: function (e, t, n, r) {
        return this.on(e, t, n, r, 1)
    }, off: function (e, n, r) {
        var i, s;
        if (e && e.preventDefault && e.handleObj)return i = e.handleObj, v(e.delegateTarget).off(i.namespace ? i.origType + "." + i.namespace : i.origType, i.selector, i.handler), this;
        if (typeof e == "object") {
            for (s in e)this.off(s, n, e[s]);
            return this
        }
        if (n === !1 || typeof n == "function")r = n, n = t;
        return r === !1 && (r = et), this.each(function () {
            v.event.remove(this, e, r, n)
        })
    }, bind: function (e, t, n) {
        return this.on(e, null, t, n)
    }, unbind: function (e, t) {
        return this.off(e, null, t)
    }, live: function (e, t, n) {
        return v(this.context).on(e, this.selector, t, n), this
    }, die: function (e, t) {
        return v(this.context).off(e, this.selector || "**", t), this
    }, delegate: function (e, t, n, r) {
        return this.on(t, e, n, r)
    }, undelegate: function (e, t, n) {
        return arguments.length === 1 ? this.off(e, "**") : this.off(t, e || "**", n)
    }, trigger: function (e, t) {
        return this.each(function () {
            v.event.trigger(e, t, this)
        })
    }, triggerHandler: function (e, t) {
        if (this[0])return v.event.trigger(e, t, this[0], !0)
    }, toggle: function (e) {
        var t = arguments, n = e.guid || v.guid++, r = 0, i = function (n) {
            var i = (v._data(this, "lastToggle" + e.guid) || 0) % r;
            return v._data(this, "lastToggle" + e.guid, i + 1), n.preventDefault(), t[i].apply(this, arguments) || !1
        };
        i.guid = n;
        while (r < t.length)t[r++].guid = n;
        return this.click(i)
    }, hover: function (e, t) {
        return this.mouseenter(e).mouseleave(t || e)
    }}), v.each("blur focus focusin focusout load resize scroll unload click dblclick mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave change select submit keydown keypress keyup error contextmenu".split(" "), function (e, t) {
        v.fn[t] = function (e, n) {
            return n == null && (n = e, e = null), arguments.length > 0 ? this.on(t, null, e, n) : this.trigger(t)
        }, Q.test(t) && (v.event.fixHooks[t] = v.event.keyHooks), G.test(t) && (v.event.fixHooks[t] = v.event.mouseHooks)
    }), function (e, t) {
        function nt(e, t, n, r) {
            n = n || [], t = t || g;
            var i, s, a, f, l = t.nodeType;
            if (!e || typeof e != "string")return n;
            if (l !== 1 && l !== 9)return[];
            a = o(t);
            if (!a && !r)if (i = R.exec(e))if (f = i[1]) {
                if (l === 9) {
                    s = t.getElementById(f);
                    if (!s || !s.parentNode)return n;
                    if (s.id === f)return n.push(s), n
                } else if (t.ownerDocument && (s = t.ownerDocument.getElementById(f)) && u(t, s) && s.id === f)return n.push(s), n
            } else {
                if (i[2])return S.apply(n, x.call(t.getElementsByTagName(e), 0)), n;
                if ((f = i[3]) && Z && t.getElementsByClassName)return S.apply(n, x.call(t.getElementsByClassName(f), 0)), n
            }
            return vt(e.replace(j, "$1"), t, n, r, a)
        }

        function rt(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return n === "input" && t.type === e
            }
        }

        function it(e) {
            return function (t) {
                var n = t.nodeName.toLowerCase();
                return(n === "input" || n === "button") && t.type === e
            }
        }

        function st(e) {
            return N(function (t) {
                return t = +t, N(function (n, r) {
                    var i, s = e([], n.length, t), o = s.length;
                    while (o--)n[i = s[o]] && (n[i] = !(r[i] = n[i]))
                })
            })
        }

        function ot(e, t, n) {
            if (e === t)return n;
            var r = e.nextSibling;
            while (r) {
                if (r === t)return-1;
                r = r.nextSibling
            }
            return 1
        }

        function ut(e, t) {
            var n, r, s, o, u, a, f, l = L[d][e + " "];
            if (l)return t ? 0 : l.slice(0);
            u = e, a = [], f = i.preFilter;
            while (u) {
                if (!n || (r = F.exec(u)))r && (u = u.slice(r[0].length) || u), a.push(s = []);
                n = !1;
                if (r = I.exec(u))s.push(n = new m(r.shift())), u = u.slice(n.length), n.type = r[0].replace(j, " ");
                for (o in i.filter)(r = J[o].exec(u)) && (!f[o] || (r = f[o](r))) && (s.push(n = new m(r.shift())), u = u.slice(n.length), n.type = o, n.matches = r);
                if (!n)break
            }
            return t ? u.length : u ? nt.error(e) : L(e, a).slice(0)
        }

        function at(e, t, r) {
            var i = t.dir, s = r && t.dir === "parentNode", o = w++;
            return t.first ? function (t, n, r) {
                while (t = t[i])if (s || t.nodeType === 1)return e(t, n, r)
            } : function (t, r, u) {
                if (!u) {
                    var a, f = b + " " + o + " ", l = f + n;
                    while (t = t[i])if (s || t.nodeType === 1) {
                        if ((a = t[d]) === l)return t.sizset;
                        if (typeof a == "string" && a.indexOf(f) === 0) {
                            if (t.sizset)return t
                        } else {
                            t[d] = l;
                            if (e(t, r, u))return t.sizset = !0, t;
                            t.sizset = !1
                        }
                    }
                } else while (t = t[i])if (s || t.nodeType === 1)if (e(t, r, u))return t
            }
        }

        function ft(e) {
            return e.length > 1 ? function (t, n, r) {
                var i = e.length;
                while (i--)if (!e[i](t, n, r))return!1;
                return!0
            } : e[0]
        }

        function lt(e, t, n, r, i) {
            var s, o = [], u = 0, a = e.length, f = t != null;
            for (; u < a; u++)if (s = e[u])if (!n || n(s, r, i))o.push(s), f && t.push(u);
            return o
        }

        function ct(e, t, n, r, i, s) {
            return r && !r[d] && (r = ct(r)), i && !i[d] && (i = ct(i, s)), N(function (s, o, u, a) {
                var f, l, c, h = [], p = [], d = o.length, v = s || dt(t || "*", u.nodeType ? [u] : u, []), m = e && (s || !t) ? lt(v, h, e, u, a) : v, g = n ? i || (s ? e : d || r) ? [] : o : m;
                n && n(m, g, u, a);
                if (r) {
                    f = lt(g, p), r(f, [], u, a), l = f.length;
                    while (l--)if (c = f[l])g[p[l]] = !(m[p[l]] = c)
                }
                if (s) {
                    if (i || e) {
                        if (i) {
                            f = [], l = g.length;
                            while (l--)(c = g[l]) && f.push(m[l] = c);
                            i(null, g = [], f, a)
                        }
                        l = g.length;
                        while (l--)(c = g[l]) && (f = i ? T.call(s, c) : h[l]) > -1 && (s[f] = !(o[f] = c))
                    }
                } else g = lt(g === o ? g.splice(d, g.length) : g), i ? i(null, o, g, a) : S.apply(o, g)
            })
        }

        function ht(e) {
            var t, n, r, s = e.length, o = i.relative[e[0].type], u = o || i.relative[" "], a = o ? 1 : 0, f = at(function (e) {
                return e === t
            }, u, !0), l = at(function (e) {
                return T.call(t, e) > -1
            }, u, !0), h = [function (e, n, r) {
                return!o && (r || n !== c) || ((t = n).nodeType ? f(e, n, r) : l(e, n, r))
            }];
            for (; a < s; a++)if (n = i.relative[e[a].type])h = [at(ft(h), n)]; else {
                n = i.filter[e[a].type].apply(null, e[a].matches);
                if (n[d]) {
                    r = ++a;
                    for (; r < s; r++)if (i.relative[e[r].type])break;
                    return ct(a > 1 && ft(h), a > 1 && e.slice(0, a - 1).join("").replace(j, "$1"), n, a < r && ht(e.slice(a, r)), r < s && ht(e = e.slice(r)), r < s && e.join(""))
                }
                h.push(n)
            }
            return ft(h)
        }

        function pt(e, t) {
            var r = t.length > 0, s = e.length > 0, o = function (u, a, f, l, h) {
                var p, d, v, m = [], y = 0, w = "0", x = u && [], T = h != null, N = c, C = u || s && i.find.TAG("*", h && a.parentNode || a), k = b += N == null ? 1 : Math.E;
                T && (c = a !== g && a, n = o.el);
                for (; (p = C[w]) != null; w++) {
                    if (s && p) {
                        for (d = 0; v = e[d]; d++)if (v(p, a, f)) {
                            l.push(p);
                            break
                        }
                        T && (b = k, n = ++o.el)
                    }
                    r && ((p = !v && p) && y--, u && x.push(p))
                }
                y += w;
                if (r && w !== y) {
                    for (d = 0; v = t[d]; d++)v(x, m, a, f);
                    if (u) {
                        if (y > 0)while (w--)!x[w] && !m[w] && (m[w] = E.call(l));
                        m = lt(m)
                    }
                    S.apply(l, m), T && !u && m.length > 0 && y + t.length > 1 && nt.uniqueSort(l)
                }
                return T && (b = k, c = N), x
            };
            return o.el = 0, r ? N(o) : o
        }

        function dt(e, t, n) {
            var r = 0, i = t.length;
            for (; r < i; r++)nt(e, t[r], n);
            return n
        }

        function vt(e, t, n, r, s) {
            var o, u, f, l, c, h = ut(e), p = h.length;
            if (!r && h.length === 1) {
                u = h[0] = h[0].slice(0);
                if (u.length > 2 && (f = u[0]).type === "ID" && t.nodeType === 9 && !s && i.relative[u[1].type]) {
                    t = i.find.ID(f.matches[0].replace($, ""), t, s)[0];
                    if (!t)return n;
                    e = e.slice(u.shift().length)
                }
                for (o = J.POS.test(e) ? -1 : u.length - 1; o >= 0; o--) {
                    f = u[o];
                    if (i.relative[l = f.type])break;
                    if (c = i.find[l])if (r = c(f.matches[0].replace($, ""), z.test(u[0].type) && t.parentNode || t, s)) {
                        u.splice(o, 1), e = r.length && u.join("");
                        if (!e)return S.apply(n, x.call(r, 0)), n;
                        break
                    }
                }
            }
            return a(e, h)(r, t, s, n, z.test(e)), n
        }

        function mt() {
        }

        var n, r, i, s, o, u, a, f, l, c, h = !0, p = "undefined", d = ("sizcache" + Math.random()).replace(".", ""), m = String, g = e.document, y = g.documentElement, b = 0, w = 0, E = [].pop, S = [].push, x = [].slice, T = [].indexOf || function (e) {
            var t = 0, n = this.length;
            for (; t < n; t++)if (this[t] === e)return t;
            return-1
        }, N = function (e, t) {
            return e[d] = t == null || t, e
        }, C = function () {
            var e = {}, t = [];
            return N(function (n, r) {
                return t.push(n) > i.cacheLength && delete e[t.shift()], e[n + " "] = r
            }, e)
        }, k = C(), L = C(), A = C(), O = "[\\x20\\t\\r\\n\\f]", M = "(?:\\\\.|[-\\w]|[^\\x00-\\xa0])+", _ = M.replace("w", "w#"), D = "([*^$|!~]?=)", P = "\\[" + O + "*(" + M + ")" + O + "*(?:" + D + O + "*(?:(['\"])((?:\\\\.|[^\\\\])*?)\\3|(" + _ + ")|)|)" + O + "*\\]", H = ":(" + M + ")(?:\\((?:(['\"])((?:\\\\.|[^\\\\])*?)\\2|([^()[\\]]*|(?:(?:" + P + ")|[^:]|\\\\.)*|.*))\\)|)", B = ":(even|odd|eq|gt|lt|nth|first|last)(?:\\(" + O + "*((?:-\\d)?\\d*)" + O + "*\\)|)(?=[^-]|$)", j = new RegExp("^" + O + "+|((?:^|[^\\\\])(?:\\\\.)*)" + O + "+$", "g"), F = new RegExp("^" + O + "*," + O + "*"), I = new RegExp("^" + O + "*([\\x20\\t\\r\\n\\f>+~])" + O + "*"), q = new RegExp(H), R = /^(?:#([\w\-]+)|(\w+)|\.([\w\-]+))$/, U = /^:not/, z = /[\x20\t\r\n\f]*[+~]/, W = /:not\($/, X = /h\d/i, V = /input|select|textarea|button/i, $ = /\\(?!\\)/g, J = {ID: new RegExp("^#(" + M + ")"), CLASS: new RegExp("^\\.(" + M + ")"), NAME: new RegExp("^\\[name=['\"]?(" + M + ")['\"]?\\]"), TAG: new RegExp("^(" + M.replace("w", "w*") + ")"), ATTR: new RegExp("^" + P), PSEUDO: new RegExp("^" + H), POS: new RegExp(B, "i"), CHILD: new RegExp("^:(only|nth|first|last)-child(?:\\(" + O + "*(even|odd|(([+-]|)(\\d*)n|)" + O + "*(?:([+-]|)" + O + "*(\\d+)|))" + O + "*\\)|)", "i"), needsContext: new RegExp("^" + O + "*[>+~]|" + B, "i")}, K = function (e) {
            var t = g.createElement("div");
            try {
                return e(t)
            } catch (n) {
                return!1
            } finally {
                t = null
            }
        }, Q = K(function (e) {
            return e.appendChild(g.createComment("")), !e.getElementsByTagName("*").length
        }), G = K(function (e) {
            return e.innerHTML = "<a href='#'></a>", e.firstChild && typeof e.firstChild.getAttribute !== p && e.firstChild.getAttribute("href") === "#"
        }), Y = K(function (e) {
            e.innerHTML = "<select></select>";
            var t = typeof e.lastChild.getAttribute("multiple");
            return t !== "boolean" && t !== "string"
        }), Z = K(function (e) {
            return e.innerHTML = "<div class='hidden e'></div><div class='hidden'></div>", !e.getElementsByClassName || !e.getElementsByClassName("e").length ? !1 : (e.lastChild.className = "e", e.getElementsByClassName("e").length === 2)
        }), et = K(function (e) {
            e.id = d + 0, e.innerHTML = "<a name='" + d + "'></a><div name='" + d + "'></div>", y.insertBefore(e, y.firstChild);
            var t = g.getElementsByName && g.getElementsByName(d).length === 2 + g.getElementsByName(d + 0).length;
            return r = !g.getElementById(d), y.removeChild(e), t
        });
        try {
            x.call(y.childNodes, 0)[0].nodeType
        } catch (tt) {
            x = function (e) {
                var t, n = [];
                for (; t = this[e]; e++)n.push(t);
                return n
            }
        }
        nt.matches = function (e, t) {
            return nt(e, null, null, t)
        }, nt.matchesSelector = function (e, t) {
            return nt(t, null, null, [e]).length > 0
        }, s = nt.getText = function (e) {
            var t, n = "", r = 0, i = e.nodeType;
            if (i) {
                if (i === 1 || i === 9 || i === 11) {
                    if (typeof e.textContent == "string")return e.textContent;
                    for (e = e.firstChild; e; e = e.nextSibling)n += s(e)
                } else if (i === 3 || i === 4)return e.nodeValue
            } else for (; t = e[r]; r++)n += s(t);
            return n
        }, o = nt.isXML = function (e) {
            var t = e && (e.ownerDocument || e).documentElement;
            return t ? t.nodeName !== "HTML" : !1
        }, u = nt.contains = y.contains ? function (e, t) {
            var n = e.nodeType === 9 ? e.documentElement : e, r = t && t.parentNode;
            return e === r || !!(r && r.nodeType === 1 && n.contains && n.contains(r))
        } : y.compareDocumentPosition ? function (e, t) {
            return t && !!(e.compareDocumentPosition(t) & 16)
        } : function (e, t) {
            while (t = t.parentNode)if (t === e)return!0;
            return!1
        }, nt.attr = function (e, t) {
            var n, r = o(e);
            return r || (t = t.toLowerCase()), (n = i.attrHandle[t]) ? n(e) : r || Y ? e.getAttribute(t) : (n = e.getAttributeNode(t), n ? typeof e[t] == "boolean" ? e[t] ? t : null : n.specified ? n.value : null : null)
        }, i = nt.selectors = {cacheLength: 50, createPseudo: N, match: J, attrHandle: G ? {} : {href: function (e) {
            return e.getAttribute("href", 2)
        }, type: function (e) {
            return e.getAttribute("type")
        }}, find: {ID: r ? function (e, t, n) {
            if (typeof t.getElementById !== p && !n) {
                var r = t.getElementById(e);
                return r && r.parentNode ? [r] : []
            }
        } : function (e, n, r) {
            if (typeof n.getElementById !== p && !r) {
                var i = n.getElementById(e);
                return i ? i.id === e || typeof i.getAttributeNode !== p && i.getAttributeNode("id").value === e ? [i] : t : []
            }
        }, TAG: Q ? function (e, t) {
            if (typeof t.getElementsByTagName !== p)return t.getElementsByTagName(e)
        } : function (e, t) {
            var n = t.getElementsByTagName(e);
            if (e === "*") {
                var r, i = [], s = 0;
                for (; r = n[s]; s++)r.nodeType === 1 && i.push(r);
                return i
            }
            return n
        }, NAME: et && function (e, t) {
            if (typeof t.getElementsByName !== p)return t.getElementsByName(name)
        }, CLASS: Z && function (e, t, n) {
            if (typeof t.getElementsByClassName !== p && !n)return t.getElementsByClassName(e)
        }}, relative: {">": {dir: "parentNode", first: !0}, " ": {dir: "parentNode"}, "+": {dir: "previousSibling", first: !0}, "~": {dir: "previousSibling"}}, preFilter: {ATTR: function (e) {
            return e[1] = e[1].replace($, ""), e[3] = (e[4] || e[5] || "").replace($, ""), e[2] === "~=" && (e[3] = " " + e[3] + " "), e.slice(0, 4)
        }, CHILD: function (e) {
            return e[1] = e[1].toLowerCase(), e[1] === "nth" ? (e[2] || nt.error(e[0]), e[3] = +(e[3] ? e[4] + (e[5] || 1) : 2 * (e[2] === "even" || e[2] === "odd")), e[4] = +(e[6] + e[7] || e[2] === "odd")) : e[2] && nt.error(e[0]), e
        }, PSEUDO: function (e) {
            var t, n;
            if (J.CHILD.test(e[0]))return null;
            if (e[3])e[2] = e[3]; else if (t = e[4])q.test(t) && (n = ut(t, !0)) && (n = t.indexOf(")", t.length - n) - t.length) && (t = t.slice(0, n), e[0] = e[0].slice(0, n)), e[2] = t;
            return e.slice(0, 3)
        }}, filter: {ID: r ? function (e) {
            return e = e.replace($, ""), function (t) {
                return t.getAttribute("id") === e
            }
        } : function (e) {
            return e = e.replace($, ""), function (t) {
                var n = typeof t.getAttributeNode !== p && t.getAttributeNode("id");
                return n && n.value === e
            }
        }, TAG: function (e) {
            return e === "*" ? function () {
                return!0
            } : (e = e.replace($, "").toLowerCase(), function (t) {
                return t.nodeName && t.nodeName.toLowerCase() === e
            })
        }, CLASS: function (e) {
            var t = k[d][e + " "];
            return t || (t = new RegExp("(^|" + O + ")" + e + "(" + O + "|$)")) && k(e, function (e) {
                return t.test(e.className || typeof e.getAttribute !== p && e.getAttribute("class") || "")
            })
        }, ATTR: function (e, t, n) {
            return function (r, i) {
                var s = nt.attr(r, e);
                return s == null ? t === "!=" : t ? (s += "", t === "=" ? s === n : t === "!=" ? s !== n : t === "^=" ? n && s.indexOf(n) === 0 : t === "*=" ? n && s.indexOf(n) > -1 : t === "$=" ? n && s.substr(s.length - n.length) === n : t === "~=" ? (" " + s + " ").indexOf(n) > -1 : t === "|=" ? s === n || s.substr(0, n.length + 1) === n + "-" : !1) : !0
            }
        }, CHILD: function (e, t, n, r) {
            return e === "nth" ? function (e) {
                var t, i, s = e.parentNode;
                if (n === 1 && r === 0)return!0;
                if (s) {
                    i = 0;
                    for (t = s.firstChild; t; t = t.nextSibling)if (t.nodeType === 1) {
                        i++;
                        if (e === t)break
                    }
                }
                return i -= r, i === n || i % n === 0 && i / n >= 0
            } : function (t) {
                var n = t;
                switch (e) {
                    case"only":
                    case"first":
                        while (n = n.previousSibling)if (n.nodeType === 1)return!1;
                        if (e === "first")return!0;
                        n = t;
                    case"last":
                        while (n = n.nextSibling)if (n.nodeType === 1)return!1;
                        return!0
                }
            }
        }, PSEUDO: function (e, t) {
            var n, r = i.pseudos[e] || i.setFilters[e.toLowerCase()] || nt.error("unsupported pseudo: " + e);
            return r[d] ? r(t) : r.length > 1 ? (n = [e, e, "", t], i.setFilters.hasOwnProperty(e.toLowerCase()) ? N(function (e, n) {
                var i, s = r(e, t), o = s.length;
                while (o--)i = T.call(e, s[o]), e[i] = !(n[i] = s[o])
            }) : function (e) {
                return r(e, 0, n)
            }) : r
        }}, pseudos: {not: N(function (e) {
            var t = [], n = [], r = a(e.replace(j, "$1"));
            return r[d] ? N(function (e, t, n, i) {
                var s, o = r(e, null, i, []), u = e.length;
                while (u--)if (s = o[u])e[u] = !(t[u] = s)
            }) : function (e, i, s) {
                return t[0] = e, r(t, null, s, n), !n.pop()
            }
        }), has: N(function (e) {
            return function (t) {
                return nt(e, t).length > 0
            }
        }), contains: N(function (e) {
            return function (t) {
                return(t.textContent || t.innerText || s(t)).indexOf(e) > -1
            }
        }), enabled: function (e) {
            return e.disabled === !1
        }, disabled: function (e) {
            return e.disabled === !0
        }, checked: function (e) {
            var t = e.nodeName.toLowerCase();
            return t === "input" && !!e.checked || t === "option" && !!e.selected
        }, selected: function (e) {
            return e.parentNode && e.parentNode.selectedIndex, e.selected === !0
        }, parent: function (e) {
            return!i.pseudos.empty(e)
        }, empty: function (e) {
            var t;
            e = e.firstChild;
            while (e) {
                if (e.nodeName > "@" || (t = e.nodeType) === 3 || t === 4)return!1;
                e = e.nextSibling
            }
            return!0
        }, header: function (e) {
            return X.test(e.nodeName)
        }, text: function (e) {
            var t, n;
            return e.nodeName.toLowerCase() === "input" && (t = e.type) === "text" && ((n = e.getAttribute("type")) == null || n.toLowerCase() === t)
        }, radio: rt("radio"), checkbox: rt("checkbox"), file: rt("file"), password: rt("password"), image: rt("image"), submit: it("submit"), reset: it("reset"), button: function (e) {
            var t = e.nodeName.toLowerCase();
            return t === "input" && e.type === "button" || t === "button"
        }, input: function (e) {
            return V.test(e.nodeName)
        }, focus: function (e) {
            var t = e.ownerDocument;
            return e === t.activeElement && (!t.hasFocus || t.hasFocus()) && !!(e.type || e.href || ~e.tabIndex)
        }, active: function (e) {
            return e === e.ownerDocument.activeElement
        }, first: st(function () {
            return[0]
        }), last: st(function (e, t) {
            return[t - 1]
        }), eq: st(function (e, t, n) {
            return[n < 0 ? n + t : n]
        }), even: st(function (e, t) {
            for (var n = 0; n < t; n += 2)e.push(n);
            return e
        }), odd: st(function (e, t) {
            for (var n = 1; n < t; n += 2)e.push(n);
            return e
        }), lt: st(function (e, t, n) {
            for (var r = n < 0 ? n + t : n; --r >= 0;)e.push(r);
            return e
        }), gt: st(function (e, t, n) {
            for (var r = n < 0 ? n + t : n; ++r < t;)e.push(r);
            return e
        })}}, f = y.compareDocumentPosition ? function (e, t) {
            return e === t ? (l = !0, 0) : (!e.compareDocumentPosition || !t.compareDocumentPosition ? e.compareDocumentPosition : e.compareDocumentPosition(t) & 4) ? -1 : 1
        } : function (e, t) {
            if (e === t)return l = !0, 0;
            if (e.sourceIndex && t.sourceIndex)return e.sourceIndex - t.sourceIndex;
            var n, r, i = [], s = [], o = e.parentNode, u = t.parentNode, a = o;
            if (o === u)return ot(e, t);
            if (!o)return-1;
            if (!u)return 1;
            while (a)i.unshift(a), a = a.parentNode;
            a = u;
            while (a)s.unshift(a), a = a.parentNode;
            n = i.length, r = s.length;
            for (var f = 0; f < n && f < r; f++)if (i[f] !== s[f])return ot(i[f], s[f]);
            return f === n ? ot(e, s[f], -1) : ot(i[f], t, 1)
        }, [0, 0].sort(f), h = !l, nt.uniqueSort = function (e) {
            var t, n = [], r = 1, i = 0;
            l = h, e.sort(f);
            if (l) {
                for (; t = e[r]; r++)t === e[r - 1] && (i = n.push(r));
                while (i--)e.splice(n[i], 1)
            }
            return e
        }, nt.error = function (e) {
            throw new Error("Syntax error, unrecognized expression: " + e)
        }, a = nt.compile = function (e, t) {
            var n, r = [], i = [], s = A[d][e + " "];
            if (!s) {
                t || (t = ut(e)), n = t.length;
                while (n--)s = ht(t[n]), s[d] ? r.push(s) : i.push(s);
                s = A(e, pt(i, r))
            }
            return s
        }, g.querySelectorAll && function () {
            var e, t = vt, n = /'|\\/g, r = /\=[\x20\t\r\n\f]*([^'"\]]*)[\x20\t\r\n\f]*\]/g, i = [":focus"], s = [":active"], u = y.matchesSelector || y.mozMatchesSelector || y.webkitMatchesSelector || y.oMatchesSelector || y.msMatchesSelector;
            K(function (e) {
                e.innerHTML = "<select><option selected=''></option></select>", e.querySelectorAll("[selected]").length || i.push("\\[" + O + "*(?:checked|disabled|ismap|multiple|readonly|selected|value)"), e.querySelectorAll(":checked").length || i.push(":checked")
            }), K(function (e) {
                e.innerHTML = "<p test=''></p>", e.querySelectorAll("[test^='']").length && i.push("[*^$]=" + O + "*(?:\"\"|'')"), e.innerHTML = "<input type='hidden'/>", e.querySelectorAll(":enabled").length || i.push(":enabled", ":disabled")
            }), i = new RegExp(i.join("|")), vt = function (e, r, s, o, u) {
                if (!o && !u && !i.test(e)) {
                    var a, f, l = !0, c = d, h = r, p = r.nodeType === 9 && e;
                    if (r.nodeType === 1 && r.nodeName.toLowerCase() !== "object") {
                        a = ut(e), (l = r.getAttribute("id")) ? c = l.replace(n, "\\$&") : r.setAttribute("id", c), c = "[id='" + c + "'] ", f = a.length;
                        while (f--)a[f] = c + a[f].join("");
                        h = z.test(e) && r.parentNode || r, p = a.join(",")
                    }
                    if (p)try {
                        return S.apply(s, x.call(h.querySelectorAll(p), 0)), s
                    } catch (v) {
                    } finally {
                        l || r.removeAttribute("id")
                    }
                }
                return t(e, r, s, o, u)
            }, u && (K(function (t) {
                e = u.call(t, "div");
                try {
                    u.call(t, "[test!='']:sizzle"), s.push("!=", H)
                } catch (n) {
                }
            }), s = new RegExp(s.join("|")), nt.matchesSelector = function (t, n) {
                n = n.replace(r, "='$1']");
                if (!o(t) && !s.test(n) && !i.test(n))try {
                    var a = u.call(t, n);
                    if (a || e || t.document && t.document.nodeType !== 11)return a
                } catch (f) {
                }
                return nt(n, null, null, [t]).length > 0
            })
        }(), i.pseudos.nth = i.pseudos.eq, i.filters = mt.prototype = i.pseudos, i.setFilters = new mt, nt.attr = v.attr, v.find = nt, v.expr = nt.selectors, v.expr[":"] = v.expr.pseudos, v.unique = nt.uniqueSort, v.text = nt.getText, v.isXMLDoc = nt.isXML, v.contains = nt.contains
    }(e);
    var nt = /Until$/, rt = /^(?:parents|prev(?:Until|All))/, it = /^.[^:#\[\.,]*$/, st = v.expr.match.needsContext, ot = {children: !0, contents: !0, next: !0, prev: !0};
    v.fn.extend({find: function (e) {
        var t, n, r, i, s, o, u = this;
        if (typeof e != "string")return v(e).filter(function () {
            for (t = 0, n = u.length; t < n; t++)if (v.contains(u[t], this))return!0
        });
        o = this.pushStack("", "find", e);
        for (t = 0, n = this.length; t < n; t++) {
            r = o.length, v.find(e, this[t], o);
            if (t > 0)for (i = r; i < o.length; i++)for (s = 0; s < r; s++)if (o[s] === o[i]) {
                o.splice(i--, 1);
                break
            }
        }
        return o
    }, has: function (e) {
        var t, n = v(e, this), r = n.length;
        return this.filter(function () {
            for (t = 0; t < r; t++)if (v.contains(this, n[t]))return!0
        })
    }, not: function (e) {
        return this.pushStack(ft(this, e, !1), "not", e)
    }, filter: function (e) {
        return this.pushStack(ft(this, e, !0), "filter", e)
    }, is: function (e) {
        return!!e && (typeof e == "string" ? st.test(e) ? v(e, this.context).index(this[0]) >= 0 : v.filter(e, this).length > 0 : this.filter(e).length > 0)
    }, closest: function (e, t) {
        var n, r = 0, i = this.length, s = [], o = st.test(e) || typeof e != "string" ? v(e, t || this.context) : 0;
        for (; r < i; r++) {
            n = this[r];
            while (n && n.ownerDocument && n !== t && n.nodeType !== 11) {
                if (o ? o.index(n) > -1 : v.find.matchesSelector(n, e)) {
                    s.push(n);
                    break
                }
                n = n.parentNode
            }
        }
        return s = s.length > 1 ? v.unique(s) : s, this.pushStack(s, "closest", e)
    }, index: function (e) {
        return e ? typeof e == "string" ? v.inArray(this[0], v(e)) : v.inArray(e.jquery ? e[0] : e, this) : this[0] && this[0].parentNode ? this.prevAll().length : -1
    }, add: function (e, t) {
        var n = typeof e == "string" ? v(e, t) : v.makeArray(e && e.nodeType ? [e] : e), r = v.merge(this.get(), n);
        return this.pushStack(ut(n[0]) || ut(r[0]) ? r : v.unique(r))
    }, addBack: function (e) {
        return this.add(e == null ? this.prevObject : this.prevObject.filter(e))
    }}), v.fn.andSelf = v.fn.addBack, v.each({parent: function (e) {
        var t = e.parentNode;
        return t && t.nodeType !== 11 ? t : null
    }, parents: function (e) {
        return v.dir(e, "parentNode")
    }, parentsUntil: function (e, t, n) {
        return v.dir(e, "parentNode", n)
    }, next: function (e) {
        return at(e, "nextSibling")
    }, prev: function (e) {
        return at(e, "previousSibling")
    }, nextAll: function (e) {
        return v.dir(e, "nextSibling")
    }, prevAll: function (e) {
        return v.dir(e, "previousSibling")
    }, nextUntil: function (e, t, n) {
        return v.dir(e, "nextSibling", n)
    }, prevUntil: function (e, t, n) {
        return v.dir(e, "previousSibling", n)
    }, siblings: function (e) {
        return v.sibling((e.parentNode || {}).firstChild, e)
    }, children: function (e) {
        return v.sibling
            (e.firstChild)
    }, contents: function (e) {
        return v.nodeName(e, "iframe") ? e.contentDocument || e.contentWindow.document : v.merge([], e.childNodes)
    }}, function (e, t) {
        v.fn[e] = function (n, r) {
            var i = v.map(this, t, n);
            return nt.test(e) || (r = n), r && typeof r == "string" && (i = v.filter(r, i)), i = this.length > 1 && !ot[e] ? v.unique(i) : i, this.length > 1 && rt.test(e) && (i = i.reverse()), this.pushStack(i, e, l.call(arguments).join(","))
        }
    }), v.extend({filter: function (e, t, n) {
        return n && (e = ":not(" + e + ")"), t.length === 1 ? v.find.matchesSelector(t[0], e) ? [t[0]] : [] : v.find.matches(e, t)
    }, dir: function (e, n, r) {
        var i = [], s = e[n];
        while (s && s.nodeType !== 9 && (r === t || s.nodeType !== 1 || !v(s).is(r)))s.nodeType === 1 && i.push(s), s = s[n];
        return i
    }, sibling: function (e, t) {
        var n = [];
        for (; e; e = e.nextSibling)e.nodeType === 1 && e !== t && n.push(e);
        return n
    }});
    var ct = "abbr|article|aside|audio|bdi|canvas|data|datalist|details|figcaption|figure|footer|header|hgroup|mark|meter|nav|output|progress|section|summary|time|video", ht = / jQuery\d+="(?:null|\d+)"/g, pt = /^\s+/, dt = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi, vt = /<([\w:]+)/, mt = /<tbody/i, gt = /<|&#?\w+;/, yt = /<(?:script|style|link)/i, bt = /<(?:script|object|embed|option|style)/i, wt = new RegExp("<(?:" + ct + ")[\\s/>]", "i"), Et = /^(?:checkbox|radio)$/, St = /checked\s*(?:[^=]|=\s*.checked.)/i, xt = /\/(java|ecma)script/i, Tt = /^\s*<!(?:\[CDATA\[|\-\-)|[\]\-]{2}>\s*$/g, Nt = {option: [1, "<select multiple='multiple'>", "</select>"], legend: [1, "<fieldset>", "</fieldset>"], thead: [1, "<table>", "</table>"], tr: [2, "<table><tbody>", "</tbody></table>"], td: [3, "<table><tbody><tr>", "</tr></tbody></table>"], col: [2, "<table><tbody></tbody><colgroup>", "</colgroup></table>"], area: [1, "<map>", "</map>"], _default: [0, "", ""]}, Ct = lt(i), kt = Ct.appendChild(i.createElement("div"));
    Nt.optgroup = Nt.option, Nt.tbody = Nt.tfoot = Nt.colgroup = Nt.caption = Nt.thead, Nt.th = Nt.td, v.support.htmlSerialize || (Nt._default = [1, "X<div>", "</div>"]), v.fn.extend({text: function (e) {
        return v.access(this, function (e) {
            return e === t ? v.text(this) : this.empty().append((this[0] && this[0].ownerDocument || i).createTextNode(e))
        }, null, e, arguments.length)
    }, wrapAll: function (e) {
        if (v.isFunction(e))return this.each(function (t) {
            v(this).wrapAll(e.call(this, t))
        });
        if (this[0]) {
            var t = v(e, this[0].ownerDocument).eq(0).clone(!0);
            this[0].parentNode && t.insertBefore(this[0]), t.map(function () {
                var e = this;
                while (e.firstChild && e.firstChild.nodeType === 1)e = e.firstChild;
                return e
            }).append(this)
        }
        return this
    }, wrapInner: function (e) {
        return v.isFunction(e) ? this.each(function (t) {
            v(this).wrapInner(e.call(this, t))
        }) : this.each(function () {
            var t = v(this), n = t.contents();
            n.length ? n.wrapAll(e) : t.append(e)
        })
    }, wrap: function (e) {
        var t = v.isFunction(e);
        return this.each(function (n) {
            v(this).wrapAll(t ? e.call(this, n) : e)
        })
    }, unwrap: function () {
        return this.parent().each(function () {
            v.nodeName(this, "body") || v(this).replaceWith(this.childNodes)
        }).end()
    }, append: function () {
        return this.domManip(arguments, !0, function (e) {
            (this.nodeType === 1 || this.nodeType === 11) && this.appendChild(e)
        })
    }, prepend: function () {
        return this.domManip(arguments, !0, function (e) {
            (this.nodeType === 1 || this.nodeType === 11) && this.insertBefore(e, this.firstChild)
        })
    }, before: function () {
        if (!ut(this[0]))return this.domManip(arguments, !1, function (e) {
            this.parentNode.insertBefore(e, this)
        });
        if (arguments.length) {
            var e = v.clean(arguments);
            return this.pushStack(v.merge(e, this), "before", this.selector)
        }
    }, after: function () {
        if (!ut(this[0]))return this.domManip(arguments, !1, function (e) {
            this.parentNode.insertBefore(e, this.nextSibling)
        });
        if (arguments.length) {
            var e = v.clean(arguments);
            return this.pushStack(v.merge(this, e), "after", this.selector)
        }
    }, remove: function (e, t) {
        var n, r = 0;
        for (; (n = this[r]) != null; r++)if (!e || v.filter(e, [n]).length)!t && n.nodeType === 1 && (v.cleanData(n.getElementsByTagName("*")), v.cleanData([n])), n.parentNode && n.parentNode.removeChild(n);
        return this
    }, empty: function () {
        var e, t = 0;
        for (; (e = this[t]) != null; t++) {
            e.nodeType === 1 && v.cleanData(e.getElementsByTagName("*"));
            while (e.firstChild)e.removeChild(e.firstChild)
        }
        return this
    }, clone: function (e, t) {
        return e = e == null ? !1 : e, t = t == null ? e : t, this.map(function () {
            return v.clone(this, e, t)
        })
    }, html: function (e) {
        return v.access(this, function (e) {
            var n = this[0] || {}, r = 0, i = this.length;
            if (e === t)return n.nodeType === 1 ? n.innerHTML.replace(ht, "") : t;
            if (typeof e == "string" && !yt.test(e) && (v.support.htmlSerialize || !wt.test(e)) && (v.support.leadingWhitespace || !pt.test(e)) && !Nt[(vt.exec(e) || ["", ""])[1].toLowerCase()]) {
                e = e.replace(dt, "<$1></$2>");
                try {
                    for (; r < i; r++)n = this[r] || {}, n.nodeType === 1 && (v.cleanData(n.getElementsByTagName("*")), n.innerHTML = e);
                    n = 0
                } catch (s) {
                }
            }
            n && this.empty().append(e)
        }, null, e, arguments.length)
    }, replaceWith: function (e) {
        return ut(this[0]) ? this.length ? this.pushStack(v(v.isFunction(e) ? e() : e), "replaceWith", e) : this : v.isFunction(e) ? this.each(function (t) {
            var n = v(this), r = n.html();
            n.replaceWith(e.call(this, t, r))
        }) : (typeof e != "string" && (e = v(e).detach()), this.each(function () {
            var t = this.nextSibling, n = this.parentNode;
            v(this).remove(), t ? v(t).before(e) : v(n).append(e)
        }))
    }, detach: function (e) {
        return this.remove(e, !0)
    }, domManip: function (e, n, r) {
        e = [].concat.apply([], e);
        var i, s, o, u, a = 0, f = e[0], l = [], c = this.length;
        if (!v.support.checkClone && c > 1 && typeof f == "string" && St.test(f))return this.each(function () {
            v(this).domManip(e, n, r)
        });
        if (v.isFunction(f))return this.each(function (i) {
            var s = v(this);
            e[0] = f.call(this, i, n ? s.html() : t), s.domManip(e, n, r)
        });
        if (this[0]) {
            i = v.buildFragment(e, this, l), o = i.fragment, s = o.firstChild, o.childNodes.length === 1 && (o = s);
            if (s) {
                n = n && v.nodeName(s, "tr");
                for (u = i.cacheable || c - 1; a < c; a++)r.call(n && v.nodeName(this[a], "table") ? Lt(this[a], "tbody") : this[a], a === u ? o : v.clone(o, !0, !0))
            }
            o = s = null, l.length && v.each(l, function (e, t) {
                t.src ? v.ajax ? v.ajax({url: t.src, type: "GET", dataType: "script", async: !1, global: !1, "throws": !0}) : v.error("no ajax") : v.globalEval((t.text || t.textContent || t.innerHTML || "").replace(Tt, "")), t.parentNode && t.parentNode.removeChild(t)
            })
        }
        return this
    }}), v.buildFragment = function (e, n, r) {
        var s, o, u, a = e[0];
        return n = n || i, n = !n.nodeType && n[0] || n, n = n.ownerDocument || n, e.length === 1 && typeof a == "string" && a.length < 512 && n === i && a.charAt(0) === "<" && !bt.test(a) && (v.support.checkClone || !St.test(a)) && (v.support.html5Clone || !wt.test(a)) && (o = !0, s = v.fragments[a], u = s !== t), s || (s = n.createDocumentFragment(), v.clean(e, n, s, r), o && (v.fragments[a] = u && s)), {fragment: s, cacheable: o}
    }, v.fragments = {}, v.each({appendTo: "append", prependTo: "prepend", insertBefore: "before", insertAfter: "after", replaceAll: "replaceWith"}, function (e, t) {
        v.fn[e] = function (n) {
            var r, i = 0, s = [], o = v(n), u = o.length, a = this.length === 1 && this[0].parentNode;
            if ((a == null || a && a.nodeType === 11 && a.childNodes.length === 1) && u === 1)return o[t](this[0]), this;
            for (; i < u; i++)r = (i > 0 ? this.clone(!0) : this).get(), v(o[i])[t](r), s = s.concat(r);
            return this.pushStack(s, e, o.selector)
        }
    }), v.extend({clone: function (e, t, n) {
        var r, i, s, o;
        v.support.html5Clone || v.isXMLDoc(e) || !wt.test("<" + e.nodeName + ">") ? o = e.cloneNode(!0) : (kt.innerHTML = e.outerHTML, kt.removeChild(o = kt.firstChild));
        if ((!v.support.noCloneEvent || !v.support.noCloneChecked) && (e.nodeType === 1 || e.nodeType === 11) && !v.isXMLDoc(e)) {
            Ot(e, o), r = Mt(e), i = Mt(o);
            for (s = 0; r[s]; ++s)i[s] && Ot(r[s], i[s])
        }
        if (t) {
            At(e, o);
            if (n) {
                r = Mt(e), i = Mt(o);
                for (s = 0; r[s]; ++s)At(r[s], i[s])
            }
        }
        return r = i = null, o
    }, clean: function (e, t, n, r) {
        var s, o, u, a, f, l, c, h, p, d, m, g, y = t === i && Ct, b = [];
        if (!t || typeof t.createDocumentFragment == "undefined")t = i;
        for (s = 0; (u = e[s]) != null; s++) {
            typeof u == "number" && (u += "");
            if (!u)continue;
            if (typeof u == "string")if (!gt.test(u))u = t.createTextNode(u); else {
                y = y || lt(t), c = t.createElement("div"), y.appendChild(c), u = u.replace(dt, "<$1></$2>"), a = (vt.exec(u) || ["", ""])[1].toLowerCase(), f = Nt[a] || Nt._default, l = f[0], c.innerHTML = f[1] + u + f[2];
                while (l--)c = c.lastChild;
                if (!v.support.tbody) {
                    h = mt.test(u), p = a === "table" && !h ? c.firstChild && c.firstChild.childNodes : f[1] === "<table>" && !h ? c.childNodes : [];
                    for (o = p.length - 1; o >= 0; --o)v.nodeName(p[o], "tbody") && !p[o].childNodes.length && p[o].parentNode.removeChild(p[o])
                }
                !v.support.leadingWhitespace && pt.test(u) && c.insertBefore(t.createTextNode(pt.exec(u)[0]), c.firstChild), u = c.childNodes, c.parentNode.removeChild(c)
            }
            u.nodeType ? b.push(u) : v.merge(b, u)
        }
        c && (u = c = y = null);
        if (!v.support.appendChecked)for (s = 0; (u = b[s]) != null; s++)v.nodeName(u, "input") ? _t(u) : typeof u.getElementsByTagName != "undefined" && v.grep(u.getElementsByTagName("input"), _t);
        if (n) {
            m = function (e) {
                if (!e.type || xt.test(e.type))return r ? r.push(e.parentNode ? e.parentNode.removeChild(e) : e) : n.appendChild(e)
            };
            for (s = 0; (u = b[s]) != null; s++)if (!v.nodeName(u, "script") || !m(u))n.appendChild(u), typeof u.getElementsByTagName != "undefined" && (g = v.grep(v.merge([], u.getElementsByTagName("script")), m), b.splice.apply(b, [s + 1, 0].concat(g)), s += g.length)
        }
        return b
    }, cleanData: function (e, t) {
        var n, r, i, s, o = 0, u = v.expando, a = v.cache, f = v.support.deleteExpando, l = v.event.special;
        for (; (i = e[o]) != null; o++)if (t || v.acceptData(i)) {
            r = i[u], n = r && a[r];
            if (n) {
                if (n.events)for (s in n.events)l[s] ? v.event.remove(i, s) : v.removeEvent(i, s, n.handle);
                a[r] && (delete a[r], f ? delete i[u] : i.removeAttribute ? i.removeAttribute(u) : i[u] = null, v.deletedIds.push(r))
            }
        }
    }}), function () {
        var e, t;
        v.uaMatch = function (e) {
            e = e.toLowerCase();
            var t = /(chrome)[ \/]([\w.]+)/.exec(e) || /(webkit)[ \/]([\w.]+)/.exec(e) || /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(e) || /(msie) ([\w.]+)/.exec(e) || e.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(e) || [];
            return{browser: t[1] || "", version: t[2] || "0"}
        }, e = v.uaMatch(o.userAgent), t = {}, e.browser && (t[e.browser] = !0, t.version = e.version), t.chrome ? t.webkit = !0 : t.webkit && (t.safari = !0), v.browser = t, v.sub = function () {
            function e(t, n) {
                return new e.fn.init(t, n)
            }

            v.extend(!0, e, this), e.superclass = this, e.fn = e.prototype = this(), e.fn.constructor = e, e.sub = this.sub, e.fn.init = function (r, i) {
                return i && i instanceof v && !(i instanceof e) && (i = e(i)), v.fn.init.call(this, r, i, t)
            }, e.fn.init.prototype = e.fn;
            var t = e(i);
            return e
        }
    }();
    var Dt, Pt, Ht, Bt = /alpha\([^)]*\)/i, jt = /opacity=([^)]*)/, Ft = /^(top|right|bottom|left)$/, It = /^(none|table(?!-c[ea]).+)/, qt = /^margin/, Rt = new RegExp("^(" + m + ")(.*)$", "i"), Ut = new RegExp("^(" + m + ")(?!px)[a-z%]+$", "i"), zt = new RegExp("^([-+])=(" + m + ")", "i"), Wt = {BODY: "block"}, Xt = {position: "absolute", visibility: "hidden", display: "block"}, Vt = {letterSpacing: 0, fontWeight: 400}, $t = ["Top", "Right", "Bottom", "Left"], Jt = ["Webkit", "O", "Moz", "ms"], Kt = v.fn.toggle;
    v.fn.extend({css: function (e, n) {
        return v.access(this, function (e, n, r) {
            return r !== t ? v.style(e, n, r) : v.css(e, n)
        }, e, n, arguments.length > 1)
    }, show: function () {
        return Yt(this, !0)
    }, hide: function () {
        return Yt(this)
    }, toggle: function (e, t) {
        var n = typeof e == "boolean";
        return v.isFunction(e) && v.isFunction(t) ? Kt.apply(this, arguments) : this.each(function () {
            (n ? e : Gt(this)) ? v(this).show() : v(this).hide()
        })
    }}), v.extend({cssHooks: {opacity: {get: function (e, t) {
        if (t) {
            var n = Dt(e, "opacity");
            return n === "" ? "1" : n
        }
    }}}, cssNumber: {fillOpacity: !0, fontWeight: !0, lineHeight: !0, opacity: !0, orphans: !0, widows: !0, zIndex: !0, zoom: !0}, cssProps: {"float": v.support.cssFloat ? "cssFloat" : "styleFloat"}, style: function (e, n, r, i) {
        if (!e || e.nodeType === 3 || e.nodeType === 8 || !e.style)return;
        var s, o, u, a = v.camelCase(n), f = e.style;
        n = v.cssProps[a] || (v.cssProps[a] = Qt(f, a)), u = v.cssHooks[n] || v.cssHooks[a];
        if (r === t)return u && "get"in u && (s = u.get(e, !1, i)) !== t ? s : f[n];
        o = typeof r, o === "string" && (s = zt.exec(r)) && (r = (s[1] + 1) * s[2] + parseFloat(v.css(e, n)), o = "number");
        if (r == null || o === "number" && isNaN(r))return;
        o === "number" && !v.cssNumber[a] && (r += "px");
        if (!u || !("set"in u) || (r = u.set(e, r, i)) !== t)try {
            f[n] = r
        } catch (l) {
        }
    }, css: function (e, n, r, i) {
        var s, o, u, a = v.camelCase(n);
        return n = v.cssProps[a] || (v.cssProps[a] = Qt(e.style, a)), u = v.cssHooks[n] || v.cssHooks[a], u && "get"in u && (s = u.get(e, !0, i)), s === t && (s = Dt(e, n)), s === "normal" && n in Vt && (s = Vt[n]), r || i !== t ? (o = parseFloat(s), r || v.isNumeric(o) ? o || 0 : s) : s
    }, swap: function (e, t, n) {
        var r, i, s = {};
        for (i in t)s[i] = e.style[i], e.style[i] = t[i];
        r = n.call(e);
        for (i in t)e.style[i] = s[i];
        return r
    }}), e.getComputedStyle ? Dt = function (t, n) {
        var r, i, s, o, u = e.getComputedStyle(t, null), a = t.style;
        return u && (r = u.getPropertyValue(n) || u[n], r === "" && !v.contains(t.ownerDocument, t) && (r = v.style(t, n)), Ut.test(r) && qt.test(n) && (i = a.width, s = a.minWidth, o = a.maxWidth, a.minWidth = a.maxWidth = a.width = r, r = u.width, a.width = i, a.minWidth = s, a.maxWidth = o)), r
    } : i.documentElement.currentStyle && (Dt = function (e, t) {
        var n, r, i = e.currentStyle && e.currentStyle[t], s = e.style;
        return i == null && s && s[t] && (i = s[t]), Ut.test(i) && !Ft.test(t) && (n = s.left, r = e.runtimeStyle && e.runtimeStyle.left, r && (e.runtimeStyle.left = e.currentStyle.left), s.left = t === "fontSize" ? "1em" : i, i = s.pixelLeft + "px", s.left = n, r && (e.runtimeStyle.left = r)), i === "" ? "auto" : i
    }), v.each(["height", "width"], function (e, t) {
        v.cssHooks[t] = {get: function (e, n, r) {
            if (n)return e.offsetWidth === 0 && It.test(Dt(e, "display")) ? v.swap(e, Xt, function () {
                return tn(e, t, r)
            }) : tn(e, t, r)
        }, set: function (e, n, r) {
            return Zt(e, n, r ? en(e, t, r, v.support.boxSizing && v.css(e, "boxSizing") === "border-box") : 0)
        }}
    }), v.support.opacity || (v.cssHooks.opacity = {get: function (e, t) {
        return jt.test((t && e.currentStyle ? e.currentStyle.filter : e.style.filter) || "") ? .01 * parseFloat(RegExp.$1) + "" : t ? "1" : ""
    }, set: function (e, t) {
        var n = e.style, r = e.currentStyle, i = v.isNumeric(t) ? "alpha(opacity=" + t * 100 + ")" : "", s = r && r.filter || n.filter || "";
        n.zoom = 1;
        if (t >= 1 && v.trim(s.replace(Bt, "")) === "" && n.removeAttribute) {
            n.removeAttribute("filter");
            if (r && !r.filter)return
        }
        n.filter = Bt.test(s) ? s.replace(Bt, i) : s + " " + i
    }}), v(function () {
        v.support.reliableMarginRight || (v.cssHooks.marginRight = {get: function (e, t) {
            return v.swap(e, {display: "inline-block"}, function () {
                if (t)return Dt(e, "marginRight")
            })
        }}), !v.support.pixelPosition && v.fn.position && v.each(["top", "left"], function (e, t) {
            v.cssHooks[t] = {get: function (e, n) {
                if (n) {
                    var r = Dt(e, t);
                    return Ut.test(r) ? v(e).position()[t] + "px" : r
                }
            }}
        })
    }), v.expr && v.expr.filters && (v.expr.filters.hidden = function (e) {
        return e.offsetWidth === 0 && e.offsetHeight === 0 || !v.support.reliableHiddenOffsets && (e.style && e.style.display || Dt(e, "display")) === "none"
    }, v.expr.filters.visible = function (e) {
        return!v.expr.filters.hidden(e)
    }), v.each({margin: "", padding: "", border: "Width"}, function (e, t) {
        v.cssHooks[e + t] = {expand: function (n) {
            var r, i = typeof n == "string" ? n.split(" ") : [n], s = {};
            for (r = 0; r < 4; r++)s[e + $t[r] + t] = i[r] || i[r - 2] || i[0];
            return s
        }}, qt.test(e) || (v.cssHooks[e + t].set = Zt)
    });
    var rn = /%20/g, sn = /\[\]$/, on = /\r?\n/g, un = /^(?:color|date|datetime|datetime-local|email|hidden|month|number|password|range|search|tel|text|time|url|week)$/i, an = /^(?:select|textarea)/i;
    v.fn.extend({serialize: function () {
        return v.param(this.serializeArray())
    }, serializeArray: function () {
        return this.map(function () {
            return this.elements ? v.makeArray(this.elements) : this
        }).filter(function () {
            return this.name && !this.disabled && (this.checked || an.test(this.nodeName) || un.test(this.type))
        }).map(function (e, t) {
            var n = v(this).val();
            return n == null ? null : v.isArray(n) ? v.map(n, function (e, n) {
                return{name: t.name, value: e.replace(on, "\r\n")}
            }) : {name: t.name, value: n.replace(on, "\r\n")}
        }).get()
    }}), v.param = function (e, n) {
        var r, i = [], s = function (e, t) {
            t = v.isFunction(t) ? t() : t == null ? "" : t, i[i.length] = encodeURIComponent(e) + "=" + encodeURIComponent(t)
        };
        n === t && (n = v.ajaxSettings && v.ajaxSettings.traditional);
        if (v.isArray(e) || e.jquery && !v.isPlainObject(e))v.each(e, function () {
            s(this.name, this.value)
        }); else for (r in e)fn(r, e[r], n, s);
        return i.join("&").replace(rn, "+")
    };
    var ln, cn, hn = /#.*$/, pn = /^(.*?):[ \t]*([^\r\n]*)\r?$/mg, dn = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/, vn = /^(?:GET|HEAD)$/, mn = /^\/\//, gn = /\?/, yn = /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, bn = /([?&])_=[^&]*/, wn = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+)|)|)/, En = v.fn.load, Sn = {}, xn = {}, Tn = ["*/"] + ["*"];
    try {
        cn = s.href
    } catch (Nn) {
        cn = i.createElement("a"), cn.href = "", cn = cn.href
    }
    ln = wn.exec(cn.toLowerCase()) || [], v.fn.load = function (e, n, r) {
        if (typeof e != "string" && En)return En.apply(this, arguments);
        if (!this.length)return this;
        var i, s, o, u = this, a = e.indexOf(" ");
        return a >= 0 && (i = e.slice(a, e.length), e = e.slice(0, a)), v.isFunction(n) ? (r = n, n = t) : n && typeof n == "object" && (s = "POST"), v.ajax({url: e, type: s, dataType: "html", data: n, complete: function (e, t) {
            r && u.each(r, o || [e.responseText, t, e])
        }}).done(function (e) {
            o = arguments, u.html(i ? v("<div>").append(e.replace(yn, "")).find(i) : e)
        }), this
    }, v.each("ajaxStart ajaxStop ajaxComplete ajaxError ajaxSuccess ajaxSend".split(" "), function (e, t) {
        v.fn[t] = function (e) {
            return this.on(t, e)
        }
    }), v.each(["get", "post"], function (e, n) {
        v[n] = function (e, r, i, s) {
            return v.isFunction(r) && (s = s || i, i = r, r = t), v.ajax({type: n, url: e, data: r, success: i, dataType: s})
        }
    }), v.extend({getScript: function (e, n) {
        return v.get(e, t, n, "script")
    }, getJSON: function (e, t, n) {
        return v.get(e, t, n, "json")
    }, ajaxSetup: function (e, t) {
        return t ? Ln(e, v.ajaxSettings) : (t = e, e = v.ajaxSettings), Ln(e, t), e
    }, ajaxSettings: {url: cn, isLocal: dn.test(ln[1]), global: !0, type: "GET", contentType: "application/x-www-form-urlencoded; charset=UTF-8", processData: !0, async: !0, accepts: {xml: "application/xml, text/xml", html: "text/html", text: "text/plain", json: "application/json, text/javascript", "*": Tn}, contents: {xml: /xml/, html: /html/, json: /json/}, responseFields: {xml: "responseXML", text: "responseText"}, converters: {"* text": e.String, "text html": !0, "text json": v.parseJSON, "text xml": v.parseXML}, flatOptions: {context: !0, url: !0}}, ajaxPrefilter: Cn(Sn), ajaxTransport: Cn(xn), ajax: function (e, n) {
        function T(e, n, s, a) {
            var l, y, b, w, S, T = n;
            if (E === 2)return;
            E = 2, u && clearTimeout(u), o = t, i = a || "", x.readyState = e > 0 ? 4 : 0, s && (w = An(c, x, s));
            if (e >= 200 && e < 300 || e === 304)c.ifModified && (S = x.getResponseHeader("Last-Modified"), S && (v.lastModified[r] = S), S = x.getResponseHeader("Etag"), S && (v.etag[r] = S)), e === 304 ? (T = "notmodified", l = !0) : (l = On(c, w), T = l.state, y = l.data, b = l.error, l = !b); else {
                b = T;
                if (!T || e)T = "error", e < 0 && (e = 0)
            }
            x.status = e, x.statusText = (n || T) + "", l ? d.resolveWith(h, [y, T, x]) : d.rejectWith(h, [x, T, b]), x.statusCode(g), g = t, f && p.trigger("ajax" + (l ? "Success" : "Error"), [x, c, l ? y : b]), m.fireWith(h, [x, T]), f && (p.trigger("ajaxComplete", [x, c]), --v.active || v.event.trigger("ajaxStop"))
        }

        typeof e == "object" && (n = e, e = t), n = n || {};
        var r, i, s, o, u, a, f, l, c = v.ajaxSetup({}, n), h = c.context || c, p = h !== c && (h.nodeType || h instanceof v) ? v(h) : v.event, d = v.Deferred(), m = v.Callbacks("once memory"), g = c.statusCode || {}, b = {}, w = {}, E = 0, S = "canceled", x = {readyState: 0, setRequestHeader: function (e, t) {
            if (!E) {
                var n = e.toLowerCase();
                e = w[n] = w[n] || e, b[e] = t
            }
            return this
        }, getAllResponseHeaders: function () {
            return E === 2 ? i : null
        }, getResponseHeader: function (e) {
            var n;
            if (E === 2) {
                if (!s) {
                    s = {};
                    while (n = pn.exec(i))s[n[1].toLowerCase()] = n[2]
                }
                n = s[e.toLowerCase()]
            }
            return n === t ? null : n
        }, overrideMimeType: function (e) {
            return E || (c.mimeType = e), this
        }, abort: function (e) {
            return e = e || S, o && o.abort(e), T(0, e), this
        }};
        d.promise(x), x.success = x.done, x.error = x.fail, x.complete = m.add, x.statusCode = function (e) {
            if (e) {
                var t;
                if (E < 2)for (t in e)g[t] = [g[t], e[t]]; else t = e[x.status], x.always(t)
            }
            return this
        }, c.url = ((e || c.url) + "").replace(hn, "").replace(mn, ln[1] + "//"), c.dataTypes = v.trim(c.dataType || "*").toLowerCase().split(y), c.crossDomain == null && (a = wn.exec(c.url.toLowerCase()), c.crossDomain = !(!a || a[1] === ln[1] && a[2] === ln[2] && (a[3] || (a[1] === "http:" ? 80 : 443)) == (ln[3] || (ln[1] === "http:" ? 80 : 443)))), c.data && c.processData && typeof c.data != "string" && (c.data = v.param(c.data, c.traditional)), kn(Sn, c, n, x);
        if (E === 2)return x;
        f = c.global, c.type = c.type.toUpperCase(), c.hasContent = !vn.test(c.type), f && v.active++ === 0 && v.event.trigger("ajaxStart");
        if (!c.hasContent) {
            c.data && (c.url += (gn.test(c.url) ? "&" : "?") + c.data, delete c.data), r = c.url;
            if (c.cache === !1) {
                var N = v.now(), C = c.url.replace(bn, "$1_=" + N);
                c.url = C + (C === c.url ? (gn.test(c.url) ? "&" : "?") + "_=" + N : "")
            }
        }
        (c.data && c.hasContent && c.contentType !== !1 || n.contentType) && x.setRequestHeader("Content-Type", c.contentType), c.ifModified && (r = r || c.url, v.lastModified[r] && x.setRequestHeader("If-Modified-Since", v.lastModified[r]), v.etag[r] && x.setRequestHeader("If-None-Match", v.etag[r])), x.setRequestHeader("Accept", c.dataTypes[0] && c.accepts[c.dataTypes[0]] ? c.accepts[c.dataTypes[0]] + (c.dataTypes[0] !== "*" ? ", " + Tn + "; q=0.01" : "") : c.accepts["*"]);
        for (l in c.headers)x.setRequestHeader(l, c.headers[l]);
        if (!c.beforeSend || c.beforeSend.call(h, x, c) !== !1 && E !== 2) {
            S = "abort";
            for (l in{success: 1, error: 1, complete: 1})x[l](c[l]);
            o = kn(xn, c, n, x);
            if (!o)T(-1, "No Transport"); else {
                x.readyState = 1, f && p.trigger("ajaxSend", [x, c]), c.async && c.timeout > 0 && (u = setTimeout(function () {
                    x.abort("timeout")
                }, c.timeout));
                try {
                    E = 1, o.send(b, T)
                } catch (k) {
                    if (!(E < 2))throw k;
                    T(-1, k)
                }
            }
            return x
        }
        return x.abort()
    }, active: 0, lastModified: {}, etag: {}});
    var Mn = [], _n = /\?/, Dn = /(=)\?(?=&|$)|\?\?/, Pn = v.now();
    v.ajaxSetup({jsonp: "callback", jsonpCallback: function () {
        var e = Mn.pop() || v.expando + "_" + Pn++;
        return this[e] = !0, e
    }}), v.ajaxPrefilter("json jsonp", function (n, r, i) {
        var s, o, u, a = n.data, f = n.url, l = n.jsonp !== !1, c = l && Dn.test(f), h = l && !c && typeof a == "string" && !(n.contentType || "").indexOf("application/x-www-form-urlencoded") && Dn.test(a);
        if (n.dataTypes[0] === "jsonp" || c || h)return s = n.jsonpCallback = v.isFunction(n.jsonpCallback) ? n.jsonpCallback() : n.jsonpCallback, o = e[s], c ? n.url = f.replace(Dn, "$1" + s) : h ? n.data = a.replace(Dn, "$1" + s) : l && (n.url += (_n.test(f) ? "&" : "?") + n.jsonp + "=" + s), n.converters["script json"] = function () {
            return u || v.error(s + " was not called"), u[0]
        }, n.dataTypes[0] = "json", e[s] = function () {
            u = arguments
        }, i.always(function () {
            e[s] = o, n[s] && (n.jsonpCallback = r.jsonpCallback, Mn.push(s)), u && v.isFunction(o) && o(u[0]), u = o = t
        }), "script"
    }), v.ajaxSetup({accepts: {script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"}, contents: {script: /javascript|ecmascript/}, converters: {"text script": function (e) {
        return v.globalEval(e), e
    }}}), v.ajaxPrefilter("script", function (e) {
        e.cache === t && (e.cache = !1), e.crossDomain && (e.type = "GET", e.global = !1)
    }), v.ajaxTransport("script", function (e) {
        if (e.crossDomain) {
            var n, r = i.head || i.getElementsByTagName("head")[0] || i.documentElement;
            return{send: function (s, o) {
                n = i.createElement("script"), n.async = "async", e.scriptCharset && (n.charset = e.scriptCharset), n.src = e.url, n.onload = n.onreadystatechange = function (e, i) {
                    if (i || !n.readyState || /loaded|complete/.test(n.readyState))n.onload = n.onreadystatechange = null, r && n.parentNode && r.removeChild(n), n = t, i || o(200, "success")
                }, r.insertBefore(n, r.firstChild)
            }, abort: function () {
                n && n.onload(0, 1)
            }}
        }
    });
    var Hn, Bn = e.ActiveXObject ? function () {
        for (var e in Hn)Hn[e](0, 1)
    } : !1, jn = 0;
    v.ajaxSettings.xhr = e.ActiveXObject ? function () {
        return!this.isLocal && Fn() || In()
    } : Fn, function (e) {
        v.extend(v.support, {ajax: !!e, cors: !!e && "withCredentials"in e})
    }(v.ajaxSettings.xhr()), v.support.ajax && v.ajaxTransport(function (n) {
        if (!n.crossDomain || v.support.cors) {
            var r;
            return{send: function (i, s) {
                var o, u, a = n.xhr();
                n.username ? a.open(n.type, n.url, n.async, n.username, n.password) : a.open(n.type, n.url, n.async);
                if (n.xhrFields)for (u in n.xhrFields)a[u] = n.xhrFields[u];
                n.mimeType && a.overrideMimeType && a.overrideMimeType(n.mimeType), !n.crossDomain && !i["X-Requested-With"] && (i["X-Requested-With"] = "XMLHttpRequest");
                try {
                    for (u in i)a.setRequestHeader(u, i[u])
                } catch (f) {
                }
                a.send(n.hasContent && n.data || null), r = function (e, i) {
                    var u, f, l, c, h;
                    try {
                        if (r && (i || a.readyState === 4)) {
                            r = t, o && (a.onreadystatechange = v.noop, Bn && delete Hn[o]);
                            if (i)a.readyState !== 4 && a.abort(); else {
                                u = a.status, l = a.getAllResponseHeaders(), c = {}, h = a.responseXML, h && h.documentElement && (c.xml = h);
                                try {
                                    c.text = a.responseText
                                } catch (p) {
                                }
                                try {
                                    f = a.statusText
                                } catch (p) {
                                    f = ""
                                }
                                !u && n.isLocal && !n.crossDomain ? u = c.text ? 200 : 404 : u === 1223 && (u = 204)
                            }
                        }
                    } catch (d) {
                        i || s(-1, d)
                    }
                    c && s(u, f, c, l)
                }, n.async ? a.readyState === 4 ? setTimeout(r, 0) : (o = ++jn, Bn && (Hn || (Hn = {}, v(e).unload(Bn)), Hn[o] = r), a.onreadystatechange = r) : r()
            }, abort: function () {
                r && r(0, 1)
            }}
        }
    });
    var qn, Rn, Un = /^(?:toggle|show|hide)$/, zn = new RegExp("^(?:([-+])=|)(" + m + ")([a-z%]*)$", "i"), Wn = /queueHooks$/, Xn = [Gn], Vn = {"*": [function (e, t) {
        var n, r, i = this.createTween(e, t), s = zn.exec(t), o = i.cur(), u = +o || 0, a = 1, f = 20;
        if (s) {
            n = +s[2], r = s[3] || (v.cssNumber[e] ? "" : "px");
            if (r !== "px" && u) {
                u = v.css(i.elem, e, !0) || n || 1;
                do a = a || ".5", u /= a, v.style(i.elem, e, u + r); while (a !== (a = i.cur() / o) && a !== 1 && --f)
            }
            i.unit = r, i.start = u, i.end = s[1] ? u + (s[1] + 1) * n : n
        }
        return i
    }]};
    v.Animation = v.extend(Kn, {tweener: function (e, t) {
        v.isFunction(e) ? (t = e, e = ["*"]) : e = e.split(" ");
        var n, r = 0, i = e.length;
        for (; r < i; r++)n = e[r], Vn[n] = Vn[n] || [], Vn[n].unshift(t)
    }, prefilter: function (e, t) {
        t ? Xn.unshift(e) : Xn.push(e)
    }}), v.Tween = Yn, Yn.prototype = {constructor: Yn, init: function (e, t, n, r, i, s) {
        this.elem = e, this.prop = n, this.easing = i || "swing", this.options = t, this.start = this.now = this.cur(), this.end = r, this.unit = s || (v.cssNumber[n] ? "" : "px")
    }, cur: function () {
        var e = Yn.propHooks[this.prop];
        return e && e.get ? e.get(this) : Yn.propHooks._default.get(this)
    }, run: function (e) {
        var t, n = Yn.propHooks[this.prop];
        return this.options.duration ? this.pos = t = v.easing[this.easing](e, this.options.duration * e, 0, 1, this.options.duration) : this.pos = t = e, this.now = (this.end - this.start) * t + this.start, this.options.step && this.options.step.call(this.elem, this.now, this), n && n.set ? n.set(this) : Yn.propHooks._default.set(this), this
    }}, Yn.prototype.init.prototype = Yn.prototype, Yn.propHooks = {_default: {get: function (e) {
        var t;
        return e.elem[e.prop] == null || !!e.elem.style && e.elem.style[e.prop] != null ? (t = v.css(e.elem, e.prop, !1, ""), !t || t === "auto" ? 0 : t) : e.elem[e.prop]
    }, set: function (e) {
        v.fx.step[e.prop] ? v.fx.step[e.prop](e) : e.elem.style && (e.elem.style[v.cssProps[e.prop]] != null || v.cssHooks[e.prop]) ? v.style(e.elem, e.prop, e.now + e.unit) : e.elem[e.prop] = e.now
    }}}, Yn.propHooks.scrollTop = Yn.propHooks.scrollLeft = {set: function (e) {
        e.elem.nodeType && e.elem.parentNode && (e.elem[e.prop] = e.now)
    }}, v.each(["toggle", "show", "hide"], function (e, t) {
        var n = v.fn[t];
        v.fn[t] = function (r, i, s) {
            return r == null || typeof r == "boolean" || !e && v.isFunction(r) && v.isFunction(i) ? n.apply(this, arguments) : this.animate(Zn(t, !0), r, i, s)
        }
    }), v.fn.extend({fadeTo: function (e, t, n, r) {
        return this.filter(Gt).css("opacity", 0).show().end().animate({opacity: t}, e, n, r)
    }, animate: function (e, t, n, r) {
        var i = v.isEmptyObject(e), s = v.speed(t, n, r), o = function () {
            var t = Kn(this, v.extend({}, e), s);
            i && t.stop(!0)
        };
        return i || s.queue === !1 ? this.each(o) : this.queue(s.queue, o)
    }, stop: function (e, n, r) {
        var i = function (e) {
            var t = e.stop;
            delete e.stop, t(r)
        };
        return typeof e != "string" && (r = n, n = e, e = t), n && e !== !1 && this.queue(e || "fx", []), this.each(function () {
            var t = !0, n = e != null && e + "queueHooks", s = v.timers, o = v._data(this);
            if (n)o[n] && o[n].stop && i(o[n]); else for (n in o)o[n] && o[n].stop && Wn.test(n) && i(o[n]);
            for (n = s.length; n--;)s[n].elem === this && (e == null || s[n].queue === e) && (s[n].anim.stop(r), t = !1, s.splice(n, 1));
            (t || !r) && v.dequeue(this, e)
        })
    }}), v.each({slideDown: Zn("show"), slideUp: Zn("hide"), slideToggle: Zn("toggle"), fadeIn: {opacity: "show"}, fadeOut: {opacity: "hide"}, fadeToggle: {opacity: "toggle"}}, function (e, t) {
        v.fn[e] = function (e, n, r) {
            return this.animate(t, e, n, r)
        }
    }), v.speed = function (e, t, n) {
        var r = e && typeof e == "object" ? v.extend({}, e) : {complete: n || !n && t || v.isFunction(e) && e, duration: e, easing: n && t || t && !v.isFunction(t) && t};
        r.duration = v.fx.off ? 0 : typeof r.duration == "number" ? r.duration : r.duration in v.fx.speeds ? v.fx.speeds[r.duration] : v.fx.speeds._default;
        if (r.queue == null || r.queue === !0)r.queue = "fx";
        return r.old = r.complete, r.complete = function () {
            v.isFunction(r.old) && r.old.call(this), r.queue && v.dequeue(this, r.queue)
        }, r
    }, v.easing = {linear: function (e) {
        return e
    }, swing: function (e) {
        return.5 - Math.cos(e * Math.PI) / 2
    }}, v.timers = [], v.fx = Yn.prototype.init, v.fx.tick = function () {
        var e, n = v.timers, r = 0;
        qn = v.now();
        for (; r < n.length; r++)e = n[r], !e() && n[r] === e && n.splice(r--, 1);
        n.length || v.fx.stop(), qn = t
    }, v.fx.timer = function (e) {
        e() && v.timers.push(e) && !Rn && (Rn = setInterval(v.fx.tick, v.fx.interval))
    }, v.fx.interval = 13, v.fx.stop = function () {
        clearInterval(Rn), Rn = null
    }, v.fx.speeds = {slow: 600, fast: 200, _default: 400}, v.fx.step = {}, v.expr && v.expr.filters && (v.expr.filters.animated = function (e) {
        return v.grep(v.timers,function (t) {
            return e === t.elem
        }).length
    });
    var er = /^(?:body|html)$/i;
    v.fn.offset = function (e) {
        if (arguments.length)return e === t ? this : this.each(function (t) {
            v.offset.setOffset(this, e, t)
        });
        var n, r, i, s, o, u, a, f = {top: 0, left: 0}, l = this[0], c = l && l.ownerDocument;
        if (!c)return;
        return(r = c.body) === l ? v.offset.bodyOffset(l) : (n = c.documentElement, v.contains(n, l) ? (typeof l.getBoundingClientRect != "undefined" && (f = l.getBoundingClientRect()), i = tr(c), s = n.clientTop || r.clientTop || 0, o = n.clientLeft || r.clientLeft || 0, u = i.pageYOffset || n.scrollTop, a = i.pageXOffset || n.scrollLeft, {top: f.top + u - s, left: f.left + a - o}) : f)
    }, v.offset = {bodyOffset: function (e) {
        var t = e.offsetTop, n = e.offsetLeft;
        return v.support.doesNotIncludeMarginInBodyOffset && (t += parseFloat(v.css(e, "marginTop")) || 0, n += parseFloat(v.css(e, "marginLeft")) || 0), {top: t, left: n}
    }, setOffset: function (e, t, n) {
        var r = v.css(e, "position");
        r === "static" && (e.style.position = "relative");
        var i = v(e), s = i.offset(), o = v.css(e, "top"), u = v.css(e, "left"), a = (r === "absolute" || r === "fixed") && v.inArray("auto", [o, u]) > -1, f = {}, l = {}, c, h;
        a ? (l = i.position(), c = l.top, h = l.left) : (c = parseFloat(o) || 0, h = parseFloat(u) || 0), v.isFunction(t) && (t = t.call(e, n, s)), t.top != null && (f.top = t.top - s.top + c), t.left != null && (f.left = t.left - s.left + h), "using"in t ? t.using.call(e, f) : i.css(f)
    }}, v.fn.extend({position: function () {
        if (!this[0])return;
        var e = this[0], t = this.offsetParent(), n = this.offset(), r = er.test(t[0].nodeName) ? {top: 0, left: 0} : t.offset();
        return n.top -= parseFloat(v.css(e, "marginTop")) || 0, n.left -= parseFloat(v.css(e, "marginLeft")) || 0, r.top += parseFloat(v.css(t[0], "borderTopWidth")) || 0, r.left += parseFloat(v.css(t[0], "borderLeftWidth")) || 0, {top: n.top - r.top, left: n.left - r.left}
    }, offsetParent: function () {
        return this.map(function () {
            var e = this.offsetParent || i.body;
            while (e && !er.test(e.nodeName) && v.css(e, "position") === "static")e = e.offsetParent;
            return e || i.body
        })
    }}), v.each({scrollLeft: "pageXOffset", scrollTop: "pageYOffset"}, function (e, n) {
        var r = /Y/.test(n);
        v.fn[e] = function (i) {
            return v.access(this, function (e, i, s) {
                var o = tr(e);
                if (s === t)return o ? n in o ? o[n] : o.document.documentElement[i] : e[i];
                o ? o.scrollTo(r ? v(o).scrollLeft() : s, r ? s : v(o).scrollTop()) : e[i] = s
            }, e, i, arguments.length, null)
        }
    }), v.each({Height: "height", Width: "width"}, function (e, n) {
        v.each({padding: "inner" + e, content: n, "": "outer" + e}, function (r, i) {
            v.fn[i] = function (i, s) {
                var o = arguments.length && (r || typeof i != "boolean"), u = r || (i === !0 || s === !0 ? "margin" : "border");
                return v.access(this, function (n, r, i) {
                    var s;
                    return v.isWindow(n) ? n.document.documentElement["client" + e] : n.nodeType === 9 ? (s = n.documentElement, Math.max(n.body["scroll" + e], s["scroll" + e], n.body["offset" + e], s["offset" + e], s["client" + e])) : i === t ? v.css(n, r, i, u) : v.style(n, r, i, u)
                }, n, o ? i : t, o, null)
            }
        })
    }), e.jQuery = e.$ = v, typeof define == "function" && define.amd && define.amd.jQuery && define("jquery", [], function () {
        return v
    })
})(window), function (e, t) {
    var n = function () {
        var t = e._data(document, "events");
        return t && t.click && e.grep(t.click,function (e) {
            return e.namespace === "rails"
        }).length
    };
    n() && e.error("jquery-ujs has already been loaded!");
    var r;
    e.rails = r = {linkClickSelector: "a[data-confirm], a[data-method], a[data-remote], a[data-disable-with]", inputChangeSelector: "select[data-remote], input[data-remote], textarea[data-remote]", formSubmitSelector: "form", formInputClickSelector: "form input[type=submit], form input[type=image], form button[type=submit], form button:not([type])", disableSelector: "input[data-disable-with], button[data-disable-with], textarea[data-disable-with]", enableSelector: "input[data-disable-with]:disabled, button[data-disable-with]:disabled, textarea[data-disable-with]:disabled", requiredInputSelector: "input[name][required]:not([disabled]),textarea[name][required]:not([disabled])", fileInputSelector: "input:file", linkDisableSelector: "a[data-disable-with]", CSRFProtection: function (t) {
        var n = e('meta[name="csrf-token"]').attr("content");
        n && t.setRequestHeader("X-CSRF-Token", n)
    }, fire: function (t, n, r) {
        var i = e.Event(n);
        return t.trigger(i, r), i.result !== !1
    }, confirm: function (e) {
        return confirm(e)
    }, ajax: function (t) {
        return e.ajax(t)
    }, href: function (e) {
        return e.attr("href")
    }, handleRemote: function (n) {
        var i, s, o, u, a, f, l, c;
        if (r.fire(n, "ajax:before")) {
            u = n.data("cross-domain"), a = u === t ? null : u, f = n.data("with-credentials") || null, l = n.data("type") || e.ajaxSettings && e.ajaxSettings.dataType;
            if (n.is("form")) {
                i = n.attr("method"), s = n.attr("action"), o = n.serializeArray();
                var h = n.data("ujs:submit-button");
                h && (o.push(h), n.data("ujs:submit-button", null))
            } else n.is(r.inputChangeSelector) ? (i = n.data("method"), s = n.data("url"), o = n.serialize(), n.data("params") && (o = o + "&" + n.data("params"))) : (i = n.data("method"), s = r.href(n), o = n.data("params") || null);
            c = {type: i || "GET", data: o, dataType: l, beforeSend: function (e, i) {
                return i.dataType === t && e.setRequestHeader("accept", "*/*;q=0.5, " + i.accepts.script), r.fire(n, "ajax:beforeSend", [e, i])
            }, success: function (e, t, r) {
                n.trigger("ajax:success", [e, t, r])
            }, complete: function (e, t) {
                n.trigger("ajax:complete", [e, t])
            }, error: function (e, t, r) {
                n.trigger("ajax:error", [e, t, r])
            }, xhrFields: {withCredentials: f}, crossDomain: a}, s && (c.url = s);
            var p = r.ajax(c);
            return n.trigger("ajax:send", p), p
        }
        return!1
    }, handleMethod: function (n) {
        var i = r.href(n), s = n.data("method"), o = n.attr("target"), u = e("meta[name=csrf-token]").attr("content"), a = e("meta[name=csrf-param]").attr("content"), f = e('<form method="post" action="' + i + '"></form>'), l = '<input name="_method" value="' + s + '" type="hidden" />';
        a !== t && u !== t && (l += '<input name="' + a + '" value="' + u + '" type="hidden" />'), o && f.attr("target", o), f.hide().append(l).appendTo("body"), f.submit()
    }, disableFormElements: function (t) {
        t.find(r.disableSelector).each(function () {
            var t = e(this), n = t.is("button"
            ) ? "html" : "val";
            t.data("ujs:enable-with", t[n]()), t[n](t.data("disable-with")), t.prop("disabled", !0)
        })
    }, enableFormElements: function (t) {
        t.find(r.enableSelector).each(function () {
            var t = e(this), n = t.is("button") ? "html" : "val";
            t.data("ujs:enable-with") && t[n](t.data("ujs:enable-with")), t.prop("disabled", !1)
        })
    }, allowAction: function (e) {
        var t = e.data("confirm"), n = !1, i;
        return t ? (r.fire(e, "confirm") && (n = r.confirm(t), i = r.fire(e, "confirm:complete", [n])), n && i) : !0
    }, blankInputs: function (t, n, r) {
        var i = e(), s, o, u = n || "input,textarea", a = t.find(u);
        return a.each(function () {
            s = e(this), o = s.is(":checkbox,:radio") ? s.is(":checked") : s.val();
            if (!o == !r) {
                if (s.is(":radio") && a.filter('input:radio:checked[name="' + s.attr("name") + '"]').length)return!0;
                i = i.add(s)
            }
        }), i.length ? i : !1
    }, nonBlankInputs: function (e, t) {
        return r.blankInputs(e, t, !0)
    }, stopEverything: function (t) {
        return e(t.target).trigger("ujs:everythingStopped"), t.stopImmediatePropagation(), !1
    }, callFormSubmitBindings: function (n, r) {
        var i = n.data("events"), s = !0;
        return i !== t && i.submit !== t && e.each(i.submit, function (e, t) {
            if (typeof t.handler == "function")return s = t.handler(r)
        }), s
    }, disableElement: function (e) {
        e.data("ujs:enable-with", e.html()), e.html(e.data("disable-with")), e.bind("click.railsDisable", function (e) {
            return r.stopEverything(e)
        })
    }, enableElement: function (e) {
        e.data("ujs:enable-with") !== t && (e.html(e.data("ujs:enable-with")), e.data("ujs:enable-with", !1)), e.unbind("click.railsDisable")
    }}, r.fire(e(document), "rails:attachBindings") && (e.ajaxPrefilter(function (e, t, n) {
        e.crossDomain || r.CSRFProtection(n)
    }), e(document).delegate(r.linkDisableSelector, "ajax:complete", function () {
        r.enableElement(e(this))
    }), e(document).delegate(r.linkClickSelector, "click.rails", function (n) {
        var i = e(this), s = i.data("method"), o = i.data("params");
        if (!r.allowAction(i))return r.stopEverything(n);
        i.is(r.linkDisableSelector) && r.disableElement(i);
        if (i.data("remote") !== t) {
            if ((n.metaKey || n.ctrlKey) && (!s || s === "GET") && !o)return!0;
            var u = r.handleRemote(i);
            return u === !1 ? r.enableElement(i) : u.error(function () {
                r.enableElement(i)
            }), !1
        }
        if (i.data("method"))return r.handleMethod(i), !1
    }), e(document).delegate(r.inputChangeSelector, "change.rails", function (t) {
        var n = e(this);
        return r.allowAction(n) ? (r.handleRemote(n), !1) : r.stopEverything(t)
    }), e(document).delegate(r.formSubmitSelector, "submit.rails", function (n) {
        var i = e(this), s = i.data("remote") !== t, o = r.blankInputs(i, r.requiredInputSelector), u = r.nonBlankInputs(i, r.fileInputSelector);
        if (!r.allowAction(i))return r.stopEverything(n);
        if (o && i.attr("novalidate") == t && r.fire(i, "ajax:aborted:required", [o]))return r.stopEverything(n);
        if (s) {
            if (u) {
                setTimeout(function () {
                    r.disableFormElements(i)
                }, 13);
                var a = r.fire(i, "ajax:aborted:file", [u]);
                return a || setTimeout(function () {
                    r.enableFormElements(i)
                }, 13), a
            }
            return!e.support.submitBubbles && e().jquery < "1.7" && r.callFormSubmitBindings(i, n) === !1 ? r.stopEverything(n) : (r.handleRemote(i), !1)
        }
        setTimeout(function () {
            r.disableFormElements(i)
        }, 13)
    }), e(document).delegate(r.formInputClickSelector, "click.rails", function (t) {
        var n = e(this);
        if (!r.allowAction(n))return r.stopEverything(t);
        var i = n.attr("name"), s = i ? {name: i, value: n.val()} : null;
        n.closest("form").data("ujs:submit-button", s)
    }), e(document).delegate(r.formSubmitSelector, "ajax:beforeSend.rails", function (t) {
        this == t.target && r.disableFormElements(e(this))
    }), e(document).delegate(r.formSubmitSelector, "ajax:complete.rails", function (t) {
        this == t.target && r.enableFormElements(e(this))
    }), e(function () {
        csrf_token = e("meta[name=csrf-token]").attr("content"), csrf_param = e("meta[name=csrf-param]").attr("content"), e('form input[name="' + csrf_param + '"]').val(csrf_token)
    }))
}(jQuery), function () {
    function l() {
        this.returnValue = !1
    }

    function c() {
        this.cancelBubble = !0
    }

    var e = 0, t = [], n = {}, r = {}, i = {"<": "lt", ">": "gt", "&": "amp", '"': "quot", "'": "#39"}, s = /[<>&\"\']/g, o, u = window.setTimeout, a = {}, f;
    (function (e) {
        var t = e.split(/,/), n, i, s;
        for (n = 0; n < t.length; n += 2) {
            s = t[n + 1].split(/ /);
            for (i = 0; i < s.length; i++)r[s[i]] = t[n]
        }
    })("application/msword,doc dot,application/pdf,pdf,application/pgp-signature,pgp,application/postscript,ps ai eps,application/rtf,rtf,application/vnd.ms-excel,xls xlb,application/vnd.ms-powerpoint,ppt pps pot,application/zip,zip,application/x-shockwave-flash,swf swfl,application/vnd.openxmlformats-officedocument.wordprocessingml.document,docx,application/vnd.openxmlformats-officedocument.wordprocessingml.template,dotx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,xlsx,application/vnd.openxmlformats-officedocument.presentationml.presentation,pptx,application/vnd.openxmlformats-officedocument.presentationml.template,potx,application/vnd.openxmlformats-officedocument.presentationml.slideshow,ppsx,application/x-javascript,js,application/json,json,audio/mpeg,mpga mpega mp2 mp3,audio/x-wav,wav,audio/mp4,m4a,image/bmp,bmp,image/gif,gif,image/jpeg,jpeg jpg jpe,image/photoshop,psd,image/png,png,image/svg+xml,svg svgz,image/tiff,tiff tif,text/plain,asc txt text diff log,text/html,htm html xhtml,text/css,css,text/csv,csv,text/rtf,rtf,video/mpeg,mpeg mpg mpe,video/quicktime,qt mov,video/mp4,mp4,video/x-m4v,m4v,video/x-flv,flv,video/x-ms-wmv,wmv,video/avi,avi,video/webm,webm,video/vnd.rn-realvideo,rv,application/vnd.oasis.opendocument.formula-template,otf,application/octet-stream,exe");
    var h = {VERSION: "@@version@@", STOPPED: 1, STARTED: 2, QUEUED: 1, UPLOADING: 2, FAILED: 4, DONE: 5, GENERIC_ERROR: -100, HTTP_ERROR: -200, IO_ERROR: -300, SECURITY_ERROR: -400, INIT_ERROR: -500, FILE_SIZE_ERROR: -600, FILE_EXTENSION_ERROR: -601, IMAGE_FORMAT_ERROR: -700, IMAGE_MEMORY_ERROR: -701, IMAGE_DIMENSIONS_ERROR: -702, mimeTypes: r, ua: function () {
        var e = navigator, t = e.userAgent, n = e.vendor, r, i, s;
        return r = /WebKit/.test(t), s = r && n.indexOf("Apple") !== -1, i = window.opera && window.opera.buildNumber, {windows: navigator.platform.indexOf("Win") !== -1, ie: !r && !i && /MSIE/gi.test(t) && /Explorer/gi.test(e.appName), webkit: r, gecko: !r && /Gecko/.test(t), safari: s, opera: !!i}
    }(), typeOf: function (e) {
        return{}.toString.call(e).match(/\s([a-z|A-Z]+)/)[1].toLowerCase()
    }, extend: function (e) {
        return h.each(arguments, function (t, n) {
            n > 0 && h.each(t, function (t, n) {
                e[n] = t
            })
        }), e
    }, cleanName: function (e) {
        var t, n;
        n = [/[\300-\306]/g, "A", /[\340-\346]/g, "a", /\307/g, "C", /\347/g, "c", /[\310-\313]/g, "E", /[\350-\353]/g, "e", /[\314-\317]/g, "I", /[\354-\357]/g, "i", /\321/g, "N", /\361/g, "n", /[\322-\330]/g, "O", /[\362-\370]/g, "o", /[\331-\334]/g, "U", /[\371-\374]/g, "u"];
        for (t = 0; t < n.length; t += 2)e = e.replace(n[t], n[t + 1]);
        return e = e.replace(/\s+/g, "_"), e = e.replace(/[^a-z0-9_\-\.]+/gi, ""), e
    }, addRuntime: function (e, n) {
        return n.name = e, t[e] = n, t.push(n), n
    }, guid: function () {
        var t = (new Date).getTime().toString(32), n;
        for (n = 0; n < 5; n++)t += Math.floor(Math.random() * 65535).toString(32);
        return(h.guidPrefix || "p") + t + (e++).toString(32)
    }, buildUrl: function (e, t) {
        var n = "";
        return h.each(t, function (e, t) {
            n += (n ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(e)
        }), n && (e += (e.indexOf("?") > 0 ? "&" : "?") + n), e
    }, each: function (e, t) {
        var n, r, i;
        if (e) {
            n = e.length;
            if (n === o) {
                for (r in e)if (e.hasOwnProperty(r) && t(e[r], r) === !1)return
            } else for (i = 0; i < n; i++)if (t(e[i], i) === !1)return
        }
    }, formatSize: function (e) {
        return e === o || /\D/.test(e) ? h.translate("N/A") : e > 1073741824 ? Math.round(e / 1073741824, 1) + " GB" : e > 1048576 ? Math.round(e / 1048576, 1) + " MB" : e > 1024 ? Math.round(e / 1024, 1) + " KB" : e + " b"
    }, getPos: function (e, t) {
        function a(e) {
            var t, n, r = 0, i = 0;
            return e && (n = e.getBoundingClientRect(), t = s.compatMode === "CSS1Compat" ? s.documentElement : s.body, r = n.left + t.scrollLeft, i = n.top + t.scrollTop), {x: r, y: i}
        }

        var n = 0, r = 0, i, s = document, o, u;
        e = e, t = t || s.body;
        if (e && e.getBoundingClientRect && navigator.userAgent.indexOf("MSIE") > 0 && s.documentMode < 8)return o = a(e), u = a(t), {x: o.x - u.x, y: o.y - u.y};
        i = e;
        while (i && i != t && i.nodeType)n += i.offsetLeft || 0, r += i.offsetTop || 0, i = i.offsetParent;
        i = e.parentNode;
        while (i && i != t && i.nodeType)n -= i.scrollLeft || 0, r -= i.scrollTop || 0, i = i.parentNode;
        return{x: n, y: r}
    }, getSize: function (e) {
        return{w: e.offsetWidth || e.clientWidth, h: e.offsetHeight || e.clientHeight}
    }, parseSize: function (e) {
        var t;
        return typeof e == "string" && (e = /^([0-9]+)([mgk]?)$/.exec(e.toLowerCase().replace(/[^0-9mkg]/g, "")), t = e[2], e = +e[1], t == "g" && (e *= 1073741824), t == "m" && (e *= 1048576), t == "k" && (e *= 1024)), e
    }, xmlEncode: function (e) {
        return e ? ("" + e).replace(s, function (e) {
            return i[e] ? "&" + i[e] + ";" : e
        }) : e
    }, toArray: function (e) {
        var t, n = [];
        for (t = 0; t < e.length; t++)n[t] = e[t];
        return n
    }, inArray: function (e, t) {
        if (t) {
            if (Array.prototype.indexOf)return Array.prototype.indexOf.call(t, e);
            for (var n = 0, r = t.length; n < r; n++)if (t[n] === e)return n
        }
        return-1
    }, addI18n: function (e) {
        return h.extend(n, e)
    }, translate: function (e) {
        return n[e] || e
    }, isEmptyObj: function (e) {
        if (e === o)return!0;
        for (var t in e)return!1;
        return!0
    }, hasClass: function (e, t) {
        var n;
        return e.className == "" ? !1 : (n = new RegExp("(^|\\s+)" + t + "(\\s+|$)"), n.test(e.className))
    }, addClass: function (e, t) {
        h.hasClass(e, t) || (e.className = e.className == "" ? t : e.className.replace(/\s+$/, "") + " " + t)
    }, removeClass: function (e, t) {
        var n = new RegExp("(^|\\s+)" + t + "(\\s+|$)");
        e.className = e.className.replace(n, function (e, t, n) {
            return t === " " && n === " " ? " " : ""
        })
    }, getStyle: function (e, t) {
        if (e.currentStyle)return e.currentStyle[t];
        if (window.getComputedStyle)return window.getComputedStyle(e, null)[t]
    }, addEvent: function (e, t, n) {
        var r, i, s, u;
        u = arguments[3], t = t.toLowerCase(), f === o && (f = "Plupload_" + h.guid()), e.addEventListener ? (r = n, e.addEventListener(t, r, !1)) : e.attachEvent && (r = function () {
            var e = window.event;
            e.target || (e.target = e.srcElement), e.preventDefault = l, e.stopPropagation = c, n(e)
        }, e.attachEvent("on" + t, r)), e[f] === o && (e[f] = h.guid()), a.hasOwnProperty(e[f]) || (a[e[f]] = {}), i = a[e[f]], i.hasOwnProperty(t) || (i[t] = []), i[t].push({func: r, orig: n, key: u})
    }, removeEvent: function (e, t) {
        var n, r, i;
        typeof arguments[2] == "function" ? r = arguments[2] : i = arguments[2], t = t.toLowerCase();
        if (!(e[f] && a[e[f]] && a[e[f]][t]))return;
        n = a[e[f]][t];
        for (var s = n.length - 1; s >= 0; s--)if (n[s].key === i || n[s].orig === r) {
            e.removeEventListener ? e.removeEventListener(t, n[s].func, !1) : e.detachEvent && e.detachEvent("on" + t, n[s].func), n[s].orig = null, n[s].func = null, n.splice(s, 1);
            if (r !== o)break
        }
        n.length || delete a[e[f]][t];
        if (h.isEmptyObj(a[e[f]])) {
            delete a[e[f]];
            try {
                delete e[f]
            } catch (u) {
                e[f] = o
            }
        }
    }, removeAllEvents: function (e) {
        var t = arguments[1];
        if (e[f] === o || !e[f])return;
        h.each(a[e[f]], function (n, r) {
            h.removeEvent(e, r, t)
        })
    }};
    h.Uploader = function (e) {
        function f() {
            var e, t = 0, n;
            if (this.state == h.STARTED) {
                for (n = 0; n < i.length; n++)!e && i[n].status == h.QUEUED ? (e = i[n], e.status = h.UPLOADING, this.trigger("BeforeUpload", e) && this.trigger("UploadFile", e)) : t++;
                t == i.length && (this.stop(), this.trigger("UploadComplete", i))
            }
        }

        function l() {
            var e, t;
            r.reset();
            for (e = 0; e < i.length; e++)t = i[e], t.size !== o ? (r.size += t.size, r.loaded += t.loaded) : r.size = o, t.status == h.DONE ? r.uploaded++ : t.status == h.FAILED ? r.failed++ : r.queued++;
            r.size === o ? r.percent = i.length > 0 ? Math.ceil(r.uploaded / i.length * 100) : 0 : (r.bytesPerSec = Math.ceil(r.loaded / ((+(new Date) - s || 1) / 1e3)), r.percent = r.size > 0 ? Math.ceil(r.loaded / r.size * 100) : 0)
        }

        var n = {}, r, i = [], s, a = !1;
        r = new h.QueueProgress, e = h.extend({chunk_size: 0, multipart: !0, multi_selection: !0, file_data_name: "file", filters: []}, e), h.extend(this, {state: h.STOPPED, runtime: "", features: {}, files: i, settings: e, total: r, id: h.guid(), init: function () {
            function v() {
                var e = a[p++], t, r, i;
                if (e) {
                    t = e.getFeatures(), r = n.settings.required_features;
                    if (r) {
                        r = r.split(",");
                        for (i = 0; i < r.length; i++)if (!t[r[i]]) {
                            v();
                            return
                        }
                    }
                    e.init(n, function (r) {
                        r && r.success ? (n.features = t, n.runtime = e.name, n.trigger("Init", {runtime: e.name}), n.trigger("PostInit"), n.refresh()) : v()
                    })
                } else n.trigger("Error", {code: h.INIT_ERROR, message: h.translate("Init error.")})
            }

            var n = this, r, a, c, p = 0, d;
            typeof e.preinit == "function" ? e.preinit(n) : h.each(e.preinit, function (e, t) {
                n.bind(t, e)
            }), e.page_url = e.page_url || document.location.pathname.replace(/\/[^\/]+$/g, "/"), /^(\w+:\/\/|\/)/.test(e.url) || (e.url = e.page_url + e.url), e.chunk_size = h.parseSize(e.chunk_size), e.max_file_size = h.parseSize(e.max_file_size), n.bind("FilesAdded", function (t, r) {
                var s, a, f = 0, l, c = e.filters;
                c && c.length && (l = [], h.each(c, function (e) {
                    h.each(e.extensions.split(/,/), function (e) {
                        /^\s*\*\s*$/.test(e) ? l.push("\\.*") : l.push("\\." + e.replace(new RegExp("[" + "/^$.*+?|()[]{}\\".replace(/./g, "\\$&") + "]", "g"), "\\$&"))
                    })
                }), l = new RegExp(l.join("|") + "$", "i"));
                for (s = 0; s < r.length; s++) {
                    a = r[s], a.loaded = 0, a.percent = 0, a.status = h.QUEUED;
                    if (l && !l.test(a.name)) {
                        t.trigger("Error", {code: h.FILE_EXTENSION_ERROR, message: h.translate("File extension error."), file: a});
                        continue
                    }
                    if (a.size !== o && a.size > e.max_file_size) {
                        t.trigger("Error", {code: h.FILE_SIZE_ERROR, message: h.translate("File size error."), file: a});
                        continue
                    }
                    i.push(a), f++
                }
                if (!f)return!1;
                u(function () {
                    n.trigger("QueueChanged"), n.refresh()
                }, 1)
            }), e.unique_names && n.bind("UploadFile", function (e, t) {
                var n = t.name.match(/\.([^.]+)$/), r = "tmp";
                n && (r = n[1]), t.target_name = t.id + "." + r
            }), n.bind("UploadProgress", function (e, t) {
                t.percent = t.size > 0 ? Math.ceil(t.loaded / t.size * 100) : 100, l()
            }), n.bind("StateChanged", function (e) {
                if (e.state == h.STARTED)s = +(new Date); else if (e.state == h.STOPPED)for (r = e.files.length - 1; r >= 0; r--)e.files[r].status == h.UPLOADING && (e.files[r].status = h.QUEUED, l())
            }), n.bind("QueueChanged", l), n.bind("Error", function (e, t) {
                t.file && (t.file.status = h.FAILED, l(), e.state == h.STARTED && u(function () {
                    f.call(n)
                }, 1))
            }), n.bind("FileUploaded", function (e, t) {
                t.status = h.DONE, t.loaded = t.size, e.trigger("UploadProgress", t), u(function () {
                    f.call(n)
                }, 1)
            });
            if (e.runtimes) {
                a = [], d = e.runtimes.split(/\s?,\s?/);
                for (r = 0; r < d.length; r++)t[d[r]] && a.push(t[d[r]])
            } else a = t;
            v(), typeof e.init == "function" ? e.init(n) : h.each(e.init, function (e, t) {
                n.bind(t, e)
            })
        }, refresh: function () {
            this.trigger("Refresh")
        }, start: function () {
            i.length && this.state != h.STARTED && (this.state = h.STARTED, this.trigger("StateChanged"), f.call(this))
        }, stop: function () {
            this.state != h.STOPPED && (this.state = h.STOPPED, this.trigger("CancelUpload"), this.trigger("StateChanged"))
        }, disableBrowse: function () {
            a = arguments[0] !== o ? arguments[0] : !0, this.trigger("DisableBrowse", a)
        }, getFile: function (e) {
            var t;
            for (t = i.length - 1; t >= 0; t--)if (i[t].id === e)return i[t]
        }, removeFile: function (e) {
            var t;
            for (t = i.length - 1; t >= 0; t--)if (i[t].id === e.id)return this.splice(t, 1)[0]
        }, splice: function (e, t) {
            var n;
            return n = i.splice(e === o ? 0 : e, t === o ? i.length : t), this.trigger("FilesRemoved", n), this.trigger("QueueChanged"), n
        }, trigger: function (e) {
            var t = n[e.toLowerCase()], r, i;
            if (t) {
                i = Array.prototype.slice.call(arguments), i[0] = this;
                for (r = 0; r < t.length; r++)if (t[r].func.apply(t[r].scope, i) === !1)return!1
            }
            return!0
        }, hasEventListener: function (e) {
            return!!n[e.toLowerCase()]
        }, bind: function (e, t, r) {
            var i;
            e = e.toLowerCase(), i = n[e] || [], i.push({func: t, scope: r || this}), n[e] = i
        }, unbind: function (e) {
            e = e.toLowerCase();
            var t = n[e], r, i = arguments[1];
            if (t) {
                if (i !== o) {
                    for (r = t.length - 1; r >= 0; r--)if (t[r].func === i) {
                        t.splice(r, 1);
                        break
                    }
                } else t = [];
                t.length || delete n[e]
            }
        }, unbindAll: function () {
            var e = this;
            h.each(n, function (t, n) {
                e.unbind(n)
            })
        }, destroy: function () {
            this.stop(), this.trigger("Destroy"), this.unbindAll()
        }})
    }, h.File = function (e, t, n, r) {
        var i = this;
        i.id = e, i.name = t, i.size = n, i.nativeFile = r, i.loaded = 0, i.percent = 0, i.status = 0
    }, h.Runtime = function () {
        this.getFeatures = function () {
        }, this.init = function (e, t) {
        }
    }, h.QueueProgress = function () {
        var e = this;
        e.size = 0, e.loaded = 0, e.uploaded = 0, e.failed = 0, e.queued = 0, e.percent = 0, e.bytesPerSec = 0, e.reset = function () {
            e.size = e.loaded = e.uploaded = e.failed = e.queued = e.percent = e.bytesPerSec = 0
        }
    }, h.runtimes = {}, window.plupload = h
}(), function (e) {
    e.runtimes.BrowserPlus = e.addRuntime("browserplus", {getFeatures: function () {
        return{dragdrop: !0, jpgresize: !0, pngresize: !0, chunks: !0, progress: !0, multipart: !0, multi_selection: !0}
    }, init: function (t, n) {
        function u(n) {
            var r, s, o = [], u, a;
            for (s = 0; s < n.length; s++)u = n[s], a = e.guid(), i[a] = u, o.push(new e.File(a, u.name, u.size));
            s && t.trigger("FilesAdded", o)
        }

        function a() {
            var a = !1;
            t.bind("PostInit", function () {
                function c(e, t) {
                    r.DragAndDrop.AddDropTarget({id: e}, function (n) {
                        r.DragAndDrop.AttachCallbacks({id: e, hover: function (e) {
                            !e && t && t()
                        }, drop: function (e) {
                            t && t(), u(e)
                        }}, function () {
                        })
                    })
                }

                function h() {
                    document.getElementById(o).style.top = "-1000px"
                }

                var n, i = s.drop_element, o = t.id + "_droptarget", f = document.getElementById(i), l;
                f && (document.attachEvent && /MSIE/gi.test(navigator.userAgent) ? (n = document.createElement("div"), n.setAttribute("id", o), e.extend(n.style, {position: "absolute", top: "-1000px", background: "red", filter: "alpha(opacity=0)", opacity: 0}), document.body.appendChild(n), e.addEvent(f, "dragenter", function (t) {
                    var n, r;
                    n = document.getElementById(i), r = e.getPos(n), e.extend(document.getElementById(o).style, {top: r.y + "px", left: r.x + "px", width: n.offsetWidth + "px", height: n.offsetHeight + "px"})
                }), c(o, h)) : c(i)), e.addEvent(document.getElementById(s.browse_button), "click", function (t) {
                    var n = [], i, o, f = s.filters, l, c;
                    t.preventDefault();
                    if (a)return;
                    e:for (i = 0; i < f.length; i++) {
                        l = f[i].extensions.split(",");
                        for (o = 0; o < l.length; o++) {
                            if (l[o] === "*") {
                                n = [];
                                break e
                            }
                            c = e.mimeTypes[l[o]], c && e.inArray(c, n) === -1 && n.push(e.mimeTypes[l[o]])
                        }
                    }
                    r.FileBrowse.OpenBrowseDialog({mimeTypes: n}, function (e) {
                        e.success && u(e.value)
                    })
                }), f = n = null
            }), t.bind("CancelUpload", function () {
                r.Uploader.cancel({}, function () {
                })
            }), t.bind("DisableBrowse", function (e, t) {
                a = t
            }), t.bind("UploadFile", function (t, n) {
                function c(i, s) {
                    var o;
                    if (n.status == e.FAILED)return;
                    u.name = n.target_name || n.name, a && (u.chunk = "" + i, u.chunks = "" + s), o = l.shift(), r.Uploader.upload({url: t.settings.url, files: {file: o}, cookies: document.cookies, postvars: e.extend(u, t.settings.multipart_params), progressCallback: function (e) {
                        var r, s = 0;
                        f[i] = parseInt(e.filePercent * o.size / 100, 10);
                        for (r = 0; r < f.length; r++)s += f[r];
                        n.loaded = s, t.trigger("UploadProgress", n)
                    }}, function (r) {
                        var o, u;
                        r.success ? (o = r.value.statusCode, a && t.trigger("ChunkUploaded", n, {chunk: i, chunks: s, response: r.value.body, status: o}), l.length > 0 ? c(++i, s) : (n.status = e.DONE, t.trigger("FileUploaded", n, {response: r.value.body, status: o}), o >= 400 && t.trigger("Error", {code: e.HTTP_ERROR, message: e.translate("HTTP Error."), file: n, status: o}))) : t.trigger("Error", {code: e.GENERIC_ERROR, message: e.translate("Generic Error."), file: n, details: r.error})
                    })
                }

                function h(e) {
                    n.size = e.size, a ? r.FileAccess.chunk({file: e, chunkSize: a}, function (e) {
                        if (e.success) {
                            var t = e.value, n = t.length;
                            f = Array(n);
                            for (var r = 0; r < n; r++)f[r] = 0, l.push(t[r]);
                            c(0, n)
                        }
                    }) : (f = Array(1), l.push(e), c(0, 1))
                }

                var s = i[n.id], u = {}, a = t.settings.chunk_size, f, l = [];
                o && /\.(png|jpg|jpeg)$/i.test(n.name) ? BrowserPlus.ImageAlter.transform({file: s, quality: o.quality || 90, actions: [
                    {scale: {maxwidth: o.width, maxheight: o.height}}
                ]}, function (e) {
                    e.success && h(e.value.file)
                }) : h(s)
            }), n({success: !0})
        }

        var r = window.BrowserPlus, i = {}, s = t.settings, o = s.resize;
        r ? r.init(function (e) {
            var t = [
                {service: "Uploader", version: "3"},
                {service: "DragAndDrop", version: "1"},
                {service: "FileBrowse", version: "1"},
                {service: "FileAccess", version: "2"}
            ];
            o && t.push({service: "ImageAlter", version: "4"}), e.success ? r.require({services: t}, function (e) {
                e.success ? a() : n()
            }) : n()
        }) : n()
    }})
}(plupload), function (e, t, n, r) {
    function o() {
        var e;
        try {
            e = navigator.plugins["Shockwave Flash"], e = e.description
        } catch (t) {
            try {
                e = (new ActiveXObject("ShockwaveFlash.ShockwaveFlash")).GetVariable("$version")
            } catch (n) {
                e = "0.0"
            }
        }
        return e = e.match(/\d+/g), parseFloat(e[0] + "." + e[1])
    }

    var i = {}, s = {};
    n.flash = {trigger: function (e, t, n) {
        setTimeout(function () {
            var r = i[e], s, o;
            r && r.trigger("Flash:" + t, n)
        }, 0)
    }}, n.runtimes.Flash = n.addRuntime("flash", {getFeatures: function () {
        return{jpgresize: !0, pngresize: !0, maxWidth: 8091, maxHeight: 8091, chunks: !0, progress: !0, multipart: !0, multi_selection: !0}
    }, init: function (e, r) {
        function c() {
            return t.getElementById(e.id + "_flash")
        }

        function h() {
            if (f++ > 5e3) {
                r({success: !1});
                return
            }
            s[e.id] === !1 && setTimeout(h, 1)
        }

        var u, a, f = 0, l = t.body;
        if (o() < 10) {
            r({success: !1});
            return
        }
        s[e.id] = !1, i[e.id] = e, u = t.getElementById(e.settings.browse_button), a = t.createElement("div"), a.id = e.id + "_flash_container", n.extend(a.style, {position: "absolute", top: "0px", background: e.settings.shim_bgcolor || "transparent", zIndex: 99999, width: "100%", height: "100%"}), a.className = "plupload flash", e.settings.container && (l = t.getElementById(e.settings.container), n.getStyle(l, "position") === "static" && (l.style.position = "relative")), l.appendChild(a), function () {
            var r, i;
            r = '<object id="' + e.id + '_flash" type="application/x-shockwave-flash" data="' + e.settings.flash_swf_url + '" ', n.ua.ie && (r += 'classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '), r += 'width="100%" height="100%" style="outline:0"><param name="movie" value="' + e.settings.flash_swf_url + '" />' + '<param name="flashvars" value="id=' + escape(e.id) + '" />' + '<param name="wmode" value="transparent" />' + '<param name="allowscriptaccess" value="always" />' + "</object>", n.ua.ie ? (i = t.createElement("div"), a.appendChild(i), i.outerHTML = r, i = null) : a.innerHTML = r
        }(), h(), u = a = null, e.bind("Destroy", function (e) {
            var r;
            n.removeAllEvents(t.body, e.id), delete s[e.id], delete i[e.id], r = t.getElementById(e.id + "_flash_container"), r && l.removeChild(r)
        }), e.bind("Flash:Init", function () {
            var i = {}, o;
            try {
                c().setFileFilters(e.settings.filters, e.settings.multi_selection)
            } catch (u) {
                r({success: !1});
                return
            }
            if (s[e.id])return;
            s[e.id] = !0, e.bind("UploadFile", function (t, r) {
                var s = t.settings, o = e.settings.resize || {};
                c().uploadFile(i[r.id], s.url, {name: r.target_name || r.name, mime: n.mimeTypes[r.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream", chunk_size: s.chunk_size, width: o.width, height: o.height, quality: o.quality, multipart: s.multipart, multipart_params: s.multipart_params || {}, file_data_name: s.file_data_name, format: /\.(jpg|jpeg)$/i.test(r.name) ? "jpg" : "png", headers: s.headers, urlstream_upload: s.urlstream_upload})
            }), e.bind("CancelUpload", function () {
                c().cancelUpload()
            }), e.bind("Flash:UploadProcess", function (e, t) {
                var r = e.getFile(i[t.id]);
                r.status != n.FAILED && (r.loaded = t.loaded, r.size = t.size, e.trigger("UploadProgress", r))
            }), e.bind("Flash:UploadChunkComplete", function (e, t) {
                var r, s = e.getFile(i[t.id]);
                r = {chunk: t.chunk, chunks: t.chunks, response: t.text}, e.trigger("ChunkUploaded", s, r), s.status !== n.FAILED && e.state !== n.STOPPED && c().uploadNextChunk(), t.chunk == t.chunks - 1 && (s.status = n.DONE, e.trigger("FileUploaded", s, {response: t.text}))
            }), e.bind("Flash:SelectFiles", function (t, r) {
                var s, o, u = [], a;
                for (o = 0; o < r.length; o++)s = r[o], a = n.guid(), i[a] = s.id, i[s.id] = a, u.push(new n.File(a, s.name, s.size, s));
                u.length && e.trigger("FilesAdded", u)
            }), e.bind("Flash:SecurityError", function (t, r) {
                e.trigger("Error", {code: n.SECURITY_ERROR, message: n.translate("Security error."), details: r.message, file: e.getFile(i[r.id])})
            }), e.bind("Flash:GenericError", function (t, r) {
                e.trigger("Error", {code: n.GENERIC_ERROR, message: n.translate("Generic error."), details: r.message, file: e.getFile(i[r.id])})
            }), e.bind("Flash:IOError", function (t, r) {
                e.trigger("Error", {code: n.IO_ERROR, message: n.translate("IO error."), details: r.message, file: e.getFile(i[r.id])})
            }), e.bind("Flash:ImageError", function (t, r) {
                e.trigger("Error", {code: parseInt(r.code, 10), message: n.translate("Image error."), file: e.getFile(i[r.id])})
            }), e.bind("Flash:StageEvent:rollOver", function (r) {
                var i, s;
                i = t.getElementById(e.settings.browse_button), s = r.settings.browse_button_hover, i && s && n.addClass(i, s)
            }), e.bind("Flash:StageEvent:rollOut", function (r) {
                var i, s;
                i = t.getElementById(e.settings.browse_button), s = r.settings.browse_button_hover, i && s && n.removeClass(i, s)
            }), e.bind("Flash:StageEvent:mouseDown", function (r) {
                var i, s;
                i = t.getElementById(e.settings.browse_button), s = r.settings.browse_button_active, i && s && (n.addClass(i, s), n.addEvent(t.body, "mouseup", function () {
                    n.removeClass(i, s)
                }, r.id))
            }), e.bind("Flash:StageEvent:mouseUp", function (r) {
                var i, s;
                i = t.getElementById(e.settings.browse_button), s = r.settings.browse_button_active, i && s && n.removeClass(i, s)
            }), e.bind("Flash:ExifData", function (t, n) {
                e.trigger("ExifData", e.getFile(i[n.id]), n.data)
            }), e.bind("Flash:GpsData", function (t, n) {
                e.trigger("GpsData", e.getFile(i[n.id]), n.data)
            }), e.bind("QueueChanged", function (t) {
                e.refresh()
            }), e.bind("FilesRemoved", function (e, t) {
                var n;
                for (n = 0; n < t.length; n++)c().removeFile(i[t[n].id])
            }), e.bind("StateChanged", function (t) {
                e.refresh()
            }), e.bind("Refresh", function (r) {
                var i, s, o;
                c().setFileFilters(e.settings.filters, e.settings.multi_selection), i = t.getElementById(r.settings.browse_button), i && (s = n.getPos(i, t.getElementById(r.settings.container)), o = n.getSize(i), n.extend(t.getElementById(r.id + "_flash_container").style, {top: s.y + "px", left: s.x + "px", width: o.w + "px", height: o.h + "px"}))
            }), e.bind("DisableBrowse", function (e, t) {
                c().disableBrowse(t)
            }), r({success: !0})
        })
    }})
}(window, document, plupload), function (e, t, n, r) {
    function u(t, n) {
        var r;
        if (!("FileReader"in e))return n(t.getAsDataURL());
        r = new FileReader, r.readAsDataURL(t), r.onload = function () {
            n(r.result)
        }
    }

    function a(t, n) {
        var r;
        if (!("FileReader"in e))return n(t.getAsBinary());
        r = new FileReader, r.readAsBinaryString(t), r.onload = function () {
            n(r.result)
        }
    }

    function f(e, n, r, i) {
        var o, a, f, l, p = this;
        u(s[e.id], function (s) {
            o = t.createElement("canvas"), o.style.display = "none", t.body.appendChild(o), a = o.getContext("2d"), f = new Image, f.onerror = f.onabort = function () {
                i({success: !1})
            }, f.onload = function () {
                var t, u, d, v, m;
                n.width || (n.width = f.width), n.height || (n.height = f.height), l = Math.min(n.width / f.width, n.height / f.height);
                if (l < 1 || l === 1 && r === "image/jpeg") {
                    t = Math.round(f.width * l), u = Math.round(f.height * l), o.width = t, o.height = u, a.drawImage(f, 0, 0, t, u);
                    if (r === "image/jpeg") {
                        v = new c(atob(s.substring(s.indexOf("base64,") + 7))), v.headers && v.headers.length && (m = new h, m.init(v.get("exif")[0]) && (m.setExif("PixelXDimension", t), m.setExif("PixelYDimension", u), v.set("exif", m.getBinary()), p.hasEventListener("ExifData") && p.trigger("ExifData", e, m.EXIF()), p.hasEventListener("GpsData") && p.trigger("GpsData", e, m.GPS())));
                        if (n.quality)try {
                            s = o.toDataURL(r, n.quality / 100)
                        } catch (g) {
                            s = o.toDataURL(r)
                        }
                    } else s = o.toDataURL(r);
                    s = s.substring(s.indexOf("base64,") + 7), s = atob(s), v && v.headers && v.headers.length && (s = v.restore(s), v.purge()), o.parentNode.removeChild(o), i({success: !0, data: s})
                } else i({success: !1})
            }, f.src = s
        })
    }

    function l() {
        function n(n, r) {
            var i = e ? 0 : -8 * (r - 1), s = 0, o;
            for (o = 0; o < r; o++)s |= t.charCodeAt(n + o) << Math.abs(i + o * 8);
            return s
        }

        function i(e, n, r) {
            var r = arguments.length === 3 ? r : t.length - n - 1;
            t = t.substr(0, n) + e + t.substr(r + n)
        }

        function s(t, n, r) {
            var s = "", o = e ? 0 : -8 * (r - 1), u;
            for (u = 0; u < r; u++)s += String.fromCharCode(n >> Math.abs(o + u * 8) & 255);
            i(s, t, r)
        }

        var e = !1, t;
        return{II: function (t) {
            if (t === r)return e;
            e = t
        }, init: function (n) {
            e = !1, t = n
        }, SEGMENT: function (e, n, r) {
            switch (arguments.length) {
                case 1:
                    return t.substr(e, t.length - e - 1);
                case 2:
                    return t.substr(e, n);
                case 3:
                    i(r, e, n);
                    break;
                default:
                    return t
            }
        }, BYTE: function (e) {
            return n(e, 1)
        }, SHORT: function (e) {
            return n(e, 2)
        }, LONG: function (e, t) {
            if (t === r)return n(e, 4);
            s(e, t, 4)
        }, SLONG: function (e) {
            var t = n(e, 4);
            return t > 2147483647 ? t - 4294967296 : t
        }, STRING: function (e, t) {
            var r = "";
            for (t += e; e < t; e++)r += String.fromCharCode(n(e, 1));
            return r
        }}
    }

    function c(e) {
        var t = {65505: {app: "EXIF", name: "APP1", signature: "Exif\0"}, 65506: {app: "ICC", name: "APP2", signature: "ICC_PROFILE\0"}, 65517: {app: "IPTC", name: "APP13", signature: "Photoshop 3.0\0"}}, n = [], i, s, o = r, u = 0, a;
        i = new l, i.init(e);
        if (i.SHORT(0) !== 65496)return;
        s = 2, a = Math.min(1048576, e.length);
        while (s <= a) {
            o = i.SHORT(s);
            if (o >= 65488 && o <= 65495) {
                s += 2;
                continue
            }
            if (o === 65498 || o === 65497)break;
            u = i.SHORT(s + 2) + 2, t[o] && i.STRING(s + 4, t[o].signature.length) === t[o].signature && n.push({hex: o, app: t[o].app.toUpperCase(), name: t[o].name.toUpperCase(), start: s, length: u, segment: i.SEGMENT(s, u)}), s += u
        }
        return i.init(null), {headers: n, restore: function (e) {
            i.init(e);
            var t = new c(e);
            if (!t.headers)return!1;
            for (var r = t.headers.length; r > 0; r--) {
                var o = t.headers[r - 1];
                i.SEGMENT(o.start, o.length, "")
            }
            t.purge(), s = i.SHORT(2) == 65504 ? 4 + i.SHORT(4) : 2;
            for (var r = 0, u = n.length; r < u; r++)i.SEGMENT(s, 0, n[r].segment), s += n[r].length;
            return i.SEGMENT()
        }, get: function (e) {
            var t = [];
            for (var r = 0, i = n.length; r < i; r++)n[r].app === e.toUpperCase() && t.push(n[r].segment);
            return t
        }, set: function (e, t) {
            var r = [];
            typeof t == "string" ? r.push(t) : r = t;
            for (var i = ii = 0, s = n.length; i < s; i++) {
                n[i].app === e.toUpperCase() && (n[i].segment = r[ii], n[i].length = r[ii].length, ii++);
                if (ii >= r.length)break
            }
        }, purge: function () {
            n = [], i.init(null)
        }}
    }

    function h() {
        function u(t, n) {
            var i = e.SHORT(t), u, a, f, l, c, h, p, d, v = [], m = {};
            for (u = 0; u < i; u++) {
                p = h = t + 12 * u + 2, f = n[e.SHORT(p)];
                if (f === r)continue;
                l = e.SHORT(p += 2), c = e.LONG(p += 2), p += 4, v = [];
                switch (l) {
                    case 1:
                    case 7:
                        c > 4 && (p = e.LONG(p) + s.tiffHeader);
                        for (a = 0; a < c; a++)v[a] = e.BYTE(p + a);
                        break;
                    case 2:
                        c > 4 && (p = e.LONG(p) + s.tiffHeader), m[f] = e.STRING(p, c - 1);
                        continue;
                    case 3:
                        c > 2 && (p = e.LONG(p) + s.tiffHeader);
                        for (a = 0; a < c; a++)v[a] = e.SHORT(p + a * 2);
                        break;
                    case 4:
                        c > 1 && (p = e.LONG(p) + s.tiffHeader);
                        for (a = 0; a < c; a++)v[a] = e.LONG(p + a * 4);
                        break;
                    case 5:
                        p = e.LONG(p) + s.tiffHeader;
                        for (a = 0; a < c; a++)v[a] = e.LONG(p + a * 4) / e.LONG(p + a * 4 + 4);
                        break;
                    case 9:
                        p = e.LONG(p) + s.tiffHeader;
                        for (a = 0; a < c; a++)v[a] = e.SLONG(p + a * 4);
                        break;
                    case 10:
                        p = e.LONG(p) + s.tiffHeader;
                        for (a = 0; a < c; a++)v[a] = e.SLONG(p + a * 4) / e.SLONG(p + a * 4 + 4);
                        break;
                    default:
                        continue
                }
                d = c == 1 ? v[0] : v, o.hasOwnProperty(f) && typeof d != "object" ? m[f] = o[f][d] : m[f] = d
            }
            return m
        }

        function a() {
            var n = r, i = s.tiffHeader;
            return e.II(e.SHORT(i) == 18761), e.SHORT(i += 2) !== 42 ? !1 : (s.IFD0 = s.tiffHeader + e.LONG(i += 2), n = u(s.IFD0, t.tiff), s.exifIFD = "ExifIFDPointer"in n ? s.tiffHeader + n.ExifIFDPointer : r, s.gpsIFD = "GPSInfoIFDPointer"in n ? s.tiffHeader + n.GPSInfoIFDPointer : r, !0)
        }

        function f(n, r, o) {
            var u, a, f, l = 0;
            if (typeof r == "string") {
                var c = t[n.toLowerCase()];
                for (hex in c)if (c[hex] === r) {
                    r = hex;
                    break
                }
            }
            u = s[n.toLowerCase() + "IFD"], a = e.SHORT(u);
            for (i = 0; i < a; i++) {
                f = u + 12 * i + 2;
                if (e.SHORT(f) == r) {
                    l = f + 8;
                    break
                }
            }
            return l ? (e.LONG(l, o), !0) : !1
        }

        var e, t, s = {}, o;
        return e = new l, t = {tiff: {274: "Orientation", 34665: "ExifIFDPointer", 34853: "GPSInfoIFDPointer"}, exif: {36864: "ExifVersion", 40961: "ColorSpace", 40962: "PixelXDimension", 40963: "PixelYDimension", 36867: "DateTimeOriginal", 33434: "ExposureTime", 33437: "FNumber", 34855: "ISOSpeedRatings", 37377: "ShutterSpeedValue", 37378: "ApertureValue", 37383: "MeteringMode", 37384: "LightSource", 37385: "Flash", 41986: "ExposureMode", 41987: "WhiteBalance", 41990: "SceneCaptureType", 41988: "DigitalZoomRatio", 41992: "Contrast", 41993: "Saturation", 41994: "Sharpness"}, gps: {0: "GPSVersionID", 1: "GPSLatitudeRef", 2: "GPSLatitude", 3: "GPSLongitudeRef", 4: "GPSLongitude"}}, o = {ColorSpace: {1: "sRGB", 0: "Uncalibrated"}, MeteringMode: {0: "Unknown", 1: "Average", 2: "CenterWeightedAverage", 3: "Spot", 4: "MultiSpot", 5: "Pattern", 6: "Partial", 255: "Other"}, LightSource: {1: "Daylight", 2: "Fliorescent", 3: "Tungsten", 4: "Flash", 9: "Fine weather", 10: "Cloudy weather", 11: "Shade", 12: "Daylight fluorescent (D 5700 - 7100K)", 13: "Day white fluorescent (N 4600 -5400K)", 14: "Cool white fluorescent (W 3900 - 4500K)", 15: "White fluorescent (WW 3200 - 3700K)", 17: "Standard light A", 18: "Standard light B", 19: "Standard light C", 20: "D55", 21: "D65", 22: "D75", 23: "D50", 24: "ISO studio tungsten", 255: "Other"}, Flash: {0: "Flash did not fire.", 1: "Flash fired.", 5: "Strobe return light not detected.", 7: "Strobe return light detected.", 9: "Flash fired, compulsory flash mode", 13: "Flash fired, compulsory flash mode, return light not detected", 15: "Flash fired, compulsory flash mode, return light detected", 16: "Flash did not fire, compulsory flash mode", 24: "Flash did not fire, auto mode", 25: "Flash fired, auto mode", 29: "Flash fired, auto mode, return light not detected", 31: "Flash fired, auto mode, return light detected", 32: "No flash function", 65: "Flash fired, red-eye reduction mode", 69: "Flash fired, red-eye reduction mode, return light not detected", 71: "Flash fired, red-eye reduction mode, return light detected", 73: "Flash fired, compulsory flash mode, red-eye reduction mode", 77: "Flash fired, compulsory flash mode, red-eye reduction mode, return light not detected", 79: "Flash fired, compulsory flash mode, red-eye reduction mode, return light detected", 89: "Flash fired, auto mode, red-eye reduction mode", 93: "Flash fired, auto mode, return light not detected, red-eye reduction mode", 95: "Flash fired, auto mode, return light detected, red-eye reduction mode"}, ExposureMode: {0: "Auto exposure", 1: "Manual exposure", 2: "Auto bracket"}, WhiteBalance: {0: "Auto white balance", 1: "Manual white balance"}, SceneCaptureType: {0: "Standard", 1: "Landscape", 2: "Portrait", 3: "Night scene"}, Contrast: {0: "Normal", 1: "Soft", 2: "Hard"}, Saturation: {0: "Normal", 1: "Low saturation", 2: "High saturation"}, Sharpness: {0: "Normal", 1: "Soft", 2: "Hard"}, GPSLatitudeRef: {N: "North latitude", S: "South latitude"}, GPSLongitudeRef: {E: "East longitude", W: "West longitude"}}, {init: function (t) {
            return s = {tiffHeader: 10}, t === r || !t.length ? !1 : (e.init(t), e.SHORT(0) === 65505 && e.STRING(4, 5).toUpperCase() === "EXIF\0" ? a() : !1)
        }, EXIF: function () {
            var e;
            e = u(s.exifIFD, t.exif);
            if (e.ExifVersion && n.typeOf(e.ExifVersion) === "array") {
                for (var r = 0, i = ""; r < e.ExifVersion.length; r++)i += String.fromCharCode(e.ExifVersion[r]);
                e.ExifVersion = i
            }
            return e
        }, GPS: function () {
            var e;
            return e = u(s.gpsIFD, t.gps), e.GPSVersionID && (e.GPSVersionID = e.GPSVersionID.join(".")), e
        }, setExif: function (e, t) {
            return e !== "PixelXDimension" && e !== "PixelYDimension" ? !1 : f("exif", e, t)
        }, getBinary: function () {
            return e.SEGMENT()
        }}
    }

    var s = {}, o;
    n.runtimes.Html5 = n.addRuntime("html5", {getFeatures: function () {
        var r, i, s, u, a, f;
        return i = s = a = f = !1, e.XMLHttpRequest && (r = new XMLHttpRequest, s = !!r.upload, i = !!r.sendAsBinary || !!r.upload), i && (u = !!(r.sendAsBinary || e.Uint8Array && e.ArrayBufferView), a = !(!File || !File.prototype.getAsDataURL && !e.FileReader || !u), f = !!File && !!(File.prototype.mozSlice || File.prototype.webkitSlice || File.prototype.slice)), o = n.ua.safari && n.ua.windows, {
            html5: i, dragdrop: function () {
                var e = t.createElement("div");
                return"draggable"in e || "ondragstart"in e && "ondrop"in e
            }(), jpgresize: a, pngresize: a, multipart: a || !!e.FileReader || !!e.FormData, canSendBinary: u, cantSendBlobInFormData: !!(n.ua.gecko && e.FormData && e.FileReader && !FileReader.prototype.readAsArrayBuffer), progress: s, chunks: f, multi_selection: !n.ua.safari || !n.ua.windows, triggerDialog: n.ua.gecko && e.FormData || n.ua.webkit}
    }, init: function (r, i) {
        function c(e) {
            var t, i, o = [], u, a = {};
            for (i = 0; i < e.length; i++) {
                t = e[i];
                if (a[t.name])continue;
                a[t.name] = !0, u = n.guid(), s[u] = t, o.push(new n.File(u, t.fileName || t.name, t.fileSize || t.size, t))
            }
            o.length && r.trigger("FilesAdded", o)
        }

        var u, l;
        u = this.getFeatures();
        if (!u.html5) {
            i({success: !1});
            return
        }
        r.bind("Init", function (e) {
            var i, s, o = [], u, a, f = e.settings.filters, l, h, p = t.body, d;
            i = t.createElement("div"), i.id = e.id + "_html5_container", n.extend(i.style, {position: "absolute", background: r.settings.shim_bgcolor || "transparent", width: "100px", height: "100px", overflow: "hidden", zIndex: 99999, opacity: r.settings.shim_bgcolor ? "" : 0}), i.className = "plupload html5", r.settings.container && (p = t.getElementById(r.settings.container), n.getStyle(p, "position") === "static" && (p.style.position = "relative")), p.appendChild(i);
            e:for (u = 0; u < f.length; u++) {
                l = f[u].extensions.split(/,/);
                for (a = 0; a < l.length; a++) {
                    if (l[a] === "*") {
                        o = [];
                        break e
                    }
                    h = n.mimeTypes[l[a]], h && n.inArray(h, o) === -1 && o.push(h)
                }
            }
            i.innerHTML = '<input id="' + r.id + '_html5" ' + ' style="font-size:999px"' + ' type="file" accept="' + o.join(",") + '" ' + (r.settings.multi_selection && r.features.multi_selection ? 'multiple="multiple"' : "") + " />", i.scrollTop = 100, d = t.getElementById(r.id + "_html5"), e.features.triggerDialog ? n.extend(d.style, {position: "absolute", width: "100%", height: "100%"}) : n.extend(d.style, {cssFloat: "right", styleFloat: "right"}), d.onchange = function () {
                c(this.files), this.value = ""
            }, s = t.getElementById(e.settings.browse_button);
            if (s) {
                var v = e.settings.browse_button_hover, m = e.settings.browse_button_active, g = e.features.triggerDialog ? s : i;
                v && (n.addEvent(g, "mouseover", function () {
                    n.addClass(s, v)
                }, e.id), n.addEvent(g, "mouseout", function () {
                    n.removeClass(s, v)
                }, e.id)), m && (n.addEvent(g, "mousedown", function () {
                    n.addClass(s, m)
                }, e.id), n.addEvent(t.body, "mouseup", function () {
                    n.removeClass(s, m)
                }, e.id)), e.features.triggerDialog && n.addEvent(s, "click", function (n) {
                    var r = t.getElementById(e.id + "_html5");
                    r && !r.disabled && r.click(), n.preventDefault()
                }, e.id)
            }
        }), r.bind("PostInit", function () {
            var e = t.getElementById(r.settings.drop_element);
            if (e) {
                if (o) {
                    n.addEvent(e, "dragenter", function (i) {
                        var s, o, u;
                        s = t.getElementById(r.id + "_drop"), s || (s = t.createElement("input"), s.setAttribute("type", "file"), s.setAttribute("id", r.id + "_drop"), s.setAttribute("multiple", "multiple"), n.addEvent(s, "change", function () {
                            c(this.files), n.removeEvent(s, "change", r.id), s.parentNode.removeChild(s)
                        }, r.id), e.appendChild(s)), o = n.getPos(e, t.getElementById(r.settings.container)), u = n.getSize(e), n.getStyle(e, "position") === "static" && n.extend(e.style, {position: "relative"}), n.extend(s.style, {position: "absolute", display: "block", top: 0, left: 0, width: u.w + "px", height: u.h + "px", opacity: 0})
                    }, r.id);
                    return
                }
                n.addEvent(e, "dragover", function (e) {
                    e.preventDefault()
                }, r.id), n.addEvent(e, "drop", function (e) {
                    var t = e.dataTransfer;
                    t && t.files && c(t.files), e.preventDefault()
                }, r.id)
            }
        }), r.bind("Refresh", function (e) {
            var i, s, o, u, a;
            i = t.getElementById(r.settings.browse_button), i && (s = n.getPos(i, t.getElementById(e.settings.container)), o = n.getSize(i), u = t.getElementById(r.id + "_html5_container"), n.extend(u.style, {top: s.y + "px", left: s.x + "px", width: o.w + "px", height: o.h + "px"}), r.features.triggerDialog && (n.getStyle(i, "position") === "static" && n.extend(i.style, {position: "relative"}), a = parseInt(n.getStyle(i, "zIndex"), 10), isNaN(a) && (a = 0), n.extend(i.style, {zIndex: a}), n.extend(u.style, {zIndex: a - 1})))
        }), r.bind("DisableBrowse", function (e, n) {
            var r = t.getElementById(e.id + "_html5");
            r && (r.disabled = n)
        }), r.bind("CancelUpload", function () {
            l && l.abort && l.abort()
        }), r.bind("UploadFile", function (t, r) {
            function h(e, t, n) {
                var r;
                if (!File.prototype.slice)return(r = File.prototype.webkitSlice || File.prototype.mozSlice) ? r.call(e, t, n) : null;
                try {
                    return e.slice(), e.slice(t, n)
                } catch (i) {
                    return e.slice(t, n - t)
                }
            }

            function p(s) {
                function c() {
                    function E(i) {
                        var s = 0, f = "----pluploadboundary" + n.guid(), h, d = "--", E = "\r\n", S = "";
                        l = new XMLHttpRequest, l.upload && (l.upload.onprogress = function (e) {
                            r.loaded = Math.min(r.size, a + e.loaded - s), t.trigger("UploadProgress", r)
                        }), l.onreadystatechange = function () {
                            var e, s;
                            if (l.readyState == 4 && t.state !== n.STOPPED) {
                                try {
                                    e = l.status
                                } catch (u) {
                                    e = 0
                                }
                                if (e >= 400)t.trigger("Error", {code: n.HTTP_ERROR, message: n.translate("HTTP Error."), file: r, status: e}); else {
                                    if (v) {
                                        s = {chunk: o, chunks: v, response: l.responseText, status: e}, t.trigger("ChunkUploaded", r, s), a += y;
                                        if (s.cancelled) {
                                            r.status = n.FAILED;
                                            return
                                        }
                                        r.loaded = Math.min(r.size, (o + 1) * g)
                                    } else r.loaded = r.size;
                                    t.trigger("UploadProgress", r), i = p = h = S = null, !v || ++o >= v ? (r.status = n.DONE, t.trigger("FileUploaded", r, {response: l.responseText, status: e})) : c()
                                }
                            }
                        };
                        if (t.settings.multipart && u.multipart) {
                            m.name = r.target_name || r.name, l.open("post", w, !0), n.each(t.settings.headers, function (e, t) {
                                l.setRequestHeader(t, e)
                            });
                            if (typeof i != "string" && !!e.FormData) {
                                h = new FormData, n.each(n.extend(m, t.settings.multipart_params), function (e, t) {
                                    h.append(t, e)
                                }), h.append(t.settings.file_data_name, i), l.send(h);
                                return
                            }
                            if (typeof i == "string") {
                                l.setRequestHeader("Content-Type", "multipart/form-data; boundary=" + f), n.each(n.extend(m, t.settings.multipart_params), function (e, t) {
                                    S += d + f + E + 'Content-Disposition: form-data; name="' + t + '"' + E + E, S += unescape(encodeURIComponent(e)) + E
                                }), b = n.mimeTypes[r.name.replace(/^.+\.([^.]+)/, "$1").toLowerCase()] || "application/octet-stream", S += d + f + E + 'Content-Disposition: form-data; name="' + t.settings.file_data_name + '"; filename="' + unescape(encodeURIComponent(r.name)) + '"' + E + "Content-Type: " + b + E + E + i + E + d + f + d + E, s = S.length - i.length, i = S;
                                if (l.sendAsBinary)l.sendAsBinary(i); else if (u.canSendBinary) {
                                    var x = new Uint8Array(i.length);
                                    for (var T = 0; T < i.length; T++)x[T] = i.charCodeAt(T) & 255;
                                    l.send(x.buffer)
                                }
                                return
                            }
                        }
                        w = n.buildUrl(t.settings.url, n.extend(m, t.settings.multipart_params)), l.open("post", w, !0), l.setRequestHeader("Content-Type", "application/octet-stream"), n.each(t.settings.headers, function (e, t) {
                            l.setRequestHeader(t, e)
                        }), l.send(i)
                    }

                    var p, d, v, m, g, y, b, w = t.settings.url;
                    if (r.status == n.DONE || r.status == n.FAILED || t.state == n.STOPPED)return;
                    m = {name: r.target_name || r.name}, i.chunk_size && r.size > i.chunk_size && (u.chunks || typeof s == "string") ? (g = i.chunk_size, v = Math.ceil(r.size / g), y = Math.min(g, r.size - o * g), typeof s == "string" ? p = s.substring(o * g, o * g + y) : p = h(s, o * g, o * g + y), m.chunk = o, m.chunks = v) : (y = r.size, p = s), t.settings.multipart && u.multipart && typeof p != "string" && f && u.cantSendBlobInFormData && u.chunks && t.settings.chunk_size ? (f.onload = function () {
                        E(f.result)
                    }, f.readAsBinaryString(p)) : E(p)
                }

                var o = 0, a = 0, f = "FileReader"in e ? new FileReader : null;
                c()
            }

            var i = t.settings, o, c;
            o = s[r.id], u.jpgresize && t.settings.resize && /\.(png|jpg|jpeg)$/i.test(r.name) ? f.call(t, r, t.settings.resize, /\.png$/i.test(r.name) ? "image/png" : "image/jpeg", function (e) {
                e.success ? (r.size = e.data.length, p(e.data)) : u.chunks ? p(o) : a(o, p)
            }) : !u.chunks && u.jpgresize ? a(o, p) : p(o)
        }), r.bind("Destroy", function (e) {
            var r, i, s = t.body, o = {inputContainer: e.id + "_html5_container", inputFile: e.id + "_html5", browseButton: e.settings.browse_button, dropElm: e.settings.drop_element};
            for (r in o)i = t.getElementById(o[r]), i && n.removeAllEvents(i, e.id);
            n.removeAllEvents(t.body, e.id), e.settings.container && (s = t.getElementById(e.settings.container)), s.removeChild(t.getElementById(o.inputContainer))
        }), i({success: !0})
    }})
}(window, document, plupload), function (e, t, n) {
    function i(e) {
        return e
    }

    function s(e) {
        return decodeURIComponent(e.replace(r, " "))
    }

    var r = /\+/g, o = e.cookie = function (r, u, a) {
        if (u !== n) {
            a = e.extend({}, o.defaults, a), u === null && (a.expires = -1);
            if (typeof a.expires == "number") {
                var f = a.expires, l = a.expires = new Date;
                l.setDate(l.getDate() + f)
            }
            return u = o.json ? JSON.stringify(u) : String(u), t.cookie = [encodeURIComponent(r), "=", o.raw ? u : encodeURIComponent(u), a.expires ? "; expires=" + a.expires.toUTCString() : "", a.path ? "; path=" + a.path : "", a.domain ? "; domain=" + a.domain : "", a.secure ? "; secure" : ""].join("")
        }
        var c = o.raw ? i : s, h = t.cookie.split("; ");
        for (var p = 0, d = h.length; p < d; p++) {
            var v = h[p].split("=");
            if (c(v.shift()) === r) {
                var m = c(v.join("="));
                return o.json ? JSON.parse(m) : m
            }
        }
        return null
    };
    o.defaults = {}, e.removeCookie = function (t, n) {
        return e.cookie(t) !== null ? (e.cookie(t, null, n), !0) : !1
    }
}(jQuery, document), function () {
}.call(this), function () {
}.call(this);
var featured = undefined;
(function () {
}).call(this), function () {
}.call(this), function () {
}.call(this), function () {
}.call(this), function () {
}.call(this), function () {
}.call(this), function () {
}.call(this), !function (e) {
    "use strict";
    function r() {
        e(t).parent().removeClass("open")
    }

    var t = '[data-toggle="dropdown"]', n = function (t) {
        var n = e(t).on("click.dropdown.data-api", this.toggle);
        e("html").on("click.dropdown.data-api", function () {
            n.parent().removeClass("open")
        })
    };
    n.prototype = {constructor: n, toggle: function (t) {
        var n = e(this), i, s, o;
        if (n.is(".disabled, :disabled"))return;
        return s = n.attr("data-target"), s || (s = n.attr("href"), s = s && s.replace(/.*(?=#[^\s]*$)/, "")), i = e(s), i.length || (i = n.parent()), o = i.hasClass("open"), r(), o || i.toggleClass("open"), !1
    }}, e.fn.dropdown = function (t) {
        return this.each(function () {
            var r = e(this), i = r.data("dropdown");
            i || r.data("dropdown", i = new n(this)), typeof t == "string" && i[t].call(r)
        })
    }, e.fn.dropdown.Constructor = n, e(function () {
        e("html").on("click.dropdown.data-api", r), e("body").on("click.dropdown", ".dropdown form",function (e) {
            e.stopPropagation()
        }).on("click.dropdown.data-api", t, n.prototype.toggle)
    })
}(window.jQuery), !function (e) {
    "use strict";
    var t = function (e, t) {
        this.init("tooltip", e, t)
    };
    t.prototype = {constructor: t, init: function (t, n, r) {
        var i, s;
        this.type = t, this.$element = e(n), this.options = this.getOptions(r), this.enabled = !0, this.options.trigger != "manual" && (i = this.options.trigger == "hover" ? "mouseenter" : "focus", s = this.options.trigger == "hover" ? "mouseleave" : "blur", this.$element.on(i, this.options.selector, e.proxy(this.enter, this)), this.$element.on(s, this.options.selector, e.proxy(this.leave, this))), this.options.selector ? this._options = e.extend({}, this.options, {trigger: "manual", selector: ""}) : this.fixTitle()
    }, getOptions: function (t) {
        return t = e.extend({}, e.fn[this.type].defaults, t, this.$element.data()), t.delay && typeof t.delay == "number" && (t.delay = {show: t.delay, hide: t.delay}), t
    }, enter: function (t) {
        var n = e(t.currentTarget)[this.type](this._options).data(this.type);
        if (!n.options.delay || !n.options.delay.show)return n.show();
        clearTimeout(this.timeout), n.hoverState = "in", this.timeout = setTimeout(function () {
            n.hoverState == "in" && n.show()
        }, n.options.delay.show)
    }, leave: function (t) {
        var n = e(t.currentTarget)[this.type](this._options).data(this.type);
        if (!n.options.delay || !n.options.delay.hide)return n.hide();
        clearTimeout(this.timeout), n.hoverState = "out", this.timeout = setTimeout(function () {
            n.hoverState == "out" && n.hide()
        }, n.options.delay.hide)
    }, show: function () {
        var e, t, n, r, i, s, o;
        if (this.hasContent() && this.enabled) {
            e = this.tip(), this.setContent(), this.options.animation && e.addClass("fade"), s = typeof this.options.placement == "function" ? this.options.placement.call(this, e[0], this.$element[0]) : this.options.placement, t = /in/.test(s), e.remove().css({top: 0, left: 0, display: "block"}).appendTo(t ? this.$element : document.body), n = this.getPosition(t), r = e[0].offsetWidth, i = e[0].offsetHeight;
            switch (t ? s.split(" ")[1] : s) {
                case"bottom":
                    o = {top: n.top + n.height, left: n.left + n.width / 2 - r / 2};
                    break;
                case"top":
                    o = {top: n.top - i, left: n.left + n.width / 2 - r / 2};
                    break;
                case"left":
                    o = {top: n.top + n.height / 2 - i / 2, left: n.left - r};
                    break;
                case"right":
                    o = {top: n.top + n.height / 2 - i / 2, left: n.left + n.width}
            }
            e.css(o).addClass(s).addClass("in")
        }
    }, isHTML: function (e) {
        return typeof e != "string" || e.charAt(0) === "<" && e.charAt(e.length - 1) === ">" && e.length >= 3 || /^(?:[^<]*<[\w\W]+>[^>]*$)/.exec(e)
    }, setContent: function () {
        var e = this.tip(), t = this.getTitle();
        e.find(".tooltip-inner")[this.isHTML(t) ? "html" : "text"](t), e.removeClass("fade in top bottom left right")
    }, hide: function () {
        function r() {
            var t = setTimeout(function () {
                n.off(e.support.transition.end).remove()
            }, 500);
            n.one(e.support.transition.end, function () {
                clearTimeout(t), n.remove()
            })
        }

        var t = this, n = this.tip();
        n.removeClass("in"), e.support.transition && this.$tip.hasClass("fade") ? r() : n.remove()
    }, fixTitle: function () {
        var e = this.$element;
        (e.attr("title") || typeof e.attr("data-original-title") != "string") && e.attr("data-original-title", e.attr("title") || "").removeAttr("title")
    }, hasContent: function () {
        return this.getTitle()
    }, getPosition: function (t) {
        return e.extend({}, t ? {top: 0, left: 0} : this.$element.offset(), {width: this.$element[0].offsetWidth, height: this.$element[0].offsetHeight})
    }, getTitle: function () {
        var e, t = this.$element, n = this.options;
        return e = t.attr("data-original-title") || (typeof n.title == "function" ? n.title.call(t[0]) : n.title), e
    }, tip: function () {
        return this.$tip = this.$tip || e(this.options.template)
    }, validate: function () {
        this.$element[0].parentNode || (this.hide(), this.$element = null, this.options = null)
    }, enable: function () {
        this.enabled = !0
    }, disable: function () {
        this.enabled = !1
    }, toggleEnabled: function () {
        this.enabled = !this.enabled
    }, toggle: function () {
        this[this.tip().hasClass("in") ? "hide" : "show"]()
    }}, e.fn.tooltip = function (n) {
        return this.each(function () {
            var r = e(this), i = r.data("tooltip"), s = typeof n == "object" && n;
            i || r.data("tooltip", i = new t(this, s)), typeof n == "string" && i[n]()
        })
    }, e.fn.tooltip.Constructor = t, e.fn.tooltip.defaults = {animation: !0, placement: "top", selector: !1, template: '<div class="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>', trigger: "hover", title: "", delay: 0}
}(window.jQuery), !function (e) {
    "use strict";
    var t = function (e, t) {
        this.init("popover", e, t)
    };
    t.prototype = e.extend({}, e.fn.tooltip.Constructor.prototype, {constructor: t, setContent: function () {
        var e = this.tip(), t = this.getTitle(), n = this.getContent();
        e.find(".popover-title")[this.isHTML(t) ? "html" : "text"](t), e.find(".popover-content > *")[this.isHTML(n) ? "html" : "text"](n), e.removeClass("fade top bottom left right in")
    }, hasContent: function () {
        return this.getTitle() || this.getContent()
    }, getContent: function () {
        var e, t = this.$element, n = this.options;
        return e = t.attr("data-content") || (typeof n.content == "function" ? n.content.call(t[0]) : n.content), e
    }, tip: function () {
        return this.$tip || (this.$tip = e(this.options.template)), this.$tip
    }}), e.fn.popover = function (n) {
        return this.each(function () {
            var r = e(this), i = r.data("popover"), s = typeof n == "object" && n;
            i || r.data("popover", i = new t(this, s)), typeof n == "string" && i[n]()
        })
    }, e.fn.popover.Constructor = t, e.fn.popover.defaults = e.extend({}, e.fn.tooltip.defaults, {placement: "right", content: "", template: '<div class="popover"><div class="arrow"></div><div class="popover-inner"><h3 class="popover-title"></h3><div class="popover-content"><p></p></div></div></div>'})
}(window.jQuery), !function (e) {
    "use strict";
    var t = function (t, n) {
        this.options = e.extend({}, e.fn.affix.defaults, n), this.$window = e(window).on("scroll.affix.data-api", e.proxy(this.checkPosition, this)).on("click.affix.data-api", e.proxy(function () {
            setTimeout(e.proxy(this.checkPosition, this), 1)
        }, this)), this.$element = e(t), this.checkPosition()
    };
    t.prototype.checkPosition = function () {
        if (!this.$element.is(":visible"))return;
        var t = e(document).height(), n = this.$window.scrollTop(), r = this.$element.offset(), i = this.options.offset, s = i.bottom, o = i.top, u = "affix affix-top affix-bottom", a;
        typeof i != "object" && (s = o = i), typeof o == "function" && (o = i.top()), typeof s == "function" && (s = i.bottom()), a = this.unpin != null && n + this.unpin <= r.top ? !1 : s != null && r.top + this.$element.height() >= t - s ? "bottom" : o != null && n <= o ? "top" : !1;
        if (this.affixed === a)return;
        this.affixed = a, this.unpin = a == "bottom" ? r.top - n : null, this.$element.removeClass(u).addClass("affix" + (a ? "-" + a : ""))
    }, e.fn.affix = function (n) {
        return this.each(function () {
            var r = e(this), i = r.data("affix"), s = typeof n == "object" && n;
            i || r.data("affix", i = new t(this, s)), typeof n == "string" && i[n]()
        })
    }, e.fn.affix.Constructor = t, e.fn.affix.defaults = {offset: 0}, e(window).on("load", function () {
        e('[data-spy="affix"]').each(function () {
            var t = e(this), n = t.data();
            n.offset = n.offset || {}, n.offsetBottom && (n.offset.bottom = n.offsetBottom), n.offsetTop && (n.offset.top = n.offsetTop), t.affix(n)
        })
    })
}(window.jQuery), !function (e) {
    "use strict";
    function t(t, n) {
        var r = e.proxy(this.process, this), i = e(t).is("body") ? e(window) : e(t), s;
        this.options = e.extend({}, e.fn.scrollspy.defaults, n), this.$scrollElement = i.on("scroll.scroll.data-api", r), this.selector = (this.options.target || (s = e(t).attr("href")) && s.replace(/.*(?=#[^\s]+$)/, "") || "") + " .nav li > a", this.$body = e("body"), this.refresh(), this.process()
    }

    t.prototype = {constructor: t, refresh: function () {
        var t = this, n;
        this.offsets = e([]), this.targets = e([]), n = this.$body.find(this.selector).map(function () {
            var t = e(this), n = t.data("target") || t.attr("href"), r = /^#\w/.test(n) && e(n);
            return r && n.length && [
                [r.offset().top, n]
            ] || null
        }).sort(function (e, t) {
            return e[0] - t[0]
        }).each(function () {
            t.offsets.push(this[0]), t.targets.push(this[1])
        })
    }, process: function () {
        var e = this.$scrollElement.scrollTop() + this.options.offset, t = this.$scrollElement[0].scrollHeight || this.$body[0].scrollHeight, n = t - this.$scrollElement.height(), r = this.offsets, i = this.targets, s = this.activeTarget, o;
        if (e >= n)return s != (o = i.last()[0]) && this.activate(o);
        for (o = r.length; o--;)s != i[o] && e >= r[o] && (!r[o + 1] || e <= r[o + 1]) && this.activate(i[o])
    }, activate: function (t) {
        var n, r;
        this.activeTarget = t, e(this.selector).parent(".active").removeClass("active"), r = this.selector + '[data-target="' + t + '"],' + this.selector + '[href="' + t + '"]', n = e(r).parent("li").addClass("active"), n.parent(".dropdown-menu").length && (n = n.closest("li.dropdown").addClass("active")), n.trigger("activate")
    }}, e.fn.scrollspy = function (n) {
        return this.each(function () {
            var r = e(this), i = r.data("scrollspy"), s = typeof n == "object" && n;
            i || r.data("scrollspy", i = new t(this, s)), typeof n == "string" && i[n]()
        })
    }, e.fn.scrollspy.Constructor = t, e.fn.scrollspy.defaults = {offset: 10}, e(window).on("load", function () {
        e('[data-spy="scroll"]').each(function () {
            var t = e(this);
            t.scrollspy(t.data())
        })
    })
}(window.jQuery), function () {
}.call(this);
var comment_form, holding, last_popover = undefined, flag_link;
css_browser_selector(navigator.userAgent), function () {
}.call(this), function () {
}.call(this), document.createElement("canvas").getContext || function () {
    function f() {
        return this.context_ || (this.context_ = new I(this))
    }

    function c(e, t, n) {
        var r = l.call(arguments, 2);
        return function () {
            return e.apply(t, r.concat(l.call(arguments)))
        }
    }

    function h(e) {
        return String(e).replace(/&/g, "&amp;").replace(/"/g, "&quot;")
    }

    function p(e, t, n) {
        e.namespaces[t] || e.namespaces.add(t, n, "#default#VML")
    }

    function d(e) {
        p(e, "g_vml_", "urn:schemas-microsoft-com:vml"), p(e, "g_o_", "urn:schemas-microsoft-com:office:office");
        if (!e.styleSheets.ex_canvas_) {
            var t = e.createStyleSheet();
            t.owningElement.id = "ex_canvas_", t.cssText = "canvas{display:inline-block;overflow:hidden;text-align:left;width:300px;height:150px}"
        }
    }

    function m(e) {
        var t = e.srcElement;
        switch (e.propertyName) {
            case"width":
                t.getContext().clearRect(), t.style.width = t.attributes.width.nodeValue + "px", t.firstChild.style.width = t.clientWidth + "px";
                break;
            case"height":
                t.getContext().clearRect(), t.style.height = t.attributes.height.nodeValue + "px", t.firstChild.style.height = t.clientHeight + "px"
        }
    }

    function g(e) {
        var t = e.srcElement;
        t.firstChild && (t.firstChild.style.width = t.clientWidth + "px", t.firstChild.style.height = t.clientHeight + "px")
    }

    function E() {
        return[
            [1, 0, 0],
            [0, 1, 0],
            [0, 0, 1]
        ]
    }

    function S(e, t) {
        var n = E();
        for (var r = 0; r < 3; r++)for (var i = 0; i < 3; i++) {
            var s = 0;
            for (var o = 0; o < 3; o++)s += e[r][o] * t[o][i];
            n[r][i] = s
        }
        return n
    }

    function x(e, t) {
        t.fillStyle = e.fillStyle, t.lineCap = e.lineCap, t.lineJoin = e.lineJoin, t.lineWidth = e.lineWidth, t.miterLimit = e.miterLimit, t.shadowBlur = e.shadowBlur, t.shadowColor = e.shadowColor, t.shadowOffsetX = e.shadowOffsetX, t.shadowOffsetY = e.shadowOffsetY, t.strokeStyle = e.strokeStyle, t.globalAlpha = e.globalAlpha, t.font = e.font, t.textAlign = e.textAlign, t.textBaseline = e.textBaseline, t.arcScaleX_ = e.arcScaleX_, t.arcScaleY_ = e.arcScaleY_, t.lineScale_ = e.lineScale_
    }

    function N(e) {
        var t = e.indexOf("(", 3), n = e.indexOf(")", t + 1), r = e.substring(t + 1, n).split(",");
        if (r.length != 4 || e.charAt(3) != "a")r[3] = 1;
        return r
    }

    function C(e) {
        return parseFloat(e) / 100
    }

    function k(e, t, n) {
        return Math.min(n, Math.max(t, e))
    }

    function L(e) {
        var t, n, r, i, s, o;
        i = parseFloat(e[0]) / 360 % 360, i < 0 && i++, s = k(C(e[1]), 0, 1), o = k(C(e[2]), 0, 1);
        if (s == 0)t = n = r = o; else {
            var u = o < .5 ? o * (1 + s) : o + s - o * s, a = 2 * o - u;
            t = A(a, u, i + 1 / 3), n = A(a, u, i), r = A(a, u, i - 1 / 3)
        }
        return"#" + y[Math.floor(t * 255)] + y[Math.floor(n * 255)] + y[Math.floor(r * 255)]
    }

    function A(e, t, n) {
        return n < 0 && n++, n > 1 && n--, 6 * n < 1 ? e + (t - e) * 6 * n : 2 * n < 1 ? t : 3 * n < 2 ? e + (t - e) * (2 / 3 - n) * 6 : e
    }

    function M(e) {
        if (e in O)return O[e];
        var t, n = 1;
        e = String(e);
        if (e.charAt(0) == "#")t = e; else if (/^rgb/.test(e)) {
            var r = N(e), t = "#", i;
            for (var s = 0; s < 3; s++)r[s].indexOf("%") != -1 ? i = Math.floor(C(r[s]) * 255) : i = +r[s], t += y[k(i, 0, 255)];
            n = +r[3]
        } else if (/^hsl/.test(e)) {
            var r = N(e);
            t = L(r), n = r[3]
        } else t = T[e] || e;
        return O[e] = {color: t, alpha: n}
    }

    function P(e) {
        if (D[e])return D[e];
        var t = document.createElement("div"), n = t.style;
        try {
            n.font = e
        } catch (r) {
        }
        return D[e] = {style: n.fontStyle || _.style, variant: n.fontVariant || _.variant, weight: n.fontWeight || _.weight, size: n.fontSize || _.size, family: n.fontFamily || _.family}
    }

    function H(e, t) {
        var n = {};
        for (var r in e)n[r] = e[r];
        var i = parseFloat(t.currentStyle.fontSize), s = parseFloat(e.size);
        return typeof e.size == "number" ? n.size = e.size : e.size.indexOf("px") != -1 ? n.size = s : e.size.indexOf("em") != -1 ? n.size = i * s : e.size.indexOf("%") != -1 ? n.size = i / 100 * s : e.size.indexOf("pt") != -1 ? n.size = s / .75 : n.size = i, n.size *= .981, n
    }

    function B(e) {
        return e.style + " " + e.variant + " " + e.weight + " " + e.size + "px " + e.family
    }

    function F(e) {
        return j[e] || "square"
    }

    function I(e) {
        this.m_ = E(), this.mStack_ = [], this.aStack_ = [], this.currentPath_ = [], this.strokeStyle = "#000", this.fillStyle = "#000", this.lineWidth = 1, this.lineJoin = "miter", this.lineCap = "butt", this.miterLimit = o * 1, this.globalAlpha = 1, this.font = "10px sans-serif", this.textAlign = "left", this.textBaseline = "alphabetic", this.canvas = e;
        var t = "width:" + e.clientWidth + "px;height:" + e.clientHeight + "px;overflow:hidden;position:absolute", n = e.ownerDocument.createElement("div");
        n.style.cssText = t, e.appendChild(n);
        var r = n.cloneNode(!1);
        r.style.backgroundColor = "red", r.style.filter = "alpha(opacity=0)", e.appendChild(r), this.element_ = n, this.arcScaleX_ = 1, this.arcScaleY_ = 1, this.lineScale_ = 1
    }

    function R(e, t, n, r) {
        e.currentPath_.push({type: "bezierCurveTo", cp1x: t.x, cp1y: t.y, cp2x: n.x, cp2y: n.y, x: r.x, y: r.y}), e.currentX_ = r.x, e.currentY_ = r.y
    }

    function U(e, t) {
        var n = M(e.strokeStyle), r = n.color, i = n.alpha * e.globalAlpha, s = e.lineScale_ * e.lineWidth;
        s < 1 && (i *= s), t.push("<g_vml_:stroke", ' opacity="', i, '"', ' joinstyle="', e.lineJoin, '"', ' miterlimit="', e.miterLimit, '"', ' endcap="', F(e.lineCap), '"', ' weight="', s, 'px"', ' color="', r, '" />')
    }

    function z(t, n, r, i) {
        var s = t.fillStyle, u = t.arcScaleX_, a = t.arcScaleY_, f = i.x - r.x, l = i.y - r.y;
        if (s instanceof $) {
            var c = 0, h = {x: 0, y: 0}, p = 0, d = 1;
            if (s.type_ == "gradient") {
                var v = s.x0_ / u, m = s.y0_ / a, g = s.x1_ / u, y = s.y1_ / a, b = W(t, v, m), w = W(t, g, y), E = w.x - b.x, S = w.y - b.y;
                c = Math.atan2(E, S) * 180 / Math.PI, c < 0 && (c += 360), c < 1e-6 && (c = 0)
            } else {
                var b = W(t, s.x0_, s.y0_);
                h = {x: (b.x - r.x) / f, y: (b.y - r.y) / l}, f /= u * o, l /= a * o;
                var x = e.max(f, l);
                p = 2 * s.r0_ / x, d = 2 * s.r1_ / x - p
            }
            var T = s.colors_;
            T.sort(function (e, t) {
                return e.offset - t.offset
            });
            var N = T.length, C = T[0].color, k = T[N - 1].color, L = T[0].alpha * t.globalAlpha, A = T[N - 1].alpha * t.globalAlpha, O = [];
            for (var _ = 0; _ < N; _++) {
                var D = T[_];
                O.push(D.offset * d + p + " " + D.color)
            }
            n.push('<g_vml_:fill type="', s.type_, '"', ' method="none" focus="100%"', ' color="', C, '"', ' color2="', k, '"', ' colors="', O.join(","), '"', ' opacity="', A, '"', ' g_o_:opacity2="', L, '"', ' angle="', c, '"', ' focusposition="', h.x, ",", h.y, '" />')
        } else if (s instanceof J) {
            if (f && l) {
                var P = -r.x, H = -r.y;
                n.push("<g_vml_:fill", ' position="', P / f * u * u, ",", H / l * a * a, '"', ' type="tile"', ' src="', s.src_, '" />')
            }
        } else {
            var B = M(t.fillStyle), j = B.color, F = B.alpha * t.globalAlpha;
            n.push('<g_vml_:fill color="', j, '" opacity="', F, '" />')
        }
    }

    function W(e, t, n) {
        var r = e.m_;
        return{x: o * (t * r[0][0] + n * r[1][0] + r[2][0]) - u, y: o * (t * r[0][1] + n * r[1][1] + r[2][1]) - u}
    }

    function X(e) {
        return isFinite(e[0][0]) && isFinite(e[0][1]) && isFinite(e[1][0]) && isFinite(e[1][1]) && isFinite(e[2][0]) && isFinite(e[2][1])
    }

    function V(e, t, n) {
        if (!X(t))return;
        e.m_ = t;
        if (n) {
            var r = t[0][0] * t[1][1] - t[0][1] * t[1][0];
            e.lineScale_ = s(i(r))
        }
    }

    function $(e) {
        this.type_ = e, this.x0_ = 0, this.y0_ = 0, this.r0_ = 0, this.x1_ = 0, this.y1_ = 0, this.r1_ = 0, this.colors_ = []
    }

    function J(e, t) {
        Q(e);
        switch (t) {
            case"repeat":
            case null:
            case"":
                this.repetition_ = "repeat";
                break;
            case"repeat-x":
            case"repeat-y":
            case"no-repeat":
                this.repetition_ = t;
                break;
            default:
                K("SYNTAX_ERR")
        }
        this.src_ = e.src, this.width_ = e.width, this.height_ = e.height
    }

    function K(e) {
        throw new G(e)
    }

    function Q(e) {
        (!e || e.nodeType != 1 || e.tagName != "IMG") && K("TYPE_MISMATCH_ERR"), e.readyState != "complete" && K("INVALID_STATE_ERR")
    }

    function G(e) {
        this.code = this[e], this.message = e + ": DOM Exception " + this.code
    }

    var e = Math, t = e.round, n = e.sin, r = e.cos, i = e.abs, s = e.sqrt, o = 10, u = o / 2, a = +navigator.userAgent.match(/MSIE ([\d.]+)?/)[1], l = Array.prototype.slice;
    d(document);
    var v = {init: function (e) {
        var t = e || document;
        t.createElement("canvas"), t.attachEvent("onreadystatechange", c(this.init_, this, t))
    }, init_: function (e) {
        var t = e.getElementsByTagName("canvas");
        for (var n = 0; n < t.length; n++)this.initElement(t[n])
    }, initElement: function (e) {
        if (!e.getContext) {
            e.getContext = f, d(e.ownerDocument), e.innerHTML = "", e.attachEvent("onpropertychange", m), e.attachEvent("onresize", g);
            var t = e.attributes;
            t.width && t.width.specified ? e.style.width = t.width.nodeValue + "px" : e.width = e.clientWidth, t.height && t.height.specified ? e.style.height = t.height.nodeValue + "px" : e.height = e.clientHeight
        }
        return e
    }};
    v.init();
    var y = [];
    for (var b = 0; b < 16; b++)for (var w = 0; w < 16; w++)y[b * 16 + w] = b.toString(16) + w.toString(16);
    var T = {aliceblue: "#F0F8FF", antiquewhite: "#FAEBD7", aquamarine: "#7FFFD4", azure: "#F0FFFF", beige: "#F5F5DC", bisque: "#FFE4C4", black: "#000000", blanchedalmond: "#FFEBCD", blueviolet: "#8A2BE2", brown: "#A52A2A", burlywood: "#DEB887", cadetblue: "#5F9EA0", chartreuse: "#7FFF00", chocolate: "#D2691E", coral: "#FF7F50", cornflowerblue: "#6495ED", cornsilk: "#FFF8DC", crimson: "#DC143C", cyan: "#00FFFF", darkblue: "#00008B", darkcyan: "#008B8B", darkgoldenrod: "#B8860B", darkgray: "#A9A9A9", darkgreen: "#006400", darkgrey: "#A9A9A9", darkkhaki: "#BDB76B", darkmagenta: "#8B008B", darkolivegreen: "#556B2F", darkorange: "#FF8C00", darkorchid: "#9932CC", darkred: "#8B0000", darksalmon: "#E9967A", darkseagreen: "#8FBC8F", darkslateblue: "#483D8B", darkslategray: "#2F4F4F", darkslategrey: "#2F4F4F", darkturquoise: "#00CED1", darkviolet: "#9400D3", deeppink: "#FF1493", deepskyblue: "#00BFFF", dimgray: "#696969", dimgrey: "#696969", dodgerblue: "#1E90FF", firebrick: "#B22222", floralwhite: "#FFFAF0", forestgreen: "#228B22", gainsboro: "#DCDCDC", ghostwhite: "#F8F8FF", gold: "#FFD700", goldenrod: "#DAA520", grey: "#808080", greenyellow: "#ADFF2F", honeydew: "#F0FFF0", hotpink: "#FF69B4", indianred: "#CD5C5C", indigo: "#4B0082", ivory: "#FFFFF0", khaki: "#F0E68C", lavender: "#E6E6FA", lavenderblush: "#FFF0F5", lawngreen: "#7CFC00", lemonchiffon: "#FFFACD", lightblue: "#ADD8E6", lightcoral: "#F08080", lightcyan: "#E0FFFF", lightgoldenrodyellow: "#FAFAD2", lightgreen: "#90EE90", lightgrey: "#D3D3D3", lightpink: "#FFB6C1", lightsalmon: "#FFA07A", lightseagreen: "#20B2AA", lightskyblue: "#87CEFA", lightslategray: "#778899", lightslategrey: "#778899", lightsteelblue: "#B0C4DE", lightyellow: "#FFFFE0", limegreen: "#32CD32", linen: "#FAF0E6", magenta: "#FF00FF", mediumaquamarine: "#66CDAA", mediumblue: "#0000CD", mediumorchid: "#BA55D3", mediumpurple: "#9370DB", mediumseagreen: "#3CB371", mediumslateblue: "#7B68EE", mediumspringgreen: "#00FA9A", mediumturquoise: "#48D1CC", mediumvioletred: "#C71585", midnightblue: "#191970", mintcream: "#F5FFFA", mistyrose: "#FFE4E1", moccasin: "#FFE4B5", navajowhite: "#FFDEAD", oldlace: "#FDF5E6", olivedrab: "#6B8E23", orange: "#FFA500", orangered: "#FF4500", orchid: "#DA70D6", palegoldenrod: "#EEE8AA", palegreen: "#98FB98", paleturquoise: "#AFEEEE", palevioletred: "#DB7093", papayawhip: "#FFEFD5", peachpuff: "#FFDAB9", peru: "#CD853F", pink: "#FFC0CB", plum: "#DDA0DD", powderblue: "#B0E0E6", rosybrown: "#BC8F8F", royalblue: "#4169E1", saddlebrown: "#8B4513", salmon: "#FA8072", sandybrown: "#F4A460", seagreen: "#2E8B57", seashell: "#FFF5EE", sienna: "#A0522D", skyblue: "#87CEEB", slateblue: "#6A5ACD", slategray: "#708090", slategrey: "#708090", snow: "#FFFAFA", springgreen: "#00FF7F", steelblue: "#4682B4", tan: "#D2B48C", thistle: "#D8BFD8", tomato: "#FF6347", turquoise: "#40E0D0", violet: "#EE82EE", wheat: "#F5DEB3", whitesmoke: "#F5F5F5", yellowgreen: "#9ACD32"}, O = {}, _ = {style: "normal", variant: "normal", weight: "normal", size: 10, family: "sans-serif"}, D = {}, j = {butt: "flat", round: "round"}, q = I.prototype;
    q.clearRect = function () {
        this.textMeasureEl_ && (this.textMeasureEl_.removeNode(!0), this.textMeasureEl_ = null), this.element_.innerHTML = ""
    }, q.beginPath = function () {
        this.currentPath_ = []
    }, q.moveTo = function (e, t) {
        var n = W(this, e, t);
        this.currentPath_.push({type: "moveTo", x: n.x, y: n.y}), this.currentX_ = n.x, this.currentY_ = n.y
    }, q.lineTo = function (e, t) {
        var n = W(this, e, t);
        this.currentPath_.push({type: "lineTo", x: n.x, y: n.y}), this.currentX_ = n.x, this.currentY_ = n.y
    }, q.bezierCurveTo = function (e, t, n, r, i, s) {
        var o = W(this, i, s), u = W(this, e, t), a = W(this, n, r);
        R(this, u, a, o)
    }, q.quadraticCurveTo = function (e, t, n, r) {
        var i = W(this, e, t), s = W(this, n, r), o = {x: this.currentX_ + 2 / 3 * (i.x - this.currentX_), y: this.currentY_ + 2 / 3 * (i.y - this.currentY_)}, u = {x: o.x + (s.x - this.currentX_) / 3, y: o.y + (s.y - this.currentY_) / 3};
        R(this, o, u, s)
    }, q.arc = function (e, t, i, s, a, f) {
        i *= o;
        var l = f ? "at" : "wa", c = e + r(s) * i - u, h = t + n(s) * i - u, p = e + r(a) * i - u, d = t + n(a) * i - u;
        c == p && !f && (c += .125);
        var v = W(this, e, t), m = W(this, c, h), g = W(this, p, d);
        this.currentPath_.push({type: l, x: v.x, y: v.y, radius: i, xStart: m.x, yStart: m.y, xEnd: g.x, yEnd: g.y})
    }, q.rect = function (e, t, n, r) {
        this.moveTo(e, t), this.lineTo(e + n, t), this.lineTo(e + n, t + r), this.lineTo(e, t + r), this.closePath()
    }, q.strokeRect = function (e, t, n, r) {
        var i = this.currentPath_;
        this.beginPath(), this.moveTo(e, t), this.lineTo(e + n, t), this.lineTo(e + n, t + r), this.lineTo(e, t + r), this.closePath(), this.stroke(), this.currentPath_ = i
    }, q.fillRect = function (e, t, n, r) {
        var i = this.currentPath_;
        this.beginPath(), this.moveTo(e, t), this.lineTo(e + n, t), this.lineTo(e + n, t + r), this.lineTo(e, t + r), this.closePath(), this.fill(), this.currentPath_ = i
    }, q.createLinearGradient = function (e, t, n, r) {
        var i = new $("gradient");
        return i.x0_ = e, i.y0_ = t, i.x1_ = n, i.y1_ = r, i
    }, q.createRadialGradient = function (e, t, n, r, i, s) {
        var o = new $("gradientradial");
        return o.x0_ = e, o.y0_ = t, o.r0_ = n, o.x1_ = r, o.y1_ = i, o.r1_ = s, o
    }, q.drawImage = function (n, r) {
        var i, s, u, a, f, l, c, h, p = n.runtimeStyle.width, d = n.runtimeStyle.height;
        n.runtimeStyle.width = "auto", n.runtimeStyle.height = "auto";
        var v = n.width, m = n.height;
        n.runtimeStyle.width = p, n.runtimeStyle.height = d;
        if (arguments.length == 3)i = arguments[1], s = arguments[2], f = l = 0, c = u = v, h = a = m; else if (arguments.length == 5)i = arguments[1], s = arguments[2], u = arguments[3], a = arguments[4], f = l = 0, c = v, h = m; else {
            if (arguments.length != 9)throw Error("Invalid number of arguments");
            f = arguments[1], l = arguments[2], c = arguments[3], h = arguments[4], i = arguments[5], s = arguments[6], u = arguments[7], a = arguments[8]
        }
        var g = W(this, i, s), y = c / 2, b = h / 2, w = [], E = 10, S = 10;
        w.push(" <g_vml_:group", ' coordsize="', o * E, ",", o * S, '"', ' coordorigin="0,0"', ' style="width:', E, "px;height:", S, "px;position:absolute;");
        if (this.m_[0][0] != 1 || this.m_[0][1] || this.m_[1][1] != 1 || this.m_[1][0]) {
            var x = [];
            x.push("M11=", this.m_[0][0], ",", "M12=", this.m_[1][0], ",", "M21=", this.m_[0][1], ",", "M22=", this.m_[1][1], ",", "Dx=", t(g.x / o), ",", "Dy=", t(g.y / o), "");
            var T = g, N = W(this, i + u, s), C = W(this, i, s + a), k = W(this, i + u, s + a);
            T.x = e.max(T.x, N.x, C.x, k.x), T.y = e.max(T.y, N.y, C.y, k.y), w.push("padding:0 ", t(T.x / o), "px ", t(T.y / o), "px 0;filter:progid:DXImageTransform.Microsoft.Matrix(", x.join(""), ", sizingmethod='clip');")
        } else w.push("top:", t(g.y / o), "px;left:", t(g.x / o), "px;");
        w.push(' ">', '<g_vml_:image src="', n.src, '"', ' style="width:', o * u, "px;", " height:", o * a, 'px"', ' cropleft="', f / v, '"', ' croptop="', l / m, '"', ' cropright="', (v - f - c) / v, '"', ' cropbottom="', (m - l - h) / m, '"', " />", "</g_vml_:group>"), this.element_.insertAdjacentHTML("BeforeEnd", w.join(""))
    }, q.stroke = function (e) {
        var n = 10, r = 10, i = 5e3, s = {x: null, y: null}, u = {x: null, y: null};
        for (var a = 0; a < this.currentPath_.length; a += i) {
            var f = [], l = !1;
            f.push("<g_vml_:shape", ' filled="', !!e, '"', ' style="position:absolute;width:', n, "px;height:", r, 'px;"', ' coordorigin="0,0"', ' coordsize="', o * n, ",", o * r, '"', ' stroked="', !e, '"', ' path="');
            var c = !1;
            for (var h = a; h < Math.min(a + i, this.currentPath_.length); h++) {
                h % i == 0 && h > 0 && f.push(" m ", t(this.currentPath_[h - 1].x), ",", t(this.currentPath_[h - 1].y));
                var p = this.currentPath_[h], d;
                switch (p.type) {
                    case"moveTo":
                        d = p, f.push(" m ", t(p.x), ",", t(p.y));
                        break;
                    case"lineTo":
                        f.push(" l ", t(p.x), ",", t(p.y));
                        break;
                    case"close":
                        f.push(" x "), p = null;
                        break;
                    case"bezierCurveTo":
                        f.push(" c ", t(p.cp1x), ",", t(p.cp1y), ",", t(p.cp2x), ",", t(p.cp2y), ",", t(p.x), ",", t(p.y));
                        break;
                    case"at":
                    case"wa":
                        f.push(" ", p.type, " ", t(p.x - this.arcScaleX_ * p.radius), ",", t(p.y - this.arcScaleY_ * p.radius), " ", t(p.x + this.arcScaleX_ * p.radius), ",", t(p.y + this.arcScaleY_ * p.radius), " ", t(p.xStart), ",", t(p.yStart), " ", t(p.xEnd), ",", t(p.yEnd))
                }
                if (p) {
                    if (s.x == null || p.x < s.x)s.x = p.x;
                    if (u.x == null || p.x > u.x)u.x = p.x;
                    if (s.y == null || p.y < s.y)s.y = p.y;
                    if (u
                        .y == null || p.y > u.y)u.y = p.y
                }
            }
            f.push(' ">'), e ? z(this, f, s, u) : U(this, f), f.push("</g_vml_:shape>"), this.element_.insertAdjacentHTML("beforeEnd", f.join(""))
        }
    }, q.fill = function () {
        this.stroke(!0)
    }, q.closePath = function () {
        this.currentPath_.push({type: "close"})
    }, q.save = function () {
        var e = {};
        x(this, e), this.aStack_.push(e), this.mStack_.push(this.m_), this.m_ = S(E(), this.m_)
    }, q.restore = function () {
        this.aStack_.length && (x(this.aStack_.pop(), this), this.m_ = this.mStack_.pop())
    }, q.translate = function (e, t) {
        var n = [
            [1, 0, 0],
            [0, 1, 0],
            [e, t, 1]
        ];
        V(this, S(n, this.m_), !1)
    }, q.rotate = function (e) {
        var t = r(e), i = n(e), s = [
            [t, i, 0],
            [-i, t, 0],
            [0, 0, 1]
        ];
        V(this, S(s, this.m_), !1)
    }, q.scale = function (e, t) {
        this.arcScaleX_ *= e, this.arcScaleY_ *= t;
        var n = [
            [e, 0, 0],
            [0, t, 0],
            [0, 0, 1]
        ];
        V(this, S(n, this.m_), !0)
    }, q.transform = function (e, t, n, r, i, s) {
        var o = [
            [e, t, 0],
            [n, r, 0],
            [i, s, 1]
        ];
        V(this, S(o, this.m_), !0)
    }, q.setTransform = function (e, t, n, r, i, s) {
        var o = [
            [e, t, 0],
            [n, r, 0],
            [i, s, 1]
        ];
        V(this, o, !0)
    }, q.drawText_ = function (e, n, r, i, s) {
        var u = this.m_, a = 1e3, f = 0, l = a, c = {x: 0, y: 0}, p = [], d = H(P(this.font), this.element_), v = B(d), m = this.element_.currentStyle, g = this.textAlign.toLowerCase();
        switch (g) {
            case"left":
            case"center":
            case"right":
                break;
            case"end":
                g = m.direction == "ltr" ? "right" : "left";
                break;
            case"start":
                g = m.direction == "rtl" ? "right" : "left";
                break;
            default:
                g = "left"
        }
        switch (this.textBaseline) {
            case"hanging":
            case"top":
                c.y = d.size / 1.75;
                break;
            case"middle":
                break;
            default:
            case null:
            case"alphabetic":
            case"ideographic":
            case"bottom":
                c.y = -d.size / 2.25
        }
        switch (g) {
            case"right":
                f = a, l = .05;
                break;
            case"center":
                f = l = a / 2
        }
        var y = W(this, n + c.x, r + c.y);
        p.push('<g_vml_:line from="', -f, ' 0" to="', l, ' 0.05" ', ' coordsize="100 100" coordorigin="0 0"', ' filled="', !s, '" stroked="', !!s, '" style="position:absolute;width:1px;height:1px;">'), s ? U(this, p) : z(this, p, {x: -f, y: 0}, {x: l, y: d.size});
        var b = u[0][0].toFixed(3) + "," + u[1][0].toFixed(3) + "," + u[0][1].toFixed(3) + "," + u[1][1].toFixed(3) + ",0,0", w = t(y.x / o) + "," + t(y.y / o);
        p.push('<g_vml_:skew on="t" matrix="', b, '" ', ' offset="', w, '" origin="', f, ' 0" />', '<g_vml_:path textpathok="true" />', '<g_vml_:textpath on="true" string="', h(e), '" style="v-text-align:', g, ";font:", h(v), '" /></g_vml_:line>'), this.element_.insertAdjacentHTML("beforeEnd", p.join(""))
    }, q.fillText = function (e, t, n, r) {
        this.drawText_(e, t, n, r, !1)
    }, q.strokeText = function (e, t, n, r) {
        this.drawText_(e, t, n, r, !0)
    }, q.measureText = function (e) {
        if (!this.textMeasureEl_) {
            var t = '<span style="position:absolute;top:-20000px;left:0;padding:0;margin:0;border:none;white-space:pre;"></span>';
            this.element_.insertAdjacentHTML("beforeEnd", t), this.textMeasureEl_ = this.element_.lastChild
        }
        var n = this.element_.ownerDocument;
        return this.textMeasureEl_.innerHTML = "", this.textMeasureEl_.style.font = this.font, this.textMeasureEl_.appendChild(n.createTextNode(e)), {width: this.textMeasureEl_.offsetWidth}
    }, q.clip = function () {
    }, q.arcTo = function () {
    }, q.createPattern = function (e, t) {
        return new J(e, t)
    }, $.prototype.addColorStop = function (e, t) {
        t = M(t), this.colors_.push({offset: e, color: t.color, alpha: t.alpha})
    };
    var Y = G.prototype = new Error;
    Y.INDEX_SIZE_ERR = 1, Y.DOMSTRING_SIZE_ERR = 2, Y.HIERARCHY_REQUEST_ERR = 3, Y.WRONG_DOCUMENT_ERR = 4, Y.INVALID_CHARACTER_ERR = 5, Y.NO_DATA_ALLOWED_ERR = 6, Y.NO_MODIFICATION_ALLOWED_ERR = 7, Y.NOT_FOUND_ERR = 8, Y.NOT_SUPPORTED_ERR = 9, Y.INUSE_ATTRIBUTE_ERR = 10, Y.INVALID_STATE_ERR = 11, Y.SYNTAX_ERR = 12, Y.INVALID_MODIFICATION_ERR = 13, Y.NAMESPACE_ERR = 14, Y.INVALID_ACCESS_ERR = 15, Y.VALIDATION_ERR = 16, Y.TYPE_MISMATCH_ERR = 17, G_vmlCanvasManager = v, CanvasRenderingContext2D = I, CanvasGradient = $, CanvasPattern = J, DOMException = G
}();
var reEscape = new RegExp("(\\" + ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"].join("|\\") + ")", "g"), suggestion_type = {apartment: "รายชื่อที่พัก", zone: "ทำเลที่พัก"};
(function (e, t) {
    function n(t, n) {
        var i = t.nodeName.toLowerCase();
        if ("area" === i) {
            var s = t.parentNode, o = s.name, u;
            return!t.href || !o || s.nodeName.toLowerCase() !== "map" ? !1 : (u = e("img[usemap=#" + o + "]")[0], !!u && r(u))
        }
        return(/input|select|textarea|button|object/.test(i) ? !t.disabled : "a" == i ? t.href || n : n) && r(t)
    }

    function r(t) {
        return!e(t).parents().andSelf().filter(function () {
            return e.curCSS(this, "visibility") === "hidden" || e.expr.filters.hidden(this)
        }).length
    }

    e.ui = e.ui || {};
    if (e.ui.version)return;
    e.extend(e.ui, {version: "1.8.24", keyCode: {ALT: 18, BACKSPACE: 8, CAPS_LOCK: 20, COMMA: 188, COMMAND: 91, COMMAND_LEFT: 91, COMMAND_RIGHT: 93, CONTROL: 17, DELETE: 46, DOWN: 40, END: 35, ENTER: 13, ESCAPE: 27, HOME: 36, INSERT: 45, LEFT: 37, MENU: 93, NUMPAD_ADD: 107, NUMPAD_DECIMAL: 110, NUMPAD_DIVIDE: 111, NUMPAD_ENTER: 108, NUMPAD_MULTIPLY: 106, NUMPAD_SUBTRACT: 109, PAGE_DOWN: 34, PAGE_UP: 33, PERIOD: 190, RIGHT: 39, SHIFT: 16, SPACE: 32, TAB: 9, UP: 38, WINDOWS: 91}}), e.fn.extend({propAttr: e.fn.prop || e.fn.attr, _focus: e.fn.focus, focus: function (t, n) {
        return typeof t == "number" ? this.each(function () {
            var r = this;
            setTimeout(function () {
                e(r).focus(), n && n.call(r)
            }, t)
        }) : this._focus.apply(this, arguments)
    }, scrollParent: function () {
        var t;
        return e.browser.msie && /(static|relative)/.test(this.css("position")) || /absolute/.test(this.css("position")) ? t = this.parents().filter(function () {
            return/(relative|absolute|fixed)/.test(e.curCSS(this, "position", 1)) && /(auto|scroll)/.test(e.curCSS(this, "overflow", 1) + e.curCSS(this, "overflow-y", 1) + e.curCSS(this, "overflow-x", 1))
        }).eq(0) : t = this.parents().filter(function () {
            return/(auto|scroll)/.test(e.curCSS(this, "overflow", 1) + e.curCSS(this, "overflow-y", 1) + e.curCSS(this, "overflow-x", 1))
        }).eq(0), /fixed/.test(this.css("position")) || !t.length ? e(document) : t
    }, zIndex: function (n) {
        if (n !== t)return this.css("zIndex", n);
        if (this.length) {
            var r = e(this[0]), i, s;
            while (r.length && r[0] !== document) {
                i = r.css("position");
                if (i === "absolute" || i === "relative" || i === "fixed") {
                    s = parseInt(r.css("zIndex"), 10);
                    if (!isNaN(s) && s !== 0)return s
                }
                r = r.parent()
            }
        }
        return 0
    }, disableSelection: function () {
        return this.bind((e.support.selectstart ? "selectstart" : "mousedown") + ".ui-disableSelection", function (e) {
            e.preventDefault()
        })
    }, enableSelection: function () {
        return this.unbind(".ui-disableSelection")
    }}), e("<a>").outerWidth(1).jquery || e.each(["Width", "Height"], function (n, r) {
        function i(t, n, r, i) {
            return e.each(s, function () {
                n -= parseFloat(e.curCSS(t, "padding" + this, !0)) || 0, r && (n -= parseFloat(e.curCSS(t, "border" + this + "Width", !0)) || 0), i && (n -= parseFloat(e.curCSS(t, "margin" + this, !0)) || 0)
            }), n
        }

        var s = r === "Width" ? ["Left", "Right"] : ["Top", "Bottom"], o = r.toLowerCase(), u = {innerWidth: e.fn.innerWidth, innerHeight: e.fn.innerHeight, outerWidth: e.fn.outerWidth, outerHeight: e.fn.outerHeight};
        e.fn["inner" + r] = function (n) {
            return n === t ? u["inner" + r].call(this) : this.each(function () {
                e(this).css(o, i(this, n) + "px")
            })
        }, e.fn["outer" + r] = function (t, n) {
            return typeof t != "number" ? u["outer" + r].call(this, t) : this.each(function () {
                e(this).css(o, i(this, t, !0, n) + "px")
            })
        }
    }), e.extend(e.expr[":"], {data: e.expr.createPseudo ? e.expr.createPseudo(function (t) {
        return function (n) {
            return!!e.data(n, t)
        }
    }) : function (t, n, r) {
        return!!e.data(t, r[3])
    }, focusable: function (t) {
        return n(t, !isNaN(e.attr(t, "tabindex")))
    }, tabbable: function (t) {
        var r = e.attr(t, "tabindex"), i = isNaN(r);
        return(i || r >= 0) && n(t, !i)
    }}), e(function () {
        var t = document.body, n = t.appendChild(n = document.createElement("div"));
        n.offsetHeight, e.extend(n.style, {minHeight: "100px", height: "auto", padding: 0, borderWidth: 0}), e.support.minHeight = n.offsetHeight === 100, e.support.selectstart = "onselectstart"in n, t.removeChild(n).style.display = "none"
    }), e.curCSS || (e.curCSS = e.css), e.extend(e.ui, {plugin: {add: function (t, n, r) {
        var i = e.ui[t].prototype;
        for (var s in r)i.plugins[s] = i.plugins[s] || [], i.plugins[s].push([n, r[s]])
    }, call: function (e, t, n) {
        var r = e.plugins[t];
        if (!r || !e.element[0].parentNode)return;
        for (var i = 0; i < r.length; i++)e.options[r[i][0]] && r[i][1].apply(e.element, n)
    }}, contains: function (e, t) {
        return document.compareDocumentPosition ? e.compareDocumentPosition(t) & 16 : e !== t && e.contains(t)
    }, hasScroll: function (t, n) {
        if (e(t).css("overflow") === "hidden")return!1;
        var r = n && n === "left" ? "scrollLeft" : "scrollTop", i = !1;
        return t[r] > 0 ? !0 : (t[r] = 1, i = t[r] > 0, t[r] = 0, i)
    }, isOverAxis: function (e, t, n) {
        return e > t && e < t + n
    }, isOver: function (t, n, r, i, s, o) {
        return e.ui.isOverAxis(t, r, s) && e.ui.isOverAxis(n, i, o)
    }})
})(jQuery), function (e, t) {
    if (e.cleanData) {
        var n = e.cleanData;
        e.cleanData = function (t) {
            for (var r = 0, i; (i = t[r]) != null; r++)try {
                e(i).triggerHandler("remove")
            } catch (s) {
            }
            n(t)
        }
    } else {
        var r = e.fn.remove;
        e.fn.remove = function (t, n) {
            return this.each(function () {
                return n || (!t || e.filter(t, [this]).length) && e("*", this).add([this]).each(function () {
                    try {
                        e(this).triggerHandler("remove")
                    } catch (t) {
                    }
                }), r.call(e(this), t, n)
            })
        }
    }
    e.widget = function (t, n, r) {
        var i = t.split(".")[0], s;
        t = t.split(".")[1], s = i + "-" + t, r || (r = n, n = e.Widget), e.expr[":"][s] = function (n) {
            return!!e.data(n, t)
        }, e[i] = e[i] || {}, e[i][t] = function (e, t) {
            arguments.length && this._createWidget(e, t)
        };
        var o = new n;
        o.options = e.extend(!0, {}, o.options), e[i][t].prototype = e.extend(!0, o, {namespace: i, widgetName: t, widgetEventPrefix: e[i][t].prototype.widgetEventPrefix || t, widgetBaseClass: s}, r), e.widget.bridge(t, e[i][t])
    }, e.widget.bridge = function (n, r) {
        e.fn[n] = function (i) {
            var s = typeof i == "string", o = Array.prototype.slice.call(arguments, 1), u = this;
            return i = !s && o.length ? e.extend.apply(null, [!0, i].concat(o)) : i, s && i.charAt(0) === "_" ? u : (s ? this.each(function () {
                var r = e.data(this, n), s = r && e.isFunction(r[i]) ? r[i].apply(r, o) : r;
                if (s !== r && s !== t)return u = s, !1
            }) : this.each(function () {
                var t = e.data(this, n);
                t ? t.option(i || {})._init() : e.data(this, n, new r(i, this))
            }), u)
        }
    }, e.Widget = function (e, t) {
        arguments.length && this._createWidget(e, t)
    }, e.Widget.prototype = {widgetName: "widget", widgetEventPrefix: "", options: {disabled: !1}, _createWidget: function (t, n) {
        e.data(n, this.widgetName, this), this.element = e(n), this.options = e.extend(!0, {}, this.options, this._getCreateOptions(), t);
        var r = this;
        this.element.bind("remove." + this.widgetName, function () {
            r.destroy()
        }), this._create(), this._trigger("create"), this._init()
    }, _getCreateOptions: function () {
        return e.metadata && e.metadata.get(this.element[0])[this.widgetName]
    }, _create: function () {
    }, _init: function () {
    }, destroy: function () {
        this.element.unbind("." + this.widgetName).removeData(this.widgetName), this.widget().unbind("." + this.widgetName).removeAttr("aria-disabled").removeClass(this.widgetBaseClass + "-disabled " + "ui-state-disabled")
    }, widget: function () {
        return this.element
    }, option: function (n, r) {
        var i = n;
        if (arguments.length === 0)return e.extend({}, this.options);
        if (typeof n == "string") {
            if (r === t)return this.options[n];
            i = {}, i[n] = r
        }
        return this._setOptions(i), this
    }, _setOptions: function (t) {
        var n = this;
        return e.each(t, function (e, t) {
            n._setOption(e, t)
        }), this
    }, _setOption: function (e, t) {
        return this.options[e] = t, e === "disabled" && this.widget()[t ? "addClass" : "removeClass"](this.widgetBaseClass + "-disabled" + " " + "ui-state-disabled").attr("aria-disabled", t), this
    }, enable: function () {
        return this._setOption("disabled", !1)
    }, disable: function () {
        return this._setOption("disabled", !0)
    }, _trigger: function (t, n, r) {
        var i, s, o = this.options[t];
        r = r || {}, n = e.Event(n), n.type = (t === this.widgetEventPrefix ? t : this.widgetEventPrefix + t).toLowerCase(), n.target = this.element[0], s = n.originalEvent;
        if (s)for (i in s)i in n || (n[i] = s[i]);
        return this.element.trigger(n, r), !(e.isFunction(o) && o.call(this.element[0], n, r) === !1 || n.isDefaultPrevented())
    }}
}(jQuery), function (e, t) {
    var n = !1;
    e(document).mouseup(function (e) {
        n = !1
    }), e.widget("ui.mouse", {options: {cancel: ":input,option", distance: 1, delay: 0}, _mouseInit: function () {
        var t = this;
        this.element.bind("mousedown." + this.widgetName,function (e) {
            return t._mouseDown(e)
        }).bind("click." + this.widgetName, function (n) {
            if (!0 === e.data(n.target, t.widgetName + ".preventClickEvent"))return e.removeData(n.target, t.widgetName + ".preventClickEvent"), n.stopImmediatePropagation(), !1
        }), this.started = !1
    }, _mouseDestroy: function () {
        this.element.unbind("." + this.widgetName), this._mouseMoveDelegate && e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate)
    }, _mouseDown: function (t) {
        if (n)return;
        this._mouseStarted && this._mouseUp(t), this._mouseDownEvent = t;
        var r = this, i = t.which == 1, s = typeof this.options.cancel == "string" && t.target.nodeName ? e(t.target).closest(this.options.cancel).length : !1;
        if (!i || s || !this._mouseCapture(t))return!0;
        this.mouseDelayMet = !this.options.delay, this.mouseDelayMet || (this._mouseDelayTimer = setTimeout(function () {
            r.mouseDelayMet = !0
        }, this.options.delay));
        if (this._mouseDistanceMet(t) && this._mouseDelayMet(t)) {
            this._mouseStarted = this._mouseStart(t) !== !1;
            if (!this._mouseStarted)return t.preventDefault(), !0
        }
        return!0 === e.data(t.target, this.widgetName + ".preventClickEvent") && e.removeData(t.target, this.widgetName + ".preventClickEvent"), this._mouseMoveDelegate = function (e) {
            return r._mouseMove(e)
        }, this._mouseUpDelegate = function (e) {
            return r._mouseUp(e)
        }, e(document).bind("mousemove." + this.widgetName, this._mouseMoveDelegate).bind("mouseup." + this.widgetName, this._mouseUpDelegate), t.preventDefault(), n = !0, !0
    }, _mouseMove: function (t) {
        return!e.browser.msie || document.documentMode >= 9 || !!t.button ? this._mouseStarted ? (this._mouseDrag(t), t.preventDefault()) : (this._mouseDistanceMet(t) && this._mouseDelayMet(t) && (this._mouseStarted = this._mouseStart(this._mouseDownEvent, t) !== !1, this._mouseStarted ? this._mouseDrag(t) : this._mouseUp(t)), !this._mouseStarted) : this._mouseUp(t)
    }, _mouseUp: function (t) {
        return e(document).unbind("mousemove." + this.widgetName, this._mouseMoveDelegate).unbind("mouseup." + this.widgetName, this._mouseUpDelegate), this._mouseStarted && (this._mouseStarted = !1, t.target == this._mouseDownEvent.target && e.data(t.target, this.widgetName + ".preventClickEvent", !0), this._mouseStop(t)), !1
    }, _mouseDistanceMet: function (e) {
        return Math.max(Math.abs(this._mouseDownEvent.pageX - e.pageX), Math.abs(this._mouseDownEvent.pageY - e.pageY)) >= this.options.distance
    }, _mouseDelayMet: function (e) {
        return this.mouseDelayMet
    }, _mouseStart: function (e) {
    }, _mouseDrag: function (e) {
    }, _mouseStop: function (e) {
    }, _mouseCapture: function (e) {
        return!0
    }})
}(jQuery), function (e, t) {
    e.ui = e.ui || {};
    var n = /left|center|right/, r = /top|center|bottom/, i = "center", s = {}, o = e.fn.position, u = e.fn.offset;
    e.fn.position = function (t) {
        if (!t || !t.of)return o.apply(this, arguments);
        t = e.extend({}, t);
        var u = e(t.of), l = u[0], h = (t.collision || "flip").split(" "), p = t.offset ? t.offset.split(" ") : [0, 0], v, m, y;
        return l.nodeType === 9 ? (v = u.width(), m = u.height(), y = {top: 0, left: 0}) : l.setTimeout ? (v = u.width(), m = u.height(), y = {top: u.scrollTop(), left: u.scrollLeft()}) : l.preventDefault ? (t.at = "left top", v = m = 0, y = {top: t.of.pageY, left: t.of.pageX}) : (v = u.outerWidth(), m = u.outerHeight(), y = u.offset()), e.each(["my", "at"], function () {
            var e = (t[this] || "").split(" ");
            e.length === 1 && (e = n.test(e[0]) ? e.concat([i]) : r.test(e[0]) ? [i].concat(e) : [i, i]), e[0] = n.test(e[0]) ? e[0] : i, e[1] = r.test(e[1]) ? e[1] : i, t[this] = e
        }), h.length === 1 && (h[1] = h[0]), p[0] = parseInt(p[0], 10) || 0, p.length === 1 && (p[1] = p[0]), p[1] = parseInt(p[1], 10) || 0, t.at[0] === "right" ? y.left += v : t.at[0] === i && (y.left += v / 2), t.at[1] === "bottom" ? y.top += m : t.at[1] === i && (y.top += m / 2), y.left += p[0], y.top += p[1], this.each(function () {
            var n = e(this), r = n.outerWidth(), o = n.outerHeight(), u = parseInt(e.curCSS(this, "marginLeft", !0)) || 0, l = parseInt(e.curCSS(this, "marginTop", !0)) || 0, c = r + u + (parseInt(e.curCSS(this, "marginRight", !0)) || 0), d = o + l + (parseInt(e.curCSS(this, "marginBottom", !0)) || 0), g = e.extend({}, y), w;
            t.my[0] === "right" ? g.left -= r : t.my[0] === i && (g.left -= r / 2), t.my[1] === "bottom" ? g.top -= o : t.my[1] === i && (g.top -= o / 2), s.fractions || (g.left = Math.round(g.left), g.top = Math.round(g.top)), w = {left: g.left - u, top: g.top - l}, e.each(["left", "top"], function (n, i) {
                e.ui.position[h[n]] && e.ui.position[h[n]][i](g, {targetWidth: v, targetHeight: m, elemWidth: r, elemHeight: o, collisionPosition: w, collisionWidth: c, collisionHeight: d, offset: p, my: t.my, at: t.at})
            }), e.fn.bgiframe && n.bgiframe(), n.offset(e.extend(g, {using: t.using}))
        })
    }, e.ui.position = {fit: {left: function (t, n) {
        var r = e(window), i = n.collisionPosition.left + n.collisionWidth - r.width() - r.scrollLeft();
        t.left = i > 0 ? t.left - i : Math.max(t.left - n.collisionPosition.left, t.left)
    }, top: function (t, n) {
        var r = e(window), i = n.collisionPosition.top + n.collisionHeight - r.height() - r.scrollTop();
        t.top = i > 0 ? t.top - i : Math.max(t.top - n.collisionPosition.top, t.top)
    }}, flip: {left: function (t, n) {
        if (n.at[0] === i)return;
        var r = e(window), s = n.collisionPosition.left + n.collisionWidth - r.width() - r.scrollLeft(), o = n.my[0] === "left" ? -n.elemWidth : n.my[0] === "right" ? n.elemWidth : 0, u = n.at[0] === "left" ? n.targetWidth : -n.targetWidth, f = -2 * n.offset[0];
        t.left += n.collisionPosition.left < 0 ? o + u + f : s > 0 ? o + u + f : 0
    }, top: function (t, n) {
        if (n.at[1] === i)return;
        var r = e(window), s = n.collisionPosition.top + n.collisionHeight - r.height() - r.scrollTop(), o = n.my[1] === "top" ? -n.elemHeight : n.my[1] === "bottom" ? n.elemHeight : 0, u = n.at[1] === "top" ? n.targetHeight : -n.targetHeight, f = -2 * n.offset[1];
        t.top += n.collisionPosition.top < 0 ? o + u + f : s > 0 ? o + u + f : 0
    }}}, e.offset.setOffset || (e.offset.setOffset = function (t, n) {
        /static/.test(e.curCSS(t, "position")) && (t.style.position = "relative");
        var r = e(t), i = r.offset(), s = parseInt(e.curCSS(t, "top", !0), 10) || 0, o = parseInt(e.curCSS(t, "left", !0), 10) || 0, u = {top: n.top - i.top + s, left: n.left - i.left + o};
        "using"in n ? n.using.call(t, u) : r.css(u)
    }, e.fn.offset = function (t) {
        var n = this[0];
        return!n || !n.ownerDocument ? null : t ? e.isFunction(t) ? this.each(function (n) {
            e(this).offset(t.call(this, n, e(this).offset()))
        }) : this.each(function () {
            e.offset.setOffset(this, t)
        }) : u.call(this)
    }), e.curCSS || (e.curCSS = e.css), function () {
        var t = document.getElementsByTagName("body")[0], n = document.createElement("div"), r, i, o, u, l;
        r = document.createElement(t ? "div" : "body"), o = {visibility: "hidden", width: 0, height: 0, border: 0, margin: 0, background: "none"}, t && e.extend(o, {position: "absolute", left: "-1000px", top: "-1000px"});
        for (var c in o)r.style[c] = o[c];
        r.appendChild(n), i = t || document.documentElement, i.insertBefore(r, i.firstChild), n.style.cssText = "position: absolute; left: 10.7432222px; top: 10.432325px; height: 30px; width: 201px;", u = e(n).offset(function (e, t) {
            return t
        }).offset(), r.innerHTML = "", i.removeChild(r), l = u.top + u.left + (t ? 2e3 : 0), s.fractions = l > 21 && l < 22
    }()
}(jQuery), function (e, t) {
    e.widget("ui.draggable", e.ui.mouse, {widgetEventPrefix: "drag", options: {addClasses: !0, appendTo: "parent", axis: !1, connectToSortable: !1, containment: !1, cursor: "auto", cursorAt: !1, grid: !1, handle: !1, helper: "original", iframeFix: !1, opacity: !1, refreshPositions: !1, revert: !1, revertDuration: 500, scope: "default", scroll: !0, scrollSensitivity: 20, scrollSpeed: 20, snap: !1, snapMode: "both", snapTolerance: 20, stack: !1, zIndex: !1}, _create: function () {
        this.options.helper == "original" && !/^(?:r|a|f)/.test(this.element.css("position")) && (this.element[0].style.position = "relative"), this.options.addClasses && this.element.addClass("ui-draggable"), this.options.disabled && this.element.addClass("ui-draggable-disabled"), this._mouseInit()
    }, destroy: function () {
        if (!this.element.data("draggable"))return;
        return this.element.removeData("draggable").unbind(".draggable").removeClass("ui-draggable ui-draggable-dragging ui-draggable-disabled"), this._mouseDestroy(), this
    }, _mouseCapture: function (t) {
        var n = this.options;
        return this.helper || n.disabled || e(t.target).is(".ui-resizable-handle") ? !1 : (this.handle = this._getHandle(t), this.handle ? (n.iframeFix && e(n.iframeFix === !0 ? "iframe" : n.iframeFix).each(function () {
            e('<div class="ui-draggable-iframeFix" style="background: #fff;"></div>').css({width: this.offsetWidth + "px", height: this.offsetHeight + "px", position: "absolute", opacity: "0.001", zIndex: 1e3}).css(e(this).offset()).appendTo("body")
        }), !0) : !1)
    }, _mouseStart: function (t) {
        var n = this.options;
        return this.helper = this._createHelper(t), this.helper.addClass("ui-draggable-dragging"), this._cacheHelperProportions(), e.ui.ddmanager && (e.ui.ddmanager.current = this), this._cacheMargins(), this.cssPosition = this.helper.css("position"), this.scrollParent = this.helper.scrollParent(), this.offset = this.positionAbs = this.element.offset(), this.offset = {top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left}, e.extend(this.offset, {click: {left: t.pageX - this.offset.left, top: t.pageY - this.offset.top}, parent: this._getParentOffset(), relative: this._getRelativeOffset()}), this.originalPosition = this.position = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, n.cursorAt && this._adjustOffsetFromHelper(n.cursorAt), n.containment && this._setContainment(), this._trigger("start", t) === !1 ? (this._clear(), !1) : (this._cacheHelperProportions(), e.ui.ddmanager && !n.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this._mouseDrag(t, !0), e.ui.ddmanager && e.ui.ddmanager.dragStart(this, t), !0)
    }, _mouseDrag: function (t, n) {
        this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute");
        if (!n) {
            var r = this._uiHash();
            if (this._trigger("drag", t, r) === !1)return this._mouseUp({}), !1;
            this.position = r.position
        }
        if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + "px";
        if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + "px";
        return e.ui.ddmanager && e.ui.ddmanager.drag(this, t), !1
    }, _mouseStop: function (t) {
        var n = !1;
        e.ui.ddmanager && !this.options.dropBehaviour && (n = e.ui.ddmanager.drop(this, t)), this.dropped && (n = this.dropped, this.dropped = !1);
        var r = this.element[0], i = !1;
        while (r && (r = r.parentNode))r == document && (i = !0);
        if (!i && this.options.helper === "original")return!1;
        if (this.options.revert == "invalid" && !n || this.options.revert == "valid" && n || this.options.revert === !0 || e.isFunction(this.options.revert) && this.options.revert.call(this.element, n)) {
            var s = this;
            e(this.helper).animate(this.originalPosition, parseInt(this.options.revertDuration, 10), function () {
                s._trigger("stop", t) !== !1 && s._clear()
            })
        } else this._trigger("stop", t) !== !1 && this._clear();
        return!1
    }, _mouseUp: function (t) {
        return e("div.ui-draggable-iframeFix").each(function () {
            this.parentNode.removeChild(this)
        }), e.ui.ddmanager && e.ui.ddmanager.dragStop(this, t), e.ui.mouse.prototype._mouseUp.call(this, t)
    }, cancel: function () {
        return this.helper.is(".ui-draggable-dragging") ? this._mouseUp({}) : this._clear(), this
    }, _getHandle: function (t) {
        var n = !this.options.handle || !e(this.options.handle, this.element).length ? !0 : !1;
        return e(this.options.handle, this.element).find("*").andSelf().each(function () {
            this == t.target && (n = !0)
        }), n
    }, _createHelper: function (t) {
        var n = this.options, r = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [t])) : n.helper == "clone" ? this.element.clone().removeAttr("id") : this.element;
        return r.parents("body").length || r.appendTo(n.appendTo == "parent" ? this.element[0].parentNode : n.appendTo), r[0] != this.element[0] && !/(fixed|absolute)/.test(r.css("position")) && r.css("position", "absolute"), r
    }, _adjustOffsetFromHelper: function (t) {
        typeof t == "string" && (t = t.split(" ")), e.isArray(t) && (t = {left: +t[0], top: +t[1] || 0}), "left"in t && (this.offset.click.left = t.left + this.margins.left), "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top"in t && (this.offset.click.top = t.top + this.margins.top), "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
    }, _getParentOffset: function () {
        this.offsetParent = this.helper.offsetParent();
        var t = this.offsetParent.offset();
        this.cssPosition == "absolute" && this.scrollParent[0] != document && e.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop());
        if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && e.browser.msie)t = {top: 0, left: 0};
        return{top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)}
    }, _getRelativeOffset: function () {
        if (this.cssPosition == "relative") {
            var e = this.element.position();
            return{top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
        }
        return{top: 0, left: 0}
    }, _cacheMargins: function () {
        this.margins = {left: parseInt(this.element.css("marginLeft"), 10) || 0, top: parseInt(this.element.css("marginTop"), 10) || 0, right: parseInt(this.element.css("marginRight"), 10) || 0, bottom: parseInt(this.element.css("marginBottom"), 10) || 0}
    }, _cacheHelperProportions: function () {
        this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
    }, _setContainment: function () {
        var t = this.options;
        t.containment == "parent" && (t.containment = this.helper[0].parentNode);
        if (t.containment == "document" || t.containment == "window")this.containment = [t.containment == "document" ? 0 : e(window).scrollLeft() - this.offset.relative.left - this.offset.parent.left, t.containment == "document" ? 0 : e(window).scrollTop() - this.offset.relative.top - this.offset.parent.top, (t.containment == "document" ? 0 : e(window).scrollLeft()) + e(t.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (t.containment == "document" ? 0 : e(window).scrollTop()) + (e(t.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
        if (!/^(document|window|parent)$/.test(t.containment) && t.containment.constructor != Array) {
            var n = e(t.containment), r = n[0];
            if (!r)return;
            var i = n.offset(), s = e(r).css("overflow") != "hidden";
            this.containment = [(parseInt(e(r).css("borderLeftWidth"), 10) || 0) + (parseInt(e(r).css("paddingLeft"), 10) || 0), (parseInt(e(r).css("borderTopWidth"), 10) || 0) + (parseInt(e(r).css("paddingTop"), 10) || 0), (s ? Math.max(r.scrollWidth, r.offsetWidth) : r.offsetWidth) - (parseInt(e(r).css("borderLeftWidth"), 10) || 0) - (parseInt(e(r).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left - this.margins.right, (s ? Math.max(r.scrollHeight, r.offsetHeight) : r.offsetHeight) - (parseInt(e(r).css("borderTopWidth"), 10) || 0) - (parseInt(e(r).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top - this.margins.bottom], this.relative_container = n
        } else t.containment.constructor == Array && (this.containment = t.containment)
    }, _convertPositionTo: function (t, n) {
        n || (n = this.position);
        var r = t == "absolute" ? 1 : -1, i = this.options, s = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, o = /(html|body)/i.test(s[0].tagName);
        return{top: n.top + this.offset.relative.top * r + this.offset.parent.top * r - (e.browser.safari && e.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : o ? 0 : s.scrollTop()) * r), left: n.left + this.offset.relative.left * r + this.offset.parent.left * r - (e.browser.safari && e.browser.version < 526 && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : o ? 0 : s.scrollLeft()) * r)}
    }, _generatePosition: function (t) {
        var n = this.options, r = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, i = /(html|body)/i.test(r[0].tagName), s = t.pageX, o = t.pageY;
        if (this.originalPosition) {
            var u;
            if (this.containment) {
                if (this.relative_container) {
                    var f = this.relative_container.offset();
                    u = [this.containment[0] + f.left, this.containment[1] + f.top, this.containment[2] + f.left, this.containment[3] + f.top]
                } else u = this.containment;
                t.pageX - this.offset.click.left < u[0] && (s = u[0] + this.offset.click.left), t.pageY - this.offset.click.top < u[1] && (o = u[1] + this.offset.click.top), t.pageX - this.offset.click.left > u[2] && (s = u[2] + this.offset.click.left), t.pageY - this.offset.click.top > u[3] && (o = u[3] + this.offset.click.top)
            }
            if (n.grid) {
                var l = n.grid[1] ? this.originalPageY + Math.round((o - this.originalPageY) / n.grid[1]) * n.grid[1] : this.originalPageY;
                o = u ? l - this.offset.click.top < u[1] || l - this.offset.click.top > u[3] ? l - this.offset.click.top < u[1] ? l + n.grid[1] : l - n.grid[1] : l : l;
                var c = n.grid[0] ? this.originalPageX + Math.round((s - this.originalPageX) / n.grid[0]) * n.grid[0] : this.originalPageX;
                s = u ? c - this.offset.click.left < u[0] || c - this.offset.click.left > u[2] ? c - this.offset.click.left < u[0] ? c + n.grid[0] : c - n.grid[0] : c : c
            }
        }
        return{top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (e.browser.safari && e.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : i ? 0 : r.scrollTop()), left: s - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (e.browser.safari && e.browser.version < 526 && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : i ? 0 : r.scrollLeft())}
    }, _clear: function () {
        this.helper.removeClass("ui-draggable-dragging"), this.helper[0] != this.element[0] && !this.cancelHelperRemoval && this.helper.remove(), this.helper = null, this.cancelHelperRemoval = !1
    }, _trigger: function (t, n, r) {
        return r = r || this._uiHash(), e.ui.plugin.call(this, t, [n, r]), t == "drag" && (this.positionAbs = this._convertPositionTo("absolute")), e.Widget.prototype._trigger.call(this, t, n, r)
    }, plugins: {}, _uiHash: function (e) {
        return{helper: this.helper, position: this.position, originalPosition: this.originalPosition, offset: this.positionAbs}
    }}), e.extend(e.ui.draggable, {version: "1.8.24"}), e.ui.plugin.add("draggable", "connectToSortable", {start: function (t, n) {
        var r = e(this).data("draggable"), i = r.options, s = e.extend({}, n, {item: r.element});
        r.sortables = [], e(i.connectToSortable).each(function () {
            var n = e.data(this, "sortable");
            n && !n.options.disabled && (r.sortables.push({instance: n, shouldRevert: n.options.revert}), n.refreshPositions(), n._trigger("activate", t, s))
        })
    }, stop: function (t, n) {
        var r = e(this).data("draggable"), i = e.extend({}, n, {item: r.element});
        e.each(r.sortables, function () {
            this.instance.isOver ? (this.instance.isOver = 0, r.cancelHelperRemoval = !0, this.instance.cancelHelperRemoval = !1, this.shouldRevert && (this.instance.options.revert = !0), this.instance._mouseStop(t), this.instance.options.helper = this.instance.options._helper, r.options.helper == "original" && this.instance.currentItem.css({top: "auto", left: "auto"})) : (this.instance.cancelHelperRemoval = !1, this.instance._trigger("deactivate", t, i))
        })
    }, drag: function (t, n) {
        var r = e(this).data("draggable"), i = this, s = function (t) {
            var n = this.offset.click.top, r = this.offset.click.left, i = this.positionAbs.top, s = this.positionAbs.left, o = t.height, u = t.width, f = t.top, l = t.left;
            return e.ui.isOver(i + n, s + r, f, l, o, u)
        };
        e.each(r.sortables, function (s) {
            this.instance.positionAbs = r.positionAbs, this.instance.helperProportions = r.helperProportions, this.instance.offset.click = r.offset.click, this.instance._intersectsWith(this.instance.containerCache) ? (this.instance.isOver || (this.instance.isOver = 1, this.instance.currentItem = e(i).clone().removeAttr("id").appendTo(this.instance.element).data("sortable-item", !0), this.instance.options._helper = this.instance.options.helper, this.instance.options.helper = function () {
                return n.helper[0]
            }, t.target = this.instance.currentItem[0], this.instance._mouseCapture(t, !0), this.instance._mouseStart(t, !0, !0), this.instance.offset.click.top = r.offset.click.top, this.instance.offset.click.left = r.offset.click.left, this.instance.offset.parent.left -= r.offset.parent.left - this.instance.offset.parent.left, this.instance.offset.parent.top -= r.offset.parent.top - this.instance.offset.parent.top, r._trigger("toSortable", t), r.dropped = this.instance.element, r.currentItem = r.element, this.instance.fromOutside = r), this.instance.currentItem && this.instance._mouseDrag(t)) : this.instance.isOver && (this.instance.isOver = 0, this.instance.cancelHelperRemoval = !0, this.instance.options.revert = !1, this.instance._trigger("out", t, this.instance._uiHash(this.instance)), this.instance._mouseStop(t, !0), this.instance.options.helper = this.instance.options._helper, this.instance.currentItem.remove(), this.instance.placeholder && this.instance.placeholder.remove(), r._trigger("fromSortable", t), r.dropped = !1)
        })
    }}), e.ui.plugin.add("draggable", "cursor", {start: function (t, n) {
        var r = e("body"), i = e(this).data("draggable").options;
        r.css("cursor") && (i._cursor = r.css("cursor")), r.css("cursor", i.cursor)
    }, stop: function (t, n) {
        var r = e(this).data("draggable").options;
        r._cursor && e("body").css("cursor", r._cursor)
    }}), e.ui.plugin.add("draggable", "opacity", {start: function (t, n) {
        var r = e(n.helper), i = e(this).data("draggable").options;
        r.css("opacity") && (i._opacity = r.css("opacity")), r.css("opacity", i.opacity)
    }, stop: function (t, n) {
        var r = e(this).data("draggable").options;
        r._opacity && e(n.helper).css("opacity", r._opacity)
    }}), e.ui.plugin.add("draggable", "scroll", {start: function (t, n) {
        var r = e(this).data("draggable");
        r.scrollParent[0] != document && r.scrollParent[0].tagName != "HTML" && (r.overflowOffset = r.scrollParent.offset())
    }, drag: function (t, n) {
        var r = e(this).data("draggable"), i = r.options, s = !1;
        if (r.scrollParent[0] != document && r.scrollParent[0].tagName != "HTML") {
            if (!i.axis || i.axis != "x")r.overflowOffset.top + r.scrollParent[0].offsetHeight - t.pageY < i.scrollSensitivity ? r.scrollParent[0].scrollTop = s = r.scrollParent[0].scrollTop + i.scrollSpeed : t.pageY - r.overflowOffset.top < i.scrollSensitivity && (r.scrollParent[0].scrollTop = s = r.scrollParent[0].scrollTop - i.scrollSpeed);
            if (!i.axis || i.axis != "y")r.overflowOffset.left + r.scrollParent[0].offsetWidth - t.pageX < i.scrollSensitivity ? r.scrollParent[0].scrollLeft = s = r.scrollParent[0].scrollLeft + i.scrollSpeed : t.pageX - r.overflowOffset.left < i.scrollSensitivity && (r.scrollParent[0].scrollLeft = s = r.scrollParent[0].scrollLeft - i.scrollSpeed)
        } else {
            if (!i.axis || i.axis != "x")t.pageY - e(document).scrollTop() < i.scrollSensitivity ? s = e(document).scrollTop(e(document).scrollTop() - i.scrollSpeed) : e(window).height
                () - (t.pageY - e(document).scrollTop()) < i.scrollSensitivity && (s = e(document).scrollTop(e(document).scrollTop() + i.scrollSpeed));
            if (!i.axis || i.axis != "y")t.pageX - e(document).scrollLeft() < i.scrollSensitivity ? s = e(document).scrollLeft(e(document).scrollLeft() - i.scrollSpeed) : e(window).width() - (t.pageX - e(document).scrollLeft()) < i.scrollSensitivity && (s = e(document).scrollLeft(e(document).scrollLeft() + i.scrollSpeed))
        }
        s !== !1 && e.ui.ddmanager && !i.dropBehaviour && e.ui.ddmanager.prepareOffsets(r, t)
    }}), e.ui.plugin.add("draggable", "snap", {start: function (t, n) {
        var r = e(this).data("draggable"), i = r.options;
        r.snapElements = [], e(i.snap.constructor != String ? i.snap.items || ":data(draggable)" : i.snap).each(function () {
            var t = e(this), n = t.offset();
            this != r.element[0] && r.snapElements.push({item: this, width: t.outerWidth(), height: t.outerHeight(), top: n.top, left: n.left})
        })
    }, drag: function (t, n) {
        var r = e(this).data("draggable"), i = r.options, s = i.snapTolerance, o = n.offset.left, u = o + r.helperProportions.width, f = n.offset.top, l = f + r.helperProportions.height;
        for (var c = r.snapElements.length - 1; c >= 0; c--) {
            var h = r.snapElements[c].left, p = h + r.snapElements[c].width, d = r.snapElements[c].top, v = d + r.snapElements[c].height;
            if (!(h - s < o && o < p + s && d - s < f && f < v + s || h - s < o && o < p + s && d - s < l && l < v + s || h - s < u && u < p + s && d - s < f && f < v + s || h - s < u && u < p + s && d - s < l && l < v + s)) {
                r.snapElements[c].snapping && r.options.snap.release && r.options.snap.release.call(r.element, t, e.extend(r._uiHash(), {snapItem: r.snapElements[c].item})), r.snapElements[c].snapping = !1;
                continue
            }
            if (i.snapMode != "inner") {
                var m = Math.abs(d - l) <= s, g = Math.abs(v - f) <= s, y = Math.abs(h - u) <= s, b = Math.abs(p - o) <= s;
                m && (n.position.top = r._convertPositionTo("relative", {top: d - r.helperProportions.height, left: 0}).top - r.margins.top), g && (n.position.top = r._convertPositionTo("relative", {top: v, left: 0}).top - r.margins.top), y && (n.position.left = r._convertPositionTo("relative", {top: 0, left: h - r.helperProportions.width}).left - r.margins.left), b && (n.position.left = r._convertPositionTo("relative", {top: 0, left: p}).left - r.margins.left)
            }
            var w = m || g || y || b;
            if (i.snapMode != "outer") {
                var m = Math.abs(d - f) <= s, g = Math.abs(v - l) <= s, y = Math.abs(h - o) <= s, b = Math.abs(p - u) <= s;
                m && (n.position.top = r._convertPositionTo("relative", {top: d, left: 0}).top - r.margins.top), g && (n.position.top = r._convertPositionTo("relative", {top: v - r.helperProportions.height, left: 0}).top - r.margins.top), y && (n.position.left = r._convertPositionTo("relative", {top: 0, left: h}).left - r.margins.left), b && (n.position.left = r._convertPositionTo("relative", {top: 0, left: p - r.helperProportions.width}).left - r.margins.left)
            }
            !r.snapElements[c].snapping && (m || g || y || b || w) && r.options.snap.snap && r.options.snap.snap.call(r.element, t, e.extend(r._uiHash(), {snapItem: r.snapElements[c].item})), r.snapElements[c].snapping = m || g || y || b || w
        }
    }}), e.ui.plugin.add("draggable", "stack", {start: function (t, n) {
        var r = e(this).data("draggable").options, i = e.makeArray(e(r.stack)).sort(function (t, n) {
            return(parseInt(e(t).css("zIndex"), 10) || 0) - (parseInt(e(n).css("zIndex"), 10) || 0)
        });
        if (!i.length)return;
        var s = parseInt(i[0].style.zIndex) || 0;
        e(i).each(function (e) {
            this.style.zIndex = s + e
        }), this[0].style.zIndex = s + i.length
    }}), e.ui.plugin.add("draggable", "zIndex", {start: function (t, n) {
        var r = e(n.helper), i = e(this).data("draggable").options;
        r.css("zIndex") && (i._zIndex = r.css("zIndex")), r.css("zIndex", i.zIndex)
    }, stop: function (t, n) {
        var r = e(this).data("draggable").options;
        r._zIndex && e(n.helper).css("zIndex", r._zIndex)
    }})
}(jQuery), function (e, t) {
    e.widget("ui.droppable", {widgetEventPrefix: "drop", options: {accept: "*", activeClass: !1, addClasses: !0, greedy: !1, hoverClass: !1, scope: "default", tolerance: "intersect"}, _create: function () {
        var t = this.options, n = t.accept;
        this.isover = 0, this.isout = 1, this.accept = e.isFunction(n) ? n : function (e) {
            return e.is(n)
        }, this.proportions = {width: this.element[0].offsetWidth, height: this.element[0].offsetHeight}, e.ui.ddmanager.droppables[t.scope] = e.ui.ddmanager.droppables[t.scope] || [], e.ui.ddmanager.droppables[t.scope].push(this), t.addClasses && this.element.addClass("ui-droppable")
    }, destroy: function () {
        var t = e.ui.ddmanager.droppables[this.options.scope];
        for (var n = 0; n < t.length; n++)t[n] == this && t.splice(n, 1);
        return this.element.removeClass("ui-droppable ui-droppable-disabled").removeData("droppable").unbind(".droppable"), this
    }, _setOption: function (t, n) {
        t == "accept" && (this.accept = e.isFunction(n) ? n : function (e) {
            return e.is(n)
        }), e.Widget.prototype._setOption.apply(this, arguments)
    }, _activate: function (t) {
        var n = e.ui.ddmanager.current;
        this.options.activeClass && this.element.addClass(this.options.activeClass), n && this._trigger("activate", t, this.ui(n))
    }, _deactivate: function (t) {
        var n = e.ui.ddmanager.current;
        this.options.activeClass && this.element.removeClass(this.options.activeClass), n && this._trigger("deactivate", t, this.ui(n))
    }, _over: function (t) {
        var n = e.ui.ddmanager.current;
        if (!n || (n.currentItem || n.element)[0] == this.element[0])return;
        this.accept.call(this.element[0], n.currentItem || n.element) && (this.options.hoverClass && this.element.addClass(this.options.hoverClass), this._trigger("over", t, this.ui(n)))
    }, _out: function (t) {
        var n = e.ui.ddmanager.current;
        if (!n || (n.currentItem || n.element)[0] == this.element[0])return;
        this.accept.call(this.element[0], n.currentItem || n.element) && (this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("out", t, this.ui(n)))
    }, _drop: function (t, n) {
        var r = n || e.ui.ddmanager.current;
        if (!r || (r.currentItem || r.element)[0] == this.element[0])return!1;
        var i = !1;
        return this.element.find(":data(droppable)").not(".ui-draggable-dragging").each(function () {
            var t = e.data(this, "droppable");
            if (t.options.greedy && !t.options.disabled && t.options.scope == r.options.scope && t.accept.call(t.element[0], r.currentItem || r.element) && e.ui.intersect(r, e.extend(t, {offset: t.element.offset()}), t.options.tolerance))return i = !0, !1
        }), i ? !1 : this.accept.call(this.element[0], r.currentItem || r.element) ? (this.options.activeClass && this.element.removeClass(this.options.activeClass), this.options.hoverClass && this.element.removeClass(this.options.hoverClass), this._trigger("drop", t, this.ui(r)), this.element) : !1
    }, ui: function (e) {
        return{draggable: e.currentItem || e.element, helper: e.helper, position: e.position, offset: e.positionAbs}
    }}), e.extend(e.ui.droppable, {version: "1.8.24"}), e.ui.intersect = function (t, n, r) {
        if (!n.offset)return!1;
        var i = (t.positionAbs || t.position.absolute).left, s = i + t.helperProportions.width, o = (t.positionAbs || t.position.absolute).top, u = o + t.helperProportions.height, f = n.offset.left, l = f + n.proportions.width, c = n.offset.top, h = c + n.proportions.height;
        switch (r) {
            case"fit":
                return f <= i && s <= l && c <= o && u <= h;
            case"intersect":
                return f < i + t.helperProportions.width / 2 && s - t.helperProportions.width / 2 < l && c < o + t.helperProportions.height / 2 && u - t.helperProportions.height / 2 < h;
            case"pointer":
                var p = (t.positionAbs || t.position.absolute).left + (t.clickOffset || t.offset.click).left, d = (t.positionAbs || t.position.absolute).top + (t.clickOffset || t.offset.click).top, v = e.ui.isOver(d, p, c, f, n.proportions.height, n.proportions.width);
                return v;
            case"touch":
                return(o >= c && o <= h || u >= c && u <= h || o < c && u > h) && (i >= f && i <= l || s >= f && s <= l || i < f && s > l);
            default:
                return!1
        }
    }, e.ui.ddmanager = {current: null, droppables: {"default": []}, prepareOffsets: function (t, n) {
        var r = e.ui.ddmanager.droppables[t.options.scope] || [], i = n ? n.type : null, s = (t.currentItem || t.element).find(":data(droppable)").andSelf();
        e:for (var o = 0; o < r.length; o++) {
            if (r[o].options.disabled || t && !r[o].accept.call(r[o].element[0], t.currentItem || t.element))continue;
            for (var u = 0; u < s.length; u++)if (s[u] == r[o].element[0]) {
                r[o].proportions.height = 0;
                continue e
            }
            r[o].visible = r[o].element.css("display") != "none";
            if (!r[o].visible)continue;
            i == "mousedown" && r[o]._activate.call(r[o], n), r[o].offset = r[o].element.offset(), r[o].proportions = {width: r[o].element[0].offsetWidth, height: r[o].element[0].offsetHeight}
        }
    }, drop: function (t, n) {
        var r = !1;
        return e.each(e.ui.ddmanager.droppables[t.options.scope] || [], function () {
            if (!this.options)return;
            !this.options.disabled && this.visible && e.ui.intersect(t, this, this.options.tolerance) && (r = this._drop.call(this, n) || r), !this.options.disabled && this.visible && this.accept.call(this.element[0], t.currentItem || t.element) && (this.isout = 1, this.isover = 0, this._deactivate.call(this, n))
        }), r
    }, dragStart: function (t, n) {
        t.element.parents(":not(body,html)").bind("scroll.droppable", function () {
            t.options.refreshPositions || e.ui.ddmanager.prepareOffsets(t, n)
        })
    }, drag: function (t, n) {
        t.options.refreshPositions && e.ui.ddmanager.prepareOffsets(t, n), e.each(e.ui.ddmanager.droppables[t.options.scope] || [], function () {
            if (this.options.disabled || this.greedyChild || !this.visible)return;
            var r = e.ui.intersect(t, this, this.options.tolerance), i = !r && this.isover == 1 ? "isout" : r && this.isover == 0 ? "isover" : null;
            if (!i)return;
            var s;
            if (this.options.greedy) {
                var o = this.options.scope, u = this.element.parents(":data(droppable)").filter(function () {
                    return e.data(this, "droppable").options.scope === o
                });
                u.length && (s = e.data(u[0], "droppable"), s.greedyChild = i == "isover" ? 1 : 0)
            }
            s && i == "isover" && (s.isover = 0, s.isout = 1, s._out.call(s, n)), this[i] = 1, this[i == "isout" ? "isover" : "isout"] = 0, this[i == "isover" ? "_over" : "_out"].call(this, n), s && i == "isout" && (s.isout = 0, s.isover = 1, s._over.call(s, n))
        })
    }, dragStop: function (t, n) {
        t.element.parents(":not(body,html)").unbind("scroll.droppable"), t.options.refreshPositions || e.ui.ddmanager.prepareOffsets(t, n)
    }}
}(jQuery), function (e, t) {
    e.widget("ui.resizable", e.ui.mouse, {widgetEventPrefix: "resize", options: {alsoResize: !1, animate: !1, animateDuration: "slow", animateEasing: "swing", aspectRatio: !1, autoHide: !1, containment: !1, ghost: !1, grid: !1, handles: "e,s,se", helper: !1, maxHeight: null, maxWidth: null, minHeight: 10, minWidth: 10, zIndex: 1e3}, _create: function () {
        var t = this, n = this.options;
        this.element.addClass("ui-resizable"), e.extend(this, {_aspectRatio: !!n.aspectRatio, aspectRatio: n.aspectRatio, originalElement: this.element, _proportionallyResizeElements: [], _helper: n.helper || n.ghost || n.animate ? n.helper || "ui-resizable-helper" : null}), this.element[0].nodeName.match(/canvas|textarea|input|select|button|img/i) && (this.element.wrap(e('<div class="ui-wrapper" style="overflow: hidden;"></div>').css({position: this.element.css("position"), width: this.element.outerWidth(), height: this.element.outerHeight(), top: this.element.css("top"), left: this.element.css("left")})), this.element = this.element.parent().data("resizable", this.element.data("resizable")), this.elementIsWrapper = !0, this.element.css({marginLeft: this.originalElement.css("marginLeft"), marginTop: this.originalElement.css("marginTop"), marginRight: this.originalElement.css("marginRight"), marginBottom: this.originalElement.css("marginBottom")}), this.originalElement.css({marginLeft: 0, marginTop: 0, marginRight: 0, marginBottom: 0}), this.originalResizeStyle = this.originalElement.css("resize"), this.originalElement.css("resize", "none"), this._proportionallyResizeElements.push(this.originalElement.css({position: "static", zoom: 1, display: "block"})), this.originalElement.css({margin: this.originalElement.css("margin")}), this._proportionallyResize()), this.handles = n.handles || (e(".ui-resizable-handle", this.element).length ? {n: ".ui-resizable-n", e: ".ui-resizable-e", s: ".ui-resizable-s", w: ".ui-resizable-w", se: ".ui-resizable-se", sw: ".ui-resizable-sw", ne: ".ui-resizable-ne", nw: ".ui-resizable-nw"} : "e,s,se");
        if (this.handles.constructor == String) {
            this.handles == "all" && (this.handles = "n,e,s,w,se,sw,ne,nw");
            var r = this.handles.split(",");
            this.handles = {};
            for (var i = 0; i < r.length; i++) {
                var s = e.trim(r[i]), o = "ui-resizable-" + s, u = e('<div class="ui-resizable-handle ' + o + '"></div>');
                u.css({zIndex: n.zIndex}), "se" == s && u.addClass("ui-icon ui-icon-gripsmall-diagonal-se"), this.handles[s] = ".ui-resizable-" + s, this.element.append(u)
            }
        }
        this._renderAxis = function (t) {
            t = t || this.element;
            for (var n in this.handles) {
                this.handles[n].constructor == String && (this.handles[n] = e(this.handles[n], this.element).show());
                if (this.elementIsWrapper && this.originalElement[0].nodeName.match(/textarea|input|select|button/i)) {
                    var r = e(this.handles[n], this.element), i = 0;
                    i = /sw|ne|nw|se|n|s/.test(n) ? r.outerHeight() : r.outerWidth();
                    var s = ["padding", /ne|nw|n/.test(n) ? "Top" : /se|sw|s/.test(n) ? "Bottom" : /^e$/.test(n) ? "Right" : "Left"].join("");
                    t.css(s, i), this._proportionallyResize()
                }
                if (!e(this.handles[n]).length)continue
            }
        }, this._renderAxis(this.element), this._handles = e(".ui-resizable-handle", this.element).disableSelection(), this._handles.mouseover(function () {
            if (!t.resizing) {
                if (this.className)var e = this.className.match(/ui-resizable-(se|sw|ne|nw|n|e|s|w)/i);
                t.axis = e && e[1] ? e[1] : "se"
            }
        }), n.autoHide && (this._handles.hide(), e(this.element).addClass("ui-resizable-autohide").hover(function () {
            if (n.disabled)return;
            e(this).removeClass("ui-resizable-autohide"), t._handles.show()
        }, function () {
            if (n.disabled)return;
            t.resizing || (e(this).addClass("ui-resizable-autohide"), t._handles.hide())
        })), this._mouseInit()
    }, destroy: function () {
        this._mouseDestroy();
        var t = function (t) {
            e(t).removeClass("ui-resizable ui-resizable-disabled ui-resizable-resizing").removeData("resizable").unbind(".resizable").find(".ui-resizable-handle").remove()
        };
        if (this.elementIsWrapper) {
            t(this.element);
            var n = this.element;
            n.after(this.originalElement.css({position: n.css("position"), width: n.outerWidth(), height: n.outerHeight(), top: n.css("top"), left: n.css("left")})).remove()
        }
        return this.originalElement.css("resize", this.originalResizeStyle), t(this.originalElement), this
    }, _mouseCapture: function (t) {
        var n = !1;
        for (var r in this.handles)e(this.handles[r])[0] == t.target && (n = !0);
        return!this.options.disabled && n
    }, _mouseStart: function (t) {
        var r = this.options, i = this.element.position(), s = this.element;
        this.resizing = !0, this.documentScroll = {top: e(document).scrollTop(), left: e(document).scrollLeft()}, (s.is(".ui-draggable") || /absolute/.test(s.css("position"))) && s.css({position: "absolute", top: i.top, left: i.left}), this._renderProxy();
        var o = n(this.helper.css("left")), u = n(this.helper.css("top"));
        r.containment && (o += e(r.containment).scrollLeft() || 0, u += e(r.containment).scrollTop() || 0), this.offset = this.helper.offset(), this.position = {left: o, top: u}, this.size = this._helper ? {width: s.outerWidth(), height: s.outerHeight()} : {width: s.width(), height: s.height()}, this.originalSize = this._helper ? {width: s.outerWidth(), height: s.outerHeight()} : {width: s.width(), height: s.height()}, this.originalPosition = {left: o, top: u}, this.sizeDiff = {width: s.outerWidth() - s.width(), height: s.outerHeight() - s.height()}, this.originalMousePosition = {left: t.pageX, top: t.pageY}, this.aspectRatio = typeof r.aspectRatio == "number" ? r.aspectRatio : this.originalSize.width / this.originalSize.height || 1;
        var f = e(".ui-resizable-" + this.axis).css("cursor");
        return e("body").css("cursor", f == "auto" ? this.axis + "-resize" : f), s.addClass("ui-resizable-resizing"), this._propagate("start", t), !0
    }, _mouseDrag: function (t) {
        var n = this.helper, r = this.options, i = {}, s = this, o = this.originalMousePosition, u = this.axis, f = t.pageX - o.left || 0, l = t.pageY - o.top || 0, c = this._change[u];
        if (!c)return!1;
        var h = c.apply(this, [t, f, l]), p = e.browser.msie && e.browser.version < 7, d = this.sizeDiff;
        this._updateVirtualBoundaries(t.shiftKey);
        if (this._aspectRatio || t.shiftKey)h = this._updateRatio(h, t);
        return h = this._respectSize(h, t), this._propagate("resize", t), n.css({top: this.position.top + "px", left: this.position.left + "px", width: this.size.width + "px", height: this.size.height + "px"}), !this._helper && this._proportionallyResizeElements.length && this._proportionallyResize(), this._updateCache(h), this._trigger("resize", t, this.ui()), !1
    }, _mouseStop: function (t) {
        this.resizing = !1;
        var n = this.options, r = this;
        if (this._helper) {
            var i = this._proportionallyResizeElements, s = i.length && /textarea/i.test(i[0].nodeName), o = s && e.ui.hasScroll(i[0], "left") ? 0 : r.sizeDiff.height, u = s ? 0 : r.sizeDiff.width, f = {width: r.helper.width() - u, height: r.helper.height() - o}, l = parseInt(r.element.css("left"), 10) + (r.position.left - r.originalPosition.left) || null, c = parseInt(r.element.css("top"), 10) + (r.position.top - r.originalPosition.top) || null;
            n.animate || this.element.css(e.extend(f, {top: c, left: l})), r.helper.height(r.size.height), r.helper.width(r.size.width), this._helper && !n.animate && this._proportionallyResize()
        }
        return e("body").css("cursor", "auto"), this.element.removeClass("ui-resizable-resizing"), this._propagate("stop", t), this._helper && this.helper.remove(), !1
    }, _updateVirtualBoundaries: function (e) {
        var t = this.options, n, i, s, o, u;
        u = {minWidth: r(t.minWidth) ? t.minWidth : 0, maxWidth: r(t.maxWidth) ? t.maxWidth : Infinity, minHeight: r(t.minHeight) ? t.minHeight : 0, maxHeight: r(t.maxHeight) ? t.maxHeight : Infinity};
        if (this._aspectRatio || e)n = u.minHeight * this.aspectRatio, s = u.minWidth / this.aspectRatio, i = u.maxHeight * this.aspectRatio, o = u.maxWidth / this.aspectRatio, n > u.minWidth && (u.minWidth = n), s > u.minHeight && (u.minHeight = s), i < u.maxWidth && (u.maxWidth = i), o < u.maxHeight && (u.maxHeight = o);
        this._vBoundaries = u
    }, _updateCache: function (e) {
        var t = this.options;
        this.offset = this.helper.offset(), r(e.left) && (this.position.left = e.left), r(e.top) && (this.position.top = e.top), r(e.height) && (this.size.height = e.height), r(e.width) && (this.size.width = e.width)
    }, _updateRatio: function (e, t) {
        var n = this.options, i = this.position, s = this.size, o = this.axis;
        return r(e.height) ? e.width = e.height * this.aspectRatio : r(e.width) && (e.height = e.width / this.aspectRatio), o == "sw" && (e.left = i.left + (s.width - e.width), e.top = null), o == "nw" && (e.top = i.top + (s.height - e.height), e.left = i.left + (s.width - e.width)), e
    }, _respectSize: function (e, t) {
        var n = this.helper, i = this._vBoundaries, s = this._aspectRatio || t.shiftKey, o = this.axis, u = r(e.width) && i.maxWidth && i.maxWidth < e.width, a = r(e.height) && i.maxHeight && i.maxHeight < e.height, f = r(e.width) && i.minWidth && i.minWidth > e.width, l = r(e.height) && i.minHeight && i.minHeight > e.height;
        f && (e.width = i.minWidth), l && (e.height = i.minHeight), u && (e.width = i.maxWidth), a && (e.height = i.maxHeight);
        var c = this.originalPosition.left + this.originalSize.width, h = this.position.top + this.size.height, p = /sw|nw|w/.test(o), v = /nw|ne|n/.test(o);
        f && p && (e.left = c - i.minWidth), u && p && (e.left = c - i.maxWidth), l && v && (e.top = h - i.minHeight), a && v && (e.top = h - i.maxHeight);
        var m = !e.width && !e.height;
        return m && !e.left && e.top ? e.top = null : m && !e.top && e.left && (e.left = null), e
    }, _proportionallyResize: function () {
        var t = this.options;
        if (!this._proportionallyResizeElements.length)return;
        var n = this.helper || this.element;
        for (var r = 0; r < this._proportionallyResizeElements.length; r++) {
            var i = this._proportionallyResizeElements[r];
            if (!this.borderDif) {
                var s = [i.css("borderTopWidth"), i.css("borderRightWidth"), i.css("borderBottomWidth"), i.css("borderLeftWidth")], o = [i.css("paddingTop"), i.css("paddingRight"), i.css("paddingBottom"), i.css("paddingLeft")];
                this.borderDif = e.map(s, function (e, t) {
                    var n = parseInt(e, 10) || 0, r = parseInt(o[t], 10) || 0;
                    return n + r
                })
            }
            if (!(!e.browser.msie || !e(n).is(":hidden") && !e(n).parents(":hidden").length))continue;
            i.css({height: n.height() - this.borderDif[0] - this.borderDif[2] || 0, width: n.width() - this.borderDif[1] - this.borderDif[3] || 0})
        }
    }, _renderProxy: function () {
        var t = this.element, n = this.options;
        this.elementOffset = t.offset();
        if (this._helper) {
            this.helper = this.helper || e('<div style="overflow:hidden;"></div>');
            var r = e.browser.msie && e.browser.version < 7, i = r ? 1 : 0, s = r ? 2 : -1;
            this.helper.addClass(this._helper).css({width: this.element.outerWidth() + s, height: this.element.outerHeight() + s, position: "absolute", left: this.elementOffset.left - i + "px", top: this.elementOffset.top - i + "px", zIndex: ++n.zIndex}), this.helper.appendTo("body").disableSelection()
        } else this.helper = this.element
    }, _change: {e: function (e, t, n) {
        return{width: this.originalSize.width + t}
    }, w: function (e, t, n) {
        var r = this.options, i = this.originalSize, s = this.originalPosition;
        return{left: s.left + t, width: i.width - t}
    }, n: function (e, t, n) {
        var r = this.options, i = this.originalSize, s = this.originalPosition;
        return{top: s.top + n, height: i.height - n}
    }, s: function (e, t, n) {
        return{height: this.originalSize.height + n}
    }, se: function (t, n, r) {
        return e.extend(this._change.s.apply(this, arguments), this._change.e.apply(this, [t, n, r]))
    }, sw: function (t, n, r) {
        return e.extend(this._change.s.apply(this, arguments), this._change.w.apply(this, [t, n, r]))
    }, ne: function (t, n, r) {
        return e.extend(this._change.n.apply(this, arguments), this._change.e.apply(this, [t, n, r]))
    }, nw: function (t, n, r) {
        return e.extend(this._change.n.apply(this, arguments), this._change.w.apply(this, [t, n, r]))
    }}, _propagate: function (t, n) {
        e.ui.plugin.call(this, t, [n, this.ui()]), t != "resize" && this._trigger(t, n, this.ui())
    }, plugins: {}, ui: function () {
        return{originalElement: this.originalElement, element: this.element, helper: this.helper, position: this.position, size: this.size, originalSize: this.originalSize, originalPosition: this.originalPosition}
    }}), e.extend(e.ui.resizable, {version: "1.8.24"}), e.ui.plugin.add("resizable", "alsoResize", {start: function (t, n) {
        var r = e(this).data("resizable"), i = r.options, s = function (t) {
            e(t).each(function () {
                var t = e(this);
                t.data("resizable-alsoresize", {width: parseInt(t.width(), 10), height: parseInt(t.height(), 10), left: parseInt(t.css("left"), 10), top: parseInt(t.css("top"), 10)})
            })
        };
        typeof i.alsoResize == "object" && !i.alsoResize.parentNode ? i.alsoResize.length ? (i.alsoResize = i.alsoResize[0], s(i.alsoResize)) : e.each(i.alsoResize, function (e) {
            s(e)
        }) : s(i.alsoResize)
    }, resize: function (t, n) {
        var r = e(this).data("resizable"), i = r.options, s = r.originalSize, o = r.originalPosition, u = {height: r.size.height - s.height || 0, width: r.size.width - s.width || 0, top: r.position.top - o.top || 0, left: r.position.left - o.left || 0}, f = function (t, r) {
            e(t).each(function () {
                var t = e(this), i = e(this).data("resizable-alsoresize"), s = {}, o = r && r.length ? r : t.parents(n.originalElement[0]).length ? ["width", "height"] : ["width", "height", "top", "left"];
                e.each(o, function (e, t) {
                    var n = (i[t] || 0) + (u[t] || 0);
                    n && n >= 0 && (s[t] = n || null)
                }), t.css(s)
            })
        };
        typeof i.alsoResize == "object" && !i.alsoResize.nodeType ? e.each(i.alsoResize, function (e, t) {
            f(e, t)
        }) : f(i.alsoResize)
    }, stop: function (t, n) {
        e(this).removeData("resizable-alsoresize")
    }}), e.ui.plugin.add("resizable", "animate", {stop: function (t, n) {
        var r = e(this).data("resizable"), i = r.options, s = r._proportionallyResizeElements, o = s.length && /textarea/i.test(s[0].nodeName), u = o && e.ui.hasScroll(s[0], "left") ? 0 : r.sizeDiff.height, f = o ? 0 : r.sizeDiff.width, l = {width: r.size.width - f, height: r.size.height - u}, c = parseInt(r.element.css("left"), 10) + (r.position.left - r.originalPosition.left) || null, h = parseInt(r.element.css("top"), 10) + (r.position.top - r.originalPosition.top) || null;
        r.element.animate(e.extend(l, h && c ? {top: h, left: c} : {}), {duration: i.animateDuration, easing: i.animateEasing, step: function () {
            var n = {width: parseInt(r.element.css("width"), 10), height: parseInt(r.element.css("height"), 10), top: parseInt(r.element.css("top"), 10), left: parseInt(r.element.css("left"), 10)};
            s && s.length && e(s[0]).css({width: n.width, height: n.height}), r._updateCache(n), r._propagate("resize", t)
        }})
    }}), e.ui.plugin.add("resizable", "containment", {start: function (t, r) {
        var i = e(this).data("resizable"), s = i.options, o = i.element, u = s.containment, f = u instanceof e ? u.get(0) : /parent/.test(u) ? o.parent().get(0) : u;
        if (!f)return;
        i.containerElement = e(f);
        if (/document/.test(u) || u == document)i.containerOffset = {left: 0, top: 0}, i.containerPosition = {left: 0, top: 0}, i.parentData = {element: e(document), left: 0, top: 0, width: e(document).width(), height: e(document).height() || document.body.parentNode.scrollHeight}; else {
            var l = e(f), h = [];
            e(["Top", "Right", "Left", "Bottom"]).each(function (e, t) {
                h[e] = n(l.css("padding" + t))
            }), i.containerOffset = l.offset(), i.containerPosition = l.position(), i.containerSize = {height: l.innerHeight() - h[3], width: l.innerWidth() - h[1]};
            var p = i.containerOffset, d = i.containerSize.height, v = i.containerSize.width, m = e.ui.hasScroll(f, "left") ? f.scrollWidth : v, g = e.ui.hasScroll(f) ? f.scrollHeight : d;
            i.parentData = {element: f, left: p.left, top: p.top, width: m, height: g}
        }
    }, resize: function (t, n) {
        var r = e(this).data("resizable"), i = r.options, s = r.containerSize, o = r.containerOffset, u = r.size, f = r.position, l = r._aspectRatio || t.shiftKey, c = {top: 0, left: 0}, h = r.containerElement;
        h[0] != document && /static/.test(h.css("position")) && (c = o), f.left < (r._helper ? o.left : 0) && (r.size.width = r.size.width + (r._helper ? r.position.left - o.left : r.position.left - c.left), l && (r.size.height = r.size.width / r.aspectRatio), r.position.left = i.helper ? o.left : 0), f.top < (r._helper ? o.top : 0) && (r.size.height = r.size.height + (r._helper ? r.position.top - o.top : r.position.top), l && (r.size.width = r.size.height * r.aspectRatio), r.position.top = r._helper ? o.top : 0), r.offset.left = r.parentData.left + r.position.left, r.offset.top = r.parentData.top + r.position.top;
        var p = Math.abs((r._helper ? r.offset.left - c.left : r.offset.left - c.left) + r.sizeDiff.width), d = Math.abs((r._helper ? r.offset.top - c.top : r.offset.top - o.top) + r.sizeDiff.height), v = r.containerElement.get(0) == r.element.parent().get(0), m = /relative|absolute/.test(r.containerElement.css("position"));
        v && m && (p -= r.parentData.left), p + r.size.width >= r.parentData.width && (r.size.width = r.parentData.width - p, l && (r.size.height = r.size.width / r.aspectRatio)), d + r.size.height >= r.parentData.height && (r.size.height = r.parentData.height - d, l && (r.size.width = r.size.height * r.aspectRatio))
    }, stop: function (t, n) {
        var r = e(this).data("resizable"), i = r.options, s = r.position, o = r.containerOffset, u = r.containerPosition, f = r.containerElement, l = e(r.helper), c = l.offset(), h = l.outerWidth() - r.sizeDiff.width, p = l.outerHeight() - r.sizeDiff.height;
        r._helper && !i.animate && /relative/.test(f.css("position")) && e(this).css({left: c.left - u.left - o.left, width: h, height: p}), r._helper && !i.animate && /static/.test(f.css("position")) && e(this).css({left: c.left - u.left - o.left, width: h, height: p})
    }}), e.ui.plugin.add("resizable", "ghost", {start: function (t, n) {
        var r = e(this).data("resizable"), i = r.options, s = r.size;
        r.ghost = r.originalElement.clone(), r.ghost.css({opacity: .25, display: "block", position: "relative", height: s.height, width: s.width, margin: 0, left: 0, top: 0}).addClass("ui-resizable-ghost").addClass(typeof i.ghost == "string" ? i.ghost : ""), r.ghost.appendTo(r.helper)
    }, resize: function (t, n) {
        var r = e(this).data("resizable"), i = r.options;
        r.ghost && r.ghost.css({position: "relative", height: r.size.height, width: r.size.width})
    }, stop: function (t, n) {
        var r = e(this).data("resizable"), i = r.options;
        r.ghost && r.helper && r.helper.get(0).removeChild(r.ghost.get(0))
    }}), e.ui.plugin.add("resizable", "grid", {resize: function (t, n) {
        var r = e(this).data("resizable"), i = r.options, s = r.size, o = r.originalSize, u = r.originalPosition, f = r.axis, l = i._aspectRatio || t.shiftKey;
        i.grid = typeof i.grid == "number" ? [i.grid, i.grid] : i.grid;
        var c = Math.round((s.width - o.width) / (i.grid[0] || 1)) * (i.grid[0] || 1), h = Math.round((s.height - o.height) / (i.grid[1] || 1)) * (i.grid[1] || 1);
        /^(se|s|e)$/.test(f) ? (r.size.width = o.width + c, r.size.height = o.height + h) : /^(ne)$/.test(f) ? (r.size.width = o.width + c, r.size.height = o.height + h, r.position.top = u.top - h) : /^(sw)$/.test(f) ? (r.size.width = o.width + c, r.size.height = o.height + h, r.position.left = u.left - c) : (r.size.width = o.width + c, r.size.height = o.height + h, r.position.top = u.top - h, r.position.left = u.left - c)
    }});
    var n = function (e) {
        return parseInt(e, 10) || 0
    }, r = function (e) {
        return!isNaN(parseInt(e, 10))
    }
}(jQuery), function (e, t) {
    e.widget("ui.selectable", e.ui.mouse, {options: {appendTo: "body", autoRefresh: !0, distance: 0, filter: "*", tolerance: "touch"}, _create: function () {
        var t = this;
        this.element.addClass("ui-selectable"), this.dragged = !1;
        var n;
        this.refresh = function () {
            n = e(t.options.filter, t.element[0]), n.addClass("ui-selectee"), n.each(function () {
                var t = e(this), n = t.offset();
                e.data(this, "selectable-item", {element: this, $element: t, left: n.left, top: n.top, right: n.left + t.outerWidth(), bottom: n.top + t.outerHeight(), startselected: !1, selected: t.hasClass("ui-selected"), selecting: t.hasClass("ui-selecting"), unselecting: t.hasClass("ui-unselecting")})
            })
        }, this.refresh(), this.selectees = n.addClass("ui-selectee"), this._mouseInit(), this.helper = e("<div class='ui-selectable-helper'></div>")
    }, destroy: function () {
        return this.selectees.removeClass("ui-selectee").removeData("selectable-item"), this.element.removeClass("ui-selectable ui-selectable-disabled").removeData("selectable").unbind(".selectable"), this._mouseDestroy(), this
    }, _mouseStart: function (t) {
        var n = this;
        this.opos = [t.pageX, t.pageY];
        if (this.options.disabled)return;
        var r = this.options;
        this.selectees = e(r.filter, this.element[0]), this._trigger("start", t), e(r.appendTo).append(this.helper), this.helper.css({left: t.clientX, top: t.clientY, width: 0, height: 0}), r.autoRefresh && this.refresh(), this.selectees.filter(".ui-selected").each(function () {
            var r = e.data(this, "selectable-item");
            r.startselected = !0, !t.metaKey && !t.ctrlKey && (r.$element.removeClass("ui-selected"), r.selected = !1, r.$element.addClass("ui-unselecting"), r.unselecting = !0, n._trigger("unselecting", t, {unselecting: r.element}))
        }), e(t.target).parents().andSelf().each(function () {
            var r = e.data(this, "selectable-item");
            if (r) {
                var i = !t.metaKey && !t.ctrlKey || !r.$element.hasClass("ui-selected");
                return r.$element.removeClass(i ? "ui-unselecting" : "ui-selected").addClass(i ? "ui-selecting" : "ui-unselecting"), r.unselecting = !i, r.selecting = i, r.selected = i, i ? n._trigger("selecting", t, {selecting: r.element}) : n._trigger("unselecting", t, {unselecting: r.element}), !1
            }
        })
    }, _mouseDrag: function (t) {
        var n = this;
        this.dragged = !0;
        if (this.options.disabled)return;
        var r = this.options, i = this.opos[0], s = this.opos[1], o = t.pageX, u = t.pageY;
        if (i > o) {
            var f = o;
            o = i, i = f
        }
        if (s > u) {
            var f = u;
            u = s, s = f
        }
        return this.helper.css({left: i, top: s, width: o - i, height: u - s}), this.selectees.each(function () {
            var f = e.data(this, "selectable-item");
            if (!f || f.element == n.element[0])return;
            var l = !1;
            r.tolerance == "touch" ? l = !(f.left > o || f.right < i || f.top > u || f.bottom < s) : r.tolerance == "fit" && (l = f.left > i && f.right < o && f.top > s && f.bottom < u), l ? (f.selected && (f.$element.removeClass("ui-selected"), f.selected = !1), f.unselecting && (f.$element.removeClass("ui-unselecting"), f.unselecting = !1), f.selecting || (f.$element.addClass("ui-selecting"), f.selecting = !0, n._trigger("selecting", t, {selecting: f.element}))) : (f.selecting && ((t.metaKey || t.ctrlKey) && f.startselected ? (f.$element.removeClass("ui-selecting"), f.selecting = !1, f.$element.addClass("ui-selected"), f.selected = !0) : (f.$element.removeClass("ui-selecting"), f.selecting = !1, f.startselected && (f.$element.addClass("ui-unselecting"), f.unselecting = !0), n._trigger("unselecting", t, {unselecting: f.element}))), f.selected && !t.metaKey && !t.ctrlKey && !f.startselected && (f.$element.removeClass("ui-selected"), f.selected = !1, f.$element.addClass("ui-unselecting"), f.unselecting = !0, n._trigger("unselecting", t, {unselecting: f.element})))
        }), !1
    }, _mouseStop: function (t) {
        var n = this;
        this.dragged = !1;
        var r = this.options;
        return e(".ui-unselecting", this.element[0]).each(function () {
            var r = e.data(this, "selectable-item");
            r.$element.removeClass("ui-unselecting"), r.unselecting = !1, r.startselected = !1, n._trigger("unselected", t, {unselected: r.element})
        }), e(".ui-selecting", this.element[0]).each(function () {
            var r = e.data(this, "selectable-item");
            r.$element.removeClass("ui-selecting").addClass("ui-selected"), r.selecting = !1, r.selected = !0, r.startselected = !0, n._trigger("selected", t, {selected: r.element})
        }), this._trigger("stop", t), this.helper.remove(), !1
    }}), e.extend(e.ui.selectable, {version: "1.8.24"})
}(jQuery), function (e, t) {
    e.widget("ui.sortable", e.ui.mouse, {widgetEventPrefix: "sort", ready: !1, options: {appendTo: "parent", axis: !1, connectWith: !1, containment: !1, cursor: "auto", cursorAt: !1, dropOnEmpty: !0, forcePlaceholderSize: !1, forceHelperSize: !1, grid: !1, handle: !1, helper: "original", items: "> *", opacity: !1, placeholder: !1, revert: !1, scroll: !0, scrollSensitivity: 20, scrollSpeed: 20, scope: "default", tolerance: "intersect", zIndex: 1e3}, _create: function () {
        var e = this.options;
        this.containerCache = {}, this.element.addClass("ui-sortable"), this.refresh(), this.floating = this.items.length ? e.axis === "x" || /left|right/.test(this.items[0].item.css("float")) || /inline|table-cell/.test(this.items[0].item.css("display")) : !1, this.offset = this.element.offset(), this._mouseInit(), this.ready = !0
    }, destroy: function () {
        e.Widget.prototype.destroy.call(this), this.element.removeClass("ui-sortable ui-sortable-disabled"), this._mouseDestroy();
        for (var t = this.items.length - 1; t >= 0; t--)this.items[t].item.removeData(this.widgetName + "-item");
        return this
    }, _setOption: function (t, n) {
        t === "disabled" ? (this.options[t] = n, this.widget()[n ? "addClass" : "removeClass"]("ui-sortable-disabled")) : e.Widget.prototype._setOption.apply(this, arguments)
    }, _mouseCapture: function (t, n) {
        var r = this;
        if (this.reverting)return!1;
        if (this.options.disabled || this.options.type == "static")return!1;
        this._refreshItems(t);
        var i = null, s = this, o = e(t.target).parents().each(function () {
            if (e.data(this, r.widgetName + "-item") == s)return i = e(this), !1
        });
        e.data(t.target, r.widgetName + "-item") == s && (i = e(t.target));
        if (!i)return!1;
        if (this.options.handle && !n) {
            var u = !1;
            e(this.options.handle, i).find("*").andSelf().each(function () {
                this == t.target && (u = !0)
            });
            if (!u)return!1
        }
        return this.currentItem = i, this._removeCurrentsFromItems(), !0
    }, _mouseStart: function (t, n, r) {
        var i = this.options, s = this;
        this.currentContainer = this, this.refreshPositions(), this.helper = this._createHelper(t), this._cacheHelperProportions(), this._cacheMargins(), this.scrollParent = this.helper.scrollParent(), this.offset = this.currentItem.offset(), this.offset = {top: this.offset.top - this.margins.top, left: this.offset.left - this.margins.left}, e.extend(this.offset, {click: {left: t.pageX - this.offset.left, top: t.pageY - this.offset.top}, parent: this._getParentOffset(), relative: this._getRelativeOffset()}), this.helper.css("position", "absolute"), this.cssPosition = this
            .helper.css("position"), this.originalPosition = this._generatePosition(t), this.originalPageX = t.pageX, this.originalPageY = t.pageY, i.cursorAt && this._adjustOffsetFromHelper(i.cursorAt), this.domPosition = {prev: this.currentItem.prev()[0], parent: this.currentItem.parent()[0]}, this.helper[0] != this.currentItem[0] && this.currentItem.hide(), this._createPlaceholder(), i.containment && this._setContainment(), i.cursor && (e("body").css("cursor") && (this._storedCursor = e("body").css("cursor")), e("body").css("cursor", i.cursor)), i.opacity && (this.helper.css("opacity") && (this._storedOpacity = this.helper.css("opacity")), this.helper.css("opacity", i.opacity)), i.zIndex && (this.helper.css("zIndex") && (this._storedZIndex = this.helper.css("zIndex")), this.helper.css("zIndex", i.zIndex)), this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" && (this.overflowOffset = this.scrollParent.offset()), this._trigger("start", t, this._uiHash()), this._preserveHelperProportions || this._cacheHelperProportions();
        if (!r)for (var o = this.containers.length - 1; o >= 0; o--)this.containers[o]._trigger("activate", t, s._uiHash(this));
        return e.ui.ddmanager && (e.ui.ddmanager.current = this), e.ui.ddmanager && !i.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t), this.dragging = !0, this.helper.addClass("ui-sortable-helper"), this._mouseDrag(t), !0
    }, _mouseDrag: function (t) {
        this.position = this._generatePosition(t), this.positionAbs = this._convertPositionTo("absolute"), this.lastPositionAbs || (this.lastPositionAbs = this.positionAbs);
        if (this.options.scroll) {
            var n = this.options, r = !1;
            this.scrollParent[0] != document && this.scrollParent[0].tagName != "HTML" ? (this.overflowOffset.top + this.scrollParent[0].offsetHeight - t.pageY < n.scrollSensitivity ? this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop + n.scrollSpeed : t.pageY - this.overflowOffset.top < n.scrollSensitivity && (this.scrollParent[0].scrollTop = r = this.scrollParent[0].scrollTop - n.scrollSpeed), this.overflowOffset.left + this.scrollParent[0].offsetWidth - t.pageX < n.scrollSensitivity ? this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft + n.scrollSpeed : t.pageX - this.overflowOffset.left < n.scrollSensitivity && (this.scrollParent[0].scrollLeft = r = this.scrollParent[0].scrollLeft - n.scrollSpeed)) : (t.pageY - e(document).scrollTop() < n.scrollSensitivity ? r = e(document).scrollTop(e(document).scrollTop() - n.scrollSpeed) : e(window).height() - (t.pageY - e(document).scrollTop()) < n.scrollSensitivity && (r = e(document).scrollTop(e(document).scrollTop() + n.scrollSpeed)), t.pageX - e(document).scrollLeft() < n.scrollSensitivity ? r = e(document).scrollLeft(e(document).scrollLeft() - n.scrollSpeed) : e(window).width() - (t.pageX - e(document).scrollLeft()) < n.scrollSensitivity && (r = e(document).scrollLeft(e(document).scrollLeft() + n.scrollSpeed))), r !== !1 && e.ui.ddmanager && !n.dropBehaviour && e.ui.ddmanager.prepareOffsets(this, t)
        }
        this.positionAbs = this._convertPositionTo("absolute");
        if (!this.options.axis || this.options.axis != "y")this.helper[0].style.left = this.position.left + "px";
        if (!this.options.axis || this.options.axis != "x")this.helper[0].style.top = this.position.top + "px";
        for (var i = this.items.length - 1; i >= 0; i--) {
            var s = this.items[i], o = s.item[0], u = this._intersectsWithPointer(s);
            if (!u)continue;
            if (s.instance !== this.currentContainer)continue;
            if (o != this.currentItem[0] && this.placeholder[u == 1 ? "next" : "prev"]()[0] != o && !e.ui.contains(this.placeholder[0], o) && (this.options.type == "semi-dynamic" ? !e.ui.contains(this.element[0], o) : !0)) {
                this.direction = u == 1 ? "down" : "up";
                if (this.options.tolerance != "pointer" && !this._intersectsWithSides(s))break;
                this._rearrange(t, s), this._trigger("change", t, this._uiHash());
                break
            }
        }
        return this._contactContainers(t), e.ui.ddmanager && e.ui.ddmanager.drag(this, t), this._trigger("sort", t, this._uiHash()), this.lastPositionAbs = this.positionAbs, !1
    }, _mouseStop: function (t, n) {
        if (!t)return;
        e.ui.ddmanager && !this.options.dropBehaviour && e.ui.ddmanager.drop(this, t);
        if (this.options.revert) {
            var r = this, i = r.placeholder.offset();
            r.reverting = !0, e(this.helper).animate({left: i.left - this.offset.parent.left - r.margins.left + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollLeft), top: i.top - this.offset.parent.top - r.margins.top + (this.offsetParent[0] == document.body ? 0 : this.offsetParent[0].scrollTop)}, parseInt(this.options.revert, 10) || 500, function () {
                r._clear(t)
            })
        } else this._clear(t, n);
        return!1
    }, cancel: function () {
        var t = this;
        if (this.dragging) {
            this._mouseUp({target: null}), this.options.helper == "original" ? this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper") : this.currentItem.show();
            for (var n = this.containers.length - 1; n >= 0; n--)this.containers[n]._trigger("deactivate", null, t._uiHash(this)), this.containers[n].containerCache.over && (this.containers[n]._trigger("out", null, t._uiHash(this)), this.containers[n].containerCache.over = 0)
        }
        return this.placeholder && (this.placeholder[0].parentNode && this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.options.helper != "original" && this.helper && this.helper[0].parentNode && this.helper.remove(), e.extend(this, {helper: null, dragging: !1, reverting: !1, _noFinalSort: null}), this.domPosition.prev ? e(this.domPosition.prev).after(this.currentItem) : e(this.domPosition.parent).prepend(this.currentItem)), this
    }, serialize: function (t) {
        var n = this._getItemsAsjQuery(t && t.connected), r = [];
        return t = t || {}, e(n).each(function () {
            var n = (e(t.item || this).attr(t.attribute || "id") || "").match(t.expression || /(.+)[-=_](.+)/);
            n && r.push((t.key || n[1] + "[]") + "=" + (t.key && t.expression ? n[1] : n[2]))
        }), !r.length && t.key && r.push(t.key + "="), r.join("&")
    }, toArray: function (t) {
        var n = this._getItemsAsjQuery(t && t.connected), r = [];
        return t = t || {}, n.each(function () {
            r.push(e(t.item || this).attr(t.attribute || "id") || "")
        }), r
    }, _intersectsWith: function (e) {
        var t = this.positionAbs.left, n = t + this.helperProportions.width, r = this.positionAbs.top, i = r + this.helperProportions.height, s = e.left, o = s + e.width, u = e.top, a = u + e.height, f = this.offset.click.top, l = this.offset.click.left, c = r + f > u && r + f < a && t + l > s && t + l < o;
        return this.options.tolerance == "pointer" || this.options.forcePointerForContainers || this.options.tolerance != "pointer" && this.helperProportions[this.floating ? "width" : "height"] > e[this.floating ? "width" : "height"] ? c : s < t + this.helperProportions.width / 2 && n - this.helperProportions.width / 2 < o && u < r + this.helperProportions.height / 2 && i - this.helperProportions.height / 2 < a
    }, _intersectsWithPointer: function (t) {
        var n = this.options.axis === "x" || e.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, t.top, t.height), r = this.options.axis === "y" || e.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, t.left, t.width), i = n && r, s = this._getDragVerticalDirection(), o = this._getDragHorizontalDirection();
        return i ? this.floating ? o && o == "right" || s == "down" ? 2 : 1 : s && (s == "down" ? 2 : 1) : !1
    }, _intersectsWithSides: function (t) {
        var n = e.ui.isOverAxis(this.positionAbs.top + this.offset.click.top, t.top + t.height / 2, t.height), r = e.ui.isOverAxis(this.positionAbs.left + this.offset.click.left, t.left + t.width / 2, t.width), i = this._getDragVerticalDirection(), s = this._getDragHorizontalDirection();
        return this.floating && s ? s == "right" && r || s == "left" && !r : i && (i == "down" && n || i == "up" && !n)
    }, _getDragVerticalDirection: function () {
        var e = this.positionAbs.top - this.lastPositionAbs.top;
        return e != 0 && (e > 0 ? "down" : "up")
    }, _getDragHorizontalDirection: function () {
        var e = this.positionAbs.left - this.lastPositionAbs.left;
        return e != 0 && (e > 0 ? "right" : "left")
    }, refresh: function (e) {
        return this._refreshItems(e), this.refreshPositions(), this
    }, _connectWith: function () {
        var e = this.options;
        return e.connectWith.constructor == String ? [e.connectWith] : e.connectWith
    }, _getItemsAsjQuery: function (t) {
        var n = this, r = [], i = [], s = this._connectWith();
        if (s && t)for (var o = s.length - 1; o >= 0; o--) {
            var u = e(s[o]);
            for (var f = u.length - 1; f >= 0; f--) {
                var l = e.data(u[f], this.widgetName);
                l && l != this && !l.options.disabled && i.push([e.isFunction(l.options.items) ? l.options.items.call(l.element) : e(l.options.items, l.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), l])
            }
        }
        i.push([e.isFunction(this.options.items) ? this.options.items.call(this.element, null, {options: this.options, item: this.currentItem}) : e(this.options.items, this.element).not(".ui-sortable-helper").not(".ui-sortable-placeholder"), this]);
        for (var o = i.length - 1; o >= 0; o--)i[o][0].each(function () {
            r.push(this)
        });
        return e(r)
    }, _removeCurrentsFromItems: function () {
        var e = this.currentItem.find(":data(" + this.widgetName + "-item)");
        for (var t = 0; t < this.items.length; t++)for (var n = 0; n < e.length; n++)e[n] == this.items[t].item[0] && this.items.splice(t, 1)
    }, _refreshItems: function (t) {
        this.items = [], this.containers = [this];
        var n = this.items, r = this, i = [
            [e.isFunction(this.options.items) ? this.options.items.call(this.element[0], t, {item: this.currentItem}) : e(this.options.items, this.element), this]
        ], s = this._connectWith();
        if (s && this.ready)for (var o = s.length - 1; o >= 0; o--) {
            var u = e(s[o]);
            for (var f = u.length - 1; f >= 0; f--) {
                var l = e.data(u[f], this.widgetName);
                l && l != this && !l.options.disabled && (i.push([e.isFunction(l.options.items) ? l.options.items.call(l.element[0], t, {item: this.currentItem}) : e(l.options.items, l.element), l]), this.containers.push(l))
            }
        }
        for (var o = i.length - 1; o >= 0; o--) {
            var c = i[o][1], h = i[o][0];
            for (var f = 0, p = h.length; f < p; f++) {
                var d = e(h[f]);
                d.data(this.widgetName + "-item", c), n.push({item: d, instance: c, width: 0, height: 0, left: 0, top: 0})
            }
        }
    }, refreshPositions: function (t) {
        this.offsetParent && this.helper && (this.offset.parent = this._getParentOffset());
        for (var n = this.items.length - 1; n >= 0; n--) {
            var r = this.items[n];
            if (r.instance != this.currentContainer && this.currentContainer && r.item[0] != this.currentItem[0])continue;
            var i = this.options.toleranceElement ? e(this.options.toleranceElement, r.item) : r.item;
            t || (r.width = i.outerWidth(), r.height = i.outerHeight());
            var s = i.offset();
            r.left = s.left, r.top = s.top
        }
        if (this.options.custom && this.options.custom.refreshContainers)this.options.custom.refreshContainers.call(this); else for (var n = this.containers.length - 1; n >= 0; n--) {
            var s = this.containers[n].element.offset();
            this.containers[n].containerCache.left = s.left, this.containers[n].containerCache.top = s.top, this.containers[n].containerCache.width = this.containers[n].element.outerWidth(), this.containers[n].containerCache.height = this.containers[n].element.outerHeight()
        }
        return this
    }, _createPlaceholder: function (t) {
        var n = t || this, r = n.options;
        if (!r.placeholder || r.placeholder.constructor == String) {
            var i = r.placeholder;
            r.placeholder = {element: function () {
                var t = e(document.createElement(n.currentItem[0].nodeName)).addClass(i || n.currentItem[0].className + " ui-sortable-placeholder").removeClass("ui-sortable-helper")[0];
                return i || (t.style.visibility = "hidden"), t
            }, update: function (e, t) {
                if (i && !r.forcePlaceholderSize)return;
                t.height() || t.height(n.currentItem.innerHeight() - parseInt(n.currentItem.css("paddingTop") || 0, 10) - parseInt(n.currentItem.css("paddingBottom") || 0, 10)), t.width() || t.width(n.currentItem.innerWidth() - parseInt(n.currentItem.css("paddingLeft") || 0, 10) - parseInt(n.currentItem.css("paddingRight") || 0, 10))
            }}
        }
        n.placeholder = e(r.placeholder.element.call(n.element, n.currentItem)), n.currentItem.after(n.placeholder), r.placeholder.update(n, n.placeholder)
    }, _contactContainers: function (t) {
        var n = null, r = null;
        for (var i = this.containers.length - 1; i >= 0; i--) {
            if (e.ui.contains(this.currentItem[0], this.containers[i].element[0]))continue;
            if (this._intersectsWith(this.containers[i].containerCache)) {
                if (n && e.ui.contains(this.containers[i].element[0], n.element[0]))continue;
                n = this.containers[i], r = i
            } else this.containers[i].containerCache.over && (this.containers[i]._trigger("out", t, this._uiHash(this)), this.containers[i].containerCache.over = 0)
        }
        if (!n)return;
        if (this.containers.length === 1)this.containers[r]._trigger("over", t, this._uiHash(this)), this.containers[r].containerCache.over = 1; else if (this.currentContainer != this.containers[r]) {
            var s = 1e4, o = null, u = this.positionAbs[this.containers[r].floating ? "left" : "top"];
            for (var f = this.items.length - 1; f >= 0; f--) {
                if (!e.ui.contains(this.containers[r].element[0], this.items[f].item[0]))continue;
                var l = this.containers[r].floating ? this.items[f].item.offset().left : this.items[f].item.offset().top;
                Math.abs(l - u) < s && (s = Math.abs(l - u), o = this.items[f], this.direction = l - u > 0 ? "down" : "up")
            }
            if (!o && !this.options.dropOnEmpty)return;
            this.currentContainer = this.containers[r], o ? this._rearrange(t, o, null, !0) : this._rearrange(t, null, this.containers[r].element, !0), this._trigger("change", t, this._uiHash()), this.containers[r]._trigger("change", t, this._uiHash(this)), this.options.placeholder.update(this.currentContainer, this.placeholder), this.containers[r]._trigger("over", t, this._uiHash(this)), this.containers[r].containerCache.over = 1
        }
    }, _createHelper: function (t) {
        var n = this.options, r = e.isFunction(n.helper) ? e(n.helper.apply(this.element[0], [t, this.currentItem])) : n.helper == "clone" ? this.currentItem.clone() : this.currentItem;
        return r.parents("body").length || e(n.appendTo != "parent" ? n.appendTo : this.currentItem[0].parentNode)[0].appendChild(r[0]), r[0] == this.currentItem[0] && (this._storedCSS = {width: this.currentItem[0].style.width, height: this.currentItem[0].style.height, position: this.currentItem.css("position"), top: this.currentItem.css("top"), left: this.currentItem.css("left")}), (r[0].style.width == "" || n.forceHelperSize) && r.width(this.currentItem.width()), (r[0].style.height == "" || n.forceHelperSize) && r.height(this.currentItem.height()), r
    }, _adjustOffsetFromHelper: function (t) {
        typeof t == "string" && (t = t.split(" ")), e.isArray(t) && (t = {left: +t[0], top: +t[1] || 0}), "left"in t && (this.offset.click.left = t.left + this.margins.left), "right"in t && (this.offset.click.left = this.helperProportions.width - t.right + this.margins.left), "top"in t && (this.offset.click.top = t.top + this.margins.top), "bottom"in t && (this.offset.click.top = this.helperProportions.height - t.bottom + this.margins.top)
    }, _getParentOffset: function () {
        this.offsetParent = this.helper.offsetParent();
        var t = this.offsetParent.offset();
        this.cssPosition == "absolute" && this.scrollParent[0] != document && e.ui.contains(this.scrollParent[0], this.offsetParent[0]) && (t.left += this.scrollParent.scrollLeft(), t.top += this.scrollParent.scrollTop());
        if (this.offsetParent[0] == document.body || this.offsetParent[0].tagName && this.offsetParent[0].tagName.toLowerCase() == "html" && e.browser.msie)t = {top: 0, left: 0};
        return{top: t.top + (parseInt(this.offsetParent.css("borderTopWidth"), 10) || 0), left: t.left + (parseInt(this.offsetParent.css("borderLeftWidth"), 10) || 0)}
    }, _getRelativeOffset: function () {
        if (this.cssPosition == "relative") {
            var e = this.currentItem.position();
            return{top: e.top - (parseInt(this.helper.css("top"), 10) || 0) + this.scrollParent.scrollTop(), left: e.left - (parseInt(this.helper.css("left"), 10) || 0) + this.scrollParent.scrollLeft()}
        }
        return{top: 0, left: 0}
    }, _cacheMargins: function () {
        this.margins = {left: parseInt(this.currentItem.css("marginLeft"), 10) || 0, top: parseInt(this.currentItem.css("marginTop"), 10) || 0}
    }, _cacheHelperProportions: function () {
        this.helperProportions = {width: this.helper.outerWidth(), height: this.helper.outerHeight()}
    }, _setContainment: function () {
        var t = this.options;
        t.containment == "parent" && (t.containment = this.helper[0].parentNode);
        if (t.containment == "document" || t.containment == "window")this.containment = [0 - this.offset.relative.left - this.offset.parent.left, 0 - this.offset.relative.top - this.offset.parent.top, e(t.containment == "document" ? document : window).width() - this.helperProportions.width - this.margins.left, (e(t.containment == "document" ? document : window).height() || document.body.parentNode.scrollHeight) - this.helperProportions.height - this.margins.top];
        if (!/^(document|window|parent)$/.test(t.containment)) {
            var n = e(t.containment)[0], r = e(t.containment).offset(), i = e(n).css("overflow") != "hidden";
            this.containment = [r.left + (parseInt(e(n).css("borderLeftWidth"), 10) || 0) + (parseInt(e(n).css("paddingLeft"), 10) || 0) - this.margins.left, r.top + (parseInt(e(n).css("borderTopWidth"), 10) || 0) + (parseInt(e(n).css("paddingTop"), 10) || 0) - this.margins.top, r.left + (i ? Math.max(n.scrollWidth, n.offsetWidth) : n.offsetWidth) - (parseInt(e(n).css("borderLeftWidth"), 10) || 0) - (parseInt(e(n).css("paddingRight"), 10) || 0) - this.helperProportions.width - this.margins.left, r.top + (i ? Math.max(n.scrollHeight, n.offsetHeight) : n.offsetHeight) - (parseInt(e(n).css("borderTopWidth"), 10) || 0) - (parseInt(e(n).css("paddingBottom"), 10) || 0) - this.helperProportions.height - this.margins.top]
        }
    }, _convertPositionTo: function (t, n) {
        n || (n = this.position);
        var r = t == "absolute" ? 1 : -1, i = this.options, s = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, o = /(html|body)/i.test(s[0].tagName);
        return{top: n.top + this.offset.relative.top * r + this.offset.parent.top * r - (e.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : o ? 0 : s.scrollTop()) * r), left: n.left + this.offset.relative.left * r + this.offset.parent.left * r - (e.browser.safari && this.cssPosition == "fixed" ? 0 : (this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : o ? 0 : s.scrollLeft()) * r)}
    }, _generatePosition: function (t) {
        var n = this.options, r = this.cssPosition != "absolute" || this.scrollParent[0] != document && !!e.ui.contains(this.scrollParent[0], this.offsetParent[0]) ? this.scrollParent : this.offsetParent, i = /(html|body)/i.test(r[0].tagName);
        this.cssPosition == "relative" && (this.scrollParent[0] == document || this.scrollParent[0] == this.offsetParent[0]) && (this.offset.relative = this._getRelativeOffset());
        var s = t.pageX, o = t.pageY;
        if (this.originalPosition) {
            this.containment && (t.pageX - this.offset.click.left < this.containment[0] && (s = this.containment[0] + this.offset.click.left), t.pageY - this.offset.click.top < this.containment[1] && (o = this.containment[1] + this.offset.click.top), t.pageX - this.offset.click.left > this.containment[2] && (s = this.containment[2] + this.offset.click.left), t.pageY - this.offset.click.top > this.containment[3] && (o = this.containment[3] + this.offset.click.top));
            if (n.grid) {
                var u = this.originalPageY + Math.round((o - this.originalPageY) / n.grid[1]) * n.grid[1];
                o = this.containment ? u - this.offset.click.top < this.containment[1] || u - this.offset.click.top > this.containment[3] ? u - this.offset.click.top < this.containment[1] ? u + n.grid[1] : u - n.grid[1] : u : u;
                var f = this.originalPageX + Math.round((s - this.originalPageX) / n.grid[0]) * n.grid[0];
                s = this.containment ? f - this.offset.click.left < this.containment[0] || f - this.offset.click.left > this.containment[2] ? f - this.offset.click.left < this.containment[0] ? f + n.grid[0] : f - n.grid[0] : f : f
            }
        }
        return{top: o - this.offset.click.top - this.offset.relative.top - this.offset.parent.top + (e.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollTop() : i ? 0 : r.scrollTop()), left: s - this.offset.click.left - this.offset.relative.left - this.offset.parent.left + (e.browser.safari && this.cssPosition == "fixed" ? 0 : this.cssPosition == "fixed" ? -this.scrollParent.scrollLeft() : i ? 0 : r.scrollLeft())}
    }, _rearrange: function (e, t, n, r) {
        n ? n[0].appendChild(this.placeholder[0]) : t.item[0].parentNode.insertBefore(this.placeholder[0], this.direction == "down" ? t.item[0] : t.item[0].nextSibling), this.counter = this.counter ? ++this.counter : 1;
        var i = this, s = this.counter;
        window.setTimeout(function () {
            s == i.counter && i.refreshPositions(!r)
        }, 0)
    }, _clear: function (t, n) {
        this.reverting = !1;
        var r = [], i = this;
        !this._noFinalSort && this.currentItem.parent().length && this.placeholder.before(this.currentItem), this._noFinalSort = null;
        if (this.helper[0] == this.currentItem[0]) {
            for (var s in this._storedCSS)if (this._storedCSS[s] == "auto" || this._storedCSS[s] == "static")this._storedCSS[s] = "";
            this.currentItem.css(this._storedCSS).removeClass("ui-sortable-helper")
        } else this.currentItem.show();
        this.fromOutside && !n && r.push(function (e) {
            this._trigger("receive", e, this._uiHash(this.fromOutside))
        }), (this.fromOutside || this.domPosition.prev != this.currentItem.prev().not(".ui-sortable-helper")[0] || this.domPosition.parent != this.currentItem.parent()[0]) && !n && r.push(function (e) {
            this._trigger("update", e, this._uiHash())
        }), this !== this.currentContainer && (n || (r.push(function (e) {
            this._trigger("remove", e, this._uiHash())
        }), r.push(function (e) {
            return function (t) {
                e._trigger("receive", t, this._uiHash(this))
            }
        }.call(this, this.currentContainer)), r.push(function (e) {
            return function (t) {
                e._trigger("update", t, this._uiHash(this))
            }
        }.call(this, this.currentContainer))));
        for (var s = this.containers.length - 1; s >= 0; s--)n || r.push(function (e) {
            return function (t) {
                e._trigger("deactivate", t, this._uiHash(this))
            }
        }.call(this, this.containers[s])), this.containers[s].containerCache.over && (r.push(function (e) {
            return function (t) {
                e._trigger("out", t, this._uiHash(this))
            }
        }.call(this, this.containers[s])), this.containers[s].containerCache.over = 0);
        this._storedCursor && e("body").css("cursor", this._storedCursor), this._storedOpacity && this.helper.css("opacity", this._storedOpacity), this._storedZIndex && this.helper.css("zIndex", this._storedZIndex == "auto" ? "" : this._storedZIndex), this.dragging = !1;
        if (this.cancelHelperRemoval) {
            if (!n) {
                this._trigger("beforeStop", t, this._uiHash());
                for (var s = 0; s < r.length; s++)r[s].call(this, t);
                this._trigger("stop", t, this._uiHash())
            }
            return this.fromOutside = !1, !1
        }
        n || this._trigger("beforeStop", t, this._uiHash()), this.placeholder[0].parentNode.removeChild(this.placeholder[0]), this.helper[0] != this.currentItem[0] && this.helper.remove(), this.helper = null;
        if (!n) {
            for (var s = 0; s < r.length; s++)r[s].call(this, t);
            this._trigger("stop", t, this._uiHash())
        }
        return this.fromOutside = !1, !0
    }, _trigger: function () {
        e.Widget.prototype._trigger.apply(this, arguments) === !1 && this.cancel()
    }, _uiHash: function (t) {
        var n = t || this;
        return{helper: n.helper, placeholder: n.placeholder || e([]), position: n.position, originalPosition: n.originalPosition, offset: n.positionAbs, item: n.currentItem, sender: t ? t.element : null}
    }}), e.extend(e.ui.sortable, {version: "1.8.24"})
}(jQuery), function (e, t) {
    e.widget("ui.accordion", {options: {active: 0, animated: "slide", autoHeight: !0, clearStyle: !1, collapsible: !1, event: "click", fillSpace: !1, header: "> li > :first-child,> :not(li):even", icons: {header: "ui-icon-triangle-1-e", headerSelected: "ui-icon-triangle-1-s"}, navigation: !1, navigationFilter: function () {
        return this.href.toLowerCase() === location.href.toLowerCase()
    }}, _create: function () {
        var t = this, n = t.options;
        t.running = 0, t.element.addClass("ui-accordion ui-widget ui-helper-reset").children("li").addClass("ui-accordion-li-fix"), t.headers = t.element.find(n.header).addClass("ui-accordion-header ui-helper-reset ui-state-default ui-corner-all").bind("mouseenter.accordion",function () {
            if (n.disabled)return;
            e(this).addClass("ui-state-hover")
        }).bind("mouseleave.accordion",function () {
            if (n.disabled)return;
            e(this).removeClass("ui-state-hover")
        }).bind("focus.accordion",function () {
            if (n.disabled)return;
            e(this).addClass("ui-state-focus")
        }).bind("blur.accordion", function () {
            if (n.disabled)return;
            e(this).removeClass("ui-state-focus")
        }), t.headers.next().addClass("ui-accordion-content ui-helper-reset ui-widget-content ui-corner-bottom");
        if (n.navigation) {
            var r = t.element.find("a").filter(n.navigationFilter).eq(0);
            if (r.length) {
                var i = r.closest(".ui-accordion-header");
                i.length ? t.active = i : t.active = r.closest(".ui-accordion-content").prev()
            }
        }
        t.active = t._findActive(t.active || n.active).addClass("ui-state-default ui-state-active").toggleClass("ui-corner-all").toggleClass("ui-corner-top"), t.active.next().addClass("ui-accordion-content-active"), t._createIcons(), t.resize(), t.element.attr("role", "tablist"), t.headers.attr("role", "tab").bind("keydown.accordion",function (e) {
            return t._keydown(e)
        }).next().attr("role", "tabpanel"), t.headers.not(t.active || "").attr({"aria-expanded": "false", "aria-selected": "false", tabIndex: -1}).next().hide(), t.active.length ? t.active.attr({"aria-expanded": "true", "aria-selected": "true", tabIndex: 0}) : t.headers.eq(0).attr("tabIndex", 0), e.browser.safari || t.headers.find("a").attr("tabIndex", -1), n.event && t.headers.bind(n.event.split(" ").join(".accordion ") + ".accordion", function (e) {
            t._clickHandler.call(t, e, this), e.preventDefault()
        })
    }, _createIcons: function () {
        var t = this.options;
        t.icons && (e("<span></span>").addClass("ui-icon " + t.icons.header).prependTo(this.headers), this.active.children(".ui-icon").toggleClass(t.icons.header).toggleClass(t.icons.headerSelected), this.element.addClass("ui-accordion-icons"))
    }, _destroyIcons: function () {
        this.headers.children(".ui-icon").remove(), this.element.removeClass("ui-accordion-icons")
    }, destroy: function () {
        var t = this.options;
        this.element.removeClass("ui-accordion ui-widget ui-helper-reset").removeAttr("role"), this.headers.unbind(".accordion").removeClass("ui-accordion-header ui-accordion-disabled ui-helper-reset ui-state-default ui-corner-all ui-state-active ui-state-disabled ui-corner-top").removeAttr("role").removeAttr("aria-expanded").removeAttr("aria-selected").removeAttr("tabIndex"), this.headers.find("a").removeAttr("tabIndex"), this._destroyIcons();
        var n = this.headers.next().css("display", "").removeAttr("role").removeClass("ui-helper-reset ui-widget-content ui-corner-bottom ui-accordion-content ui-accordion-content-active ui-accordion-disabled ui-state-disabled");
        return(t.autoHeight || t.fillHeight) && n.css("height", ""), e.Widget.prototype.destroy.call(this)
    }, _setOption: function (t, n) {
        e.Widget.prototype._setOption.apply(this, arguments), t == "active" && this.activate(n), t == "icons" && (this._destroyIcons(), n && this._createIcons()), t == "disabled" && this.headers.add(this.headers.next())[n ? "addClass" : "removeClass"]("ui-accordion-disabled ui-state-disabled")
    }, _keydown: function (t) {
        if (this.options.disabled || t.altKey || t.ctrlKey)return;
        var n = e.ui.keyCode, r = this.headers.length, i = this.headers.index(t.target), s = !1;
        switch (t.keyCode) {
            case n.RIGHT:
            case n.DOWN:
                s = this.headers[(i + 1) % r];
                break;
            case n.LEFT:
            case n.UP:
                s = this.headers[(i - 1 + r) % r];
                break;
            case n.SPACE:
            case n.ENTER:
                this._clickHandler({target: t.target}, t.target), t.preventDefault()
        }
        return s ? (e(t.target).attr("tabIndex", -1), e(s).attr("tabIndex", 0), s.focus(), !1) : !0
    }, resize: function () {
        var t = this.options, n;
        if (t.fillSpace) {
            if (e.browser.msie) {
                var r = this.element.parent().css("overflow");
                this.element.parent().css("overflow", "hidden")
            }
            n = this.element.parent().height(), e.browser.msie && this.element.parent().css("overflow", r), this.headers.each(function () {
                n -= e(this).outerHeight(!0)
            }), this.headers.next().each(function () {
                e(this).height(Math.max(0, n - e(this).innerHeight() + e(this).height()))
            }).css("overflow", "auto")
        } else t.autoHeight && (n = 0, this.headers.next().each(function () {
            n = Math.max(n, e(this).height("").height())
        }).height(n));
        return this
    }, activate: function (e) {
        this.options.active = e;
        var t = this._findActive(e)[0];
        return this._clickHandler({target: t}, t), this
    }, _findActive: function (t) {
        return t ? typeof t == "number" ? this.headers.filter(":eq(" + t + ")") : this.headers.not(this.headers.not(t)) : t === !1 ? e([]) : this.headers.filter(":eq(0)")
    }, _clickHandler: function (t, n) {
        var r = this.options;
        if (r.disabled)return;
        if (!t.target) {
            if (!r.collapsible)return;
            this.active.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(r.icons.headerSelected).addClass(r.icons.header), this.active.next().addClass("ui-accordion-content-active");
            var i = this.active.next(), s = {options: r, newHeader: e([]), oldHeader: r.active, newContent: e([]), oldContent: i}, o = this.active = e([]);
            this._toggle(o, i, s);
            return
        }
        var u = e(t.currentTarget || n), f = u[0] === this.active[0];
        r.active = r.collapsible && f ? !1 : this.headers.index(u);
        if (this.running || !r.collapsible && f)return;
        var l = this.active, o = u.next(), i = this.active.next(), s = {options: r, newHeader: f && r.collapsible ? e([]) : u, oldHeader: this.active, newContent: f && r.collapsible ? e([]) : o, oldContent: i}, c = this.headers.index(this.active[0]) > this.headers.index(u[0]);
        this.active = f ? e([]) : u, this._toggle(o, i, s, f, c), l.removeClass("ui-state-active ui-corner-top").addClass("ui-state-default ui-corner-all").children(".ui-icon").removeClass(r.icons.headerSelected).addClass(r.icons.header), f || (u.removeClass("ui-state-default ui-corner-all").addClass("ui-state-active ui-corner-top").children(".ui-icon").removeClass(r.icons.header).addClass(r.icons.headerSelected), u.next().addClass("ui-accordion-content-active"));
        return
    }, _toggle: function (t, n, r, i, s) {
        var o = this, u = o.options;
        o.toShow = t, o.toHide = n, o.data = r;
        var f = function () {
            if (!o)return;
            return o._completed.apply(o, arguments)
        };
        o._trigger("changestart", null, o.data), o.running = n.size() === 0 ? t.size() : n.size();
        if (u.animated) {
            var l = {};
            u.collapsible && i ? l = {toShow: e([]), toHide: n, complete: f, down: s, autoHeight: u.autoHeight || u.fillSpace} : l = {toShow: t, toHide: n, complete: f, down: s, autoHeight: u.autoHeight || u.fillSpace}, u.proxied || (u.proxied = u.animated), u.proxiedDuration || (u.proxiedDuration = u.duration), u.animated = e.isFunction(u.proxied) ? u.proxied(l) : u.proxied, u.duration = e.isFunction(u.proxiedDuration) ? u.proxiedDuration(l) : u.proxiedDuration;
            var c = e.ui.accordion.animations, h = u.duration, p = u.animated;
            p && !c[p] && !e.easing[p] && (p = "slide"), c[p] || (c[p] = function (e) {
                this.slide(e, {easing: p, duration: h || 700})
            }), c[p](l)
        } else u.collapsible && i ? t.toggle() : (n.hide(), t.show()), f(!0);
        n.prev().attr({"aria-expanded": "false", "aria-selected": "false", tabIndex: -1}).blur(), t.prev().attr({"aria-expanded": "true", "aria-selected": "true", tabIndex: 0}).focus()
    }, _completed: function (e) {
        this.running = e ? 0 : --this.running;
        if (this.running)return;
        this.options.clearStyle && this.toShow.add(this.toHide).css({height: "", overflow: ""}), this.toHide.removeClass("ui-accordion-content-active"), this.toHide.length && (this.toHide.parent()[0].className = this.toHide.parent()[0].className), this._trigger("change", null, this.data)
    }}), e.extend(e.ui.accordion, {version: "1.8.24", animations: {slide: function (t, n) {
        t = e.extend({easing: "swing", duration: 300}, t, n);
        if (!t.toHide.size()) {
            t.toShow.animate({height: "show", paddingTop: "show", paddingBottom: "show"}, t);
            return
        }
        if (!t.toShow.size()) {
            t.toHide.animate({height: "hide", paddingTop: "hide", paddingBottom: "hide"}, t);
            return
        }
        var r = t.toShow.css("overflow"), i = 0, s = {}, o = {}, u = ["height", "paddingTop", "paddingBottom"], f, l = t.toShow;
        f = l[0].style.width, l.width(l.parent().width() - parseFloat(l.css("paddingLeft")) - parseFloat(l.css("paddingRight")) - (parseFloat(l.css("borderLeftWidth")) || 0) - (parseFloat(l.css("borderRightWidth")) || 0)), e.each(u, function (n, r) {
            o[r] = "hide";
            var i = ("" + e.css(t.toShow[0], r)).match(/^([\d+-.]+)(.*)$/);
            s[r] = {value: i[1], unit: i[2] || "px"}
        }), t.toShow.css({height: 0, overflow: "hidden"}).show(), t.toHide.filter(":hidden").each(t.complete).end().filter(":visible").animate(o, {step: function (e, n) {
            n.prop == "height" && (i = n.end - n.start === 0 ? 0 : (n.now - n.start) / (n.end - n.start)), t.toShow[0].style[n.prop] = i * s[n.prop].value + s[n.prop].unit
        }, duration: t.duration, easing: t.easing, complete: function () {
            t.autoHeight || t.toShow.css("height", ""), t.toShow.css({width: f, overflow: r}), t.complete()
        }})
    }, bounceslide: function (e) {
        this.slide(e, {easing: e.down ? "easeOutBounce" : "swing", duration: e.down ? 1e3 : 200})
    }}})
}(jQuery), function (e, t) {
    var n = 0;
    e.widget("ui.autocomplete", {options: {appendTo: "body", autoFocus: !1, delay: 300, minLength: 1, position: {my: "left top", at: "left bottom", collision: "none"}, source: null}, pending: 0, _create: function () {
        var t = this, n = this.element[0].ownerDocument, r;
        this.isMultiLine = this.element.is("textarea"), this.element.addClass("ui-autocomplete-input").attr("autocomplete", "off").attr({role: "textbox", "aria-autocomplete": "list", "aria-haspopup": "true"}).bind("keydown.autocomplete",function (n) {
            if (t.options.disabled || t.element.propAttr("readOnly"))return;
            r = !1;
            var i = e.ui.keyCode;
            switch (n.keyCode) {
                case i.PAGE_UP:
                    t._move("previousPage", n);
                    break;
                case i.PAGE_DOWN:
                    t._move("nextPage", n);
                    break;
                case i.UP:
                    t._keyEvent("previous", n);
                    break;
                case i.DOWN:
                    t._keyEvent("next", n);
                    break;
                case i.ENTER:
                case i.NUMPAD_ENTER:
                    t.menu.active && (r = !0, n.preventDefault());
                case i.TAB:
                    if (!t.menu.active)return;
                    t.menu.select(n);
                    break;
                case i.ESCAPE:
                    t.element.val(t.term), t.close(n);
                    break;
                default:
                    clearTimeout(t.searching), t.searching = setTimeout(function () {
                        t.term != t.element.val() && (t.selectedItem = null, t.search(null, n))
                    }, t.options.delay)
            }
        }).bind("keypress.autocomplete",function (e) {
            r && (r = !1, e.preventDefault())
        }).bind("focus.autocomplete",function () {
            if (t.options.disabled)return;
            t.selectedItem = null, t.previous = t.element.val()
        }).bind("blur.autocomplete", function (e) {
            if (t.options.disabled)return;
            clearTimeout(t.searching), t.closing = setTimeout(function () {
                t.close(e), t._change(e)
            }, 150)
        }), this._initSource(), this.menu = e("<ul></ul>").addClass("ui-autocomplete").appendTo(e(this.options.appendTo || "body", n)[0]).mousedown(function (n) {
            var r = t.menu.element[0];
            e(n.target).closest(".ui-menu-item").length || setTimeout(function () {
                e(document).one("mousedown", function (n) {
                    n.target !== t.element[0] && n.target !== r && !e.ui.contains(r, n.target) && t.close()
                })
            }, 1), setTimeout(function () {
                clearTimeout(t.closing)
            }, 13)
        }).menu({focus: function (e, n) {
            var r = n.item.data("item.autocomplete");
            !1 !== t._trigger("focus", e, {item: r}) && /^key/.test(e.originalEvent.type) && t.element.val(r.value)
        }, selected: function (e, r) {
            var i = r.item.data("item.autocomplete"), s = t.previous;
            t.element[0] !== n.activeElement && (t.element.focus(), t.previous = s, setTimeout(function () {
                t.previous = s, t.selectedItem = i
            }, 1)), !1 !== t._trigger("select", e, {item: i}) && t.element.val(i.value), t.term = t.element.val(), t.close(e), t.selectedItem = i
        }, blur: function (e, n) {
            t.menu.element.is(":visible") && t.element.val() !== t.term && t.element.val(t.term)
        }}).zIndex(this.element.zIndex() + 1).css({
            top: 0, left: 0}).hide().data("menu"), e.fn.bgiframe && this.menu.element.bgiframe(), t.beforeunloadHandler = function () {
            t.element.removeAttr("autocomplete")
        }, e(window).bind("beforeunload", t.beforeunloadHandler)
    }, destroy: function () {
        this.element.removeClass("ui-autocomplete-input").removeAttr("autocomplete").removeAttr("role").removeAttr("aria-autocomplete").removeAttr("aria-haspopup"), this.menu.element.remove(), e(window).unbind("beforeunload", this.beforeunloadHandler), e.Widget.prototype.destroy.call(this)
    }, _setOption: function (t, n) {
        e.Widget.prototype._setOption.apply(this, arguments), t === "source" && this._initSource(), t === "appendTo" && this.menu.element.appendTo(e(n || "body", this.element[0].ownerDocument)[0]), t === "disabled" && n && this.xhr && this.xhr.abort()
    }, _initSource: function () {
        var t = this, n, r;
        e.isArray(this.options.source) ? (n = this.options.source, this.source = function (t, r) {
            r(e.ui.autocomplete.filter(n, t.term))
        }) : typeof this.options.source == "string" ? (r = this.options.source, this.source = function (n, i) {
            t.xhr && t.xhr.abort(), t.xhr = e.ajax({url: r, data: n, dataType: "json", success: function (e, t) {
                i(e)
            }, error: function () {
                i([])
            }})
        }) : this.source = this.options.source
    }, search: function (e, t) {
        e = e != null ? e : this.element.val(), this.term = this.element.val();
        if (e.length < this.options.minLength)return this.close(t);
        clearTimeout(this.closing);
        if (this._trigger("search", t) === !1)return;
        return this._search(e)
    }, _search: function (e) {
        this.pending++, this.element.addClass("ui-autocomplete-loading"), this.source({term: e}, this._response())
    }, _response: function () {
        var e = this, t = ++n;
        return function (r) {
            t === n && e.__response(r), e.pending--, e.pending || e.element.removeClass("ui-autocomplete-loading")
        }
    }, __response: function (e) {
        !this.options.disabled && e && e.length ? (e = this._normalize(e), this._suggest(e), this._trigger("open")) : this.close()
    }, close: function (e) {
        clearTimeout(this.closing), this.menu.element.is(":visible") && (this.menu.element.hide(), this.menu.deactivate(), this._trigger("close", e))
    }, _change: function (e) {
        this.previous !== this.element.val() && this._trigger("change", e, {item: this.selectedItem})
    }, _normalize: function (t) {
        return t.length && t[0].label && t[0].value ? t : e.map(t, function (t) {
            return typeof t == "string" ? {label: t, value: t} : e.extend({label: t.label || t.value, value: t.value || t.label}, t)
        })
    }, _suggest: function (t) {
        var n = this.menu.element.empty().zIndex(this.element.zIndex() + 1);
        this._renderMenu(n, t), this.menu.deactivate(), this.menu.refresh(), n.show(), this._resizeMenu(), n.position(e.extend({of: this.element}, this.options.position)), this.options.autoFocus && this.menu.next(new e.Event("mouseover"))
    }, _resizeMenu: function () {
        var e = this.menu.element;
        e.outerWidth(Math.max(e.width("").outerWidth() + 1, this.element.outerWidth()))
    }, _renderMenu: function (t, n) {
        var r = this;
        e.each(n, function (e, n) {
            r._renderItem(t, n)
        })
    }, _renderItem: function (t, n) {
        return e("<li></li>").data("item.autocomplete", n).append(e("<a></a>").text(n.label)).appendTo(t)
    }, _move: function (e, t) {
        if (!this.menu.element.is(":visible")) {
            this.search(null, t);
            return
        }
        if (this.menu.first() && /^previous/.test(e) || this.menu.last() && /^next/.test(e)) {
            this.element.val(this.term), this.menu.deactivate();
            return
        }
        this.menu[e](t)
    }, widget: function () {
        return this.menu.element
    }, _keyEvent: function (e, t) {
        if (!this.isMultiLine || this.menu.element.is(":visible"))this._move(e, t), t.preventDefault()
    }}), e.extend(e.ui.autocomplete, {escapeRegex: function (e) {
        return e.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&")
    }, filter: function (t, n) {
        var r = new RegExp(e.ui.autocomplete.escapeRegex(n), "i");
        return e.grep(t, function (e) {
            return r.test(e.label || e.value || e)
        })
    }})
}(jQuery), function (e) {
    e.widget("ui.menu", {_create: function () {
        var t = this;
        this.element.addClass("ui-menu ui-widget ui-widget-content ui-corner-all").attr({role: "listbox", "aria-activedescendant": "ui-active-menuitem"}).click(function (n) {
            if (!e(n.target).closest(".ui-menu-item a").length)return;
            n.preventDefault(), t.select(n)
        }), this.refresh()
    }, refresh: function () {
        var t = this, n = this.element.children("li:not(.ui-menu-item):has(a)").addClass("ui-menu-item").attr("role", "menuitem");
        n.children("a").addClass("ui-corner-all").attr("tabindex", -1).mouseenter(function (n) {
            t.activate(n, e(this).parent())
        }).mouseleave(function () {
            t.deactivate()
        })
    }, activate: function (e, t) {
        this.deactivate();
        if (this.hasScroll()) {
            var n = t.offset().top - this.element.offset().top, r = this.element.scrollTop(), i = this.element.height();
            n < 0 ? this.element.scrollTop(r + n) : n >= i && this.element.scrollTop(r + n - i + t.height())
        }
        this.active = t.eq(0).children("a").addClass("ui-state-hover").attr("id", "ui-active-menuitem").end(), this._trigger("focus", e, {item: t})
    }, deactivate: function () {
        if (!this.active)return;
        this.active.children("a").removeClass("ui-state-hover").removeAttr("id"), this._trigger("blur"), this.active = null
    }, next: function (e) {
        this.move("next", ".ui-menu-item:first", e)
    }, previous: function (e) {
        this.move("prev", ".ui-menu-item:last", e)
    }, first: function () {
        return this.active && !this.active.prevAll(".ui-menu-item").length
    }, last: function () {
        return this.active && !this.active.nextAll(".ui-menu-item").length
    }, move: function (e, t, n) {
        if (!this.active) {
            this.activate(n, this.element.children(t));
            return
        }
        var r = this.active[e + "All"](".ui-menu-item").eq(0);
        r.length ? this.activate(n, r) : this.activate(n, this.element.children(t))
    }, nextPage: function (t) {
        if (this.hasScroll()) {
            if (!this.active || this.last()) {
                this.activate(t, this.element.children(".ui-menu-item:first"));
                return
            }
            var n = this.active.offset().top, r = this.element.height(), i = this.element.children(".ui-menu-item").filter(function () {
                var t = e(this).offset().top - n - r + e(this).height();
                return t < 10 && t > -10
            });
            i.length || (i = this.element.children(".ui-menu-item:last")), this.activate(t, i)
        } else this.activate(t, this.element.children(".ui-menu-item").filter(!this.active || this.last() ? ":first" : ":last"))
    }, previousPage: function (t) {
        if (this.hasScroll()) {
            if (!this.active || this.first()) {
                this.activate(t, this.element.children(".ui-menu-item:last"));
                return
            }
            var n = this.active.offset().top, r = this.element.height(), i = this.element.children(".ui-menu-item").filter(function () {
                var t = e(this).offset().top - n + r - e(this).height();
                return t < 10 && t > -10
            });
            i.length || (i = this.element.children(".ui-menu-item:first")), this.activate(t, i)
        } else this.activate(t, this.element.children(".ui-menu-item").filter(!this.active || this.first() ? ":last" : ":first"))
    }, hasScroll: function () {
        return this.element.height() < this.element[e.fn.prop ? "prop" : "attr"]("scrollHeight")
    }, select: function (e) {
        this._trigger("selected", e, {item: this.active})
    }})
}(jQuery), function (e, t) {
    var n, r, i, s, o = "ui-button ui-widget ui-state-default ui-corner-all", u = "ui-state-hover ui-state-active ", a = "ui-button-icons-only ui-button-icon-only ui-button-text-icons ui-button-text-icon-primary ui-button-text-icon-secondary ui-button-text-only", f = function () {
        var t = e(this).find(":ui-button");
        setTimeout(function () {
            t.button("refresh")
        }, 1)
    }, l = function (t) {
        var n = t.name, r = t.form, i = e([]);
        return n && (r ? i = e(r).find("[name='" + n + "']") : i = e("[name='" + n + "']", t.ownerDocument).filter(function () {
            return!this.form
        })), i
    };
    e.widget("ui.button", {options: {disabled: null, text: !0, label: null, icons: {primary: null, secondary: null}}, _create: function () {
        this.element.closest("form").unbind("reset.button").bind("reset.button", f), typeof this.options.disabled != "boolean" ? this.options.disabled = !!this.element.propAttr("disabled") : this.element.propAttr("disabled", this.options.disabled), this._determineButtonType(), this.hasTitle = !!this.buttonElement.attr("title");
        var t = this, u = this.options, a = this.type === "checkbox" || this.type === "radio", h = "ui-state-hover" + (a ? "" : " ui-state-active"), p = "ui-state-focus";
        u.label === null && (u.label = this.buttonElement.html()), this.buttonElement.addClass(o).attr("role", "button").bind("mouseenter.button",function () {
            if (u.disabled)return;
            e(this).addClass("ui-state-hover"), this === n && e(this).addClass("ui-state-active")
        }).bind("mouseleave.button",function () {
            if (u.disabled)return;
            e(this).removeClass(h)
        }).bind("click.button", function (e) {
            u.disabled && (e.preventDefault(), e.stopImmediatePropagation())
        }), this.element.bind("focus.button",function () {
            t.buttonElement.addClass(p)
        }).bind("blur.button", function () {
            t.buttonElement.removeClass(p)
        }), a && (this.element.bind("change.button", function () {
            if (s)return;
            t.refresh()
        }), this.buttonElement.bind("mousedown.button",function (e) {
            if (u.disabled)return;
            s = !1, r = e.pageX, i = e.pageY
        }).bind("mouseup.button", function (e) {
            if (u.disabled)return;
            if (r !== e.pageX || i !== e.pageY)s = !0
        })), this.type === "checkbox" ? this.buttonElement.bind("click.button", function () {
            if (u.disabled || s)return!1;
            e(this).toggleClass("ui-state-active"), t.buttonElement.attr("aria-pressed", t.element[0].checked)
        }) : this.type === "radio" ? this.buttonElement.bind("click.button", function () {
            if (u.disabled || s)return!1;
            e(this).addClass("ui-state-active"), t.buttonElement.attr("aria-pressed", "true");
            var n = t.element[0];
            l(n).not(n).map(function () {
                return e(this).button("widget")[0]
            }).removeClass("ui-state-active").attr("aria-pressed", "false")
        }) : (this.buttonElement.bind("mousedown.button",function () {
            if (u.disabled)return!1;
            e(this).addClass("ui-state-active"), n = this, e(document).one("mouseup", function () {
                n = null
            })
        }).bind("mouseup.button",function () {
            if (u.disabled)return!1;
            e(this).removeClass("ui-state-active")
        }).bind("keydown.button",function (t) {
            if (u.disabled)return!1;
            (t.keyCode == e.ui.keyCode.SPACE || t.keyCode == e.ui.keyCode.ENTER) && e(this).addClass("ui-state-active")
        }).bind("keyup.button", function () {
            e(this).removeClass("ui-state-active")
        }), this.buttonElement.is("a") && this.buttonElement.keyup(function (t) {
            t.keyCode === e.ui.keyCode.SPACE && e(this).click()
        })), this._setOption("disabled", u.disabled), this._resetButton()
    }, _determineButtonType: function () {
        this.element.is(":checkbox") ? this.type = "checkbox" : this.element.is(":radio") ? this.type = "radio" : this.element.is("input") ? this.type = "input" : this.type = "button";
        if (this.type === "checkbox" || this.type === "radio") {
            var e = this.element.parents().filter(":last"), t = "label[for='" + this.element.attr("id") + "']";
            this.buttonElement = e.find(t), this.buttonElement.length || (e = e.length ? e.siblings() : this.element.siblings(), this.buttonElement = e.filter(t), this.buttonElement.length || (this.buttonElement = e.find(t))), this.element.addClass("ui-helper-hidden-accessible");
            var n = this.element.is(":checked");
            n && this.buttonElement.addClass("ui-state-active"), this.buttonElement.attr("aria-pressed", n)
        } else this.buttonElement = this.element
    }, widget: function () {
        return this.buttonElement
    }, destroy: function () {
        this.element.removeClass("ui-helper-hidden-accessible"), this.buttonElement.removeClass(o + " " + u + " " + a).removeAttr("role").removeAttr("aria-pressed").html(this.buttonElement.find(".ui-button-text").html()), this.hasTitle || this.buttonElement.removeAttr("title"), e.Widget.prototype.destroy.call(this)
    }, _setOption: function (t, n) {
        e.Widget.prototype._setOption.apply(this, arguments);
        if (t === "disabled") {
            n ? this.element.propAttr("disabled", !0) : this.element.propAttr("disabled", !1);
            return
        }
        this._resetButton()
    }, refresh: function () {
        var t = this.element.is(":disabled");
        t !== this.options.disabled && this._setOption("disabled", t), this.type === "radio" ? l(this.element[0]).each(function () {
            e(this).is(":checked") ? e(this).button("widget").addClass("ui-state-active").attr("aria-pressed", "true") : e(this).button("widget").removeClass("ui-state-active").attr("aria-pressed", "false")
        }) : this.type === "checkbox" && (this.element.is(":checked") ? this.buttonElement.addClass("ui-state-active").attr("aria-pressed", "true") : this.buttonElement.removeClass("ui-state-active").attr("aria-pressed", "false"))
    }, _resetButton: function () {
        if (this.type === "input") {
            this.options.label && this.element.val(this.options.label);
            return
        }
        var t = this.buttonElement.removeClass(a), n = e("<span></span>", this.element[0].ownerDocument).addClass("ui-button-text").html(this.options.label).appendTo(t.empty()).text(), r = this.options.icons, i = r.primary && r.secondary, s = [];
        r.primary || r.secondary ? (this.options.text && s.push("ui-button-text-icon" + (i ? "s" : r.primary ? "-primary" : "-secondary")), r.primary && t.prepend("<span class='ui-button-icon-primary ui-icon " + r.primary + "'></span>"), r.secondary && t.append("<span class='ui-button-icon-secondary ui-icon " + r.secondary + "'></span>"), this.options.text || (s.push(i ? "ui-button-icons-only" : "ui-button-icon-only"), this.hasTitle || t.attr("title", n))) : s.push("ui-button-text-only"), t.addClass(s.join(" "))
    }}), e.widget("ui.buttonset", {options: {items: ":button, :submit, :reset, :checkbox, :radio, a, :data(button)"}, _create: function () {
        this.element.addClass("ui-buttonset")
    }, _init: function () {
        this.refresh()
    }, _setOption: function (t, n) {
        t === "disabled" && this.buttons.button("option", t, n), e.Widget.prototype._setOption.apply(this, arguments)
    }, refresh: function () {
        var t = this.element.css("direction") === "rtl";
        this.buttons = this.element.find(this.options.items).filter(":ui-button").button("refresh").end().not(":ui-button").button().end().map(function () {
            return e(this).button("widget")[0]
        }).removeClass("ui-corner-all ui-corner-left ui-corner-right").filter(":first").addClass(t ? "ui-corner-right" : "ui-corner-left").end().filter(":last").addClass(t ? "ui-corner-left" : "ui-corner-right").end().end()
    }, destroy: function () {
        this.element.removeClass("ui-buttonset"), this.buttons.map(function () {
            return e(this).button("widget")[0]
        }).removeClass("ui-corner-left ui-corner-right").end().button("destroy"), e.Widget.prototype.destroy.call(this)
    }})
}(jQuery), function (e, t) {
    var n = "ui-dialog ui-widget ui-widget-content ui-corner-all ", r = {buttons: !0, height: !0, maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0, width: !0}, i = {maxHeight: !0, maxWidth: !0, minHeight: !0, minWidth: !0};
    e.widget("ui.dialog", {options: {autoOpen: !0, buttons: {}, closeOnEscape: !0, closeText: "close", dialogClass: "", draggable: !0, hide: null, height: "auto", maxHeight: !1, maxWidth: !1, minHeight: 150, minWidth: 150, modal: !1, position: {my: "center", at: "center", collision: "fit", using: function (t) {
        var n = e(this).css(t).offset().top;
        n < 0 && e(this).css("top", t.top - n)
    }}, resizable: !0, show: null, stack: !0, title: "", width: 300, zIndex: 1e3}, _create: function () {
        this.originalTitle = this.element.attr("title"), typeof this.originalTitle != "string" && (this.originalTitle = ""), this.options.title = this.options.title || this.originalTitle;
        var t = this, r = t.options, i = r.title || "&#160;", s = e.ui.dialog.getTitleId(t.element), o = (t.uiDialog = e("<div></div>")).appendTo(document.body).hide().addClass(n + r.dialogClass).css({zIndex: r.zIndex}).attr("tabIndex", -1).css("outline", 0).keydown(function (n) {
            r.closeOnEscape && !n.isDefaultPrevented() && n.keyCode && n.keyCode === e.ui.keyCode.ESCAPE && (t.close(n), n.preventDefault())
        }).attr({role: "dialog", "aria-labelledby": s}).mousedown(function (e) {
            t.moveToTop(!1, e)
        }), u = t.element.show().removeAttr("title").addClass("ui-dialog-content ui-widget-content").appendTo(o), f = (t.uiDialogTitlebar = e("<div></div>")).addClass("ui-dialog-titlebar ui-widget-header ui-corner-all ui-helper-clearfix").prependTo(o), l = e('<a href="#"></a>').addClass("ui-dialog-titlebar-close ui-corner-all").attr("role", "button").hover(function () {
            l.addClass("ui-state-hover")
        },function () {
            l.removeClass("ui-state-hover")
        }).focus(function () {
            l.addClass("ui-state-focus")
        }).blur(function () {
            l.removeClass("ui-state-focus")
        }).click(function (e) {
            return t.close(e), !1
        }).appendTo(f), h = (t.uiDialogTitlebarCloseText = e("<span></span>")).addClass("ui-icon ui-icon-closethick").text(r.closeText).appendTo(l), p = e("<span></span>").addClass("ui-dialog-title").attr("id", s).html(i).prependTo(f);
        e.isFunction(r.beforeclose) && !e.isFunction(r.beforeClose) && (r.beforeClose = r.beforeclose), f.find("*").add(f).disableSelection(), r.draggable && e.fn.draggable && t._makeDraggable(), r.resizable && e.fn.resizable && t._makeResizable(), t._createButtons(r.buttons), t._isOpen = !1, e.fn.bgiframe && o.bgiframe()
    }, _init: function () {
        this.options.autoOpen && this.open()
    }, destroy: function () {
        var e = this;
        return e.overlay && e.overlay.destroy(), e.uiDialog.hide(), e.element.unbind(".dialog").removeData("dialog").removeClass("ui-dialog-content ui-widget-content").hide().appendTo("body"), e.uiDialog.remove(), e.originalTitle && e.element.attr("title", e.originalTitle), e
    }, widget: function () {
        return this.uiDialog
    }, close: function (t) {
        var n = this, r, i;
        if (!1 === n._trigger("beforeClose", t))return;
        return n.overlay && n.overlay.destroy(), n.uiDialog.unbind("keypress.ui-dialog"), n._isOpen = !1, n.options.hide ? n.uiDialog.hide(n.options.hide, function () {
            n._trigger("close", t)
        }) : (n.uiDialog.hide(), n._trigger("close", t)), e.ui.dialog.overlay.resize(), n.options.modal && (r = 0, e(".ui-dialog").each(function () {
            this !== n.uiDialog[0] && (i = e(this).css("z-index"), isNaN(i) || (r = Math.max(r, i)))
        }), e.ui.dialog.maxZ = r), n
    }, isOpen: function () {
        return this._isOpen
    }, moveToTop: function (t, n) {
        var r = this, i = r.options, s;
        return i.modal && !t || !i.stack && !i.modal ? r._trigger("focus", n) : (i.zIndex > e.ui.dialog.maxZ && (e.ui.dialog.maxZ = i.zIndex), r.overlay && (e.ui.dialog.maxZ += 1, r.overlay.$el.css("z-index", e.ui.dialog.overlay.maxZ = e.ui.dialog.maxZ)), s = {scrollTop: r.element.scrollTop(), scrollLeft: r.element.scrollLeft()}, e.ui.dialog.maxZ += 1, r.uiDialog.css("z-index", e.ui.dialog.maxZ), r.element.attr(s), r._trigger("focus", n), r)
    }, open: function () {
        if (this._isOpen)return;
        var t = this, n = t.options, r = t.uiDialog;
        return t.overlay = n.modal ? new e.ui.dialog.overlay(t) : null, t._size(), t._position(n.position), r.show(n.show), t.moveToTop(!0), n.modal && r.bind("keydown.ui-dialog", function (t) {
            if (t.keyCode !== e.ui.keyCode.TAB)return;
            var n = e(":tabbable", this), r = n.filter(":first"), i = n.filter(":last");
            if (t.target === i[0] && !t.shiftKey)return r.focus(1), !1;
            if (t.target === r[0] && t.shiftKey)return i.focus(1), !1
        }), e(t.element.find(":tabbable").get().concat(r.find(".ui-dialog-buttonpane :tabbable").get().concat(r.get()))).eq(0).focus(), t._isOpen = !0, t._trigger("open"), t
    }, _createButtons: function (t) {
        var n = this, r = !1, i = e("<div></div>").addClass("ui-dialog-buttonpane ui-widget-content ui-helper-clearfix"), s = e("<div></div>").addClass("ui-dialog-buttonset").appendTo(i);
        n.uiDialog.find(".ui-dialog-buttonpane").remove(), typeof t == "object" && t !== null && e.each(t, function () {
            return!(r = !0)
        }), r && (e.each(t, function (t, r) {
            r = e.isFunction(r) ? {click: r, text: t} : r;
            var i = e('<button type="button"></button>').click(function () {
                r.click.apply(n.element[0], arguments)
            }).appendTo(s);
            e.each(r, function (e, t) {
                if (e === "click")return;
                e in i ? i[e](t) : i.attr(e, t)
            }), e.fn.button && i.button()
        }), i.appendTo(n.uiDialog))
    }, _makeDraggable: function () {
        function t(e) {
            return{position: e.position, offset: e.offset}
        }

        var n = this, r = n.options, i = e(document), s;
        n.uiDialog.draggable({cancel: ".ui-dialog-content, .ui-dialog-titlebar-close", handle: ".ui-dialog-titlebar", containment: "document", start: function (i, o) {
            s = r.height === "auto" ? "auto" : e(this).height(), e(this).height(e(this).height()).addClass("ui-dialog-dragging"), n._trigger("dragStart", i, t(o))
        }, drag: function (e, r) {
            n._trigger("drag", e, t(r))
        }, stop: function (o, u) {
            r.position = [u.position.left - i.scrollLeft(), u.position.top - i.scrollTop()], e(this).removeClass("ui-dialog-dragging").height(s), n._trigger("dragStop", o, t(u)), e.ui.dialog.overlay.resize()
        }})
    }, _makeResizable: function (n) {
        function r(e) {
            return{originalPosition: e.originalPosition, originalSize: e.originalSize, position: e.position, size: e.size}
        }

        n = n === t ? this.options.resizable : n;
        var i = this, s = i.options, o = i.uiDialog.css("position"), u = typeof n == "string" ? n : "n,e,s,w,se,sw,ne,nw";
        i.uiDialog.resizable({cancel: ".ui-dialog-content", containment: "document", alsoResize: i.element, maxWidth: s.maxWidth, maxHeight: s.maxHeight, minWidth: s.minWidth, minHeight: i._minHeight(), handles: u, start: function (t, n) {
            e(this).addClass("ui-dialog-resizing"), i._trigger("resizeStart", t, r(n))
        }, resize: function (e, t) {
            i._trigger("resize", e, r(t))
        }, stop: function (t, n) {
            e(this).removeClass("ui-dialog-resizing"), s.height = e(this).height(), s.width = e(this).width(), i._trigger("resizeStop", t, r(n)), e.ui.dialog.overlay.resize()
        }}).css("position", o).find(".ui-resizable-se").addClass("ui-icon ui-icon-grip-diagonal-se")
    }, _minHeight: function () {
        var e = this.options;
        return e.height === "auto" ? e.minHeight : Math.min(e.minHeight, e.height)
    }, _position: function (t) {
        var n = [], r = [0, 0], i;
        if (t) {
            if (typeof t == "string" || typeof t == "object" && "0"in t)n = t.split ? t.split(" ") : [t[0], t[1]], n.length === 1 && (n[1] = n[0]), e.each(["left", "top"], function (e, t) {
                +n[e] === n[e] && (r[e] = n[e], n[e] = t)
            }), t = {my: n.join(" "), at: n.join(" "), offset: r.join(" ")};
            t = e.extend({}, e.ui.dialog.prototype.options.position, t)
        } else t = e.ui.dialog.prototype.options.position;
        i = this.uiDialog.is(":visible"), i || this.uiDialog.show(), this.uiDialog.css({top: 0, left: 0}).position(e.extend({of: window}, t)), i || this.uiDialog.hide()
    }, _setOptions: function (t) {
        var n = this, s = {}, o = !1;
        e.each(t, function (e, t) {
            n._setOption(e, t), e in r && (o = !0), e in i && (s[e] = t)
        }), o && this._size(), this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", s)
    }, _setOption: function (t, r) {
        var i = this, s = i.uiDialog;
        switch (t) {
            case"beforeclose":
                t = "beforeClose";
                break;
            case"buttons":
                i._createButtons(r);
                break;
            case"closeText":
                i.uiDialogTitlebarCloseText.text("" + r);
                break;
            case"dialogClass":
                s.removeClass(i.options.dialogClass).addClass(n + r);
                break;
            case"disabled":
                r ? s.addClass("ui-dialog-disabled") : s.removeClass("ui-dialog-disabled");
                break;
            case"draggable":
                var o = s.is(":data(draggable)");
                o && !r && s.draggable("destroy"), !o && r && i._makeDraggable();
                break;
            case"position":
                i._position(r);
                break;
            case"resizable":
                var u = s.is(":data(resizable)");
                u && !r && s.resizable("destroy"), u && typeof r == "string" && s.resizable("option", "handles", r), !u && r !== !1 && i._makeResizable(r);
                break;
            case"title":
                e(".ui-dialog-title", i.uiDialogTitlebar).html("" + (r || "&#160;"))
        }
        e.Widget.prototype._setOption.apply(i, arguments)
    }, _size: function () {
        var t = this.options, n, r, i = this.uiDialog.is(":visible");
        this.element.show().css({width: "auto", minHeight: 0, height: 0}), t.minWidth > t.width && (t.width = t.minWidth), n = this.uiDialog.css({height: "auto", width: t.width}).height(), r = Math.max(0, t.minHeight - n);
        if (t.height === "auto")if (e.support.minHeight)this.element.css({minHeight: r, height: "auto"}); else {
            this.uiDialog.show();
            var s = this.element.css("height", "auto").height();
            i || this.uiDialog.hide(), this.element.height(Math.max(s, r))
        } else this.element.height(Math.max(t.height - n, 0));
        this.uiDialog.is(":data(resizable)") && this.uiDialog.resizable("option", "minHeight", this._minHeight())
    }}), e.extend(e.ui.dialog, {version: "1.8.24", uuid: 0, maxZ: 0, getTitleId: function (e) {
        var t = e.attr("id");
        return t || (this.uuid += 1, t = this.uuid), "ui-dialog-title-" + t
    }, overlay: function (t) {
        this.$el = e.ui.dialog.overlay.create(t)
    }}), e.extend(e.ui.dialog.overlay, {instances: [], oldInstances: [], maxZ: 0, events: e.map("focus,mousedown,mouseup,keydown,keypress,click".split(","),function (e) {
        return e + ".dialog-overlay"
    }).join(" "), create: function (t) {
        this.instances.length === 0 && (setTimeout(function () {
            e.ui.dialog.overlay.instances.length && e(document).bind(e.ui.dialog.overlay.events, function (t) {
                if (e(t.target).zIndex() < e.ui.dialog.overlay.maxZ)return!1
            })
        }, 1), e(document).bind("keydown.dialog-overlay", function (n) {
            t.options.closeOnEscape && !n.isDefaultPrevented() && n.keyCode && n.keyCode === e.ui.keyCode.ESCAPE && (t.close(n), n.preventDefault())
        }), e(window).bind("resize.dialog-overlay", e.ui.dialog.overlay.resize));
        var n = (this.oldInstances.pop() || e("<div></div>").addClass("ui-widget-overlay")).appendTo(document.body).css({width: this.width(), height: this.height()});
        return e.fn.bgiframe && n.bgiframe(), this.instances.push(n), n
    }, destroy: function (t) {
        var n = e.inArray(t, this.instances);
        n != -1 && this.oldInstances.push(this.instances.splice(n, 1)[0]), this.instances.length === 0 && e([document, window]).unbind(".dialog-overlay"), t.remove();
        var r = 0;
        e.each(this.instances, function () {
            r = Math.max(r, this.css("z-index"))
        }), this.maxZ = r
    }, height: function () {
        var t, n;
        return e.browser.msie && e.browser.version < 7 ? (t = Math.max(document.documentElement.scrollHeight, document.body.scrollHeight), n = Math.max(document.documentElement.offsetHeight, document.body.offsetHeight), t < n ? e(window).height() + "px" : t + "px") : e(document).height() + "px"
    }, width: function () {
        var t, n;
        return e.browser.msie ? (t = Math.max(document.documentElement.scrollWidth, document.body.scrollWidth), n = Math.max(document.documentElement.offsetWidth, document.body.offsetWidth), t < n ? e(window).width() + "px" : t + "px") : e(document).width() + "px"
    }, resize: function () {
        var t = e([]);
        e.each(e.ui.dialog.overlay.instances, function () {
            t = t.add(this)
        }), t.css({width: 0, height: 0}).css({width: e.ui.dialog.overlay.width(), height: e.ui.dialog.overlay.height()})
    }}), e.extend(e.ui.dialog.overlay.prototype, {destroy: function () {
        e.ui.dialog.overlay.destroy(this.$el)
    }})
}(jQuery), function (e, t) {
    var n = 5;
    e.widget("ui.slider", e.ui.mouse, {widgetEventPrefix: "slide", options: {animate: !1, distance: 0, max: 100, min: 0, orientation: "horizontal", range: !1, step: 1, value: 0, values: null}, _create: function () {
        var t = this, r = this.options, i = this.element.find(".ui-slider-handle").addClass("ui-state-default ui-corner-all"), s = "<a class='ui-slider-handle ui-state-default ui-corner-all' href='#'></a>", o = r.values && r.values.length || 1, u = [];
        this._keySliding = !1, this._mouseSliding = !1, this._animateOff = !0, this._handleIndex = null, this._detectOrientation(), this._mouseInit(), this.element.addClass("ui-slider ui-slider-" + this.orientation + " ui-widget" + " ui-widget-content" + " ui-corner-all" + (r.disabled ? " ui-slider-disabled ui-disabled" : "")), this.range = e([]), r.range && (r.range === !0 && (r.values || (r.values = [this._valueMin(), this._valueMin()]), r.values.length && r.values.length !== 2 && (r.values = [r.values[0], r.values[0]])), this.range = e("<div></div>").appendTo(this.element).addClass("ui-slider-range ui-widget-header" + (r.range === "min" || r.range === "max" ? " ui-slider-range-" + r.range : "")));
        for (var f = i.length; f < o; f += 1)u.push(s);
        this.handles = i.add(e(u.join("")).appendTo(t.element)), this.handle = this.handles.eq(0), this.handles.add(this.range).filter("a").click(function (e) {
            e.preventDefault()
        }).hover(function () {
            r.disabled || e(this).addClass("ui-state-hover")
        },function () {
            e(this).removeClass("ui-state-hover")
        }).focus(function () {
            r.disabled ? e(this).blur() : (e(".ui-slider .ui-state-focus").removeClass("ui-state-focus"), e(this).addClass("ui-state-focus"))
        }).blur(function () {
            e(this).removeClass("ui-state-focus")
        }), this.handles.each(function (t) {
            e(this).data("index.ui-slider-handle", t)
        }), this.handles.keydown(function (r) {
            var i = e(this).data("index.ui-slider-handle"), s, o, u, f;
            if (t.options.disabled)return;
            switch (r.keyCode) {
                case e.ui.keyCode.HOME:
                case e.ui.keyCode.END:
                case e.ui.keyCode.PAGE_UP:
                case e.ui.keyCode.PAGE_DOWN:
                case e.ui.keyCode.UP:
                case e.ui.keyCode.RIGHT:
                case e.ui.keyCode.DOWN:
                case e.ui.keyCode.LEFT:
                    r.preventDefault();
                    if (!t._keySliding) {
                        t._keySliding = !0, e(this).addClass("ui-state-active"), s = t._start(r, i);
                        if (s === !1)return
                    }
            }
            f = t.options.step, t.options.values && t.options.values.length ? o = u = t.values(i) : o = u = t.value();
            switch (r.keyCode) {
                case e.ui.keyCode.HOME:
                    u = t._valueMin();
                    break;
                case e.ui.keyCode.END:
                    u = t._valueMax();
                    break;
                case e.ui.keyCode.PAGE_UP:
                    u = t._trimAlignValue(o + (t._valueMax() - t._valueMin()) / n);
                    break;
                case e.ui.keyCode.PAGE_DOWN:
                    u = t._trimAlignValue(o - (t._valueMax() - t._valueMin()) / n);
                    break;
                case e.ui.keyCode.UP:
                case e.ui.keyCode.RIGHT:
                    if (o === t._valueMax())return;
                    u = t._trimAlignValue(o + f);
                    break;
                case e.ui.keyCode.DOWN:
                case e.ui.keyCode.LEFT:
                    if (o === t._valueMin())return;
                    u = t._trimAlignValue(o - f)
            }
            t._slide(r, i, u)
        }).keyup(function (n) {
            var r = e(this).data("index.ui-slider-handle");
            t._keySliding && (t._keySliding = !1, t._stop(n, r), t._change(n, r), e(this).removeClass("ui-state-active"))
        }), this._refreshValue(), this._animateOff = !1
    }, destroy: function () {
        return this.handles.remove(), this.range.remove(), this.element.removeClass("ui-slider ui-slider-horizontal ui-slider-vertical ui-slider-disabled ui-widget ui-widget-content ui-corner-all").removeData("slider").unbind(".slider"), this._mouseDestroy(), this
    }, _mouseCapture: function (t) {
        var n = this.options, r, i, s, o, u, f, l, c, h;
        return n.disabled ? !1 : (this.elementSize = {width: this.element.outerWidth(), height: this.element.outerHeight()}, this.elementOffset = this.element.offset(), r = {x: t.pageX, y: t.pageY}, i = this._normValueFromMouse(r), s = this._valueMax() - this._valueMin() + 1, u = this, this.handles.each(function (t) {
            var n = Math.abs(i - u.values(t));
            s > n && (s = n, o = e(this), f = t)
        }), n.range === !0 && this.values(1) === n.min && (f += 1, o = e(this.handles[f])), l = this._start(t, f), l === !1 ? !1 : (this._mouseSliding = !0, u._handleIndex = f, o.addClass("ui-state-active").focus(), c = o.offset(), h = !e(t.target).parents().andSelf().is(".ui-slider-handle"), this._clickOffset = h ? {left: 0, top: 0} : {left: t.pageX - c.left - o.width() / 2, top: t.pageY - c.top - o.height() / 2 - (parseInt(o.css("borderTopWidth"), 10) || 0) - (parseInt(o.css("borderBottomWidth"), 10) || 0) + (parseInt(o.css("marginTop"), 10) || 0)}, this.handles.hasClass("ui-state-hover") || this._slide(t, f, i), this._animateOff = !0, !0))
    }, _mouseStart: function (e) {
        return!0
    }, _mouseDrag: function (e) {
        var t = {x: e.pageX, y: e.pageY}, n = this._normValueFromMouse(t);
        return this._slide(e, this._handleIndex, n), !1
    }, _mouseStop: function (e) {
        return this.handles.removeClass("ui-state-active"), this._mouseSliding = !1, this._stop(e, this._handleIndex), this._change(e, this._handleIndex), this._handleIndex = null, this._clickOffset = null, this._animateOff = !1, !1
    }, _detectOrientation: function () {
        this.orientation = this.options.orientation === "vertical" ? "vertical" : "horizontal"
    }, _normValueFromMouse: function (e) {
        var t, n, r, i, s;
        return this.orientation === "horizontal" ? (t = this.elementSize.width, n = e.x - this.elementOffset.left - (this._clickOffset ? this._clickOffset.left : 0)) : (t = this.elementSize.height, n = e.y - this.elementOffset.top - (this._clickOffset ? this._clickOffset.top : 0)), r = n / t, r > 1 && (r = 1), r < 0 && (r = 0), this.orientation === "vertical" && (r = 1 - r), i = this._valueMax() - this._valueMin(), s = this._valueMin() + r * i, this._trimAlignValue(s)
    }, _start: function (e, t) {
        var n = {handle: this.handles[t], value: this.value()};
        return this.options.values && this.options.values.length && (n.value = this.values(t), n.values = this.values()), this._trigger("start", e, n)
    }, _slide: function (e, t, n) {
        var r, i, s;
        this.options.values && this.options.values.length ? (r = this.values(t ? 0 : 1), this.options.values.length === 2 && this.options.range === !0 && (t === 0 && n > r || t === 1 && n < r) && (n = r), n !== this.values(t) && (i = this.values(), i[t] = n, s = this._trigger("slide", e, {handle: this.handles[t], value: n, values: i}), r = this.values(t ? 0 : 1), s !== !1 && this.values(t, n, !0))) : n !== this.value() && (s = this._trigger("slide", e, {handle: this.handles[t], value: n}), s !== !1 && this.value(n))
    }, _stop: function (e, t) {
        var n = {handle: this.handles[t], value: this.value()};
        this.options.values && this.options.values.length && (n.value = this.values(t), n.values = this.values()), this._trigger("stop", e, n)
    }, _change: function (e, t) {
        if (!this._keySliding && !this._mouseSliding) {
            var n = {handle: this.handles[t], value: this.value()};
            this.options.values && this.options.values.length && (n.value = this.values(t), n.values = this.values()), this._trigger("change", e, n)
        }
    }, value: function (e) {
        if (arguments.length) {
            this.options.value = this._trimAlignValue(e), this._refreshValue(), this._change(null, 0);
            return
        }
        return this._value()
    }, values: function (t, n) {
        var r, i, s;
        if (arguments.length > 1) {
            this.options.values[t] = this._trimAlignValue(n), this._refreshValue(), this._change(null, t);
            return
        }
        if (!arguments.length)return this._values();
        if (!e.isArray(arguments[0]))return this.options.values && this.options.values.length ? this._values(t) : this.value();
        r = this.options.values, i = arguments[0];
        for (s = 0; s < r.length; s += 1)r[s] = this._trimAlignValue(i[s]), this._change(null, s);
        this._refreshValue()
    }, _setOption: function (t, n) {
        var r, i = 0;
        e.isArray(this.options.values) && (i = this.options.values.length), e.Widget.prototype._setOption.apply(this, arguments);
        switch (t) {
            case"disabled":
                n ? (this.handles.filter(".ui-state-focus").blur(), this.handles.removeClass("ui-state-hover"), this.handles.propAttr("disabled", !0), this.element.addClass("ui-disabled")) : (this.handles.propAttr("disabled", !1), this.element.removeClass("ui-disabled"));
                break;
            case"orientation":
                this._detectOrientation(), this.element.removeClass("ui-slider-horizontal ui-slider-vertical").addClass("ui-slider-" + this.orientation), this._refreshValue();
                break;
            case"value":
                this._animateOff = !0, this._refreshValue(), this._change(null, 0), this._animateOff = !1;
                break;
            case"values":
                this._animateOff = !0, this._refreshValue();
                for (r = 0; r < i; r += 1)this._change(null, r);
                this._animateOff = !1
        }
    }, _value: function () {
        var e = this.options.value;
        return e = this._trimAlignValue(e), e
    }, _values: function (e) {
        var t, n, r;
        if (arguments.length)return t = this.options.values[e], t = this._trimAlignValue(t), t;
        n = this.options.values.slice();
        for (r = 0; r < n.length; r += 1)n[r] = this._trimAlignValue(n[r]);
        return n
    }, _trimAlignValue: function (e) {
        if (e <= this._valueMin())return this._valueMin();
        if (e >= this._valueMax())return this._valueMax();
        var t = this.options.step > 0 ? this.options.step : 1, n = (e - this._valueMin()) % t, r = e - n;
        return Math.abs(n) * 2 >= t && (r += n > 0 ? t : -t), parseFloat(r.toFixed(5))
    }, _valueMin: function () {
        return this.options.min
    }, _valueMax: function () {
        return this.options.max
    }, _refreshValue: function () {
        var t = this.options.range, n = this.options, r = this, i = this._animateOff ? !1 : n.animate, s, o = {}, u, f, l, c;
        this.options.values && this.options.values.length ? this.handles.each(function (t, f) {
            s = (r.values(t) - r._valueMin()) / (r._valueMax() - r._valueMin()) * 100, o[r.orientation === "horizontal" ? "left" : "bottom"] = s + "%", e(this).stop(1, 1)[i ? "animate" : "css"](o, n.animate), r.options.range === !0 &&
                (r.orientation === "horizontal" ? (t === 0 && r.range.stop(1, 1)[i ? "animate" : "css"]({left: s + "%"}, n.animate), t === 1 && r.range[i ? "animate" : "css"]({width: s - u + "%"}, {queue: !1, duration: n.animate})) : (t === 0 && r.range.stop(1, 1)[i ? "animate" : "css"]({bottom: s + "%"}, n.animate), t === 1 && r.range[i ? "animate" : "css"]({height: s - u + "%"}, {queue: !1, duration: n.animate}))), u = s
        }) : (f = this.value(), l = this._valueMin(), c = this._valueMax(), s = c !== l ? (f - l) / (c - l) * 100 : 0, o[r.orientation === "horizontal" ? "left" : "bottom"] = s + "%", this.handle.stop(1, 1)[i ? "animate" : "css"](o, n.animate), t === "min" && this.orientation === "horizontal" && this.range.stop(1, 1)[i ? "animate" : "css"]({width: s + "%"}, n.animate), t === "max" && this.orientation === "horizontal" && this.range[i ? "animate" : "css"]({width: 100 - s + "%"}, {queue: !1, duration: n.animate}), t === "min" && this.orientation === "vertical" && this.range.stop(1, 1)[i ? "animate" : "css"]({height: s + "%"}, n.animate), t === "max" && this.orientation === "vertical" && this.range[i ? "animate" : "css"]({height: 100 - s + "%"}, {queue: !1, duration: n.animate}))
    }}), e.extend(e.ui.slider, {version: "1.8.24"})
}(jQuery), function (e, t) {
    function n() {
        return++i
    }

    function r() {
        return++s
    }

    var i = 0, s = 0;
    e.widget("ui.tabs", {options: {add: null, ajaxOptions: null, cache: !1, cookie: null, collapsible: !1, disable: null, disabled: [], enable: null, event: "click", fx: null, idPrefix: "ui-tabs-", load: null, panelTemplate: "<div></div>", remove: null, select: null, show: null, spinner: "<em>Loading&#8230;</em>", tabTemplate: "<li><a href='#{href}'><span>#{label}</span></a></li>"}, _create: function () {
        this._tabify(!0)
    }, _setOption: function (e, t) {
        if (e == "selected") {
            if (this.options.collapsible && t == this.options.selected)return;
            this.select(t)
        } else this.options[e] = t, this._tabify()
    }, _tabId: function (e) {
        return e.title && e.title.replace(/\s/g, "_").replace(/[^\w\u00c0-\uFFFF-]/g, "") || this.options.idPrefix + n()
    }, _sanitizeSelector: function (e) {
        return e.replace(/:/g, "\\:")
    }, _cookie: function () {
        var t = this.cookie || (this.cookie = this.options.cookie.name || "ui-tabs-" + r());
        return e.cookie.apply(null, [t].concat(e.makeArray(arguments)))
    }, _ui: function (e, t) {
        return{tab: e, panel: t, index: this.anchors.index(e)}
    }, _cleanup: function () {
        this.lis.filter(".ui-state-processing").removeClass("ui-state-processing").find("span:data(label.tabs)").each(function () {
            var t = e(this);
            t.html(t.data("label.tabs")).removeData("label.tabs")
        })
    }, _tabify: function (n) {
        function r(t, n) {
            t.css("display", ""), !e.support.opacity && n.opacity && t[0].style.removeAttribute("filter")
        }

        var i = this, s = this.options, o = /^#.+/;
        this.list = this.element.find("ol,ul").eq(0), this.lis = e(" > li:has(a[href])", this.list), this.anchors = this.lis.map(function () {
            return e("a", this)[0]
        }), this.panels = e([]), this.anchors.each(function (t, n) {
            var r = e(n).attr("href"), u = r.split("#")[0], f;
            u && (u === location.toString().split("#")[0] || (f = e("base")[0]) && u === f.href) && (r = n.hash, n.href = r);
            if (o.test(r))i.panels = i.panels.add(i.element.find(i._sanitizeSelector(r))); else if (r && r !== "#") {
                e.data(n, "href.tabs", r), e.data(n, "load.tabs", r.replace(/#.*$/, ""));
                var l = i._tabId(n);
                n.href = "#" + l;
                var c = i.element.find("#" + l);
                c.length || (c = e(s.panelTemplate).attr("id", l).addClass("ui-tabs-panel ui-widget-content ui-corner-bottom").insertAfter(i.panels[t - 1] || i.list), c.data("destroy.tabs", !0)), i.panels = i.panels.add(c)
            } else s.disabled.push(t)
        }), n ? (this.element.addClass("ui-tabs ui-widget ui-widget-content ui-corner-all"), this.list.addClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"), this.lis.addClass("ui-state-default ui-corner-top"), this.panels.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom"), s.selected === t ? (location.hash && this.anchors.each(function (e, t) {
            if (t.hash == location.hash)return s.selected = e, !1
        }), typeof s.selected != "number" && s.cookie && (s.selected = parseInt(i._cookie(), 10)), typeof s.selected != "number" && this.lis.filter(".ui-tabs-selected").length && (s.selected = this.lis.index(this.lis.filter(".ui-tabs-selected"))), s.selected = s.selected || (this.lis.length ? 0 : -1)) : s.selected === null && (s.selected = -1), s.selected = s.selected >= 0 && this.anchors[s.selected] || s.selected < 0 ? s.selected : 0, s.disabled = e.unique(s.disabled.concat(e.map(this.lis.filter(".ui-state-disabled"), function (e, t) {
            return i.lis.index(e)
        }))).sort(), e.inArray(s.selected, s.disabled) != -1 && s.disabled.splice(e.inArray(s.selected, s.disabled), 1), this.panels.addClass("ui-tabs-hide"), this.lis.removeClass("ui-tabs-selected ui-state-active"), s.selected >= 0 && this.anchors.length && (i.element.find(i._sanitizeSelector(i.anchors[s.selected].hash)).removeClass("ui-tabs-hide"), this.lis.eq(s.selected).addClass("ui-tabs-selected ui-state-active"), i.element.queue("tabs", function () {
            i._trigger("show", null, i._ui(i.anchors[s.selected], i.element.find(i._sanitizeSelector(i.anchors[s.selected].hash))[0]))
        }), this.load(s.selected)), e(window).bind("unload", function () {
            i.lis.add(i.anchors).unbind(".tabs"), i.lis = i.anchors = i.panels = null
        })) : s.selected = this.lis.index(this.lis.filter(".ui-tabs-selected")), this.element[s.collapsible ? "addClass" : "removeClass"]("ui-tabs-collapsible"), s.cookie && this._cookie(s.selected, s.cookie);
        for (var u = 0, f; f = this.lis[u]; u++)e(f)[e.inArray(u, s.disabled) != -1 && !e(f).hasClass("ui-tabs-selected") ? "addClass" : "removeClass"]("ui-state-disabled");
        s.cache === !1 && this.anchors.removeData("cache.tabs"), this.lis.add(this.anchors).unbind(".tabs");
        if (s.event !== "mouseover") {
            var l = function (e, t) {
                t.is(":not(.ui-state-disabled)") && t.addClass("ui-state-" + e)
            }, c = function (e, t) {
                t.removeClass("ui-state-" + e)
            };
            this.lis.bind("mouseover.tabs", function () {
                l("hover", e(this))
            }), this.lis.bind("mouseout.tabs", function () {
                c("hover", e(this))
            }), this.anchors.bind("focus.tabs", function () {
                l("focus", e(this).closest("li"))
            }), this.anchors.bind("blur.tabs", function () {
                c("focus", e(this).closest("li"))
            })
        }
        var h, p;
        s.fx && (e.isArray(s.fx) ? (h = s.fx[0], p = s.fx[1]) : h = p = s.fx);
        var d = p ? function (t, n) {
            e(t).closest("li").addClass("ui-tabs-selected ui-state-active"), n.hide().removeClass("ui-tabs-hide").animate(p, p.duration || "normal", function () {
                r(n, p), i._trigger("show", null, i._ui(t, n[0]))
            })
        } : function (t, n) {
            e(t).closest("li").addClass("ui-tabs-selected ui-state-active"), n.removeClass("ui-tabs-hide"), i._trigger("show", null, i._ui(t, n[0]))
        }, v = h ? function (e, t) {
            t.animate(h, h.duration || "normal", function () {
                i.lis.removeClass("ui-tabs-selected ui-state-active"), t.addClass("ui-tabs-hide"), r(t, h), i.element.dequeue("tabs")
            })
        } : function (e, t, n) {
            i.lis.removeClass("ui-tabs-selected ui-state-active"), t.addClass("ui-tabs-hide"), i.element.dequeue("tabs")
        };
        this.anchors.bind(s.event + ".tabs", function () {
            var t = this, n = e(t).closest("li"), r = i.panels.filter(":not(.ui-tabs-hide)"), o = i.element.find(i._sanitizeSelector(t.hash));
            if (n.hasClass("ui-tabs-selected") && !s.collapsible || n.hasClass("ui-state-disabled") || n.hasClass("ui-state-processing") || i.panels.filter(":animated").length || i._trigger("select", null, i._ui(this, o[0])) === !1)return this.blur(), !1;
            s.selected = i.anchors.index(this), i.abort();
            if (s.collapsible) {
                if (n.hasClass("ui-tabs-selected"))return s.selected = -1, s.cookie && i._cookie(s.selected, s.cookie), i.element.queue("tabs",function () {
                    v(t, r)
                }).dequeue("tabs"), this.blur(), !1;
                if (!r.length)return s.cookie && i._cookie(s.selected, s.cookie), i.element.queue("tabs", function () {
                    d(t, o)
                }), i.load(i.anchors.index(this)), this.blur(), !1
            }
            s.cookie && i._cookie(s.selected, s.cookie);
            if (!o.length)throw"jQuery UI Tabs: Mismatching fragment identifier.";
            r.length && i.element.queue("tabs", function () {
                v(t, r)
            }), i.element.queue("tabs", function () {
                d(t, o)
            }), i.load(i.anchors.index(this)), e.browser.msie && this.blur()
        }), this.anchors.bind("click.tabs", function () {
            return!1
        })
    }, _getIndex: function (e) {
        return typeof e == "string" && (e = this.anchors.index(this.anchors.filter("[href$='" + e + "']"))), e
    }, destroy: function () {
        var t = this.options;
        return this.abort(), this.element.unbind(".tabs").removeClass("ui-tabs ui-widget ui-widget-content ui-corner-all ui-tabs-collapsible").removeData("tabs"), this.list.removeClass("ui-tabs-nav ui-helper-reset ui-helper-clearfix ui-widget-header ui-corner-all"), this.anchors.each(function () {
            var t = e.data(this, "href.tabs");
            t && (this.href = t);
            var n = e(this).unbind(".tabs");
            e.each(["href", "load", "cache"], function (e, t) {
                n.removeData(t + ".tabs")
            })
        }), this.lis.unbind(".tabs").add(this.panels).each(function () {
            e.data(this, "destroy.tabs") ? e(this).remove() : e(this).removeClass(["ui-state-default", "ui-corner-top", "ui-tabs-selected", "ui-state-active", "ui-state-hover", "ui-state-focus", "ui-state-disabled", "ui-tabs-panel", "ui-widget-content", "ui-corner-bottom", "ui-tabs-hide"].join(" "))
        }), t.cookie && this._cookie(null, t.cookie), this
    }, add: function (n, r, i) {
        i === t && (i = this.anchors.length);
        var s = this, o = this.options, u = e(o.tabTemplate.replace(/#\{href\}/g, n).replace(/#\{label\}/g, r)), f = n.indexOf("#") ? this._tabId(e("a", u)[0]) : n.replace("#", "");
        u.addClass("ui-state-default ui-corner-top").data("destroy.tabs", !0);
        var l = s.element.find("#" + f);
        return l.length || (l = e(o.panelTemplate).attr("id", f).data("destroy.tabs", !0)), l.addClass("ui-tabs-panel ui-widget-content ui-corner-bottom ui-tabs-hide"), i >= this.lis.length ? (u.appendTo(this.list), l.appendTo(this.list[0].parentNode)) : (u.insertBefore(this.lis[i]), l.insertBefore(this.panels[i])), o.disabled = e.map(o.disabled, function (e, t) {
            return e >= i ? ++e : e
        }), this._tabify(), this.anchors.length == 1 && (o.selected = 0, u.addClass("ui-tabs-selected ui-state-active"), l.removeClass("ui-tabs-hide"), this.element.queue("tabs", function () {
            s._trigger("show", null, s._ui(s.anchors[0], s.panels[0]))
        }), this.load(0)), this._trigger("add", null, this._ui(this.anchors[i], this.panels[i])), this
    }, remove: function (t) {
        t = this._getIndex(t);
        var n = this.options, r = this.lis.eq(t).remove(), i = this.panels.eq(t).remove();
        return r.hasClass("ui-tabs-selected") && this.anchors.length > 1 && this.select(t + (t + 1 < this.anchors.length ? 1 : -1)), n.disabled = e.map(e.grep(n.disabled, function (e, n) {
            return e != t
        }), function (e, n) {
            return e >= t ? --e : e
        }), this._tabify(), this._trigger("remove", null, this._ui(r.find("a")[0], i[0])), this
    }, enable: function (t) {
        t = this._getIndex(t);
        var n = this.options;
        if (e.inArray(t, n.disabled) == -1)return;
        return this.lis.eq(t).removeClass("ui-state-disabled"), n.disabled = e.grep(n.disabled, function (e, n) {
            return e != t
        }), this._trigger("enable", null, this._ui(this.anchors[t], this.panels[t])), this
    }, disable: function (e) {
        e = this._getIndex(e);
        var t = this, n = this.options;
        return e != n.selected && (this.lis.eq(e).addClass("ui-state-disabled"), n.disabled.push(e), n.disabled.sort(), this._trigger("disable", null, this._ui(this.anchors[e], this.panels[e]))), this
    }, select: function (e) {
        e = this._getIndex(e);
        if (e == -1) {
            if (!this.options.collapsible || this.options.selected == -1)return this;
            e = this.options.selected
        }
        return this.anchors.eq(e).trigger(this.options.event + ".tabs"), this
    }, load: function (t) {
        t = this._getIndex(t);
        var n = this, r = this.options, i = this.anchors.eq(t)[0], s = e.data(i, "load.tabs");
        this.abort();
        if (!s || this.element.queue("tabs").length !== 0 && e.data(i, "cache.tabs")) {
            this.element.dequeue("tabs");
            return
        }
        this.lis.eq(t).addClass("ui-state-processing");
        if (r.spinner) {
            var o = e("span", i);
            o.data("label.tabs", o.html()).html(r.spinner)
        }
        return this.xhr = e.ajax(e.extend({}, r.ajaxOptions, {url: s, success: function (s, o) {
            n.element.find(n._sanitizeSelector(i.hash)).html(s), n._cleanup(), r.cache && e.data(i, "cache.tabs", !0), n._trigger("load", null, n._ui(n.anchors[t], n.panels[t]));
            try {
                r.ajaxOptions.success(s, o)
            } catch (u) {
            }
        }, error: function (e, s, o) {
            n._cleanup(), n._trigger("load", null, n._ui(n.anchors[t], n.panels[t]));
            try {
                r.ajaxOptions.error(e, s, t, i)
            } catch (o) {
            }
        }})), n.element.dequeue("tabs"), this
    }, abort: function () {
        return this.element.queue([]), this.panels.stop(!1, !0), this.element.queue("tabs", this.element.queue("tabs").splice(-2, 2)), this.xhr && (this.xhr.abort(), delete this.xhr), this._cleanup(), this
    }, url: function (e, t) {
        return this.anchors.eq(e).removeData("cache.tabs").data("load.tabs", t), this
    }, length: function () {
        return this.anchors.length
    }}), e.extend(e.ui.tabs, {version: "1.8.24"}), e.extend(e.ui.tabs.prototype, {rotation: null, rotate: function (e, t) {
        var n = this, r = this.options, i = n._rotate || (n._rotate = function (t) {
            clearTimeout(n.rotation), n.rotation = setTimeout(function () {
                var e = r.selected;
                n.select(++e < n.anchors.length ? e : 0)
            }, e), t && t.stopPropagation()
        }), s = n._unrotate || (n._unrotate = t ? function (e) {
            i()
        } : function (e) {
            e.clientX && n.rotate(null)
        });
        return e ? (this.element.bind("tabsshow", i), this.anchors.bind(r.event + ".tabs", s), i()) : (clearTimeout(n.rotation), this.element.unbind("tabsshow", i), this.anchors.unbind(r.event + ".tabs", s), delete this._rotate, delete this._unrotate), this
    }})
}(jQuery), function ($, undefined) {
    function Datepicker() {
        this.debug = !1, this._curInst = null, this._keyEvent = !1, this._disabledInputs = [], this._datepickerShowing = !1, this._inDialog = !1, this._mainDivId = "ui-datepicker-div", this._inlineClass = "ui-datepicker-inline", this._appendClass = "ui-datepicker-append", this._triggerClass = "ui-datepicker-trigger", this._dialogClass = "ui-datepicker-dialog", this._disableClass = "ui-datepicker-disabled", this._unselectableClass = "ui-datepicker-unselectable", this._currentClass = "ui-datepicker-current-day", this._dayOverClass = "ui-datepicker-days-cell-over", this.regional = [], this.regional[""] = {closeText: "Done", prevText: "Prev", nextText: "Next", currentText: "Today", monthNames: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"], monthNamesShort: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"], dayNames: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"], dayNamesShort: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"], dayNamesMin: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"], weekHeader: "Wk", dateFormat: "mm/dd/yy", firstDay: 0, isRTL: !1, showMonthAfterYear: !1, yearSuffix: ""}, this._defaults = {showOn: "focus", showAnim: "fadeIn", showOptions: {}, defaultDate: null, appendText: "", buttonText: "...", buttonImage: "", buttonImageOnly: !1, hideIfNoPrevNext: !1, navigationAsDateFormat: !1, gotoCurrent: !1, changeMonth: !1, changeYear: !1, yearRange: "c-10:c+10", showOtherMonths: !1, selectOtherMonths: !1, showWeek: !1, calculateWeek: this.iso8601Week, shortYearCutoff: "+10", minDate: null, maxDate: null, duration: "fast", beforeShowDay: null, beforeShow: null, onSelect: null, onChangeMonthYear: null, onClose: null, numberOfMonths: 1, showCurrentAtPos: 0, stepMonths: 1, stepBigMonths: 12, altField: "", altFormat: "", constrainInput: !0, showButtonPanel: !1, autoSize: !1, disabled: !1}, $.extend(this._defaults, this.regional[""]), this.dpDiv = bindHover($('<div id="' + this._mainDivId + '" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>'))
    }

    function bindHover(e) {
        var t = "button, .ui-datepicker-prev, .ui-datepicker-next, .ui-datepicker-calendar td a";
        return e.bind("mouseout",function (e) {
            var n = $(e.target).closest(t);
            if (!n.length)return;
            n.removeClass("ui-state-hover ui-datepicker-prev-hover ui-datepicker-next-hover")
        }).bind("mouseover", function (n) {
            var r = $(n.target).closest(t);
            if ($.datepicker._isDisabledDatepicker(instActive.inline ? e.parent()[0] : instActive.input[0]) || !r.length)return;
            r.parents(".ui-datepicker-calendar").find("a").removeClass("ui-state-hover"), r.addClass("ui-state-hover"), r.hasClass("ui-datepicker-prev") && r.addClass("ui-datepicker-prev-hover"), r.hasClass("ui-datepicker-next") && r.addClass("ui-datepicker-next-hover")
        })
    }

    function extendRemove(e, t) {
        $.extend(e, t);
        for (var n in t)if (t[n] == null || t[n] == undefined)e[n] = t[n];
        return e
    }

    function isArray(e) {
        return e && ($.browser.safari && typeof e == "object" && e.length || e.constructor && e.constructor.toString().match(/\Array\(\)/))
    }

    $.extend($.ui, {datepicker: {version: "1.8.24"}});
    var PROP_NAME = "datepicker", dpuuid = (new Date).getTime(), instActive;
    $.extend(Datepicker.prototype, {markerClassName: "hasDatepicker", maxRows: 4, log: function () {
        this.debug && console.log.apply("", arguments)
    }, _widgetDatepicker: function () {
        return this.dpDiv
    }, setDefaults: function (e) {
        return extendRemove(this._defaults, e || {}), this
    }, _attachDatepicker: function (target, settings) {
        var inlineSettings = null;
        for (var attrName in this._defaults) {
            var attrValue = target.getAttribute("date:" + attrName);
            if (attrValue) {
                inlineSettings = inlineSettings || {};
                try {
                    inlineSettings[attrName] = eval(attrValue)
                } catch (err) {
                    inlineSettings[attrName] = attrValue
                }
            }
        }
        var nodeName = target.nodeName.toLowerCase(), inline = nodeName == "div" || nodeName == "span";
        target.id || (this.uuid += 1, target.id = "dp" + this.uuid);
        var inst = this._newInst($(target), inline);
        inst.settings = $.extend({}, settings || {}, inlineSettings || {}), nodeName == "input" ? this._connectDatepicker(target, inst) : inline && this._inlineDatepicker(target, inst)
    }, _newInst: function (e, t) {
        var n = e[0].id.replace(/([^A-Za-z0-9_-])/g, "\\\\$1");
        return{id: n, input: e, selectedDay: 0, selectedMonth: 0, selectedYear: 0, drawMonth: 0, drawYear: 0, inline: t, dpDiv: t ? bindHover($('<div class="' + this._inlineClass + ' ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all"></div>')) : this.dpDiv}
    }, _connectDatepicker: function (e, t) {
        var n = $(e);
        t.append = $([]), t.trigger = $([]);
        if (n.hasClass(this.markerClassName))return;
        this._attachments(n, t), n.addClass(this.markerClassName).keydown(this._doKeyDown).keypress(this._doKeyPress).keyup(this._doKeyUp).bind("setData.datepicker",function (e, n, r) {
            t.settings[n] = r
        }).bind("getData.datepicker", function (e, n) {
            return this._get(t, n)
        }), this._autoSize(t), $.data(e, PROP_NAME, t), t.settings.disabled && this._disableDatepicker(e)
    }, _attachments: function (e, t) {
        var n = this._get(t, "appendText"), r = this._get(t, "isRTL");
        t.append && t.append.remove(), n && (t.append = $('<span class="' + this._appendClass + '">' + n + "</span>"), e[r ? "before" : "after"](t.append)), e.unbind("focus", this._showDatepicker), t.trigger && t.trigger.remove();
        var i = this._get(t, "showOn");
        (i == "focus" || i == "both") && e.focus(this._showDatepicker);
        if (i == "button" || i == "both") {
            var s = this._get(t, "buttonText"), o = this._get(t, "buttonImage");
            t.trigger = $(this._get(t, "buttonImageOnly") ? $("<img/>").addClass(this._triggerClass).attr({src: o, alt: s, title: s}) : $('<button type="button"></button>').addClass(this._triggerClass).html(o == "" ? s : $("<img/>").attr({src: o, alt: s, title: s}))), e[r ? "before" : "after"](t.trigger), t.trigger.click(function () {
                return $.datepicker._datepickerShowing && $.datepicker._lastInput == e[0] ? $.datepicker._hideDatepicker() : $.datepicker._datepickerShowing && $.datepicker._lastInput != e[0] ? ($.datepicker._hideDatepicker(), $.datepicker._showDatepicker(e[0])) : $.datepicker._showDatepicker(e[0]), !1
            })
        }
    }, _autoSize: function (e) {
        if (this._get(e, "autoSize") && !e.inline) {
            var t = new Date(2009, 11, 20), n = this._get(e, "dateFormat");
            if (n.match(/[DM]/)) {
                var r = function (e) {
                    var t = 0, n = 0;
                    for (var r = 0; r < e.length; r++)e[r].length > t && (t = e[r].length, n = r);
                    return n
                };
                t.setMonth(r(this._get(e, n.match(/MM/) ? "monthNames" : "monthNamesShort"))), t.setDate(r(this._get(e, n.match(/DD/) ? "dayNames" : "dayNamesShort")) + 20 - t.getDay())
            }
            e.input.attr("size", this._formatDate(e, t).length)
        }
    }, _inlineDatepicker: function (e, t) {
        var n = $(e);
        if (n.hasClass(this.markerClassName))return;
        n.addClass(this.markerClassName).append(t.dpDiv).bind("setData.datepicker",function (e, n, r) {
            t.settings[n] = r
        }).bind("getData.datepicker", function (e, n) {
            return this._get(t, n)
        }), $.data(e, PROP_NAME, t), this._setDate(t, this._getDefaultDate(t), !0), this._updateDatepicker(t), this._updateAlternate(t), t.settings.disabled && this._disableDatepicker(e), t.dpDiv.css("display", "block")
    }, _dialogDatepicker: function (e, t, n, r, i) {
        var s = this._dialogInst;
        if (!s) {
            this.uuid += 1;
            var o = "dp" + this.uuid;
            this._dialogInput = $('<input type="text" id="' + o + '" style="position: absolute; top: -100px; width: 0px;"/>'), this._dialogInput.keydown(this._doKeyDown), $("body").append(this._dialogInput), s = this._dialogInst = this._newInst(this._dialogInput, !1), s.settings = {}, $.data(this._dialogInput[0], PROP_NAME, s)
        }
        extendRemove(s.settings, r || {}), t = t && t.constructor == Date ? this._formatDate(s, t) : t, this._dialogInput.val(t), this._pos = i ? i.length ? i : [i.pageX, i.pageY] : null;
        if (!this._pos) {
            var u = document.documentElement.clientWidth, a = document.documentElement.clientHeight, f = document.documentElement.scrollLeft || document.body.scrollLeft, l = document.documentElement.scrollTop || document.body.scrollTop;
            this._pos = [u / 2 - 100 + f, a / 2 - 150 + l]
        }
        return this._dialogInput.css("left", this._pos[0] + 20 + "px").css("top", this._pos[1] + "px"), s.settings.onSelect = n, this._inDialog = !0, this.dpDiv.addClass(this._dialogClass), this._showDatepicker(this._dialogInput[0]), $.blockUI && $.blockUI(this.dpDiv), $.data(this._dialogInput[0], PROP_NAME, s), this
    }, _destroyDatepicker: function (e) {
        var t = $(e), n = $.data(e, PROP_NAME);
        if (!t.hasClass(this.markerClassName))return;
        var r = e.nodeName.toLowerCase();
        $.removeData(e, PROP_NAME), r == "input" ? (n.append.remove(), n.trigger.remove(), t.removeClass(this.markerClassName).unbind("focus", this._showDatepicker).unbind("keydown", this._doKeyDown).unbind("keypress", this._doKeyPress).unbind("keyup", this._doKeyUp)) : (r == "div" || r == "span") && t.removeClass(this.markerClassName).empty()
    }, _enableDatepicker: function (e) {
        var t = $(e), n = $.data(e, PROP_NAME);
        if (!t.hasClass(this.markerClassName))return;
        var r = e.nodeName.toLowerCase();
        if (r == "input")e.disabled = !1, n.trigger.filter("button").each(function () {
            this.disabled = !1
        }).end().filter("img").css({opacity: "1.0", cursor: ""}); else if (r == "div" || r == "span") {
            var i = t.children("." + this._inlineClass);
            i.children().removeClass("ui-state-disabled"), i.find("select.ui-datepicker-month, select.ui-datepicker-year").removeAttr("disabled")
        }
        this._disabledInputs = $.map(this._disabledInputs, function (t) {
            return t == e ? null : t
        })
    }, _disableDatepicker: function (e) {
        var t = $(e), n = $.data(e, PROP_NAME);
        if (!t.hasClass(this.markerClassName))return;
        var r = e.nodeName.toLowerCase();
        if (r == "input")e.disabled = !0, n.trigger.filter("button").each(function () {
            this.disabled = !0
        }).end().filter("img").css({opacity: "0.5", cursor: "default"}); else if (r == "div" || r == "span") {
            var i = t.children("." + this._inlineClass);
            i.children().addClass("ui-state-disabled"), i.find("select.ui-datepicker-month, select.ui-datepicker-year").attr("disabled", "disabled")
        }
        this._disabledInputs = $.map(this._disabledInputs, function (t) {
            return t == e ? null : t
        }), this._disabledInputs[this._disabledInputs.length] = e
    }, _isDisabledDatepicker: function (e) {
        if (!e)return!1;
        for (var t = 0; t < this._disabledInputs.length; t++)if (this._disabledInputs[t] == e)return!0;
        return!1
    }, _getInst: function (e) {
        try {
            return $.data(e, PROP_NAME)
        } catch (t) {
            throw"Missing instance data for this datepicker"
        }
    }, _optionDatepicker: function (e, t, n) {
        var r = this._getInst(e);
        if (arguments.length == 2 && typeof t == "string")return t == "defaults" ? $.extend({}, $.datepicker._defaults) : r ? t == "all" ? $.extend({}, r.settings) : this._get(r, t) : null;
        var i = t || {};
        typeof t == "string" && (i = {}, i[t] = n);
        if (r) {
            this._curInst == r && this._hideDatepicker();
            var s = this._getDateDatepicker(e, !0), o = this._getMinMaxDate(r, "min"), u = this._getMinMaxDate(r, "max");
            extendRemove(r.settings, i), o !== null && i.dateFormat !== undefined && i.minDate === undefined && (r.settings.minDate = this._formatDate(r, o)), u !== null && i.dateFormat !== undefined && i.maxDate === undefined && (r.settings.maxDate = this._formatDate(r, u)), this._attachments($(e), r), this._autoSize(r), this._setDate(r, s), this._updateAlternate(r), this._updateDatepicker(r)
        }
    }, _changeDatepicker: function (e, t, n) {
        this._optionDatepicker(e, t, n)
    }, _refreshDatepicker: function (e) {
        var t = this._getInst(e);
        t && this._updateDatepicker(t)
    }, _setDateDatepicker: function (e, t) {
        var n = this._getInst(e);
        n && (this._setDate(n, t), this._updateDatepicker(n), this._updateAlternate(n))
    }, _getDateDatepicker: function (e, t) {
        var n = this._getInst(e);
        return n && !n.inline && this._setDateFromField(n, t), n ? this._getDate(n) : null
    }, _doKeyDown: function (e) {
        var t = $.datepicker._getInst(e.target), n = !0, r = t.dpDiv.is(".ui-datepicker-rtl");
        t._keyEvent = !0;
        if ($.datepicker._datepickerShowing)switch (e.keyCode) {
            case 9:
                $.datepicker._hideDatepicker(), n = !1;
                break;
            case 13:
                var i = $("td." + $.datepicker._dayOverClass + ":not(." + $.datepicker._currentClass + ")", t.dpDiv);
                i[0] && $.datepicker._selectDay(e.target, t.selectedMonth, t.selectedYear, i[0]);
                var s = $.datepicker._get(t, "onSelect");
                if (s) {
                    var o = $.datepicker._formatDate(t);
                    s.apply(t.input ? t.input[0] : null, [o, t])
                } else $.datepicker._hideDatepicker();
                return!1;
            case 27:
                $.datepicker._hideDatepicker();
                break;
            case 33:
                $.datepicker._adjustDate(e.target, e.ctrlKey ? -$.datepicker._get(t, "stepBigMonths") : -$.datepicker._get(t, "stepMonths"), "M");
                break;
            case 34:
                $.datepicker._adjustDate(e.target, e.ctrlKey ? +$.datepicker._get(t, "stepBigMonths") : +$.datepicker._get(t, "stepMonths"), "M");
                break;
            case 35:
                (e.ctrlKey || e.metaKey) && $.datepicker._clearDate(e.target), n = e.ctrlKey || e.metaKey;
                break;
            case 36:
                (e.ctrlKey || e.metaKey) && $.datepicker._gotoToday(e.target), n = e.ctrlKey || e.metaKey;
                break;
            case 37:
                (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, r ? 1 : -1, "D"), n = e.ctrlKey || e.metaKey, e.originalEvent.altKey && $.datepicker._adjustDate(e.target, e.ctrlKey ? -$.datepicker._get(t, "stepBigMonths") : -$.datepicker._get(t, "stepMonths"), "M");
                break;
            case 38:
                (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, -7, "D"), n = e.ctrlKey || e.metaKey;
                break;
            case 39:
                (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, r ? -1 : 1, "D"), n = e.ctrlKey || e.metaKey, e.originalEvent.altKey && $.datepicker._adjustDate(e.target, e.ctrlKey ? +$.datepicker._get(t, "stepBigMonths") : +$.datepicker._get(t, "stepMonths"), "M");
                break;
            case 40:
                (e.ctrlKey || e.metaKey) && $.datepicker._adjustDate(e.target, 7, "D"), n = e.ctrlKey || e.metaKey;
                break;
            default:
                n = !1
        } else e.keyCode == 36 && e.ctrlKey ? $.datepicker._showDatepicker(this) : n = !1;
        n && (e.preventDefault(), e.stopPropagation())
    }, _doKeyPress: function (e) {
        var t = $.datepicker._getInst(e.target);
        if ($.datepicker._get(t, "constrainInput")) {
            var n = $.datepicker._possibleChars($.datepicker._get(t, "dateFormat")), r = String.fromCharCode(e.charCode == undefined ? e.keyCode : e.charCode);
            return e.ctrlKey || e.metaKey || r < " " || !n || n.indexOf(r) > -1
        }
    }, _doKeyUp: function (e) {
        var t = $.datepicker._getInst(e.target);
        if (t.input.val() != t.lastVal)try {
            var n = $.datepicker.parseDate($.datepicker._get(t, "dateFormat"), t.input ? t.input.val() : null, $.datepicker._getFormatConfig(t));
            n && ($.datepicker._setDateFromField(t), $.datepicker._updateAlternate(t), $.datepicker._updateDatepicker(t))
        } catch (r) {
            $.datepicker.log(r)
        }
        return!0
    }, _showDatepicker: function (e) {
        e = e.target || e, e.nodeName.toLowerCase() != "input" && (e = $("input", e.parentNode)[0]);
        if ($.datepicker._isDisabledDatepicker(e) || $.datepicker._lastInput == e)return;
        var t = $.datepicker._getInst(e);
        $.datepicker._curInst && $.datepicker._curInst != t && ($.datepicker._curInst.dpDiv.stop(!0, !0), t && $.datepicker._datepickerShowing && $.datepicker._hideDatepicker($.datepicker._curInst.input[0]));
        var n = $.datepicker._get(t, "beforeShow"), r = n ? n.apply(e, [e, t]) : {};
        if (r === !1)return;
        extendRemove(t.settings, r), t.lastVal = null, $.datepicker._lastInput = e, $.datepicker._setDateFromField(t), $.datepicker._inDialog && (e.value = ""), $.datepicker._pos || ($.datepicker._pos = $.datepicker._findPos(e), $.datepicker._pos[1] += e.offsetHeight);
        var i = !1;
        $(e).parents().each(function () {
            return i |= $(this).css("position") == "fixed", !i
        }), i && $.browser.opera && ($.datepicker._pos[0] -= document.documentElement.scrollLeft, $.datepicker._pos[1] -= document.documentElement.scrollTop);
        var s = {left: $.datepicker._pos[0], top: $.datepicker._pos[1]};
        $.datepicker._pos = null, t.dpDiv.empty(), t.dpDiv.css({position: "absolute", display: "block", top: "-1000px"}), $.datepicker._updateDatepicker(t), s = $.datepicker._checkOffset(t, s, i), t.dpDiv.css({position: $.datepicker._inDialog && $.blockUI ? "static" : i ? "fixed" : "absolute", display: "none", left: s.left + "px", top: s.top + "px"});
        if (!t.inline) {
            var o = $.datepicker._get(t, "showAnim"), u = $.datepicker._get(t, "duration"), a = function () {
                var e = t.dpDiv.find("iframe.ui-datepicker-cover");
                if (!!e.length) {
                    var n = $.datepicker._getBorders(t.dpDiv);
                    e.css({left: -n[0], top: -n[1], width: t.dpDiv.outerWidth(), height: t.dpDiv.outerHeight()})
                }
            };
            t.dpDiv.zIndex($(e).zIndex() + 1), $.datepicker._datepickerShowing = !0, $.effects && $.effects[o] ? t.dpDiv.show(o, $.datepicker._get(t, "showOptions"), u, a) : t.dpDiv[o || "show"](o ? u : null, a), (!o || !u) && a(), t.input.is(":visible") && !t.input.is(":disabled") && t.input.focus(), $.datepicker._curInst = t
        }
    }, _updateDatepicker: function (e) {
        var t = this;
        t.maxRows = 4;
        var n = $.datepicker._getBorders(e.dpDiv);
        instActive = e, e.dpDiv.empty().append(this._generateHTML(e)), this._attachHandlers(e);
        var r = e.dpDiv.find("iframe.ui-datepicker-cover");
        !r.length || r.css({left: -n[0], top: -n[1], width: e.dpDiv.outerWidth(), height: e.dpDiv.outerHeight()}), e.dpDiv.find("." + this._dayOverClass + " a").mouseover();
        var i = this._getNumberOfMonths(e), s = i[1], o = 17;
        e.dpDiv.removeClass("ui-datepicker-multi-2 ui-datepicker-multi-3 ui-datepicker-multi-4").width(""), s > 1 && e.dpDiv.addClass("ui-datepicker-multi-" + s).css("width", o * s + "em"), e.dpDiv[(i[0] != 1 || i[1] != 1 ? "add" : "remove") + "Class"]("ui-datepicker-multi"), e.dpDiv[(this._get(e, "isRTL") ? "add" : "remove") + "Class"]("ui-datepicker-rtl"), e == $.datepicker._curInst && $.datepicker._datepickerShowing && e.input && e.input.is(":visible") && !e.input.is(":disabled") && e.input[0] != document.activeElement && e.input.focus();
        if (e.yearshtml) {
            var u = e.yearshtml;
            setTimeout(function () {
                u === e.yearshtml && e.yearshtml && e.dpDiv.find("select.ui-datepicker-year:first").replaceWith(e.yearshtml), u = e.yearshtml = null
            }, 0)
        }
    }, _getBorders: function (e) {
        var t = function (e) {
            return{thin: 1, medium: 2, thick: 3}[e] || e
        };
        return[parseFloat(t(e.css("border-left-width"))), parseFloat(t(e.css("border-top-width")))]
    }, _checkOffset: function (e, t, n) {
        var r = e.dpDiv.outerWidth(), i = e.dpDiv.outerHeight(), s = e.input ? e.input.outerWidth() : 0, o = e.input ? e.input.outerHeight() : 0, u = document.documentElement.clientWidth + (n ? 0 : $(document).scrollLeft()), a = document.documentElement.clientHeight + (n ? 0 : $(document).scrollTop());
        return t.left -= this._get(e, "isRTL") ? r - s : 0, t.left -= n && t.left == e.input.offset().left ? $(document).scrollLeft() : 0, t.top -= n && t.top == e.input.offset().top + o ? $(document).scrollTop() : 0, t.left -= Math.min(t.left, t.left + r > u && u > r ? Math.abs(t.left + r - u) : 0), t.top -= Math.min(t.top, t.top + i > a && a > i ? Math.abs(i + o) : 0), t
    }, _findPos: function (e) {
        var t = this._getInst(e), n = this._get(t, "isRTL");
        while (e && (e.type == "hidden" || e.nodeType != 1 || $.expr.filters.hidden(e)))e = e[n ? "previousSibling" : "nextSibling"];
        var r = $(e).offset();
        return[r.left, r.top]
    }, _hideDatepicker: function (e) {
        var t = this._curInst;
        if (!t || e && t != $.data(e, PROP_NAME))return;
        if (this._datepickerShowing) {
            var n = this._get(t, "showAnim"), r = this._get(t, "duration"), i = function () {
                $.datepicker._tidyDialog(t)
            };
            $.effects && $.effects[n] ? t.dpDiv.hide(n, $.datepicker._get(t, "showOptions"), r, i) : t.dpDiv[n == "slideDown" ? "slideUp" : n == "fadeIn" ? "fadeOut" : "hide"](n ? r : null, i), n || i(), this._datepickerShowing = !1;
            var s = this._get(t, "onClose");
            s && s.apply(t.input ? t.input[0] : null, [t.input ? t.input.val() : "", t]), this._lastInput = null, this._inDialog && (this._dialogInput.css({position: "absolute", left: "0", top: "-100px"}), $.blockUI && ($.unblockUI(), $("body").append(this.dpDiv))), this._inDialog = !1
        }
    }, _tidyDialog: function (e) {
        e.dpDiv.removeClass(this._dialogClass).unbind(".ui-datepicker-calendar")
    }, _checkExternalClick: function (e) {
        if (!$.datepicker._curInst)return;
        var t = $(e.target), n = $.datepicker._getInst(t[0]);
        (t[0].id != $.datepicker._mainDivId && t.parents("#" + $.datepicker._mainDivId).length == 0 && !t.hasClass($.datepicker.markerClassName) && !t.closest("." + $.datepicker._triggerClass).length && $.datepicker._datepickerShowing && (!$.datepicker._inDialog || !$.blockUI) || t.hasClass($.datepicker.markerClassName) && $.datepicker._curInst != n) && $.datepicker._hideDatepicker()
    }, _adjustDate: function (e, t, n) {
        var r = $(e), i = this._getInst(r[0]);
        if (this._isDisabledDatepicker(r[0]))return;
        this._adjustInstDate(i, t + (n == "M" ? this._get(i, "showCurrentAtPos") : 0), n), this._updateDatepicker(i)
    }, _gotoToday: function (e) {
        var t = $(e), n = this._getInst(t[0]);
        if (this._get(n, "gotoCurrent") && n.currentDay)n.selectedDay = n.currentDay, n.drawMonth = n.selectedMonth = n.currentMonth, n.drawYear = n.selectedYear = n.currentYear; else {
            var r = new Date;
            n.selectedDay = r.getDate(), n.drawMonth = n.selectedMonth = r.getMonth(), n.drawYear = n.selectedYear = r.getFullYear()
        }
        this._notifyChange(n), this._adjustDate(t)
    }, _selectMonthYear: function (e, t, n) {
        var r = $(e), i = this._getInst(r[0]);
        i["selected" + (n == "M" ? "Month" : "Year")] = i["draw" + (n == "M" ? "Month" : "Year")] = parseInt(t.options[t.selectedIndex].value, 10), this._notifyChange(i), this._adjustDate(r)
    }, _selectDay: function (e, t, n, r) {
        var i = $(e);
        if ($(r).hasClass(this._unselectableClass) || this._isDisabledDatepicker(i[0]))return;
        var s = this._getInst(i[0]);
        s.selectedDay = s.currentDay = $("a", r).html(), s.selectedMonth = s.currentMonth = t, s.selectedYear = s.currentYear = n, this._selectDate(e, this._formatDate(s, s.currentDay, s.currentMonth, s.currentYear))
    }, _clearDate: function (e) {
        var t = $(e), n = this._getInst(t[0]);
        this._selectDate(t, "")
    }, _selectDate: function (e, t) {
        var n = $(e), r = this._getInst(n[0]);
        t = t != null ? t : this._formatDate(r), r.input && r.input.val(t), this._updateAlternate(r);
        var i = this._get(r, "onSelect");
        i ? i.apply(r.input ? r.input[0] : null, [t, r]) : r.input && r.input.trigger("change"), r.inline ? this._updateDatepicker(r) : (this._hideDatepicker(), this._lastInput = r.input[0], typeof r.input[0] != "object" && r.input.focus(), this._lastInput = null)
    }, _updateAlternate: function (e) {
        var t = this._get(e, "altField");
        if (t) {
            var n = this._get(e, "altFormat") || this._get(e, "dateFormat"), r = this._getDate(e), i = this.formatDate(n, r, this._getFormatConfig(e));
            $(t).each(function () {
                $(this).val(i)
            })
        }
    }, noWeekends: function (e) {
        var t = e.getDay();
        return[t > 0 && t < 6, ""]
    }, iso8601Week: function (e) {
        var t = new Date(e.getTime());
        t.setDate(t.getDate() + 4 - (t.getDay() || 7));
        var n = t.getTime();
        return t.setMonth(0), t.setDate(1), Math.floor(Math.round((n - t) / 864e5) / 7) + 1
    }, parseDate: function (e, t, n) {
        if (e == null || t == null)throw"Invalid arguments";
        t = typeof t == "object" ? t.toString() : t + "";
        if (t == "")return null;
        var r = (n ? n.shortYearCutoff : null) || this._defaults.shortYearCutoff;
        r = typeof r != "string" ? r : (new Date).getFullYear() % 100 + parseInt(r, 10);
        var i = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort, s = (n ? n.dayNames : null) || this._defaults.dayNames, o = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort, u = (n ? n.monthNames : null) || this._defaults.monthNames, a = -1, f = -1, l = -1, c = -1, h = !1, p = function (t) {
            var n = y + 1 < e.length && e.charAt(y + 1) == t;
            return n && y++, n
        }, d = function (e) {
            var n = p(e), r = e == "@" ? 14 : e == "!" ? 20 : e == "y" && n ? 4 : e == "o" ? 3 : 2, i = new RegExp("^\\d{1," + r + "}"), s = t.substring(g).match(i);
            if (!s)throw"Missing number at position " + g;
            return g += s[0].length, parseInt(s[0], 10)
        }, v = function (e, n, r) {
            var i = $.map(p(e) ? r : n,function (e, t) {
                return[
                    [t, e]
                ]
            }).sort(function (e, t) {
                return-(e[1].length - t[1].length)
            }), s = -1;
            $.each(i, function (e, n) {
                var r = n[1];
                if (t.substr(g, r.length).toLowerCase() == r.toLowerCase())return s = n[0], g += r.length, !1
            });
            if (s != -1)return s + 1;
            throw"Unknown name at position " + g
        }, m = function () {
            if (t.charAt(g) != e.charAt(y))throw"Unexpected literal at position " + g;
            g++
        }, g = 0;
        for (var y = 0; y < e.length; y++)if (h)e.charAt(y) == "'" && !p("'") ? h = !1 : m(); else switch (e.charAt(y)) {
            case"d":
                l = d("d");
                break;
            case"D":
                v("D", i, s);
                break;
            case"o":
                c = d("o");
                break;
            case"m":
                f = d("m");
                break;
            case"M":
                f = v("M", o, u);
                break;
            case"y":
                a = d("y");
                break;
            case"@":
                var b = new Date(d("@"));
                a = b.getFullYear(), f = b.getMonth() + 1, l = b.getDate();
                break;
            case"!":
                var b = new Date((d("!") - this._ticksTo1970) / 1e4);
                a = b.getFullYear(), f = b.getMonth() + 1, l = b.getDate();
                break;
            case"'":
                p("'") ? m() : h = !0;
                break;
            default:
                m()
        }
        if (g < t.length)throw"Extra/unparsed characters found in date: " + t.substring(g);
        a == -1 ? a = (new Date).getFullYear() : a < 100 && (a += (new Date).getFullYear() - (new Date).getFullYear() % 100 + (a <= r ? 0 : -100));
        if (c > -1) {
            f = 1, l = c;
            do {
                var w = this._getDaysInMonth(a, f - 1);
                if (l <= w)break;
                f++, l -= w
            } while (!0)
        }
        var b = this._daylightSavingAdjust(new Date(a, f - 1, l));
        if (b.getFullYear() != a || b.getMonth() + 1 != f || b.getDate() != l)throw"Invalid date";
        return b
    }, ATOM: "yy-mm-dd", COOKIE: "D, dd M yy", ISO_8601: "yy-mm-dd", RFC_822: "D, d M y", RFC_850: "DD, dd-M-y", RFC_1036: "D, d M y", RFC_1123: "D, d M yy", RFC_2822: "D, d M yy", RSS: "D, d M y", TICKS: "!", TIMESTAMP: "@", W3C: "yy-mm-dd", _ticksTo1970: (718685 + Math.floor(492.5) - Math.floor(19.7) + Math.floor(4.925)) * 24 * 60 * 60 * 1e7, formatDate: function (e, t, n) {
        if (!t)return"";
        var r = (n ? n.dayNamesShort : null) || this._defaults.dayNamesShort, i = (n ? n.dayNames : null) || this._defaults.dayNames, s = (n ? n.monthNamesShort : null) || this._defaults.monthNamesShort, o = (n ? n.monthNames : null) || this._defaults.monthNames, u = function (t) {
            var n = h + 1 < e.length && e.charAt(h + 1) == t;
            return n && h++, n
        }, a = function (e, t, n) {
            var r = "" + t;
            if (u(e))while (r.length < n)r = "0" + r;
            return r
        }, f = function (e, t, n, r) {
            return u(e) ? r[t] : n[t]
        }, l = "", c = !1;
        if (t)for (var h = 0; h < e.length; h++)if (c)e.charAt(h) == "'" && !u("'") ? c = !1 : l += e.charAt(h); else switch (e.charAt(h)) {
            case"d":
                l += a("d", t.getDate(), 2);
                break;
            case"D":
                l += f("D", t.getDay(), r, i);
                break;
            case"o":
                l += a("o", Math.round(((new Date(t.getFullYear(), t.getMonth(), t.getDate())).getTime() - (new Date(t.getFullYear(), 0, 0)).getTime()) / 864e5), 3);
                break;
            case"m":
                l += a("m", t.getMonth() + 1, 2);
                break;
            case"M":
                l += f("M", t.getMonth(), s, o);
                break;
            case"y":
                l += u("y") ? t.getFullYear() : (t.getYear() % 100 < 10 ? "0" : "") + t.getYear() % 100;
                break;
            case"@":
                l += t.getTime();
                break;
            case"!":
                l += t.getTime() * 1e4 + this._ticksTo1970;
                break;
            case"'":
                u("'") ? l += "'" : c = !0;
                break;
            default:
                l += e.charAt(h)
        }
        return l
    }, _possibleChars: function (e) {
        var t = "", n = !1, r = function (t) {
            var n = i + 1 < e.length && e.charAt(i + 1) == t;
            return n && i++, n
        };
        for (var i = 0; i < e.length; i++)if (n)e.charAt(i) == "'" && !r("'") ? n = !1 : t += e.charAt(i); else switch (e.charAt(i)) {
            case"d":
            case"m":
            case"y":
            case"@":
                t += "0123456789";
                break;
            case"D":
            case"M":
                return null;
            case"'":
                r("'") ? t += "'" : n = !0;
                break;
            default:
                t += e.charAt(i)
        }
        return t
    }, _get: function (e, t) {
        return e.settings[t] !== undefined ? e.settings[t] : this._defaults[t]
    }, _setDateFromField: function (e, t) {
        if (e.input.val() == e.lastVal)return;
        var n = this._get(e, "dateFormat"), r = e.lastVal = e.input ? e.input.val() : null, i, s;
        i = s = this._getDefaultDate(e);
        var o = this._getFormatConfig(e);
        try {
            i = this.parseDate(n, r, o) || s
        } catch (u) {
            this.log(u), r = t ? "" : r
        }
        e.selectedDay = i.getDate(), e.drawMonth = e.selectedMonth = i.getMonth(), e.drawYear = e.selectedYear = i.getFullYear(), e.currentDay = r ? i.getDate() : 0, e.currentMonth = r ? i.getMonth() : 0, e.currentYear = r ? i.getFullYear() : 0, this._adjustInstDate(e)
    }, _getDefaultDate: function (e) {
        return this._restrictMinMax(e, this._determineDate(e, this._get(e, "defaultDate"), new Date))
    }, _determineDate: function (e, t, n) {
        var r = function (e) {
            var t = new Date;
            return t.setDate(t.getDate() + e), t
        }, i = function (t) {
            try {
                return $.datepicker.parseDate($.datepicker._get(e, "dateFormat"), t, $.datepicker._getFormatConfig(e))
            } catch (n) {
            }
            var r = (t.toLowerCase().match(/^c/) ? $.datepicker._getDate(e) : null) || new Date, i = r.getFullYear(), s = r.getMonth(), o = r.getDate(), u = /([+-]?[0-9]+)\s*(d|D|w|W|m|M|y|Y)?/g, f = u.exec(t);
            while (f) {
                switch (f[2] || "d") {
                    case"d":
                    case"D":
                        o += parseInt(f[1], 10);
                        break;
                    case"w":
                    case"W":
                        o += parseInt(f[1], 10) * 7;
                        break;
                    case"m":
                    case"M":
                        s += parseInt(f[1], 10), o = Math.min(o, $.datepicker._getDaysInMonth(i, s));
                        break;
                    case"y":
                    case"Y":
                        i += parseInt(f[1], 10), o = Math.min(o, $.datepicker._getDaysInMonth(i, s))
                }
                f = u.exec(t)
            }
            return new Date(i, s, o)
        }, s = t == null || t === "" ? n : typeof t == "string" ? i(t) : typeof t == "number" ? isNaN(t) ? n : r(t) : new Date(t.getTime());
        return s = s && s.toString() == "Invalid Date" ? n : s, s && (s.setHours(0), s.setMinutes(0), s.setSeconds(0), s.setMilliseconds(0)), this._daylightSavingAdjust(s)
    }, _daylightSavingAdjust: function (e) {
        return e ? (e.setHours(e.getHours() > 12 ? e.getHours() + 2 : 0), e) : null
    }, _setDate: function (e, t, n) {
        var r = !t, i = e.selectedMonth, s = e.selectedYear, o = this._restrictMinMax(e, this._determineDate(e, t, new Date));
        e.selectedDay = e.currentDay = o.getDate(), e.drawMonth = e.selectedMonth = e.currentMonth = o.getMonth(), e.drawYear = e.selectedYear = e.currentYear = o.getFullYear(), (i != e.selectedMonth || s != e.selectedYear) && !n && this._notifyChange(e), this._adjustInstDate(e), e.input && e.input.val(r ? "" : this._formatDate(e))
    }, _getDate: function (e) {
        var t = !e.currentYear || e.input && e.input.val() == "" ? null : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
        return t
    }, _attachHandlers: function (e) {
        var t = this._get(e, "stepMonths"), n = "#" + e.id.replace(/\\\\/g, "\\");
        e.dpDiv.find("[data-handler]").map(function () {
            var e = {prev: function () {
                window["DP_jQuery_" + dpuuid].datepicker._adjustDate(n, -t, "M")
            }, next: function () {
                window["DP_jQuery_" + dpuuid].datepicker._adjustDate(n, +t, "M")
            }, hide: function () {
                window["DP_jQuery_" + dpuuid].datepicker._hideDatepicker()
            }, today: function () {
                window["DP_jQuery_" + dpuuid].datepicker._gotoToday(n)
            }, selectDay: function () {
                return window["DP_jQuery_" + dpuuid].datepicker._selectDay(n, +this.getAttribute("data-month"), +this.getAttribute("data-year"), this), !1
            }, selectMonth: function () {
                return window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(n, this, "M"), !1
            }, selectYear: function () {
                return window["DP_jQuery_" + dpuuid].datepicker._selectMonthYear(n, this, "Y"), !1
            }};
            $(this).bind(this.getAttribute("data-event"), e[this.getAttribute("data-handler")])
        })
    }, _generateHTML: function (e) {
        var t = new Date;
        t = this._daylightSavingAdjust(new Date(t.getFullYear(), t.getMonth(), t.getDate()));
        var n = this._get(e, "isRTL"), r = this._get(e, "showButtonPanel"), i = this._get(e, "hideIfNoPrevNext"), s = this._get(e, "navigationAsDateFormat"), o = this._getNumberOfMonths(e), u = this._get(e, "showCurrentAtPos"), a = this._get(e, "stepMonths"), f = o[0] != 1 || o[1] != 1, l = this._daylightSavingAdjust(e.currentDay ? new Date(e.currentYear, e.currentMonth, e.currentDay) : new Date(9999, 9, 9)), c = this._getMinMaxDate(e, "min"), h = this._getMinMaxDate(e, "max"), p = e.drawMonth - u, d = e.drawYear;
        p < 0 && (p += 12, d--);
        if (h) {
            var v = this._daylightSavingAdjust(new Date(h.getFullYear(), h.getMonth() - o[0] * o[1] + 1, h.getDate()));
            v = c && v < c ? c : v;
            while (this._daylightSavingAdjust(new Date(d, p, 1)) > v)p--, p < 0 && (p = 11, d--)
        }
        e.drawMonth = p, e.drawYear = d;
        var m = this._get(e, "prevText");
        m = s ? this.formatDate(m, this._daylightSavingAdjust(new Date(d, p - a, 1)), this._getFormatConfig(e)) : m;
        var g = this._canAdjustMonth(e, -1, d, p) ? '<a class="ui-datepicker-prev ui-corner-all" data-handler="prev" data-event="click" title="' + m + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "e" : "w") + '">' + m + "</span></a>" : i ? "" : '<a class="ui-datepicker-prev ui-corner-all ui-state-disabled" title="' + m + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "e" : "w") + '">' + m + "</span></a>", y = this._get(e, "nextText");
        y = s ? this.formatDate(y, this._daylightSavingAdjust(new Date(d, p + a, 1)), this._getFormatConfig(e)) : y;
        var b = this._canAdjustMonth(e, 1, d, p) ? '<a class="ui-datepicker-next ui-corner-all" data-handler="next" data-event="click" title="' + y + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "w" : "e") + '">' + y + "</span></a>" : i ? "" : '<a class="ui-datepicker-next ui-corner-all ui-state-disabled" title="' + y + '"><span class="ui-icon ui-icon-circle-triangle-' + (n ? "w" : "e") + '">' + y + "</span></a>", w = this._get(e, "currentText"), E = this._get(e, "gotoCurrent") && e.currentDay ? l : t;
        w = s ? this.formatDate(w, E, this._getFormatConfig(e)) : w;
        var S = e.inline ? "" : '<button type="button" class="ui-datepicker-close ui-state-default ui-priority-primary ui-corner-all" data-handler="hide" data-event="click">' + this._get(e, "closeText") + "</button>", x = r ? '<div class="ui-datepicker-buttonpane ui-widget-content">' + (n ? S : "") + (this._isInRange(e, E) ? '<button type="button" class="ui-datepicker-current ui-state-default ui-priority-secondary ui-corner-all" data-handler="today" data-event="click">' + w + "</button>" : "") + (n ? "" : S) + "</div>" : "", T = parseInt(this._get(e, "firstDay"), 10);
        T = isNaN(T) ? 0 : T;
        var N = this._get(e, "showWeek"), C = this._get(e, "dayNames"), k = this._get(e, "dayNamesShort"), L = this._get(e, "dayNamesMin"), A = this._get(e, "monthNames"), O = this._get(e, "monthNamesShort"), M = this._get(e, "beforeShowDay"), _ = this._get(e, "showOtherMonths"), D = this._get(e, "selectOtherMonths"), P = this._get(e, "calculateWeek") || this.iso8601Week, H = this._getDefaultDate(e), B = "";
        for (var j = 0; j < o[0]; j++) {
            var F = "";
            this.maxRows = 4;
            for (var I = 0; I < o[1]; I++) {
                var q = this._daylightSavingAdjust(new Date(d, p, e.selectedDay)), R = " ui-corner-all", U = "";
                if (f) {
                    U += '<div class="ui-datepicker-group';
                    if (o[1] > 1)switch (I) {
                        case 0:
                            U += " ui-datepicker-group-first", R = " ui-corner-" + (n ? "right" : "left");
                            break;
                        case o[1] - 1:
                            U += " ui-datepicker-group-last", R = " ui-corner-" + (n ? "left" : "right");
                            break;
                        default:
                            U += " ui-datepicker-group-middle", R = ""
                    }
                    U += '">'
                }
                U += '<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix' + R + '">' + (/all|left/.test(R) && j == 0 ? n ? b : g : "") + (/all|right/.test(R) && j == 0 ? n ? g : b : "") + this._generateMonthYearHeader(e, p, d, c, h, j > 0 || I > 0, A, O) + '</div><table class="ui-datepicker-calendar"><thead>' + "<tr>";
                var z = N ? '<th class="ui-datepicker-week-col">' + this._get(e, "weekHeader") + "</th>" : "";
                for (var W = 0; W < 7; W++) {
                    var X = (W + T) % 7;
                    z += "<th" + ((W + T + 6) % 7 >= 5 ? ' class="ui-datepicker-week-end"' : "") + ">" + '<span title="' + C[X] + '">' + L[X] + "</span></th>"
                }
                U += z + "</tr></thead><tbody>";
                var V = this._getDaysInMonth(d, p);
                d == e.selectedYear && p == e.selectedMonth && (e.selectedDay = Math.min(e.selectedDay, V));
                var J = (this._getFirstDayOfMonth(d, p) - T + 7) % 7, K = Math.ceil((J + V) / 7), Q = f ? this.maxRows > K ? this.maxRows : K : K;
                this.maxRows = Q;
                var G = this._daylightSavingAdjust(new Date(d, p, 1 - J));
                for (var Y = 0; Y < Q; Y++) {
                    U += "<tr>";
                    var Z = N ? '<td class="ui-datepicker-week-col">' + this._get(e, "calculateWeek")(G) + "</td>" : "";
                    for (var W = 0; W < 7; W++) {
                        var et = M ? M.apply(e.input ? e.input[0] : null, [G]) : [!0, ""], tt = G.getMonth() != p, nt = tt && !D || !et[0] || c && G < c || h && G > h;
                        Z += '<td class="' + ((W + T + 6) % 7 >= 5 ? " ui-datepicker-week-end" : "") + (tt ? " ui-datepicker-other-month" : "") + (G.getTime() == q.getTime() && p == e.selectedMonth && e._keyEvent || H.getTime() == G.getTime() && H.getTime() == q.getTime() ? " " + this._dayOverClass : "") + (nt ? " " + this._unselectableClass + " ui-state-disabled" : "") + (tt && !_ ? "" : " " + et[1] + (G.getTime() == l.getTime() ? " " + this._currentClass : "") + (G.getTime() == t.getTime() ? " ui-datepicker-today" : "")) + '"' + ((!tt || _) && et[2] ? ' title="' + et[2] + '"' : "") + (nt ? "" : ' data-handler="selectDay" data-event="click" data-month="' + G.getMonth() + '" data-year="' + G.getFullYear() + '"') + ">" + (tt && !_ ? "&#xa0;" : nt ? '<span class="ui-state-default">' + G.getDate() + "</span>" : '<a class="ui-state-default' + (G.getTime() == t.getTime() ? " ui-state-highlight" : "") + (G.getTime() == l.getTime() ? " ui-state-active" : "") + (tt ? " ui-priority-secondary" : "") + '" href="#">' + G.getDate() + "</a>") + "</td>", G.setDate(G.getDate() + 1), G = this._daylightSavingAdjust(G)
                    }
                    U += Z + "</tr>"
                }
                p++, p > 11 && (p = 0, d++), U += "</tbody></table>" + (f ? "</div>" + (o[0] > 0 && I == o[1] - 1 ? '<div class="ui-datepicker-row-break"></div>' : "") : ""), F += U
            }
            B += F
        }
        return B += x + ($.browser.msie && parseInt($.browser.version, 10) < 7 && !e.inline ? '<iframe src="javascript:false;" class="ui-datepicker-cover" frameborder="0"></iframe>' : ""), e._keyEvent = !1, B
    }, _generateMonthYearHeader: function (e, t, n, r, i, s, o, u) {
        var a = this._get(e, "changeMonth"), f = this._get(e, "changeYear"), l = this._get(e, "showMonthAfterYear"), c = '<div class="ui-datepicker-title">', h = "";
        if (s || !a)h += '<span class="ui-datepicker-month">' + o[t] + "</span>"; else {
            var p = r && r.getFullYear() == n, d = i && i.getFullYear() == n;
            h += '<select class="ui-datepicker-month" data-handler="selectMonth" data-event="change">';
            for (var v = 0; v < 12; v++)(!p || v >= r.getMonth()) && (!d || v <= i.getMonth()) && (h += '<option value="' + v + '"' + (v == t ? ' selected="selected"' : "") + ">" + u[v] + "</option>");
            h += "</select>"
        }
        l || (c += h + (s || !a || !f ? "&#xa0;" : ""));
        if (!e.yearshtml) {
            e.yearshtml = "";
            if (s || !f)c += '<span class="ui-datepicker-year">' + n + "</span>"; else {
                var m = this._get(e, "yearRange").split(":"), g = (new Date).getFullYear(), y = function (e) {
                    var t = e.match(/c[+-].*/) ? n + parseInt(e.substring(1), 10) : e.match(/[+-].*/) ? g + parseInt(e, 10) : parseInt(e, 10);
                    return isNaN(t) ? g : t
                }, b = y(m[0]), w = Math.max(b, y(m[1] || ""));
                b = r ? Math.max(b, r.getFullYear()) : b, w = i ? Math.min(w, i.getFullYear()) : w, e.yearshtml += '<select class="ui-datepicker-year" data-handler="selectYear" data-event="change">';
                for (; b <= w; b++)e.yearshtml += '<option value="' + b + '"' + (b == n ? ' selected="selected"' : "") + ">" + b + "</option>";
                e.yearshtml += "</select>", c += e.yearshtml, e.yearshtml = null
            }
        }
        return c += this._get(e, "yearSuffix"), l && (c += (s || !a || !f ? "&#xa0;" : "") + h), c += "</div>", c
    }, _adjustInstDate: function (e, t, n) {
        var r = e.drawYear + (n == "Y" ? t : 0), i = e.drawMonth + (n == "M" ? t : 0), s = Math.min(e.selectedDay, this._getDaysInMonth(r, i)) + (n == "D" ? t : 0), o = this._restrictMinMax(e, this._daylightSavingAdjust(new Date(r, i, s)));
        e.selectedDay = o.getDate(), e.drawMonth = e.selectedMonth = o.getMonth(), e.drawYear = e.selectedYear = o.getFullYear(), (n == "M" || n == "Y") && this._notifyChange(e)
    }, _restrictMinMax: function (e, t) {
        var n = this._getMinMaxDate(e, "min"), r = this._getMinMaxDate(e, "max"), i = n && t < n ? n : t;
        return i = r && i > r ? r : i, i
    }, _notifyChange: function (e) {
        var t = this._get(e, "onChangeMonthYear");
        t && t.apply(e.input ? e.input[0] : null, [e.selectedYear, e.selectedMonth + 1, e])
    }, _getNumberOfMonths: function (e) {
        var t = this._get(e, "numberOfMonths");
        return t == null ? [1, 1] : typeof t == "number" ? [1, t] : t
    }, _getMinMaxDate: function (e, t) {
        return this._determineDate(e, this._get(e, t + "Date"), null)
    }, _getDaysInMonth: function (e, t) {
        return 32 - this._daylightSavingAdjust(new Date(e, t, 32)).getDate()
    }, _getFirstDayOfMonth: function (e, t) {
        return(new Date(e, t, 1)).getDay()
    }, _canAdjustMonth: function (e, t, n, r) {
        var i = this._getNumberOfMonths(e), s = this._daylightSavingAdjust(new Date(n, r + (t < 0 ? t : i[0] * i[1]), 1));
        return t < 0 && s.setDate(this._getDaysInMonth(s.getFullYear(), s.getMonth())), this._isInRange(e, s)
    }, _isInRange: function (e, t) {
        var n = this._getMinMaxDate(e, "min"), r = this._getMinMaxDate(e, "max");
        return(!n || t.getTime() >= n.getTime()) && (!r || t.getTime() <= r.getTime())
    }, _getFormatConfig: function (e) {
        var t = this._get(e, "shortYearCutoff");
        return t = typeof t != "string" ? t : (new Date).getFullYear() % 100 + parseInt(t, 10), {shortYearCutoff: t, dayNamesShort: this._get(e, "dayNamesShort"), dayNames: this._get(e, "dayNames"), monthNamesShort: this._get(e, "monthNamesShort"), monthNames: this._get(e, "monthNames")}
    }, _formatDate: function (e, t, n, r) {
        t || (e.currentDay = e.selectedDay, e.currentMonth = e.selectedMonth, e.currentYear = e.selectedYear);
        var i = t ? typeof t == "object" ? t : this._daylightSavingAdjust(new Date(r, n, t)) : this._daylightSavingAdjust(new Date(e.currentYear, e.currentMonth, e.currentDay));
        return this.formatDate(this._get(e, "dateFormat"), i, this._getFormatConfig(e))
    }}), $.fn.datepicker = function (e) {
        if (!this.length)return this;
        $.datepicker.initialized || ($(document).mousedown($.datepicker._checkExternalClick).find("body").append($.datepicker.dpDiv), $.datepicker.initialized = !0);
        var t = Array.prototype.slice.call(arguments, 1);
        return typeof e != "string" || e != "isDisabled" && e != "getDate" && e != "widget" ? e == "option" && arguments.length == 2 && typeof arguments[1] == "string" ? $.datepicker["_" + e + "Datepicker"].apply($.datepicker, [this[0]].concat(t)) : this.each(function () {
            typeof e == "string" ? $.datepicker["_" + e + "Datepicker"].apply($.datepicker, [this].concat(t)) : $.datepicker._attachDatepicker(this, e)
        }) : $.datepicker["_" + e + "Datepicker"].apply($.datepicker, [this[0]].concat(t))
    }, $.datepicker = new Datepicker, $.datepicker.initialized = !1, $.datepicker.uuid = (new Date).getTime(), $.datepicker.version = "1.8.24", window["DP_jQuery_" + dpuuid] = $
}(jQuery), function (e, t) {
    e.widget("ui.progressbar", {options: {value: 0, max: 100}, min: 0, _create: function () {
        this.element.addClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").attr({role: "progressbar", "aria-valuemin": this.min, "aria-valuemax": this.options.max, "aria-valuenow": this._value()}), this.valueDiv = e("<div class='ui-progressbar-value ui-widget-header ui-corner-left'></div>").appendTo(this.element), this.oldValue = this._value(), this._refreshValue()
    }, destroy: function () {
        this.element.removeClass("ui-progressbar ui-widget ui-widget-content ui-corner-all").removeAttr("role").removeAttr("aria-valuemin").removeAttr("aria-valuemax").removeAttr("aria-valuenow"), this.valueDiv.remove(), e.Widget.prototype.destroy.apply(this, arguments)
    }, value: function (e) {
        return e === t ? this._value() : (this._setOption("value", e), this)
    }, _setOption: function (t, n) {
        t === "value" && (this.options.value = n, this._refreshValue(), this._value() === this.options.max && this._trigger("complete")), e.Widget.prototype._setOption.apply(this, arguments)
    }, _value: function () {
        var e = this.options.value;
        return typeof e != "number" && (e = 0), Math.min(this.options.max, Math.max(this.min, e))
    }, _percentage: function () {
        return 100 * this._value() / this.options.max
    }, _refreshValue: function () {
        var e = this.value(), t = this._percentage();
        this.oldValue !== e && (this.oldValue = e, this._trigger("change")), this.valueDiv.toggle(e > this.min).toggleClass("ui-corner-right", e === this.options.max).width(t.toFixed(0) + "%"), this.element.attr("aria-valuenow", e)
    }}), e.extend(e.ui.progressbar, {version: "1.8.24"})
}(jQuery), jQuery.effects || function (e, t) {
    function n(t) {
        var n;
        return t && t.constructor == Array && t.length == 3 ? t : (n = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(t)) ? [parseInt(n[1], 10), parseInt(n[2], 10), parseInt(n[3], 10)] : (n = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(t)) ? [parseFloat(n[1]) * 2.55, parseFloat(n[2]) * 2.55, parseFloat(n[3]) * 2.55] : (n = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(t)) ? [parseInt(n[1], 16), parseInt(n[2], 16), parseInt(n[3], 16)] : (n = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(t)) ? [parseInt(n[1] + n[1], 16), parseInt(n[2] + n[2], 16), parseInt(n[3] + n[3], 16)] : (n = /rgba\(0, 0, 0, 0\)/.exec(t)) ? f.transparent : f[e.trim(t).toLowerCase()]
    }

    function r(t, r) {
        var i;
        do {
            i = (e.curCSS || e.css)(t, r);
            if (i != "" && i != "transparent" || e.nodeName(t, "body"))break;
            r = "backgroundColor"
        } while (t = t.parentNode);
        return n(i)
    }

    function i() {
        var e = document.defaultView ? document.defaultView.getComputedStyle(this, null) : this.currentStyle, t = {}, n, r;
        if (e && e.length && e[0] && e[e[0]]) {
            var i = e.length;
            while (i--)n = e[i], typeof e[n] == "string" && (r = n.replace(/\-(\w)/g, function (e, t) {
                return t.toUpperCase()
            }), t[r] = e[n])
        } else for (n in e)typeof e[n] == "string" && (t[n] = e[n]);
        return t
    }

    function s(t) {
        var n, r;
        for (n in t)r = t[n], (r == null || e.isFunction(r) || n in c || /scrollbar/.test(n) || !/color/i.test(n) && isNaN(parseFloat(r))) && delete t[n];
        return t
    }

    function o(e, t) {
        var n = {_: 0}, r;
        for (r in t)e[r] != t[r] && (n[r] = t[r]);
        return n
    }

    function u(t, n, r, i) {
        typeof t == "object" && (i = n, r = null, n = t, t = n.effect), e.isFunction(n) && (i = n, r = null, n = {});
        if (typeof n == "number" || e.fx.speeds[n])i = r, r = n, n = {};
        return e.isFunction(r) && (i = r, r = null), n = n || {}, r = r || n.duration, r = e.fx.off ? 0 : typeof r == "number" ? r : r in e.fx.speeds ? e.fx.speeds[r] : e.fx.speeds._default, i = i || n.complete, [t, n, r, i]
    }

    function a(t) {
        return!t || typeof t == "number" || e.fx.speeds[t] ? !0 : typeof t == "string" && !e.effects[t] ? !0 : !1
    }

    e.effects = {}, e.each(["backgroundColor", "borderBottomColor", "borderLeftColor", "borderRightColor", "borderTopColor", "borderColor", "color", "outlineColor"], function (t, i) {
        e.fx.step[i] = function (e) {
            e.colorInit || (e.start = r(e.elem, i), e.end = n(e.end), e.colorInit = !0), e.elem.style[i] = "rgb(" + Math.max(Math.min(parseInt(e.pos * (e.end[0] - e.start[0]) + e.start[0], 10), 255), 0) + "," + Math.max(Math.min(parseInt(e.pos * (e.end[1] - e.start[1]) + e.start[1], 10), 255), 0) + "," + Math.max(Math.min(parseInt(e.pos * (e.end[2] - e.start[2]) + e.start[2], 10), 255), 0) + ")"
        }
    });
    var f = {aqua: [0, 255, 255], azure: [240, 255, 255], beige: [245, 245, 220], black: [0, 0, 0], blue: [0, 0, 255], brown: [165, 42, 42], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgrey: [169, 169, 169], darkgreen: [0, 100, 0], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkviolet: [148, 0, 211], fuchsia: [255, 0, 255], gold: [255, 215, 0], green: [0, 128, 0], indigo: [75, 0, 130], khaki: [240, 230, 140], lightblue: [173, 216, 230], lightcyan: [224, 255, 255], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightyellow: [255, 255, 224], lime: [0, 255, 0], magenta: [255, 0, 255], maroon: [128, 0, 0], navy: [0, 0, 128], olive: [128, 128, 0], orange: [255, 165, 0], pink: [255, 192, 203], purple: [128, 0, 128], violet: [128, 0, 128], red: [255, 0, 0], silver: [192, 192, 192], white: [255, 255, 255], yellow: [255, 255, 0], transparent: [255, 255, 255]}, l = ["add", "remove", "toggle"], c = {border: 1, borderBottom: 1, borderColor: 1, borderLeft: 1, borderRight: 1, borderTop: 1, borderWidth: 1, margin: 1, padding: 1};
    e.effects.animateClass = function (t, n, r, u) {
        return e.isFunction(r) && (u = r, r = null), this.queue(function () {
            var a = e(this), f = a.attr("style") || " ", c = s(i.call(this)), h, p = a.attr("class") || "";
            e.each(l, function (e, n) {
                t[n] && a[n + "Class"](t[n])
            }), h = s(i.call(this)), a.attr("class", p), a.animate(o(c, h), {queue: !1, duration: n, easing: r, complete: function () {
                e.each(l, function (e, n) {
                    t[n] && a[n + "Class"](t[n])
                }), typeof a.attr("style") == "object" ? (a.attr("style").cssText = "", a.attr("style").cssText = f) : a.attr("style", f), u && u.apply(this, arguments), e.dequeue(this)
            }})
        })
    }, e.fn.extend({_addClass: e.fn.addClass, addClass: function (t, n, r, i) {
        return n ? e.effects.animateClass.apply(this, [
            {add: t},
            n,
            r,
            i
        ]) : this._addClass(t)
    }, _removeClass: e.fn.removeClass, removeClass: function (t, n, r, i) {
        return n ? e.effects.animateClass.apply(this, [
            {remove: t},
            n,
            r,
            i
        ]) : this._removeClass(t)
    }, _toggleClass: e.fn.toggleClass, toggleClass: function (n, r, i, s, o) {
        return typeof r == "boolean" || r === t ? i ? e.effects.animateClass.apply(this, [r ? {add: n} : {remove: n}, i, s, o]) : this._toggleClass(n, r) : e.effects.animateClass.apply(this, [
            {toggle: n},
            r,
            i,
            s
        ])
    }, switchClass: function (t, n, r, i, s) {
        return e.effects.animateClass.apply(this, [
            {add: n, remove: t},
            r,
            i,
            s
        ])
    }}), e.extend(e.effects, {version: "1.8.24", save: function (e, t) {
        for (var n = 0; n < t.length; n++)t[n] !== null && e.data("ec.storage." + t[n], e[0].style[t[n]])
    }, restore: function (e, t) {
        for (var n = 0; n < t.length; n++)t[n] !== null && e.css(t[n], e.data("ec.storage." + t[n]))
    }, setMode: function (e, t) {
        return t == "toggle" && (t = e.is(":hidden") ? "show" : "hide"), t
    }, getBaseline: function (e, t) {
        var n, r;
        switch (e[0]) {
            case"top":
                n = 0;
                break;
            case"middle":
                n = .5;
                break;
            case"bottom":
                n = 1;
                break;
            default:
                n = e[0] / t.height
        }
        switch (e[1]) {
            case"left":
                r = 0;
                break;
            case"center":
                r = .5;
                break;
            case"right":
                r = 1;
                break;
            default:
                r = e[1] / t.width
        }
        return{x: r, y: n}
    }, createWrapper: function (t) {
        if (t.parent().is(".ui-effects-wrapper"))return t.parent();
        var n = {width: t.outerWidth(!0), height: t.outerHeight(!0), "float": t.css("float")}, r = e("<div></div>").addClass("ui-effects-wrapper").css({fontSize: "100%", background: "transparent", border: "none", margin: 0, padding: 0}), i = document.activeElement;
        try {
            i.id
        } catch (s) {
            i = document.body
        }
        return t.wrap(r), (t[0] === i || e.contains(t[0], i)) && e(i).focus(), r = t.parent(), t.css("position") == "static" ? (r.css({position: "relative"}), t.css({position: "relative"})) : (e.extend(n, {position: t.css("position"), zIndex: t.css("z-index")}), e.each(["top", "left", "bottom", "right"], function (e, r) {
            n[r] = t.css(r), isNaN(parseInt(n[r], 10)) && (n[r] = "auto")
        }), t.css({position: "relative", top: 0, left: 0, right: "auto", bottom: "auto"})), r.css(n).show()
    }, removeWrapper: function (t) {
        var n, r = document.activeElement;
        return t.parent().is(".ui-effects-wrapper") ? (n = t.parent().replaceWith(t), (t[0] === r || e.contains(t[0], r)) && e(r).focus(), n) : t
    }, setTransition: function (t, n, r, i) {
        return i = i || {}, e.each(n, function (e, n) {
            var s = t.cssUnit(n);
            s[0] > 0 && (i[n] = s[0] * r + s[1])
        }), i
    }}), e.fn.extend({effect: function (t, n, r, i) {
        var s = u.apply(this, arguments), o = {options: s[1], duration: s[2], callback: s[3]}, a = o.options.mode, f = e.effects[t];
        return e.fx.off || !f ? a ? this[a](o.duration, o.callback) : this.each(function () {
            o.callback && o.callback.call(this)
        }) : f.call(this, o)
    }, _show: e.fn.show, show: function (e) {
        if (a(e))return this._show.apply(this, arguments);
        var t = u.apply(this, arguments);
        return t[1].mode = "show", this.effect.apply(this, t)
    }, _hide: e.fn.hide, hide: function (e) {
        if (a(e))return this._hide.apply(this, arguments);
        var t = u.apply(this, arguments);
        return t[1].mode = "hide", this.effect.apply(this, t)
    }, __toggle: e.fn.toggle, toggle: function (t) {
        if (a(t) || typeof t == "boolean" || e.isFunction(t))return this.__toggle.apply(this, arguments);
        var n = u.apply(this, arguments);
        return n[1].mode = "toggle", this.effect.apply(this, n)
    }, cssUnit: function (t) {
        var n = this.css(t), r = [];
        return e.each(["em", "px", "%", "pt"], function (e, t) {
            n.indexOf(t) > 0 && (r = [parseFloat(n), t])
        }), r
    }});
    var h = {};
    e.each(["Quad", "Cubic", "Quart", "Quint", "Expo"], function (e, t) {
        h[t] = function (t) {
            return Math.pow(t, e + 2)
        }
    }), e.extend(h, {Sine: function (e) {
        return 1 - Math.cos(e * Math.PI / 2)
    }, Circ: function (e) {
        return 1 - Math.sqrt(1 - e * e)
    }, Elastic: function (e) {
        return e === 0 || e === 1 ? e : -Math.pow(2, 8 * (e - 1)) * Math.sin(((e - 1) * 80 - 7.5) * Math.PI / 15)
    }, Back: function (e) {
        return e * e * (3 * e - 2)
    }, Bounce: function (e) {
        var t, n = 4;
        while (e < ((t = Math.pow(2, --n)) - 1) / 11);
        return 1 / Math.pow(4, 3 - n) - 7.5625 * Math.pow((t * 3 - 2) / 22 - e, 2)
    }}), e.each(h, function (t, n) {
        e.easing["easeIn" + t] = n, e.easing["easeOut" + t] = function (e) {
            return 1 - n(1 - e)
        }, e.easing["easeInOut" + t] = function (e) {
            return e < .5 ? n(e * 2) / 2 : n(e * -2 + 2) / -2 + 1
        }
    })
}(jQuery), function (e, t) {
    e.effects.blind = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right"], i = e.effects.setMode(n, t.options.mode || "hide"), s = t.options.direction || "vertical";
            e.effects.save(n, r), n.show();
            var o = e.effects.createWrapper(n).css({overflow: "hidden"}), u = s == "vertical" ? "height" : "width", f = s == "vertical" ? o.height() : o.width();
            i == "show" && o.css(u, 0);
            var l = {};
            l[u] = i == "show" ? f : 0, o.animate(l, t.duration, t.options.easing, function () {
                i == "hide" && n.hide(), e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(n[0], arguments), n.dequeue()
            })
        })
    }
}(jQuery), function (e, t) {
    e.effects.bounce = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right"], i = e.effects.setMode(n, t.options.mode || "effect"), s = t.options.direction || "up", o = t.options.distance || 20, u = t.options.times || 5, f = t.duration || 250;
            /show|hide/.test(i) && r.push("opacity"), e.effects.save(n, r), n.show(), e.effects.createWrapper(n);
            var l = s == "up" || s == "down" ? "top" : "left", c = s == "up" || s == "left" ? "pos" : "neg", o = t.options.distance || (l == "top" ? n.outerHeight(!0) / 3 : n.outerWidth(!0) / 3);
            i == "show" && n.css("opacity", 0).css(l, c == "pos" ? -o : o), i == "hide" && (o /= u * 2), i != "hide" && u--;
            if (i == "show") {
                var h = {opacity: 1};
                h[l] = (c == "pos" ? "+=" : "-=") + o, n.animate(h, f / 2, t.options.easing), o /= 2, u--
            }
            for (var p = 0; p < u; p++) {
                var d = {}, v = {};
                d[l] = (c == "pos" ? "-=" : "+=") + o, v[l] = (c == "pos" ? "+=" : "-=") + o, n.animate(d, f / 2, t.options.easing).animate(v, f / 2, t.options.easing), o = i == "hide" ? o * 2 : o / 2
            }
            if (i == "hide") {
                var h = {opacity: 0};
                h[l] = (c == "pos" ? "-=" : "+=") + o, n.animate(h, f / 2, t.options.easing, function () {
                    n.hide(), e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(this, arguments)
                })
            } else {
                var d = {}, v = {};
                d[l] = (c == "pos" ? "-=" : "+=") + o, v[l] = (c == "pos" ? "+=" : "-=") + o, n.animate(d, f / 2, t.options.easing).animate(v, f / 2, t.options.easing, function () {
                    e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(this, arguments)
                })
            }
            n.queue("fx", function () {
                n.dequeue()
            }), n.dequeue()
        })
    }
}(jQuery), function (e, t) {
    e.effects.clip = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right", "height", "width"], i = e.effects.setMode(n, t.options.mode || "hide"), s = t.options.direction || "vertical";
            e.effects.save(n, r), n.show();
            var o = e.effects.createWrapper(n).css({overflow: "hidden"}), u = n[0].tagName == "IMG" ? o : n, f = {size: s == "vertical" ? "height" : "width", position: s == "vertical" ? "top" : "left"}, l = s == "vertical" ? u.height() : u.width();
            i == "show" && (u.css(f.size, 0), u.css(f.position, l / 2));
            var c = {};
            c[f.size] = i == "show" ? l : 0, c[f.position] = i == "show" ? 0 : l / 2, u.animate(c, {queue: !1, duration: t.duration, easing: t.options.easing, complete: function () {
                i == "hide" && n.hide(), e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(n[0], arguments), n.dequeue()
            }})
        })
    }
}(jQuery), function (e, t) {
    e.effects.drop = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right", "opacity"], i = e.effects.setMode(n, t.options.mode || "hide"), s = t.options.direction || "left";
            e.effects.save(n, r), n.show(), e.effects.createWrapper(n);
            var o = s == "up" || s == "down" ? "top" : "left", u = s == "up" || s == "left" ? "pos" : "neg", f = t.options.distance || (o == "top" ? n.outerHeight(!0) / 2 : n.outerWidth(!0) / 2);
            i == "show" && n.css("opacity", 0).css(o, u == "pos" ? -f : f);
            var l = {opacity: i == "show" ? 1 : 0};
            l[o] = (i == "show" ? u == "pos" ? "+=" : "-=" : u == "pos" ? "-=" : "+=") + f, n.animate(l, {queue: !1, duration: t.duration, easing: t.options.easing, complete: function () {
                i == "hide" && n.hide(), e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(this, arguments), n.dequeue()
            }})
        })
    }
}(jQuery), function (e, t) {
    e.effects.explode = function (t) {
        return this.queue(function () {
            var n = t.options.pieces ? Math.round(Math.sqrt(t.options.pieces)) : 3, r = t.options.pieces ? Math.round(Math.sqrt(t.options.pieces)) : 3;
            t.options.mode = t.options.mode == "toggle" ? e(this).is(":visible") ? "hide" : "show" : t.options.mode;
            var i = e(this).show().css("visibility", "hidden"), s = i.offset();
            s.top -= parseInt(i.css("marginTop"), 10) || 0, s.left -= parseInt(i.css("marginLeft"), 10) || 0;
            var o = i.outerWidth(!0), u = i.outerHeight(!0);
            for (var f = 0; f < n; f++)for (var l = 0; l < r; l++)i.clone().appendTo("body").wrap("<div></div>").css({position: "absolute", visibility: "visible", left: -l * (o / r), top: -f * (u / n)}).parent().addClass("ui-effects-explode").css({position: "absolute", overflow: "hidden", width: o / r, height: u / n, left: s.left + l * (o / r) + (t.options.mode == "show" ? (l - Math.floor(r / 2)) * (o / r) : 0), top: s.top + f * (u / n) + (t.options.mode == "show" ? (f - Math.floor(n / 2)) * (u / n) : 0), opacity: t.options.mode == "show" ? 0 : 1}).animate({left: s.left + l * (o / r) + (t.options.mode == "show" ? 0 : (l - Math.floor(r / 2)) * (o / r)), top: s.top + f * (u / n) + (t.options.mode == "show" ? 0 : (f - Math.floor(n / 2)) * (u / n)), opacity: t.options.mode == "show" ? 1 : 0}, t.duration || 500);
            setTimeout(function () {
                t.options.mode == "show" ? i.css({visibility: "visible"}) : i.css({visibility: "visible"}).hide(), t.callback && t.callback.apply(i[0]), i.dequeue(), e("div.ui-effects-explode").remove()
            }, t.duration || 500)
        })
    }
}(jQuery), function (e, t) {
    e.effects.fade = function (t) {
        return this.queue(function () {
            var n = e(this), r = e.effects.setMode(n, t.options.mode || "hide");
            n.animate({opacity: r}, {queue: !1, duration: t.duration, easing: t.options.easing, complete: function () {
                t.callback && t.callback.apply(this, arguments), n.dequeue()
            }})
        })
    }
}(jQuery), function (e, t) {
    e.effects.fold = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right"], i = e.effects.setMode(n, t.options.mode || "hide"), s = t.options.size || 15, o = !!t.options.horizFirst, u = t.duration ? t.duration / 2 : e.fx.speeds._default / 2;
            e.effects.save(n, r), n.show();
            var f = e.effects.createWrapper(n).css({overflow: "hidden"}), l = i == "show" != o, c = l ? ["width", "height"] : ["height", "width"], h = l ? [f.width(), f.height()] : [f.height(), f.width()], p = /([0-9]+)%/.exec(s);
            p && (s = parseInt(p[1], 10) / 100 * h[i == "hide" ? 0 : 1]), i == "show" && f.css(o ? {height: 0, width: s} : {height: s, width: 0});
            var d = {}, v = {};
            d[c[0]] = i == "show" ? h[0] : s, v[c[1]] = i == "show" ? h[1] : 0, f.animate(d, u, t.options.easing).animate(v, u, t.options.easing, function () {
                i == "hide" && n.hide(), e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(n[0], arguments), n.dequeue()
            })
        })
    }
}(jQuery), function (e, t) {
    e.effects.highlight = function (t) {
        return this.queue(function () {
            var n = e(this
            ), r = ["backgroundImage", "backgroundColor", "opacity"], i = e.effects.setMode(n, t.options.mode || "show"), s = {backgroundColor: n.css("backgroundColor")};
            i == "hide" && (s.opacity = 0), e.effects.save(n, r), n.show().css({backgroundImage: "none", backgroundColor: t.options.color || "#ffff99"}).animate(s, {queue: !1, duration: t.duration, easing: t.options.easing, complete: function () {
                i == "hide" && n.hide(), e.effects.restore(n, r), i == "show" && !e.support.opacity && this.style.removeAttribute("filter"), t.callback && t.callback.apply(this, arguments), n.dequeue()
            }})
        })
    }
}(jQuery), function (e, t) {
    e.effects.pulsate = function (t) {
        return this.queue(function () {
            var n = e(this), r = e.effects.setMode(n, t.options.mode || "show"), i = (t.options.times || 5) * 2 - 1, s = t.duration ? t.duration / 2 : e.fx.speeds._default / 2, o = n.is(":visible"), u = 0;
            o || (n.css("opacity", 0).show(), u = 1), (r == "hide" && o || r == "show" && !o) && i--;
            for (var f = 0; f < i; f++)n.animate({opacity: u}, s, t.options.easing), u = (u + 1) % 2;
            n.animate({opacity: u}, s, t.options.easing, function () {
                u == 0 && n.hide(), t.callback && t.callback.apply(this, arguments)
            }), n.queue("fx",function () {
                n.dequeue()
            }).dequeue()
        })
    }
}(jQuery), function (e, t) {
    e.effects.puff = function (t) {
        return this.queue(function () {
            var n = e(this), r = e.effects.setMode(n, t.options.mode || "hide"), i = parseInt(t.options.percent, 10) || 150, s = i / 100, o = {height: n.height(), width: n.width()};
            e.extend(t.options, {fade: !0, mode: r, percent: r == "hide" ? i : 100, from: r == "hide" ? o : {height: o.height * s, width: o.width * s}}), n.effect("scale", t.options, t.duration, t.callback), n.dequeue()
        })
    }, e.effects.scale = function (t) {
        return this.queue(function () {
            var n = e(this), r = e.extend(!0, {}, t.options), i = e.effects.setMode(n, t.options.mode || "effect"), s = parseInt(t.options.percent, 10) || (parseInt(t.options.percent, 10) == 0 ? 0 : i == "hide" ? 0 : 100), o = t.options.direction || "both", u = t.options.origin;
            i != "effect" && (r.origin = u || ["middle", "center"], r.restore = !0);
            var f = {height: n.height(), width: n.width()};
            n.from = t.options.from || (i == "show" ? {height: 0, width: 0} : f);
            var l = {y: o != "horizontal" ? s / 100 : 1, x: o != "vertical" ? s / 100 : 1};
            n.to = {height: f.height * l.y, width: f.width * l.x}, t.options.fade && (i == "show" && (n.from.opacity = 0, n.to.opacity = 1), i == "hide" && (n.from.opacity = 1, n.to.opacity = 0)), r.from = n.from, r.to = n.to, r.mode = i, n.effect("size", r, t.duration, t.callback), n.dequeue()
        })
    }, e.effects.size = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right", "width", "height", "overflow", "opacity"], i = ["position", "top", "bottom", "left", "right", "overflow", "opacity"], s = ["width", "height", "overflow"], o = ["fontSize"], u = ["borderTopWidth", "borderBottomWidth", "paddingTop", "paddingBottom"], f = ["borderLeftWidth", "borderRightWidth", "paddingLeft", "paddingRight"], l = e.effects.setMode(n, t.options.mode || "effect"), c = t.options.restore || !1, h = t.options.scale || "both", p = t.options.origin, d = {height: n.height(), width: n.width()};
            n.from = t.options.from || d, n.to = t.options.to || d;
            if (p) {
                var v = e.effects.getBaseline(p, d);
                n.from.top = (d.height - n.from.height) * v.y, n.from.left = (d.width - n.from.width) * v.x, n.to.top = (d.height - n.to.height) * v.y, n.to.left = (d.width - n.to.width) * v.x
            }
            var m = {from: {y: n.from.height / d.height, x: n.from.width / d.width}, to: {y: n.to.height / d.height, x: n.to.width / d.width}};
            if (h == "box" || h == "both")m.from.y != m.to.y && (r = r.concat(u), n.from = e.effects.setTransition(n, u, m.from.y, n.from), n.to = e.effects.setTransition(n, u, m.to.y, n.to)), m.from.x != m.to.x && (r = r.concat(f), n.from = e.effects.setTransition(n, f, m.from.x, n.from), n.to = e.effects.setTransition(n, f, m.to.x, n.to));
            (h == "content" || h == "both") && m.from.y != m.to.y && (r = r.concat(o), n.from = e.effects.setTransition(n, o, m.from.y, n.from), n.to = e.effects.setTransition(n, o, m.to.y, n.to)), e.effects.save(n, c ? r : i), n.show(), e.effects.createWrapper(n), n.css("overflow", "hidden").css(n.from);
            if (h == "content" || h == "both")u = u.concat(["marginTop", "marginBottom"]).concat(o), f = f.concat(["marginLeft", "marginRight"]), s = r.concat(u).concat(f), n.find("*[width]").each(function () {
                var n = e(this);
                c && e.effects.save(n, s);
                var r = {height: n.height(), width: n.width()};
                n.from = {height: r.height * m.from.y, width: r.width * m.from.x}, n.to = {height: r.height * m.to.y, width: r.width * m.to.x}, m.from.y != m.to.y && (n.from = e.effects.setTransition(n, u, m.from.y, n.from), n.to = e.effects.setTransition(n, u, m.to.y, n.to)), m.from.x != m.to.x && (n.from = e.effects.setTransition(n, f, m.from.x, n.from), n.to = e.effects.setTransition(n, f, m.to.x, n.to)), n.css(n.from), n.animate(n.to, t.duration, t.options.easing, function () {
                    c && e.effects.restore(n, s)
                })
            });
            n.animate(n.to, {queue: !1, duration: t.duration, easing: t.options.easing, complete: function () {
                n.to.opacity === 0 && n.css("opacity", n.from.opacity), l == "hide" && n.hide(), e.effects.restore(n, c ? r : i), e.effects.removeWrapper(n), t.callback && t.callback.apply(this, arguments), n.dequeue()
            }})
        })
    }
}(jQuery), function (e, t) {
    e.effects.shake = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right"], i = e.effects.setMode(n, t.options.mode || "effect"), s = t.options.direction || "left", o = t.options.distance || 20, u = t.options.times || 3, f = t.duration || t.options.duration || 140;
            e.effects.save(n, r), n.show(), e.effects.createWrapper(n);
            var l = s == "up" || s == "down" ? "top" : "left", c = s == "up" || s == "left" ? "pos" : "neg", h = {}, p = {}, d = {};
            h[l] = (c == "pos" ? "-=" : "+=") + o, p[l] = (c == "pos" ? "+=" : "-=") + o * 2, d[l] = (c == "pos" ? "-=" : "+=") + o * 2, n.animate(h, f, t.options.easing);
            for (var v = 1; v < u; v++)n.animate(p, f, t.options.easing).animate(d, f, t.options.easing);
            n.animate(p, f, t.options.easing).animate(h, f / 2, t.options.easing, function () {
                e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(this, arguments)
            }), n.queue("fx", function () {
                n.dequeue()
            }), n.dequeue()
        })
    }
}(jQuery), function (e, t) {
    e.effects.slide = function (t) {
        return this.queue(function () {
            var n = e(this), r = ["position", "top", "bottom", "left", "right"], i = e.effects.setMode(n, t.options.mode || "show"), s = t.options.direction || "left";
            e.effects.save(n, r), n.show(), e.effects.createWrapper(n).css({overflow: "hidden"});
            var o = s == "up" || s == "down" ? "top" : "left", u = s == "up" || s == "left" ? "pos" : "neg", f = t.options.distance || (o == "top" ? n.outerHeight(!0) : n.outerWidth(!0));
            i == "show" && n.css(o, u == "pos" ? isNaN(f) ? "-" + f : -f : f);
            var l = {};
            l[o] = (i == "show" ? u == "pos" ? "+=" : "-=" : u == "pos" ? "-=" : "+=") + f, n.animate(l, {queue: !1, duration: t.duration, easing: t.options.easing, complete: function () {
                i == "hide" && n.hide(), e.effects.restore(n, r), e.effects.removeWrapper(n), t.callback && t.callback.apply(this, arguments), n.dequeue()
            }})
        })
    }
}(jQuery), function (e, t) {
    e.effects.transfer = function (t) {
        return this.queue(function () {
            var n = e(this), r = e(t.options.to), i = r.offset(), s = {top: i.top, left: i.left, height: r.innerHeight(), width: r.innerWidth()}, o = n.offset(), u = e('<div class="ui-effects-transfer"></div>').appendTo(document.body).addClass(t.options.className).css({top: o.top, left: o.left, height: n.innerHeight(), width: n.innerWidth(), position: "absolute"}).animate(s, t.duration, t.options.easing, function () {
                u.remove(), t.callback && t.callback.apply(n[0], arguments), n.dequeue()
            })
        })
    }
}(jQuery), function (e) {
    e.color = {}, e.color.make = function (t, n, r, i) {
        var s = {};
        return s.r = t || 0, s.g = n || 0, s.b = r || 0, s.a = i != null ? i : 1, s.add = function (e, t) {
            for (var n = 0; n < e.length; ++n)s[e.charAt(n)] += t;
            return s.normalize()
        }, s.scale = function (e, t) {
            for (var n = 0; n < e.length; ++n)s[e.charAt(n)] *= t;
            return s.normalize()
        }, s.toString = function () {
            return s.a >= 1 ? "rgb(" + [s.r, s.g, s.b].join(",") + ")" : "rgba(" + [s.r, s.g, s.b, s.a].join(",") + ")"
        }, s.normalize = function () {
            function e(e, t, n) {
                return t < e ? e : t > n ? n : t
            }

            return s.r = e(0, parseInt(s.r), 255), s.g = e(0, parseInt(s.g), 255), s.b = e(0, parseInt(s.b), 255), s.a = e(0, s.a, 1), s
        }, s.clone = function () {
            return e.color.make(s.r, s.b, s.g, s.a)
        }, s.normalize()
    }, e.color.extract = function (t, n) {
        var r;
        do {
            r = t.css(n).toLowerCase();
            if (r != "" && r != "transparent")break;
            t = t.parent()
        } while (!e.nodeName(t.get(0), "body"));
        return r == "rgba(0, 0, 0, 0)" && (r = "transparent"), e.color.parse(r)
    }, e.color.parse = function (n) {
        var r, i = e.color.make;
        if (r = /rgb\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*\)/.exec(n))return i(parseInt(r[1], 10), parseInt(r[2], 10), parseInt(r[3], 10));
        if (r = /rgba\(\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]{1,3})\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(n))return i(parseInt(r[1], 10), parseInt(r[2], 10), parseInt(r[3], 10), parseFloat(r[4]));
        if (r = /rgb\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*\)/.exec(n))return i(parseFloat(r[1]) * 2.55, parseFloat(r[2]) * 2.55, parseFloat(r[3]) * 2.55);
        if (r = /rgba\(\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\%\s*,\s*([0-9]+(?:\.[0-9]+)?)\s*\)/.exec(n))return i(parseFloat(r[1]) * 2.55, parseFloat(r[2]) * 2.55, parseFloat(r[3]) * 2.55, parseFloat(r[4]));
        if (r = /#([a-fA-F0-9]{2})([a-fA-F0-9]{2})([a-fA-F0-9]{2})/.exec(n))return i(parseInt(r[1], 16), parseInt(r[2], 16), parseInt(r[3], 16));
        if (r = /#([a-fA-F0-9])([a-fA-F0-9])([a-fA-F0-9])/.exec(n))return i(parseInt(r[1] + r[1], 16), parseInt(r[2] + r[2], 16), parseInt(r[3] + r[3], 16));
        var s = e.trim(n).toLowerCase();
        return s == "transparent" ? i(255, 255, 255, 0) : (r = t[s] || [0, 0, 0], i(r[0], r[1], r[2]))
    };
    var t = {aqua: [0, 255, 255], azure: [240, 255, 255], beige: [245, 245, 220], black: [0, 0, 0], blue: [0, 0, 255], brown: [165, 42, 42], cyan: [0, 255, 255], darkblue: [0, 0, 139], darkcyan: [0, 139, 139], darkgrey: [169, 169, 169], darkgreen: [0, 100, 0], darkkhaki: [189, 183, 107], darkmagenta: [139, 0, 139], darkolivegreen: [85, 107, 47], darkorange: [255, 140, 0], darkorchid: [153, 50, 204], darkred: [139, 0, 0], darksalmon: [233, 150, 122], darkviolet: [148, 0, 211], fuchsia: [255, 0, 255], gold: [255, 215, 0], green: [0, 128, 0], indigo: [75, 0, 130], khaki: [240, 230, 140], lightblue: [173, 216, 230], lightcyan: [224, 255, 255], lightgreen: [144, 238, 144], lightgrey: [211, 211, 211], lightpink: [255, 182, 193], lightyellow: [255, 255, 224], lime: [0, 255, 0], magenta: [255, 0, 255], maroon: [128, 0, 0], navy: [0, 0, 128], olive: [128, 128, 0], orange: [255, 165, 0], pink: [255, 192, 203], purple: [128, 0, 128], violet: [128, 0, 128], red: [255, 0, 0], silver: [192, 192, 192], white: [255, 255, 255], yellow: [255, 255, 0]}
}(jQuery), function (e) {
    function t(t, r, i, s) {
        function S(e, t) {
            t = [E].concat(t);
            for (var n = 0; n < e.length; ++n)e[n].apply(this, t)
        }

        function x() {
            for (var t = 0; t < s.length; ++t) {
                var n = s[t];
                n.init(E), n.options && e.extend(!0, u, n.options)
            }
        }

        function T(t) {
            var n;
            e.extend(!0, u, t), u.xaxis.color == null && (u.xaxis.color = u.grid.color), u.yaxis.color == null && (u.yaxis.color = u.grid.color), u.xaxis.tickColor == null && (u.xaxis.tickColor = u.grid.tickColor), u.yaxis.tickColor == null && (u.yaxis.tickColor = u.grid.tickColor), u.grid.borderColor == null && (u.grid.borderColor = u.grid.color), u.grid.tickColor == null && (u.grid.tickColor = e.color.parse(u.grid.color).scale("a", .22).toString());
            for (n = 0; n < Math.max(1, u.xaxes.length); ++n)u.xaxes[n] = e.extend(!0, {}, u.xaxis, u.xaxes[n]);
            for (n = 0; n < Math.max(1, u.yaxes.length); ++n)u.yaxes[n] = e.extend(!0, {}, u.yaxis, u.yaxes[n]);
            u.xaxis.noTicks && u.xaxis.ticks == null && (u.xaxis.ticks = u.xaxis.noTicks), u.yaxis.noTicks && u.yaxis.ticks == null && (u.yaxis.ticks = u.yaxis.noTicks), u.x2axis && (u.xaxes[1] = e.extend(!0, {}, u.xaxis, u.x2axis), u.xaxes[1].position = "top"), u.y2axis && (u.yaxes[1] = e.extend(!0, {}, u.yaxis, u.y2axis), u.yaxes[1].position = "right"), u.grid.coloredAreas && (u.grid.markings = u.grid.coloredAreas), u.grid.coloredAreasColor && (u.grid.markingsColor = u.grid.coloredAreasColor), u.lines && e.extend(!0, u.series.lines, u.lines), u.points && e.extend(!0, u.series.points, u.points), u.bars && e.extend(!0, u.series.bars, u.bars), u.shadowSize != null && (u.series.shadowSize = u.shadowSize), u.highlightColor != null && (u.series.highlightColor = u.highlightColor);
            for (n = 0; n < u.xaxes.length; ++n)M(p, n + 1).options = u.xaxes[n];
            for (n = 0; n < u.yaxes.length; ++n)M(d, n + 1).options = u.yaxes[n];
            for (var r in w)u.hooks[r] && u.hooks[r].length && (w[r] = w[r].concat(u.hooks[r]));
            S(w.processOptions, [u])
        }

        function N(e) {
            o = C(e), _(), D()
        }

        function C(t) {
            var n = [];
            for (var r = 0; r < t.length; ++r) {
                var i = e.extend(!0, {}, u.series);
                t[r].data != null ? (i.data = t[r].data, delete t[r].data, e.extend(!0, i, t[r]), t[r].data = i.data) : i.data = t[r], n.push(i)
            }
            return n
        }

        function k(e, t) {
            var n = e[t + "axis"];
            return typeof n == "object" && (n = n.n), typeof n != "number" && (n = 1), n
        }

        function L() {
            return e.grep(p.concat(d), function (e) {
                return e
            })
        }

        function A(e) {
            var t = {}, n, r;
            for (n = 0; n < p.length; ++n)r = p[n], r && r.used && (t["x" + r.n] = r.c2p(e.left));
            for (n = 0; n < d.length; ++n)r = d[n], r && r.used && (t["y" + r.n] = r.c2p(e.top));
            return t.x1 !== undefined && (t.x = t.x1), t.y1 !== undefined && (t.y = t.y1), t
        }

        function O(e) {
            var t = {}, n, r, i;
            for (n = 0; n < p.length; ++n) {
                r = p[n];
                if (r && r.used) {
                    i = "x" + r.n, e[i] == null && r.n == 1 && (i = "x");
                    if (e[i] != null) {
                        t.left = r.p2c(e[i]);
                        break
                    }
                }
            }
            for (n = 0; n < d.length; ++n) {
                r = d[n];
                if (r && r.used) {
                    i = "y" + r.n, e[i] == null && r.n == 1 && (i = "y");
                    if (e[i] != null) {
                        t.top = r.p2c(e[i]);
                        break
                    }
                }
            }
            return t
        }

        function M(t, n) {
            return t[n - 1] || (t[n - 1] = {n: n, direction: t == p ? "x" : "y", options: e.extend(!0, {}, t == p ? u.xaxis : u.yaxis)}), t[n - 1]
        }

        function _() {
            var t = o.length, n = -1, r;
            for (r = 0; r < o.length; ++r) {
                var i = o[r].color;
                i != null && (t--, typeof i == "number" && i > n && (n = i))
            }
            t <= n && (t = n + 1);
            var s, a = [], f = u.colors, l = f.length, c = 0;
            for (r = 0; r < t; r++)s = e.color.parse(f[r % l] || "#666"), r % l == 0 && r && (c >= 0 ? c < .5 ? c = -c - .2 : c = 0 : c = -c), a[r] = s.scale("rgb", 1 + c);
            var h = 0, v;
            for (r = 0; r < o.length; ++r) {
                v = o[r], v.color == null ? (v.color = a[h].toString(), ++h) : typeof v.color == "number" && (v.color = a[v.color].toString());
                if (v.lines.show == null) {
                    var m, g = !0;
                    for (m in v)if (v[m] && v[m].show) {
                        g = !1;
                        break
                    }
                    g && (v.lines.show = !0)
                }
                v.lines.zero == null && (v.lines.zero = !!v.lines.fill), v.xaxis = M(p, k(v, "x")), v.yaxis = M(d, k(v, "y"))
            }
        }

        function D() {
            function x(e, t, n) {
                t < e.datamin && t != -r && (e.datamin = t), n > e.datamax && n != r && (e.datamax = n)
            }

            var t = Number.POSITIVE_INFINITY, n = Number.NEGATIVE_INFINITY, r = Number.MAX_VALUE, i, s, u, a, f, l, c, h, p, d, v, m, g, y, b, E;
            e.each(L(), function (e, r) {
                r.datamin = t, r.datamax = n, r.used = !1
            });
            for (i = 0; i < o.length; ++i)l = o[i], l.datapoints = {points: []}, S(w.processRawData, [l, l.data, l.datapoints]);
            for (i = 0; i < o.length; ++i) {
                l = o[i], b = l.data, E = l.datapoints.format;
                if (!E) {
                    E = [], E.push({x: !0, number: !0, required: !0}), E.push({y: !0, number: !0, required: !0});
                    if (l.bars.show || l.lines.show && l.lines.fill) {
                        var T = !!(l.bars.show && l.bars.zero || l.lines.show && l.lines.zero);
                        E.push({y: !0, number: !0, required: !1, defaultValue: 0, autoscale: T}), l.bars.horizontal && (delete E[E.length - 1].y, E[E.length - 1].x = !0)
                    }
                    l.datapoints.format = E
                }
                if (l.datapoints.pointsize != null)continue;
                l.datapoints.pointsize = E.length, h = l.datapoints.pointsize, c = l.datapoints.points;
                var N = l.lines.show && l.lines.steps;
                l.xaxis.used = l.yaxis.used = !0;
                for (s = u = 0; s < b.length; ++s, u += h) {
                    y = b[s];
                    var C = y == null;
                    if (!C)for (a = 0; a < h; ++a)m = y[a], g = E[a], g && (g.number && m != null && (m = +m, isNaN(m) ? m = null : m == Infinity ? m = r : m == -Infinity && (m = -r)), m == null && (g.required && (C = !0), g.defaultValue != null && (m = g.defaultValue))), c[u + a] = m;
                    if (C)for (a = 0; a < h; ++a)m = c[u + a], m != null && (g = E[a], g.x && x(l.xaxis, m, m), g.y && x(l.yaxis, m, m)), c[u + a] = null; else if (N && u > 0 && c[u - h] != null && c[u - h] != c[u] && c[u - h + 1] != c[u + 1]) {
                        for (a = 0; a < h; ++a)c[u + h + a] = c[u + a];
                        c[u + 1] = c[u - h + 1], u += h
                    }
                }
            }
            for (i = 0; i < o.length; ++i)l = o[i], S(w.processDatapoints, [l, l.datapoints]);
            for (i = 0; i < o.length; ++i) {
                l = o[i], c = l.datapoints.points, h = l.datapoints.pointsize, E = l.datapoints.format;
                var k = t, A = t, O = n, M = n;
                for (s = 0; s < c.length; s += h) {
                    if (c[s] == null)continue;
                    for (a = 0; a < h; ++a) {
                        m = c[s + a], g = E[a];
                        if (!g || g.autoscale === !1 || m == r || m == -r)continue;
                        g.x && (m < k && (k = m), m > O && (O = m)), g.y && (m < A && (A = m), m > M && (M = m))
                    }
                }
                if (l.bars.show) {
                    var _;
                    switch (l.bars.align) {
                        case"left":
                            _ = 0;
                            break;
                        case"right":
                            _ = -l.bars.barWidth;
                            break;
                        case"center":
                            _ = -l.bars.barWidth / 2;
                            break;
                        default:
                            throw new Error("Invalid bar alignment: " + l.bars.align)
                    }
                    l.bars.horizontal ? (A += _, M += _ + l.bars.barWidth) : (k += _, O += _ + l.bars.barWidth)
                }
                x(l.xaxis, k, O), x(l.yaxis, A, M)
            }
            e.each(L(), function (e, r) {
                r.datamin == t && (r.datamin = null), r.datamax == n && (r.datamax = null)
            })
        }

        function P(e) {
            var t = window.devicePixelRatio || 1, n = e.webkitBackingStorePixelRatio || e.mozBackingStorePixelRatio || e.msBackingStorePixelRatio || e.oBackingStorePixelRatio || e.backingStorePixelRatio || 1;
            return t / n
        }

        function H(n) {
            var r = document.createElement("canvas");
            r.className = n, e(r).css({direction: "ltr", position: "absolute", left: 0, top: 0}).appendTo(t);
            if (!r.getContext) {
                if (!window.G_vmlCanvasManager)throw new Error("Canvas is not available. If you're using IE with a fall-back such as Excanvas, then there's either a mistake in your conditional include, or the page has no DOCTYPE and is rendering in Quirks Mode.");
                r = window.G_vmlCanvasManager.initElement(r)
            }
            var i = r.getContext("2d"), s = P(i);
            return r.width = m * s, r.height = g * s, r.style.width = m + "px", r.style.height = g + "px", i.save(), i.scale(s, s), r
        }

        function B() {
            m = t.width(), g = t.height();
            if (m <= 0 || g <= 0)throw new Error("Invalid dimensions for plot, width = " + m + ", height = " + g)
        }

        function j(e) {
            var t = e.getContext("2d"), n = P(t);
            e.style.width != m && (e.width = m * n, e.style.width = m + "px"), e.style.height != g && (e.height = g * n, e.style.height = g + "px"), t.restore(), t.save(), t.scale(n, n)
        }

        function F() {
            var n, r = t.children("canvas.flot-base"), i = t.children("canvas.flot-overlay");
            r.length == 0 || i == 0 ? (t.html(""), t.css({padding: 0}), t.css("position") == "static" && t.css("position", "relative"), B(), a = H("flot-base"), f = H("flot-overlay"), n = !1) : (a = r.get(0), f = i.get(0), n = !0), c = a.getContext("2d"), h = f.getContext("2d"), l = e(f), n && (t.data("plot").shutdown(), E.resize(), h.clearRect(0, 0, m, g), l.unbind(), t.children().not([a, f]).remove()), t.data("plot", E)
        }

        function I() {
            u.grid.hoverable && (l.mousemove(pt), l.bind("mouseleave", dt)), u.grid.clickable && l.click(vt), S(w.bindEvents, [l])
        }

        function q() {
            ct && clearTimeout(ct), l.unbind("mousemove", pt), l.unbind("mouseleave", dt), l.unbind("click", vt), S(w.shutdown, [l])
        }

        function R(e) {
            function t(e) {
                return e
            }

            var n, r, i = e.options.transform || t, s = e.options.inverseTransform;
            e.direction == "x" ? (n = e.scale = y / Math.abs(i(e.max) - i(e.min)), r = Math.min(i(e.max), i(e.min))) : (n = e.scale = b / Math.abs(i(e.max) - i(e.min)), n = -n, r = Math.max(i(e.max), i(e.min))), i == t ? e.p2c = function (e) {
                return(e - r) * n
            } : e.p2c = function (e) {
                return(i(e) - r) * n
            }, s ? e.c2p = function (e) {
                return s(r + e / n)
            } : e.c2p = function (e) {
                return r + e / n
            }
        }

        function U(e) {
            var t = e.options, n = e.ticks || [], r = t.labelWidth || 0, i = t.labelHeight || 0, s = e.font;
            c.save(), c.font = s.style + " " + s.variant + " " + s.weight + " " + s.size + "px '" + s.family + "'";
            for (var o = 0; o < n.length; ++o) {
                var u = n[o];
                u.lines = [], u.width = u.height = 0;
                if (!u.label)continue;
                var a = (u.label + "").replace(/<br ?\/?>|\r\n|\r/g, "\n").split("\n");
                for (var f = 0; f < a.length; ++f) {
                    var l = {text: a[f]}, h = c.measureText(l.text);
                    l.width = h.width, l.height = h.height != null ? h.height : s.size, l.height += Math.round(s.size * .15), u.width = Math.max(l.width, u.width), u.height += l.height, u.lines.push(l)
                }
                t.labelWidth == null && (r = Math.max(r, u.width)), t.labelHeight == null && (i = Math.max(i, u.height))
            }
            c.restore(), e.labelWidth = Math.ceil(r), e.labelHeight = Math.ceil(i)
        }

        function z(t) {
            var n = t.labelWidth, r = t.labelHeight, i = t.options.position, s = t.options.tickLength, o = u.grid.axisMargin, a = u.grid.labelMargin, f = t.direction == "x" ? p : d, l, c, h = e.grep(f, function (e) {
                return e && e.options.position == i && e.reserveSpace
            });
            e.inArray(t, h) == h.length - 1 && (o = 0);
            if (s == null) {
                var y = e.grep(f, function (e) {
                    return e && e.reserveSpace
                });
                c = e.inArray(t, y) == 0, c ? s = "full" : s = 5
            }
            isNaN(+s) || (a += +s), t.direction == "x" ? (r += a, i == "bottom" ? (v.bottom += r + o, t.box = {top: g - v.bottom, height: r}) : (t.box = {top: v.top + o, height: r}, v.top += r + o)) : (n += a, i == "left" ? (t.box = {left: v.left + o, width: n}, v.left += n + o) : (v.right += n + o, t.box = {left: m - v.right, width: n})), t.position = i, t.tickLength = s, t.box.padding = a, t.innermost = c
        }

        function W(e) {
            e.direction == "x" ? (e.box.left = v.left - e.labelWidth / 2, e.box.width = m - v.left - v.right + e.labelWidth) : (e.box.top = v.top - e.labelHeight / 2, e.box.height = g - v.bottom - v.top + e.labelHeight)
        }

        function X() {
            var t = u.grid.minBorderMargin, n = {x: 0, y: 0}, r, i;
            if (t == null) {
                t = 0;
                for (r = 0; r < o.length; ++r)t = Math.max(t, 2 * (o[r].points.radius + o[r].points.lineWidth / 2))
            }
            n.x = n.y = Math.ceil(t), e.each(L(), function (e, t) {
                var r = t.direction;
                t.reserveSpace && (n[r] = Math.ceil(Math.max(n[r], (r == "x" ? t.labelWidth : t.labelHeight) / 2)))
            }), v.left = Math.max(n.x, v.left), v.right = Math.max(n.x, v.right), v.top = Math.max(n.y, v.top), v.bottom = Math.max(n.y, v.bottom)
        }

        function V() {
            var n, r = L(), i = u.grid.show;
            for (var s in v) {
                var o = u.grid.margin || 0;
                v[s] = typeof o == "number" ? o : o[s] || 0
            }
            S(w.processOffset, [v]);
            for (var s in v)typeof u.grid.borderWidth == "object" ? v[s] += i ? u.grid.borderWidth[s] : 0 : v[s] += i ? u.grid.borderWidth : 0;
            e.each(r, function (e, t) {
                t.show = t.options.show, t.show == null && (t.show = t.used), t.reserveSpace = t.show || t.options.reserveSpace, J(t)
            });
            if (i) {
                var a = {style: t.css("font-style"), size: Math.round(.8 * (+t.css("font-size").replace("px", "") || 13)), variant: t.css("font-variant"), weight: t.css("font-weight"), family: t.css("font-family")}, f = e.grep(r, function (e) {
                    return e.reserveSpace
                });
                e.each(f, function (t, n) {
                    K(n), Q(n), G(n, n.ticks), n.font = e.extend({}, a, n.options.font), U(n)
                });
                for (n = f.length - 1; n >= 0; --n)z(f[n]);
                X(), e.each(f, function (e, t) {
                    W(t)
                })
            }
            y = m - v.left - v.right, b = g - v.bottom - v.top, e.each(r, function (e, t) {
                R(t)
            }), ft()
        }

        function J(e) {
            var t = e.options, n = +(t.min != null ? t.min : e.datamin), r = +(t.max != null ? t.max : e.datamax), i = r - n;
            if (i == 0) {
                var s = r == 0 ? 1 : .01;
                t.min == null && (n -= s);
                if (t.max == null || t.min != null)r += s
            } else {
                var o = t.autoscaleMargin;
                o != null && (t.min == null && (n -= i * o, n < 0 && e.datamin != null && e.datamin >= 0 && (n = 0)), t.max == null && (r += i * o, r > 0 && e.datamax != null && e.datamax <= 0 && (r = 0)))
            }
            e.min = n, e.max = r
        }

        function K(t) {
            var r = t.options, i;
            typeof r.ticks == "number" && r.ticks > 0 ? i = r.ticks : i = .3 * Math.sqrt(t.direction == "x" ? m : g), t.delta = (t.max - t.min) / i;
            if (r.mode == "time" && !t.tickGenerator)throw new Error("Time mode requires the flot.time plugin.");
            t.tickGenerator || (t.tickGenerator = function (e) {
                var t = r.tickDecimals, i = -Math.floor(Math.log(e.delta) / Math.LN10);
                t != null && i > t && (i = t);
                var s = Math.pow(10, -i), o = e.delta / s, u, a = [], f, l = 0, c = Number.NaN, h;
                o < 1.5 ? u = 1 : o < 3 ? (u = 2, o > 2.25 && (t == null || i + 1 <= t) && (u = 2.5, ++i)) : o < 7.5 ? u = 5 : u = 10, u *= s, r.minTickSize != null && u < r.minTickSize && (u = r.minTickSize), e.tickDecimals = Math.max(0, t != null ? t : i), e.tickSize = r.tickSize || u, f = n(e.min, e.tickSize);
                do h = c, c = f + l * e.tickSize, a.push(c), ++l; while (c < e.max && c != h);
                return a
            }, t.tickFormatter = function (e, t) {
                var n = t.tickDecimals ? Math.pow(10, t.tickDecimals) : 1, r = "" + Math.round(e * n) / n;
                if (t.tickDecimals != null) {
                    var i = r.indexOf("."), s = i == -1 ? 0 : r.length - i - 1;
                    if (s < t.tickDecimals)return(s ? r : r + ".") + ("" + n).substr(1, t.tickDecimals - s)
                }
                return r
            }), e.isFunction(r.tickFormatter) && (t.tickFormatter = function (e, t) {
                return"" + r.tickFormatter(e, t)
            });
            if (r.alignTicksWithAxis != null) {
                var s = (t.direction == "x" ? p : d)[r.alignTicksWithAxis - 1];
                if (s && s.used && s != t) {
                    var o = t.tickGenerator(t);
                    o.length > 0 && (r.min == null && (t.min = Math.min(t.min, o[0])), r.max == null && o.length > 1 && (t.max = Math.max(t.max, o[o.length - 1]))), t.tickGenerator = function (e) {
                        var t = [], n, r;
                        for (r = 0; r < s.ticks.length; ++r)n = (s.ticks[r].v - s.min) / (s.max - s.min), n = e.min + n * (e.max - e.min), t.push(n);
                        return t
                    };
                    if (!t.mode && r.tickDecimals == null) {
                        var u = Math.max(0, -Math.floor(Math.log(t.delta) / Math.LN10) + 1), a = t.tickGenerator(t);
                        a.length > 1 && /\..*0$/.test((a[1] - a[0]).toFixed(u)) || (t.tickDecimals = u)
                    }
                }
            }
        }

        function Q(t) {
            var n = t.options.ticks, r = [];
            n == null || typeof n == "number" && n > 0 ? r = t.tickGenerator(t) : n && (e.isFunction(n) ? r = n(t) : r = n);
            var i, s;
            t.ticks = [];
            for (i = 0; i < r.length; ++i) {
                var o = null, u = r[i];
                typeof u == "object" ? (s = +u[0], u.length > 1 && (o = u[1])) : s = +u, o == null && (o = t.tickFormatter(s, t)), isNaN(s) || t.ticks.push({v: s, label: o})
            }
        }

        function G(e, t) {
            e.options.autoscaleMargin && t.length > 0 && (e.options.min == null && (e.min = Math.min(e.min, t[0].v)), e.options.max == null && t.length > 1 && (e.max = Math.max(e.max, t[t.length - 1].v)))
        }

        function Y() {
            c.clearRect(0, 0, m, g), S(w.drawBackground, [c]);
            var e = u.grid;
            e.show && e.backgroundColor && et(), e.show && !e.aboveData && (tt(), nt());
            for (var t = 0; t < o.length; ++t)S(w.drawSeries, [c, o[t]]), rt(o[t]);
            S(w.draw, [c]), e.show && e.aboveData && (tt(), nt())
        }

        function Z(e, t) {
            var n, r, i, s, o = L();
            for (var u = 0; u < o.length; ++u) {
                n = o[u];
                if (n.direction == t) {
                    s = t + n.n + "axis", !e[s] && n.n == 1 && (s = t + "axis");
                    if (e[s]) {
                        r = e[s].from, i = e[s].to;
                        break
                    }
                }
            }
            e[s] || (n = t == "x" ? p[0] : d[0], r = e[t + "1"], i = e[t + "2"]);
            if (r != null && i != null && r > i) {
                var a = r;
                r = i, i = a
            }
            return{from: r, to: i, axis: n}
        }

        function et() {
            c.save(), c.translate(v.left, v.top), c.fillStyle = Tt(u.grid.backgroundColor, b, 0, "rgba(255, 255, 255, 0)"), c.fillRect(0, 0, y, b), c.restore()
        }

        function tt() {
            var t, n, r, i;
            c.save(), c.translate(v.left, v.top);
            var s = u.grid.markings;
            if (s) {
                e.isFunction(s) && (n = E.getAxes(), n.xmin = n.xaxis.min, n.xmax = n.xaxis.max, n.ymin = n.yaxis.min, n.ymax = n.yaxis.max, s = s(n));
                for (t = 0; t < s.length; ++t) {
                    var o = s[t], a = Z(o, "x"), f = Z(o, "y");
                    a.from == null && (a.from = a.axis.min), a.to == null && (a.to = a.axis.max), f.from == null && (f.from = f.axis.min), f.to == null && (f.to = f.axis.max);
                    if (a.to < a.axis.min || a.from > a.axis.max || f.to < f.axis.min || f.from > f.axis.max)continue;
                    a.from = Math.max(a.from, a.axis.min), a.to = Math.min(a.to, a.axis.max), f.from = Math.max(f.from, f.axis.min), f.to = Math.min(f.to, f.axis.max);
                    if (a.from == a.to && f.from == f.to)continue;
                    a.from = a.axis.p2c(a.from), a.to = a.axis.p2c(a.to), f.from = f.axis.p2c(f.from), f.to = f.axis.p2c(f.to), a.from == a.to || f.from == f.to ? (c.beginPath(), c.strokeStyle = o.color || u.grid.markingsColor, c.lineWidth = o.lineWidth || u.grid.markingsLineWidth, c.moveTo(a.from, f.from), c.lineTo(a.to, f.to), c.stroke()) : (c.fillStyle = o.color || u.grid.markingsColor, c.fillRect(a.from, f.to, a.to - a.from, f.from - f.to))
                }
            }
            n = L(), r = u.grid.borderWidth;
            for (var l = 0; l < n.length; ++l) {
                var h = n[l], p = h.box, d = h.tickLength, m, g, w, S;
                if (!h.show || h.ticks.length == 0)continue;
                c.strokeStyle = h.options.tickColor || e.color.parse(h.options.color).scale("a", .22).toString(), c.lineWidth = 1, h.direction == "x" ? (m = 0, d == "full" ? g = h.position == "top" ? 0 : b : g = p.top - v.top + (h.position == "top" ? p.height : 0)) : (g = 0, d == "full" ? m = h.position == "left" ? 0 : y : m = p.left - v.left + (h.position == "left" ? p.width : 0)), h.innermost || (c.beginPath(), w = S = 0, h.direction == "x" ? w = y : S = b, c.lineWidth == 1 && (m = Math.floor(m) + .5, g = Math.floor(g) + .5), c.moveTo(m, g), c.lineTo(m + w, g + S), c.stroke()), c.beginPath();
                for (t = 0; t < h.ticks.length; ++t) {
                    var x = h.ticks[t].v;
                    w = S = 0;
                    if (x < h.min || x > h.max || d == "full" && (typeof r == "object" && r[h.position] > 0 || r > 0) && (x == h.min || x == h.max))continue;
                    h.direction == "x" ? (m = h.p2c(x), S = d == "full" ? -b : d, h.position == "top" && (S = -S)) : (g = h.p2c(x), w = d == "full" ? -y : d, h.position == "left" && (w = -w)), c.lineWidth == 1 && (h.direction == "x" ? m = Math.floor(m) + .5 : g = Math.floor(g) + .5), c.moveTo(m, g), c.lineTo(m + w, g + S)
                }
                c.stroke()
            }
            r && (i = u.grid.borderColor, typeof r == "object" || typeof i == "object" ? (typeof r != "object" && (r = {top: r, right: r, bottom: r, left: r}), typeof i != "object" && (i = {top: i, right: i, bottom: i, left: i}), r.top > 0 && (c.strokeStyle = i.top, c.lineWidth = r.top, c.beginPath(), c.moveTo(0 - r.left, 0 - r.top / 2), c.lineTo(y, 0 - r.top / 2), c.stroke()), r.right > 0 && (c.strokeStyle = i.right, c.lineWidth = r.right, c.beginPath(), c.moveTo(y + r.right / 2, 0 - r.top), c.lineTo(y + r.right / 2, b), c.stroke()), r.bottom > 0 && (c.strokeStyle = i.bottom, c.lineWidth = r.bottom, c.beginPath(), c.moveTo(y + r.right, b + r.bottom / 2), c.lineTo(0, b + r.bottom / 2), c.stroke()), r.left > 0 && (c.strokeStyle = i.left, c.lineWidth = r.left, c.beginPath(), c.moveTo(0 - r.left / 2, b + r.bottom), c.lineTo(0 - r.left / 2, 0), c.stroke())) : (c.lineWidth = r, c.strokeStyle = u.grid.borderColor, c.strokeRect(-r / 2, -r / 2, y + r, b + r))), c.restore()
        }

        function nt() {
            c.save(), e.each(L(), function (e, t) {
                if (!t.show || t.ticks.length == 0)return;
                var n = t.box, r = t.font;
                c.fillStyle = t.options.color, c.font = r.style + " " + r.variant + " " + r.weight + " " + r.size + "px " + r.family, c.textAlign = "start", c.textBaseline = "middle";
                for (var i = 0; i < t.ticks.length; ++i) {
                    var s = t.ticks[i];
                    if (!s.label || s.v < t.min || s.v > t.max)continue;
                    var o, u, a = 0, f;
                    for (var l = 0; l < s.lines.length; ++l)f = s.lines[l], t.direction == "x" ? (o = v.left + t.p2c(s.v) - f.width / 2, t.position == "bottom" ? u = n.top + n.padding : u = n.top + n.height - n.padding - s.height) : (u = v.top + t.p2c(s.v) - s.height / 2, t.position == "left" ? o = n.left + n.width - n.padding - f.width : o = n.left + n.padding), u += f.height / 2 + a, a += f.height, !(window.opera && window.opera.version().split(".")[0] < 12) || (o = Math.floor(o), u = Math.ceil(u - 2)), c.fillText(f.text, o, u)
                }
            }), c.restore()
        }

        function rt(e) {
            e.lines.show && it(e), e.bars.show && ut(e), e.points.show && st(e)
        }

        function it(e) {
            function t(e, t, n, r, i) {
                var s = e.points, o = e.pointsize, u = null, a = null;
                c.beginPath();
                for (var f = o; f < s.length; f += o) {
                    var l = s[f - o], h = s[f - o + 1], p = s[f], d = s[f + 1];
                    if (l == null || p == null)continue;
                    if (h <= d && h < i.min) {
                        if (d < i.min)continue;
                        l = (i.min - h) / (d - h) * (p - l) + l, h = i.min
                    } else if (d <= h && d < i.min) {
                        if (h < i.min)continue;
                        p = (i.min - h) / (d - h) * (p - l) + l, d = i.min
                    }
                    if (h >= d && h > i.max) {
                        if (d > i.max)continue;
                        l = (i.max - h) / (d - h) * (p - l) + l, h = i.max
                    } else if (d >= h && d > i.max) {
                        if (h > i.max)continue;
                        p = (i.max - h) / (d - h) * (p - l) + l, d = i.max
                    }
                    if (l <= p && l < r.min) {
                        if (p < r.min)continue;
                        h = (r.min - l) / (p - l) * (d - h) + h, l = r.min
                    } else if (p <= l && p < r.min) {
                        if (l < r.min)continue;
                        d = (r.min - l) / (p - l) * (d - h) + h, p = r.min
                    }
                    if (l >= p && l > r.max) {
                        if (p > r.max)continue;
                        h = (r.max - l) / (p - l) * (d - h) + h, l = r.max
                    } else if (p >= l && p > r.max) {
                        if (l > r.max)continue;
                        d = (r.max - l) / (p - l) * (d - h) + h, p = r.max
                    }
                    (l != u || h != a) && c.moveTo(r.p2c(l) + t, i.p2c(h) + n), u = p, a = d, c.lineTo(r.p2c(p) + t, i.p2c(d) + n)
                }
                c.stroke()
            }

            function n(e, t, n) {
                var r = e.points, i = e.pointsize, s = Math.min(Math.max(0, n.min), n.max), o = 0, u, a = !1, f = 1, l = 0, h = 0;
                for (; ;) {
                    if (i > 0 && o > r.length + i)break;
                    o += i;
                    var p = r[o - i], d = r[o - i + f], v = r[o], m = r[o + f];
                    if (a) {
                        if (i > 0 && p != null && v == null) {
                            h = o, i = -i, f = 2;
                            continue
                        }
                        if (i < 0 && o == l + i) {
                            c.fill(), a = !1, i = -i, f = 1, o = l = h + i;
                            continue
                        }
                    }
                    if (p == null || v == null)continue;
                    if (p <= v && p < t.min) {
                        if (v < t.min)continue;
                        d = (t.min - p) / (v - p) * (m - d) + d, p = t.min
                    } else if (v <= p && v < t.min) {
                        if (p < t.min)continue;
                        m = (t.min - p) / (v - p) * (m - d) + d, v = t.min
                    }
                    if (p >= v && p > t.max) {
                        if (v > t.max)continue;
                        d = (t.max - p) / (v - p) * (m - d) + d, p = t.max
                    } else if (v >= p && v > t.max) {
                        if (p > t.max)continue;
                        m = (t.max - p) / (v - p) * (m - d) + d, v = t.max
                    }
                    a || (c.beginPath(), c.moveTo(t.p2c(p), n.p2c(s)), a = !0);
                    if (d >= n.max && m >= n.max) {
                        c.lineTo(t.p2c(p), n.p2c(n.max)), c.lineTo(t.p2c(v), n.p2c(n.max));
                        continue
                    }
                    if (d <= n.min && m <= n.min) {
                        c.lineTo(t.p2c(p), n.p2c(n.min)), c.lineTo(t.p2c(v), n.p2c(n.min));
                        continue
                    }
                    var g = p, y = v;
                    d <= m && d < n.min && m >= n.min ? (p = (n.min - d) / (m - d) * (v - p) + p, d = n.min) : m <= d && m < n.min && d >= n.min && (v = (n.min - d) / (m - d) * (v - p) + p, m = n.min), d >= m && d > n.max && m <= n.max ? (p = (n.max - d) / (m - d) * (v - p) + p, d = n.max) : m >= d && m > n.max && d <= n.max && (v = (n.max - d) / (m - d) * (v - p) + p, m = n.max), p != g && c.lineTo(t.p2c(g), n.p2c(d)), c.lineTo(t.p2c(p), n.p2c(d)), c.lineTo(t.p2c(v), n.p2c(m)), v != y && (c.lineTo(t.p2c(v), n.p2c(m)), c.lineTo(t.p2c(y), n.p2c(m)))
                }
            }

            c.save(), c.translate(v.left, v.top), c.lineJoin = "round";
            var r = e.lines.lineWidth, i = e.shadowSize;
            if (r > 0 && i > 0) {
                c.lineWidth = i, c.strokeStyle = "rgba(0,0,0,0.1)";
                var s = Math.PI / 18;
                t(e.datapoints, Math.sin(s) * (r / 2 + i / 2), Math.cos(s) * (r / 2 + i / 2), e.xaxis, e.yaxis), c.lineWidth = i / 2, t(e.datapoints, Math.sin(s) * (r / 2 + i / 4), Math.cos(s) * (r / 2 + i / 4), e.xaxis, e.yaxis)
            }
            c.lineWidth = r, c.strokeStyle = e.color;
            var o = at(e.lines, e.color, 0, b);
            o && (c.fillStyle = o, n(e.datapoints, e.xaxis, e.yaxis)), r > 0 && t(e.datapoints, 0, 0, e.xaxis, e.yaxis), c.restore()
        }

        function st(e) {
            function t(e, t, n, r, i, s, o, u) {
                var a = e.points, f = e.pointsize;
                for (var l = 0; l < a.length; l += f) {
                    var h = a[l], p = a[l + 1];
                    if (h == null || h < s.min || h > s.max || p < o.min || p > o.max)continue;
                    c.beginPath(), h = s.p2c(h), p = o.p2c(p) + r, u == "circle" ? c.arc(h, p, t, 0, i ? Math.PI : Math.PI * 2, !1) : u(c, h, p, t, i), c.closePath(), n && (c.fillStyle = n, c.fill()), c.stroke()
                }
            }

            c.save(), c.translate(v.left, v.top);
            var n = e.points.lineWidth, r = e.shadowSize, i = e.points.radius, s = e.points.symbol;
            if (n > 0 && r > 0) {
                var o = r / 2;
                c.lineWidth = o, c.strokeStyle = "rgba(0,0,0,0.1)", t(e.datapoints, i, null, o + o / 2, !0, e.xaxis, e.yaxis, s), c.strokeStyle = "rgba(0,0,0,0.2)", t(e.datapoints, i, null, o / 2, !0, e.xaxis, e.yaxis, s)
            }
            c.lineWidth = n, c.strokeStyle = e.color, t(e.datapoints, i, at(e.points, e.color), 0, !1, e.xaxis, e.yaxis, s), c.restore()
        }

        function ot(e, t, n, r, i, s, o, u, a, f, l, c) {
            var h, p, d, v, m, g, y, b, w;
            l ? (b = g = y = !0, m = !1, h = n, p = e, v = t + r, d = t + i, p < h && (w = p, p = h, h = w, m = !0, g = !1)) : (m = g = y = !0, b = !1, h = e + r, p = e + i, d = n, v = t, v < d && (w = v, v = d, d = w, b = !0, y = !1));
            if (p < u.min || h > u.max || v < a.min || d > a.max)return;
            h < u.min && (h = u.min, m = !1), p > u.max && (p = u.max, g = !1), d < a.min && (d = a.min, b = !1), v > a.max && (v = a.max, y = !1), h = u.p2c(h), d = a.p2c(d), p = u.p2c(p), v = a.p2c(v), o && (f.beginPath(), f.moveTo(h, d), f.lineTo(h, v), f.lineTo(p, v), f.lineTo(p, d), f.fillStyle = o(d, v), f.fill()), c > 0 && (m || g || y || b) && (f.beginPath(), f.moveTo(h, d + s), m ? f.lineTo(h, v + s) : f.moveTo(h, v + s), y ? f.lineTo(p, v + s) : f.moveTo(p, v + s), g ? f.lineTo(p, d + s) : f.moveTo(p, d + s), b ? f.lineTo(h, d + s) : f.moveTo(h, d + s), f.stroke())
        }

        function ut(e) {
            function t(t, n, r, i, s, o, u) {
                var a = t.points, f = t.pointsize;
                for (var l = 0; l < a.length; l += f) {
                    if (a[l] == null)continue;
                    ot(a[l], a[l + 1], a[l + 2], n, r, i, s, o, u, c, e.bars.horizontal, e.bars.lineWidth)
                }
            }

            c.save(), c.translate(v.left, v.top), c.lineWidth = e.bars.lineWidth, c.strokeStyle = e.color;
            var n;
            switch (e.bars.align) {
                case"left":
                    n = 0;
                    break;
                case"right":
                    n = -e.bars.barWidth;
                    break;
                case"center":
                    n = -e.bars.barWidth / 2;
                    break;
                default:
                    throw new Error("Invalid bar alignment: " + e.bars.align)
            }
            var r = e.bars.fill ? function (t, n) {
                return at(e.bars, e.color, t, n)
            } : null;
            t(e.datapoints, n, n + e.bars.barWidth, 0, r, e.xaxis, e.yaxis), c.restore()
        }

        function at(t, n, r, i) {
            var s = t.fill;
            if (!s)return null;
            if (t.fillColor)return Tt(t.fillColor, r, i, n);
            var o = e.color.parse(n);
            return o.a = typeof s == "number" ? s : .4, o.normalize(), o.toString()
        }

        function ft() {
            t.find(".legend").remove();
            if (!u.legend.show)return;
            var n = [], r = [], i = !1, s = u.legend.labelFormatter, a, f;
            for (var l = 0; l < o.length; ++l)a = o[l], a.label && (f = s ? s(a.label, a) : a.label, f && r.push({label: f, color: a.color}));
            if (u.legend.sorted)if (e.isFunction(u.legend.sorted))r.sort(u.legend.sorted); else {
                var c = u.legend.sorted != "descending";
                r.sort(function (e, t) {
                    return e.label == t.label ? 0 : e.label < t.label != c ? 1 : -1
                })
            }
            for (var l = 0; l < r.length; ++l) {
                var h = r[l];
                l % u.legend.noColumns == 0 && (i && n.push("</tr>"), n.push("<tr>"), i = !0), n.push('<td class="legendColorBox"><div style="border:1px solid ' + u.legend.labelBoxBorderColor + ';padding:1px"><div style="width:4px;height:0;border:5px solid ' +
                    h.color + ';overflow:hidden"></div></div></td>' + '<td class="legendLabel">' + h.label + "</td>")
            }
            i && n.push("</tr>");
            if (n.length == 0)return;
            var p = '<table style="font-size:smaller;color:' + u.grid.color + '">' + n.join("") + "</table>";
            if (u.legend.container != null)e(u.legend.container).html(p); else {
                var d = "", m = u.legend.position, g = u.legend.margin;
                g[0] == null && (g = [g, g]), m.charAt(0) == "n" ? d += "top:" + (g[1] + v.top) + "px;" : m.charAt(0) == "s" && (d += "bottom:" + (g[1] + v.bottom) + "px;"), m.charAt(1) == "e" ? d += "right:" + (g[0] + v.right) + "px;" : m.charAt(1) == "w" && (d += "left:" + (g[0] + v.left) + "px;");
                var y = e('<div class="legend">' + p.replace('style="', 'style="position:absolute;' + d + ";") + "</div>").appendTo(t);
                if (u.legend.backgroundOpacity != 0) {
                    var b = u.legend.backgroundColor;
                    b == null && (b = u.grid.backgroundColor, b && typeof b == "string" ? b = e.color.parse(b) : b = e.color.extract(y, "background-color"), b.a = 1, b = b.toString());
                    var w = y.children();
                    e('<div style="position:absolute;width:' + w.width() + "px;height:" + w.height() + "px;" + d + "background-color:" + b + ';"> </div>').prependTo(y).css("opacity", u.legend.backgroundOpacity)
                }
            }
        }

        function ht(e, t, n) {
            var r = u.grid.mouseActiveRadius, i = r * r + 1, s = null, a = !1, f, l, c;
            for (f = o.length - 1; f >= 0; --f) {
                if (!n(o[f]))continue;
                var h = o[f], p = h.xaxis, d = h.yaxis, v = h.datapoints.points, m = p.c2p(e), g = d.c2p(t), y = r / p.scale, b = r / d.scale;
                c = h.datapoints.pointsize, p.options.inverseTransform && (y = Number.MAX_VALUE), d.options.inverseTransform && (b = Number.MAX_VALUE);
                if (h.lines.show || h.points.show)for (l = 0; l < v.length; l += c) {
                    var w = v[l], E = v[l + 1];
                    if (w == null)continue;
                    if (w - m > y || w - m < -y || E - g > b || E - g < -b)continue;
                    var S = Math.abs(p.p2c(w) - e), x = Math.abs(d.p2c(E) - t), T = S * S + x * x;
                    T < i && (i = T, s = [f, l / c])
                }
                if (h.bars.show && !s) {
                    var N = h.bars.align == "left" ? 0 : -h.bars.barWidth / 2, C = N + h.bars.barWidth;
                    for (l = 0; l < v.length; l += c) {
                        var w = v[l], E = v[l + 1], k = v[l + 2];
                        if (w == null)continue;
                        if (o[f].bars.horizontal ? m <= Math.max(k, w) && m >= Math.min(k, w) && g >= E + N && g <= E + C : m >= w + N && m <= w + C && g >= Math.min(k, E) && g <= Math.max(k, E))s = [f, l / c]
                    }
                }
            }
            return s ? (f = s[0], l = s[1], c = o[f].datapoints.pointsize, {datapoint: o[f].datapoints.points.slice(l * c, (l + 1) * c), dataIndex: l, series: o[f], seriesIndex: f}) : null
        }

        function pt(e) {
            u.grid.hoverable && mt("plothover", e, function (e) {
                return e["hoverable"] != 0
            })
        }

        function dt(e) {
            u.grid.hoverable && mt("plothover", e, function (e) {
                return!1
            })
        }

        function vt(e) {
            mt("plotclick", e, function (e) {
                return e["clickable"] != 0
            })
        }

        function mt(e, n, r) {
            var i = l.offset(), s = n.pageX - i.left - v.left, o = n.pageY - i.top - v.top, a = A({left: s, top: o});
            a.pageX = n.pageX, a.pageY = n.pageY;
            var f = ht(s, o, r);
            f && (f.pageX = parseInt(f.series.xaxis.p2c(f.datapoint[0]) + i.left + v.left, 10), f.pageY = parseInt(f.series.yaxis.p2c(f.datapoint[1]) + i.top + v.top, 10));
            if (u.grid.autoHighlight) {
                for (var c = 0; c < lt.length; ++c) {
                    var h = lt[c];
                    h.auto == e && (!f || h.series != f.series || h.point[0] != f.datapoint[0] || h.point[1] != f.datapoint[1]) && wt(h.series, h.point)
                }
                f && bt(f.series, f.datapoint, e)
            }
            t.trigger(e, [a, f])
        }

        function gt() {
            var e = u.interaction.redrawOverlayInterval;
            if (e == -1) {
                yt();
                return
            }
            ct || (ct = setTimeout(yt, e))
        }

        function yt() {
            ct = null, h.save(), h.clearRect(0, 0, m, g), h.translate(v.left, v.top);
            var e, t;
            for (e = 0; e < lt.length; ++e)t = lt[e], t.series.bars.show ? xt(t.series, t.point) : St(t.series, t.point);
            h.restore(), S(w.drawOverlay, [h])
        }

        function bt(e, t, n) {
            typeof e == "number" && (e = o[e]);
            if (typeof t == "number") {
                var r = e.datapoints.pointsize;
                t = e.datapoints.points.slice(r * t, r * (t + 1))
            }
            var i = Et(e, t);
            i == -1 ? (lt.push({series: e, point: t, auto: n}), gt()) : n || (lt[i].auto = !1)
        }

        function wt(e, t) {
            e == null && t == null && (lt = [], gt()), typeof e == "number" && (e = o[e]), typeof t == "number" && (t = e.data[t]);
            var n = Et(e, t);
            n != -1 && (lt.splice(n, 1), gt())
        }

        function Et(e, t) {
            for (var n = 0; n < lt.length; ++n) {
                var r = lt[n];
                if (r.series == e && r.point[0] == t[0] && r.point[1] == t[1])return n
            }
            return-1
        }

        function St(t, n) {
            var r = n[0], i = n[1], s = t.xaxis, o = t.yaxis, u = typeof t.highlightColor == "string" ? t.highlightColor : e.color.parse(t.color).scale("a", .5).toString();
            if (r < s.min || r > s.max || i < o.min || i > o.max)return;
            var a = t.points.radius + t.points.lineWidth / 2;
            h.lineWidth = a, h.strokeStyle = u;
            var f = 1.5 * a;
            r = s.p2c(r), i = o.p2c(i), h.beginPath(), t.points.symbol == "circle" ? h.arc(r, i, f, 0, 2 * Math.PI, !1) : t.points.symbol(h, r, i, f, !1), h.closePath(), h.stroke()
        }

        function xt(t, n) {
            var r = typeof t.highlightColor == "string" ? t.highlightColor : e.color.parse(t.color).scale("a", .5).toString(), i = r, s = t.bars.align == "left" ? 0 : -t.bars.barWidth / 2;
            h.lineWidth = t.bars.lineWidth, h.strokeStyle = r, ot(n[0], n[1], n[2] || 0, s, s + t.bars.barWidth, 0, function () {
                return i
            }, t.xaxis, t.yaxis, h, t.bars.horizontal, t.bars.lineWidth)
        }

        function Tt(t, n, r, i) {
            if (typeof t == "string")return t;
            var s = c.createLinearGradient(0, r, 0, n);
            for (var o = 0, u = t.colors.length; o < u; ++o) {
                var a = t.colors[o];
                if (typeof a != "string") {
                    var f = e.color.parse(i);
                    a.brightness != null && (f = f.scale("rgb", a.brightness)), a.opacity != null && (f.a *= a.opacity), a = f.toString()
                }
                s.addColorStop(o / (u - 1), a)
            }
            return s
        }

        var o = [], u = {colors: ["#edc240", "#afd8f8", "#cb4b4b", "#4da74d", "#9440ed"], legend: {show: !0, noColumns: 1, labelFormatter: null, labelBoxBorderColor: "#ccc", container: null, position: "ne", margin: 5, backgroundColor: null, backgroundOpacity: .85, sorted: null}, xaxis: {show: null, position: "bottom", mode: null, timezone: null, font: null, color: null, tickColor: null, transform: null, inverseTransform: null, min: null, max: null, autoscaleMargin: null, ticks: null, tickFormatter: null, labelWidth: null, labelHeight: null, reserveSpace: null, tickLength: null, alignTicksWithAxis: null, tickDecimals: null, tickSize: null, minTickSize: null, monthNames: null, timeformat: null, twelveHourClock: !1}, yaxis: {autoscaleMargin: .02, position: "left"}, xaxes: [], yaxes: [], series: {points: {show: !1, radius: 3, lineWidth: 2, fill: !0, fillColor: "#ffffff", symbol: "circle"}, lines: {lineWidth: 2, fill: !1, fillColor: null, steps: !1}, bars: {show: !1, lineWidth: 2, barWidth: 1, fill: !0, fillColor: null, align: "left", horizontal: !1, zero: !0}, shadowSize: 3, highlightColor: null}, grid: {show: !0, aboveData: !1, color: "#545454", backgroundColor: null, borderColor: null, tickColor: null, margin: 0, labelMargin: 5, axisMargin: 8, borderWidth: 2, minBorderMargin: null, markings: null, markingsColor: "#f4f4f4", markingsLineWidth: 2, clickable: !1, hoverable: !1, autoHighlight: !0, mouseActiveRadius: 10}, interaction: {redrawOverlayInterval: 1e3 / 60}, hooks: {}}, a = null, f = null, l = null, c = null, h = null, p = [], d = [], v = {left: 0, right: 0, top: 0, bottom: 0}, m = 0, g = 0, y = 0, b = 0, w = {processOptions: [], processRawData: [], processDatapoints: [], processOffset: [], drawBackground: [], drawSeries: [], draw: [], bindEvents: [], drawOverlay: [], shutdown: []}, E = this;
        E.setData = N, E.setupGrid = V, E.draw = Y, E.getPlaceholder = function () {
            return t
        }, E.getCanvas = function () {
            return a
        }, E.getPlotOffset = function () {
            return v
        }, E.width = function () {
            return y
        }, E.height = function () {
            return b
        }, E.offset = function () {
            var e = l.offset();
            return e.left += v.left, e.top += v.top, e
        }, E.getData = function () {
            return o
        }, E.getAxes = function () {
            var t = {}, n;
            return e.each(p.concat(d), function (e, n) {
                n && (t[n.direction + (n.n != 1 ? n.n : "") + "axis"] = n)
            }), t
        }, E.getXAxes = function () {
            return p
        }, E.getYAxes = function () {
            return d
        }, E.c2p = A, E.p2c = O, E.getOptions = function () {
            return u
        }, E.highlight = bt, E.unhighlight = wt, E.triggerRedrawOverlay = gt, E.pointOffset = function (e) {
            return{left: parseInt(p[k(e, "x") - 1].p2c(+e.x) + v.left, 10), top: parseInt(d[k(e, "y") - 1].p2c(+e.y) + v.top, 10)}
        }, E.shutdown = q, E.resize = function () {
            B(), j(a), j(f)
        }, E.hooks = w, x(E), T(i), F(), N(r), V(), Y(), I();
        var lt = [], ct = null
    }

    function n(e, t) {
        return t * Math.floor(e / t)
    }

    e.plot = function (n, r, i) {
        var s = new t(e(n), r, i, e.plot.plugins);
        return s
    }, e.plot.version = "0.8-alpha", e.plot.plugins = []
}(jQuery), function (e) {
    function n(e, t) {
        return t * Math.floor(e / t)
    }

    function r(e, t, n, r) {
        if (typeof e.strftime == "function")return e.strftime(t);
        var i = function (e, t) {
            return e = "" + e, t = "" + (t == null ? "0" : t), e.length == 1 ? t + e : e
        }, s = [], o = !1, u = e.getHours(), a = u < 12;
        n == null && (n = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]), r == null && (r = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]);
        var f;
        u > 12 ? f = u - 12 : u == 0 ? f = 12 : f = u;
        for (var l = 0; l < t.length; ++l) {
            var c = t.charAt(l);
            if (o) {
                switch (c) {
                    case"a":
                        c = "" + r[e.getDay()];
                        break;
                    case"b":
                        c = "" + n[e.getMonth()];
                        break;
                    case"d":
                        c = i(e.getDate());
                        break;
                    case"e":
                        c = i(e.getDate(), " ");
                        break;
                    case"H":
                        c = i(u);
                        break;
                    case"I":
                        c = i(f);
                        break;
                    case"l":
                        c = i(f, " ");
                        break;
                    case"m":
                        c = i(e.getMonth() + 1);
                        break;
                    case"M":
                        c = i(e.getMinutes());
                        break;
                    case"q":
                        c = "" + (Math.floor(e.getMonth() / 3) + 1);
                        break;
                    case"S":
                        c = i(e.getSeconds());
                        break;
                    case"y":
                        c = i(e.getFullYear() % 100);
                        break;
                    case"Y":
                        c = "" + e.getFullYear();
                        break;
                    case"p":
                        c = a ? "am" : "pm";
                        break;
                    case"P":
                        c = a ? "AM" : "PM";
                        break;
                    case"w":
                        c = "" + e.getDay()
                }
                s.push(c), o = !1
            } else c == "%" ? o = !0 : s.push(c)
        }
        return s.join("")
    }

    function i(e) {
        function t(e, t, n, r) {
            e[t] = function () {
                return n[r].apply(n, arguments)
            }
        }

        var n = {date: e};
        e.strftime != undefined && t(n, "strftime", e, "strftime"), t(n, "getTime", e, "getTime"), t(n, "setTime", e, "setTime");
        var r = ["Date", "Day", "FullYear", "Hours", "Milliseconds", "Minutes", "Month", "Seconds"];
        for (var i = 0; i < r.length; i++)t(n, "get" + r[i], e, "getUTC" + r[i]), t(n, "set" + r[i], e, "setUTC" + r[i]);
        return n
    }

    function s(e, t) {
        if (t.timezone == "browser")return new Date(e);
        if (!t.timezone || t.timezone == "utc")return i(new Date(e));
        if (typeof timezoneJS != "undefined" && typeof timezoneJS.Date != "undefined") {
            var n = new timezoneJS.Date;
            return n.setTimezone(t.timezone), n.setTime(e), n
        }
        return i(new Date(e))
    }

    function l(t) {
        t.hooks.processDatapoints.push(function (t, i, u) {
            e.each(t.getAxes(), function (e, t) {
                var i = t.options;
                i.mode == "time" && (t.tickGenerator = function (e) {
                    var t = [], r = s(e.min, i), u = 0, l = i.tickSize && i.tickSize[1] === "quarter" || i.minTickSize && i.minTickSize[1] === "quarter" ? f : a;
                    i.minTickSize != null && (typeof i.tickSize == "number" ? u = i.tickSize : u = i.minTickSize[0] * o[i.minTickSize[1]]);
                    for (var c = 0; c < l.length - 1; ++c)if (e.delta < (l[c][0] * o[l[c][1]] + l[c + 1][0] * o[l[c + 1][1]]) / 2 && l[c][0] * o[l[c][1]] >= u)break;
                    var h = l[c][0], p = l[c][1];
                    if (p == "year") {
                        if (i.minTickSize != null && i.minTickSize[1] == "year")h = Math.floor(i.minTickSize[0]); else {
                            var d = Math.pow(10, Math.floor(Math.log(e.delta / o.year) / Math.LN10)), v = e.delta / o.year / d;
                            v < 1.5 ? h = 1 : v < 3 ? h = 2 : v < 7.5 ? h = 5 : h = 10, h *= d
                        }
                        h < 1 && (h = 1)
                    }
                    e.tickSize = i.tickSize || [h, p];
                    var m = e.tickSize[0];
                    p = e.tickSize[1];
                    var g = m * o[p];
                    p == "second" ? r.setSeconds(n(r.getSeconds(), m)) : p == "minute" ? r.setMinutes(n(r.getMinutes(), m)) : p == "hour" ? r.setHours(n(r.getHours(), m)) : p == "month" ? r.setMonth(n(r.getMonth(), m)) : p == "quarter" ? r.setMonth(3 * n(r.getMonth() / 3, m)) : p == "year" && r.setFullYear(n(r.getFullYear(), m)), r.setMilliseconds(0), g >= o.minute ? r.setSeconds(0) : g >= o.hour ? r.setMinutes(0) : g >= o.day ? r.setHours(0) : g >= o.day * 4 ? r.setDate(1) : g >= o.month * 2 ? r.setMonth(n(r.getMonth(), 3)) : g >= o.quarter * 2 ? r.setMonth(n(r.getMonth(), 6)) : g >= o.year && r.setMonth(0);
                    var y = 0, b = Number.NaN, w;
                    do {
                        w = b, b = r.getTime(), t.push(b);
                        if (p == "month" || p == "quarter")if (m < 1) {
                            r.setDate(1);
                            var E = r.getTime();
                            r.setMonth(r.getMonth() + (p == "quarter" ? 3 : 1));
                            var S = r.getTime();
                            r.setTime(b + y * o.hour + (S - E) * m), y = r.getHours(), r.setHours(0)
                        } else r.setMonth(r.getMonth() + m * (p == "quarter" ? 3 : 1)); else p == "year" ? r.setFullYear(r.getFullYear() + m) : r.setTime(b + g)
                    } while (b < e.max && b != w);
                    return t
                }, t.tickFormatter = function (e, t) {
                    var n = s(e, t.options);
                    if (i.timeformat != null)return r(n, i.timeformat, i.monthNames, i.dayNames);
                    var u = t.options.tickSize && t.options.tickSize[1] == "quarter" || t.options.minTickSize && t.options.minTickSize[1] == "quarter", a = t.tickSize[0] * o[t.tickSize[1]], f = t.max - t.min, l = i.twelveHourClock ? " %p" : "", c = i.twelveHourClock ? "%I" : "%H", h;
                    a < o.minute ? h = c + ":%M:%S" + l : a < o.day ? f < 2 * o.day ? h = c + ":%M" + l : h = "%b %d " + c + ":%M" + l : a < o.month ? h = "%b %d" : u && a < o.quarter || !u && a < o.year ? f < o.year ? h = "%b" : h = "%b %Y" : u && a < o.year ? f < o.year ? h = "Q%q" : h = "Q%q %Y" : h = "%Y";
                    var p = r(n, h, i.monthNames, i.dayNames);
                    return p
                })
            })
        })
    }

    var t = {}, o = {second: 1e3, minute: 6e4, hour: 36e5, day: 864e5, month: 2592e6, quarter: 7776e6, year: 525949.2 * 60 * 1e3}, u = [
        [1, "second"],
        [2, "second"],
        [5, "second"],
        [10, "second"],
        [30, "second"],
        [1, "minute"],
        [2, "minute"],
        [5, "minute"],
        [10, "minute"],
        [30, "minute"],
        [1, "hour"],
        [2, "hour"],
        [4, "hour"],
        [8, "hour"],
        [12, "hour"],
        [1, "day"],
        [2, "day"],
        [3, "day"],
        [.25, "month"],
        [.5, "month"],
        [1, "month"],
        [2, "month"]
    ], a = u.concat([
        [3, "month"],
        [6, "month"],
        [1, "year"]
    ]), f = u.concat([
        [1, "quarter"],
        [2, "quarter"],
        [1, "year"]
    ]);
    e.plot.plugins.push({init: l, options: t, name: "time", version: "1.0"}), e.plot.formatDate = r
}(jQuery), function (e) {
    var t = {tooltip: !1, tooltipOpts: {content: "%s | X: %x | Y: %y", xDateFormat: null, yDateFormat: null, shifts: {x: 10, y: 20}, defaultTheme: !0, onHover: function (e, t) {
    }}}, n = function (e) {
        this.tipPosition = {x: 0, y: 0}, this.init(e)
    };
    n.prototype.init = function (t) {
        var n = this;
        t.hooks.bindEvents.push(function (t, r) {
            n.plotOptions = t.getOptions();
            if (n.plotOptions.tooltip === !1 || typeof n.plotOptions.tooltip == "undefined")return;
            n.tooltipOptions = n.plotOptions.tooltipOpts;
            var i = n.getDomElement();
            e(t.getPlaceholder()).bind("plothover", function (e, t, r) {
                if (r) {
                    var s;
                    s = n.stringFormat(n.tooltipOptions.content, r), i.html(s).css({left: n.tipPosition.x + n.tooltipOptions.shifts.x, top: n.tipPosition.y + n.tooltipOptions.shifts.y}).show(), typeof n.tooltipOptions.onHover == "function" && n.tooltipOptions.onHover(r, i)
                } else i.hide().html("")
            }), r.mousemove(function (e) {
                var t = {};
                t.x = e.pageX, t.y = e.pageY, n.updateTooltipPosition(t)
            })
        })
    }, n.prototype.getDomElement = function () {
        var t;
        return e("#flotTip").length > 0 ? t = e("#flotTip") : (t = e("<div />").attr("id", "flotTip"), t.appendTo("body").hide().css({position: "absolute"}), this.tooltipOptions.defaultTheme && t.css({background: "#fff", "z-index": "100", padding: "0.4em 0.6em", "border-radius": "0.5em", "font-size": "0.8em", border: "1px solid #111"})), t
    }, n.prototype.updateTooltipPosition = function (e) {
        this.tipPosition.x = e.x, this.tipPosition.y = e.y
    }, n.prototype.stringFormat = function (e, t) {
        var n = /%p\.{0,1}(\d{0,})/, r = /%s/, i = /%x\.{0,1}(\d{0,})/, s = /%y\.{0,1}(\d{0,})/;
        return typeof e == "function" && (e = e(t.series.data[t.dataIndex][0], t.series.data[t.dataIndex][1])), typeof t.series.percent != "undefined" && (e = this.adjustValPrecision(n, e, t.series.percent)), typeof t.series.label != "undefined" && (e = e.replace(r, t.series.label)), this.isTimeMode("xaxis", t) && this.isXDateFormat(t) && (e = e.replace(i, this.timestampToDate(t.series.data[t.dataIndex][0], this.tooltipOptions.xDateFormat))), this.isTimeMode("yaxis", t) && this.isYDateFormat(t) && (e = e.replace(s, this.timestampToDate(t.series.data[t.dataIndex][1], this.tooltipOptions.yDateFormat))), typeof t.series.data[t.dataIndex][0] == "number" && (e = this.adjustValPrecision(i, e, t.series.data[t.dataIndex][0])), typeof t.series.data[t.dataIndex][1] == "number" && (e = this.adjustValPrecision(s, e, t.series.data[t.dataIndex][1])), typeof t.series.xaxis.tickFormatter != "undefined" && (e = e.replace(i, t.series.xaxis.tickFormatter(t.series.data[t.dataIndex][0], t.series.xaxis))), typeof t.series.yaxis.tickFormatter != "undefined" && (e = e.replace(s, t.series.yaxis.tickFormatter(t.series.data[t.dataIndex][1], t.series.yaxis))), e
    }, n.prototype.isTimeMode = function (e, t) {
        return typeof t.series[e].options.mode != "undefined" && t.series[e].options.mode === "time"
    }, n.prototype.isXDateFormat = function (e) {
        return typeof this.tooltipOptions.xDateFormat != "undefined" && this.tooltipOptions.xDateFormat !== null
    }, n.prototype.isYDateFormat = function (e) {
        return typeof this.tooltipOptions.yDateFormat != "undefined" && this.tooltipOptions.yDateFormat !== null
    }, n.prototype.timestampToDate = function (t, n) {
        var r = new Date(t);
        return e.plot.formatDate(r, n)
    }, n.prototype.adjustValPrecision = function (e, t, n) {
        var r;
        return t.match(e) !== null && RegExp.$1 !== "" && (r = RegExp.$1, n = n.toFixed(r), t = t.replace(e, n)), t
    };
    var r = [], i = function (e) {
        r.push(new n(e))
    };
    e.plot.plugins.push({init: i, options: t, name: "tooltip", version: "0.6"})
}(jQuery), function (e) {
    "use strict";
    function n(t) {
        var n = t.data;
        t.isDefaultPrevented() || (t.preventDefault(), e(this).ajaxSubmit(n))
    }

    function r(t) {
        var n = t.target, r = e(n);
        if (!r.is(":submit,input:image")) {
            var i = r.closest(":submit");
            if (i.length === 0)return;
            n = i[0]
        }
        var s = this;
        s.clk = n;
        if (n.type == "image")if (t.offsetX !== undefined)s.clk_x = t.offsetX, s.clk_y = t.offsetY; else if (typeof e.fn.offset == "function") {
            var o = r.offset();
            s.clk_x = t.pageX - o.left, s.clk_y = t.pageY - o.top
        } else s.clk_x = t.pageX - n.offsetLeft, s.clk_y = t.pageY - n.offsetTop;
        setTimeout(function () {
            s.clk = s.clk_x = s.clk_y = null
        }, 100)
    }

    function i() {
        if (!e.fn.ajaxSubmit.debug)return;
        var t = "[jquery.form] " + Array.prototype.join.call(arguments, "");
        window.console && window.console.log ? window.console.log(t) : window.opera && window.opera.postError && window.opera.postError(t)
    }

    var t = {};
    t.fileapi = e("<input type='file'/>").get(0).files !== undefined, t.formdata = window.FormData !== undefined, e.fn.ajaxSubmit = function (n) {
        function x(t) {
            var n = e.param(t).split("&"), r = n.length, i = {}, s, o;
            for (s = 0; s < r; s++)o = n[s].split("="), i[decodeURIComponent(o[0])] = decodeURIComponent(o[1]);
            return i
        }

        function T(t) {
            var r = new FormData;
            for (var i = 0; i < t.length; i++)r.append(t[i].name, t[i].value);
            if (n.extraData) {
                var s = x(n.extraData);
                for (var o in s)s.hasOwnProperty(o) && r.append(o, s[o])
            }
            n.data = null;
            var u = e.extend(!0, {}, e.ajaxSettings, n, {contentType: !1, processData: !1, cache: !1, type: "POST"});
            n.uploadProgress && (u.xhr = function () {
                var e = jQuery.ajaxSettings.xhr();
                return e.upload && (e.upload.onprogress = function (e) {
                    var t = 0, r = e.loaded || e.position, i = e.total;
                    e.lengthComputable && (t = Math.ceil(r / i * 100)), n.uploadProgress(e, r, i, t)
                }), e
            }), u.data = null;
            var a = u.beforeSend;
            u.beforeSend = function (e, t) {
                t.data = r, a && a.call(this, e, t)
            }, e.ajax(u)
        }

        function N(t) {
            function x(e) {
                var t = e.contentWindow ? e.contentWindow.document : e.contentDocument ? e.contentDocument : e.document;
                return t
            }

            function C() {
                function o() {
                    try {
                        var e = x(d).readyState;
                        i("state = " + e), e && e.toLowerCase() == "uninitialized" && setTimeout(o, 50)
                    } catch (t) {
                        i("Server abort: ", t, " (", t.name, ")"), M(S), b && clearTimeout(b), b = undefined
                    }
                }

                var t = u.attr("target"), n = u.attr("action");
                s.setAttribute("target", h), r || s.setAttribute("method", "POST"), n != f.url && s.setAttribute("action", f.url), !f.skipEncodingOverride && (!r || /post/i.test(r)) && u.attr({encoding: "multipart/form-data", enctype: "multipart/form-data"}), f.timeout && (b = setTimeout(function () {
                    y = !0, M(E)
                }, f.timeout));
                var a = [];
                try {
                    if (f.extraData)for (var l in f.extraData)f.extraData.hasOwnProperty(l) && (e.isPlainObject(f.extraData[l]) && f.extraData[l].hasOwnProperty("name") && f.extraData[l].hasOwnProperty("value") ? a.push(e('<input type="hidden" name="' + f.extraData[l].name + '">').attr("value", f.extraData[l].value).appendTo(s)[0]) : a.push(e('<input type="hidden" name="' + l + '">').attr("value", f.extraData[l]).appendTo(s)[0]));
                    f.iframeTarget || (p.appendTo("body"), d.attachEvent ? d.attachEvent("onload", M) : d.addEventListener("load", M, !1)), setTimeout(o, 15), s.submit()
                } finally {
                    s.setAttribute("action", n), t ? s.setAttribute("target", t) : u.removeAttr("target"), e(a).remove()
                }
            }

            function M(t) {
                if (v.aborted || O)return;
                try {
                    L = x(d)
                } catch (n) {
                    i("cannot access response document: ", n), t = S
                }
                if (t === E && v) {
                    v.abort("timeout");
                    return
                }
                if (t == S && v) {
                    v.abort("server abort");
                    return
                }
                if (!L || L.location.href == f.iframeSrc)if (!y)return;
                d.detachEvent ? d.detachEvent("onload", M) : d.removeEventListener("load", M, !1);
                var r = "success", s;
                try {
                    if (y)throw"timeout";
                    var o = f.dataType == "xml" || L.XMLDocument || e.isXMLDoc(L);
                    i("isXml=" + o);
                    if (!o && window.opera && (L.body === null || !L.body.innerHTML) && --A) {
                        i("requeing onLoad callback, DOM not available"), setTimeout(M, 250);
                        return
                    }
                    var u = L.body ? L.body : L.documentElement;
                    v.responseText = u ? u.innerHTML : null, v.responseXML = L.XMLDocument ? L.XMLDocument : L, o && (f.dataType = "xml"), v.getResponseHeader = function (e) {
                        var t = {"content-type": f.dataType};
                        return t[e]
                    }, u && (v.status = Number(u.getAttribute("status")) || v.status, v.statusText = u.getAttribute("statusText") || v.statusText);
                    var a = (f.dataType || "").toLowerCase(), l = /(json|script|text)/.test(a);
                    if (l || f.textarea) {
                        var h = L.getElementsByTagName("textarea")[0];
                        if (h)v.responseText = h.value, v.status = Number(h.getAttribute("status")) || v.status, v.statusText = h.getAttribute("statusText") || v.statusText; else if (l) {
                            var m = L.getElementsByTagName("pre")[0], g = L.getElementsByTagName("body")[0];
                            m ? v.responseText = m.textContent ? m.textContent : m.innerText : g && (v.responseText = g.textContent ? g.textContent : g.innerText)
                        }
                    } else a == "xml" && !v.responseXML && v.responseText && (v.responseXML = _(v.responseText));
                    try {
                        k = P(v, a, f)
                    } catch (t) {
                        r = "parsererror", v.error = s = t || r
                    }
                } catch (t) {
                    i("error caught: ", t), r = "error", v.error = s = t || r
                }
                v.aborted && (i("upload aborted"), r = null), v.status && (r = v.status >= 200 && v.status < 300 || v.status === 304 ? "success" : "error"), r === "success" ? (f.success && f.success.call(f.context, k, "success", v), c && e.event.trigger("ajaxSuccess", [v, f])) : r && (s === undefined && (s = v.statusText), f.error && f.error.call(f.context, v, r, s), c && e.event.trigger("ajaxError", [v, f, s])), c && e.event.trigger("ajaxComplete", [v, f]), c && !--e.active && e.event.trigger("ajaxStop"), f.complete && f.complete.call(f.context, v, r), O = !0, f.timeout && clearTimeout(b), setTimeout(function () {
                    f.iframeTarget || p.remove(), v.responseXML = null
                }, 100)
            }

            var s = u[0], o, a, f, c, h, p, d, v, m, g, y, b, w = !!e.fn.prop;
            if (e(":input[name=submit],:input[id=submit]", s).length) {
                alert('Error: Form elements must not have name or id of "submit".');
                return
            }
            if (t)for (a = 0; a < l.length; a++)o = e(l[a]), w ? o.prop("disabled", !1) : o.removeAttr("disabled");
            f = e.extend(!0, {}, e.ajaxSettings, n), f.context = f.context || f, h = "jqFormIO" + (new Date).getTime(), f.iframeTarget ? (p = e(f.iframeTarget), g = p.attr("name"), g ? h = g : p.attr("name", h)) : (p = e('<iframe name="' + h + '" src="' + f.iframeSrc + '" />'), p.css({position: "absolute", top: "-1000px", left: "-1000px"})), d = p[0], v = {aborted: 0, responseText: null, responseXML: null, status: 0, statusText: "n/a", getAllResponseHeaders: function () {
            }, getResponseHeader: function () {
            }, setRequestHeader: function () {
            }, abort: function (t) {
                var n = t === "timeout" ? "timeout" : "aborted";
                i("aborting upload... " + n), this.aborted = 1;
                if (d.contentWindow.document.execCommand)try {
                    d.contentWindow.document.execCommand("Stop")
                } catch (r) {
                }
                p.attr("src", f.iframeSrc), v.error = n, f.error && f.error.call(f.context, v, n, t), c && e.event.trigger("ajaxError", [v, f, n]), f.complete && f.complete.call(f.context, v, n)
            }}, c = f.global, c && 0 === e.active++ && e.event.trigger("ajaxStart"), c && e.event.trigger("ajaxSend", [v, f]);
            if (f.beforeSend && f.beforeSend.call(f.context, v, f) === !1) {
                f.global && e.active--;
                return
            }
            if (v.aborted)return;
            m = s.clk, m && (g = m.name, g && !m.disabled && (f.extraData = f.extraData || {}, f.extraData[g] = m.value, m.type == "image" && (f.extraData[g + ".x"] = s.clk_x, f.extraData[g + ".y"] = s.clk_y)));
            var E = 1, S = 2, T = e("meta[name=csrf-token]").attr("content"), N = e("meta[name=csrf-param]").attr("content");
            N && T && (f.extraData = f.extraData || {}, f.extraData[N] = T), f.forceSync ? C() : setTimeout(C, 10);
            var k, L, A = 50, O, _ = e.parseXML || function (e, t) {
                return window.ActiveXObject ? (t = new ActiveXObject("Microsoft.XMLDOM"), t.async = "false", t.loadXML(e)) : t = (new DOMParser).parseFromString(e, "text/xml"), t && t.documentElement && t.documentElement.nodeName != "parsererror" ? t : null
            }, D = e.parseJSON || function (e) {
                return window.eval("(" + e + ")")
            }, P = function (t, n, r) {
                var i = t.getResponseHeader("content-type") || "", s = n === "xml" || !n && i.indexOf("xml") >= 0, o = s ? t.responseXML : t.responseText;
                return s && o.documentElement.nodeName === "parsererror" && e.error && e.error("parsererror"), r && r.dataFilter && (o = r.dataFilter(o, n)), typeof o == "string" && (n === "json" || !n && i.indexOf("json") >= 0 ? o = D(o) : (n === "script" || !n && i.indexOf("javascript") >= 0) && e.globalEval(o)), o
            }
        }

        if (!this.length)return i("ajaxSubmit: skipping submit process - no element selected"), this;
        var r, s, o, u = this;
        typeof n == "function" && (n = {success: n}), r = this.attr("method"), s = this.attr("action"), o = typeof s == "string" ? e.trim(s) : "", o = o || window.location.href || "", o && (o = (o.match(/^([^#]+)/) || [])[1]), n = e.extend(!0, {url: o, success: e.ajaxSettings.success, type: r || "GET", iframeSrc: /^https/i.test(window.location.href || "") ? "javascript:false" : "about:blank"}, n);
        var a = {};
        this.trigger("form-pre-serialize", [this, n, a]);
        if (a.veto)return i("ajaxSubmit: submit vetoed via form-pre-serialize trigger"), this;
        if (n.beforeSerialize && n.beforeSerialize(this, n) === !1)return i("ajaxSubmit: submit aborted via beforeSerialize callback"), this;
        var f = n.traditional;
        f === undefined && (f = e.ajaxSettings.traditional);
        var l = [], c, h = this.formToArray(n.semantic, l);
        n.data && (n.extraData = n.data, c = e.param(n.data, f));
        if (n.beforeSubmit && n.beforeSubmit(h, this, n) === !1)return i("ajaxSubmit: submit aborted via beforeSubmit callback"), this;
        this.trigger("form-submit-validate", [h, this, n, a]);
        if (a.veto)return i("ajaxSubmit: submit vetoed via form-submit-validate trigger"), this;
        var p = e.param(h, f);
        c && (p = p ? p + "&" + c : c), n.type.toUpperCase() == "GET" ? (n.url += (n.url.indexOf("?") >= 0 ? "&" : "?") + p, n.data = null) : n.data = p;
        var d = [];
        n.resetForm && d.push(function () {
            u.resetForm()
        }), n.clearForm && d.push(function () {
            u.clearForm(n.includeHidden)
        });
        if (!n.dataType && n.target) {
            var v = n.success || function () {
            };
            d.push(function (t) {
                var r = n.replaceTarget ? "replaceWith" : "html";
                e(n.target)[r](t).each(v, arguments)
            })
        } else n.success && d.push(n.success);
        n.success = function (e, t, r) {
            var i = n.context || this;
            for (var s = 0, o = d.length; s < o; s++)d[s].apply(i, [e, t, r || u, u])
        };
        var m = e("input:file:enabled[value]", this), g = m.length > 0, y = "multipart/form-data", b = u.attr("enctype") == y || u.attr("encoding") == y, w = t.fileapi && t.formdata;
        i("fileAPI :" + w);
        var E = (g || b) && !w;
        n.iframe !== !1 && (n.iframe || E) ? n.closeKeepAlive ? e.get(n.closeKeepAlive, function () {
            N(h)
        }) : N(h) : (g || b) && w ? T(h) : e.ajax(n);
        for (var S = 0; S < l.length; S++)l[S] = null;
        return this.trigger("form-submit-notify", [this, n]), this
    }, e.fn.ajaxForm = function (t) {
        t = t || {}, t.delegation = t.delegation && e.isFunction(e.fn.on);
        if (!t.delegation && this.length === 0) {
            var s = {s: this.selector, c: this.context};
            return!e.isReady && s.s ? (i("DOM not ready, queuing ajaxForm"), e(function () {
                e(s.s, s.c).ajaxForm(t)
            }), this) : (i("terminating; zero elements found by selector" + (e.isReady ? "" : " (DOM not ready)")), this)
        }
        return t.delegation ? (e(document).off("submit.form-plugin", this.selector, n).off("click.form-plugin", this.selector, r).on("submit.form-plugin", this.selector, t, n).on("click.form-plugin", this.selector, t, r), this) : this.ajaxFormUnbind().bind("submit.form-plugin", t, n).bind("click.form-plugin", t, r)
    }, e.fn.ajaxFormUnbind = function () {
        return this.unbind("submit.form-plugin click.form-plugin")
    }, e.fn.formToArray = function (n, r) {
        var i = [];
        if (this.length === 0)return i;
        var s = this[0], o = n ? s.getElementsByTagName("*") : s.elements;
        if (!o)return i;
        var u, a, f, l, c, h, p;
        for (u = 0, h = o.length; u < h; u++) {
            c = o[u], f = c.name;
            if (!f)continue;
            if (n && s.clk && c.type == "image") {
                !c.disabled && s.clk == c && (i.push({name: f, value: e(c).val(), type: c.type}), i.push({name: f + ".x", value: s.clk_x}, {name: f + ".y", value: s.clk_y}));
                continue
            }
            l = e.fieldValue(c, !0);
            if (l && l.constructor == Array) {
                r && r.push(c);
                for (a = 0, p = l.length; a < p; a++)i.push({name: f, value: l[a]})
            } else if (t.fileapi && c.type == "file" && !c.disabled) {
                r && r.push(c);
                var d = c.files;
                if (d.length)for (a = 0; a < d.length; a++)i.push({name: f, value: d[a], type: c.type}); else i.push({name: f, value: "", type: c.type})
            } else l !== null && typeof l != "undefined" && (r && r.push(c), i.push({name: f, value: l, type: c.type, required: c.required}))
        }
        if (!n && s.clk) {
            var v = e(s.clk), m = v[0];
            f = m.name, f && !m.disabled && m.type == "image" && (i.push({name: f, value: v.val()}), i.push({name: f + ".x", value: s.clk_x}, {name: f + ".y", value: s.clk_y}))
        }
        return i
    }, e.fn.formSerialize = function (t) {
        return e.param(this.formToArray(t))
    }, e.fn.fieldSerialize = function (t) {
        var n = [];
        return this.each(function () {
            var r = this.name;
            if (!r)return;
            var i = e.fieldValue(this, t);
            if (i && i.constructor == Array)for (var s = 0, o = i.length; s < o; s++)n.push({name: r, value: i[s]}); else i !== null && typeof i != "undefined" && n.push({name: this.name, value: i})
        }), e.param(n)
    }, e.fn.fieldValue = function (t) {
        for (var n = [], r = 0, i = this.length; r < i; r++) {
            var s = this[r], o = e.fieldValue(s, t);
            if (o === null || typeof o == "undefined" || o.constructor == Array && !o.length)continue;
            o.constructor == Array ? e.merge(n, o) : n.push(o)
        }
        return n
    }, e.fieldValue = function (t, n) {
        var r = t.name, i = t.type, s = t.tagName.toLowerCase();
        n === undefined && (n = !0);
        if (n && (!r || t.disabled || i == "reset" || i == "button" || (i == "checkbox" || i == "radio") && !t.checked || (i == "submit" || i == "image") && t.form && t.form.clk != t || s == "select" && t.selectedIndex == -1))return null;
        if (s == "select") {
            var o = t.selectedIndex;
            if (o < 0)return null;
            var u = [], a = t.options, f = i == "select-one", l = f ? o + 1 : a.length;
            for (var c = f ? o : 0; c < l; c++) {
                var h = a[c];
                if (h.selected) {
                    var p = h.value;
                    p || (p = h.attributes && h.attributes.value && !h.attributes.value.specified ? h.text : h.value);
                    if (f)return p;
                    u.push(p)
                }
            }
            return u
        }
        return e(t).val()
    }, e.fn.clearForm = function (t) {
        return this.each(function () {
            e("input,select,textarea", this).clearFields(t)
        })
    }, e.fn.clearFields = e.fn.clearInputs = function (t) {
        var n = /^(?:color|date|datetime|email|month|number|password|range|search|tel|text|time|url|week)$/i;
        return this.each(function () {
            var r = this.type, i = this.tagName.toLowerCase();
            n.test(r) || i == "textarea" ? this.value = "" : r == "checkbox" || r == "radio" ? this.checked = !1 : i == "select" ? this.selectedIndex = -1 : t && (t === !0 && /hidden/.test(r) || typeof t == "string" && e(this).is(t)) && (this.value = "")
        })
    }, e.fn.resetForm = function () {
        return this.each(function () {
            (typeof this.reset == "function" || typeof this.reset == "object" && !this.reset.nodeType) && this.reset()
        })
    }, e.fn.enable = function (e) {
        return e === undefined && (e = !0), this.each(function () {
            this.disabled = !e
        })
    }, e.fn.selected = function (t) {
        return t === undefined && (t = !0), this.each(function () {
            var n = this.type;
            if (n == "checkbox" || n == "radio")this.checked = t; else if (this.tagName.toLowerCase() == "option") {
                var r = e(this).parent("select");
                t && r[0] && r[0].type == "select-one" && r.find("option").selected(!1), this.selected = t
            }
        })
    }, e.fn.ajaxSubmit.debug = !1
}(jQuery), $.fn.multiSelect = function (e) {
    var t = {multiselect: !0, selected: "selected", filter: " > *", unselectOn: !1, keepSelection: !0, list: $(this).selector, e: null, element: null, start: !1, stop: !1, unselecting: !1};
    return this.each(function (n, r) {
        var i = $.extend({}, t, e || {});
        $(document).on("mousedown", i.list + i.filter, function (e) {
            return e.which == 1 && (i.handle != undefined && !$(e.target).is(i.handle), i.e = e, i.element = $(this), multiSelect(i)), !0
        }), i.unselectOn && $(document).on("mousedown", i.unselectOn, function (e) {
            !$(e.target).parents().is(i.list) && e.which != 3 && ($(i.list + " ." + i.selected).removeClass(i.selected), i.unselecting != 0 && i.unselecting())
        })
    })
}, function () {
    var e, t, n, r, i, s = function (e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    };
    e = jQuery, t = function () {
        function e(e) {
            this.minLength = e, this.value = "", this.lastValue = "", this.emptyValues = []
        }

        return e.prototype.getValue = function () {
            return this.value
        }, e.prototype.setValue = function (e) {
            return this.lastValue = this.value, this.value = e
        }, e.prototype.hasChanged = function () {
            return this.value !== this.lastValue
        }, e.prototype.markEmpty = function () {
            return this.emptyValues.push(this.value)
        }, e.prototype.willHaveResults = function () {
            return this._isValid() && !this._isEmpty()
        }, e.prototype._isValid = function () {
            return this.value.length >= this.minLength
        }, e.prototype._isEmpty = function () {
            var e, t, n, r;
            r = this.emptyValues;
            for (t = 0, n = r.length; t < n; t++) {
                e = r[t];
                if (this.value.slice(0, e.length) === e)return!0
            }
            return!1
        }, e
    }(), r = function () {
        function t(e, t, n, r) {
            this.term = t, this.data = n, this.type = r, this.id = "" + e + "-soulmate-suggestion", this.index = e
        }

        return t.prototype.select = function (e) {
            return e(this.term, this.data, this.type, this.index, this.id)
        }, t.prototype.focus = function () {
            return this.element().addClass("focus")
        }, t.prototype.blur = function () {
            return this.element().removeClass("focus")
        }, t.prototype.render = function (e) {
            return'<li id="' + this.id + '" class="soulmate-suggestion">\n  ' + e(this.term, this.data, this.type, this.index, this.id) + "\n</li>"
        }, t.prototype.element = function () {
            return e("#" + this.id)
        }, t
    }(), i = function () {
        function t(e, t) {
            this.renderCallback = e, this.selectCallback = t, this.focusedIndex = -1, this.suggestions = []
        }

        return t.prototype.update = function (e) {
            var t, n, i, s, o;
            this.suggestions = [], t = 0, o = [];
            for (i in e)s = e[i], o.push(function () {
                var e, o, u;
                u = [];
                for (e = 0, o = s.length; e < o; e++)n = s[e], this.suggestions.push(new r(t, n.term, n.data, i)), u.push(t += 1);
                return u
            }.call(this));
            return o
        }, t.prototype.blurAll = function () {
            var e, t, n, r, i;
            this.focusedIndex = -1, r = this.suggestions, i = [];
            for (t = 0, n = r.length; t < n; t++)e = r[t], i.push(e.blur());
            return i
        }, t.prototype.render = function () {
            var e, t, n, r, i, s;
            return e = "", this.suggestions.length && (n = null, s = this.suggestions, e = this._renderSuggestion(this.suggestions)), e
        }, t.prototype.count = function () {
            return this.suggestions.length
        }, t.prototype.focus = function (e) {
            if (e < this.count())return this.blurAll(), e < 0 ? this.focusedIndex = -1 : (this.suggestions[e].focus(), this.focusedIndex = e)
        }, t.prototype.focusElement = function (t) {
            var n;
            return n = parseInt(e(t).attr("id")), this.focus(n)
        }, t.prototype.focusNext = function () {
            return this.focus(this.focusedIndex + 1)
        }, t.prototype.focusPrevious = function () {
            return this.focus(this.focusedIndex - 1)
        }, t.prototype.selectFocused = function () {
            if (this.focusedIndex >= 0)return this.suggestions[this.focusedIndex].select(this.selectCallback)
        }, t.prototype.allBlured = function () {
            return this.focusedIndex === -1
        }, t.prototype._renderTypeStart = function (e) {
            return'<li class="soulmate-type-container">\n  <ul class="soulmate-type-suggestions"> <li class="soulmate-type ' + e + ' ">&nbsp;</li>\n'
        }, t.prototype._renderTypeEnd = function (e) {
            return"  </ul>\n </li>"
        }, t.prototype._renderSuggestion = function (e) {
            return this.renderCallback(e)
        }, t
    }(), n = function () {
        function r(n, r) {
            var o, u, a, f, l, c, h, p;
            this.input = n, this.handleKeyup = s(this.handleKeyup, this), this.handleKeydown = s(this.handleKeydown, this), l = this, p = r.url, h = r.types, a = r.renderCallback, f = r.selectCallback, o = r.maxResults, u = r.minQueryLength, c = r.timeout, beforeSend = r.beforeSend, container_class = r.container_class, this.url = p, this.types = h, this.maxResults = o, this.timeout = c || 500, this.xhr =
                null, this.suggestions = new i(a, f), this.query = new t(u), this.beforeSend = beforeSend, this.container_class = container_class, e("ul." + container_class).length > 0 ? this.container = e("ul." + container_class) : this.container = e('<ul class="soulmate ' + container_class + '">').insertAfter(this.input), this.container.delegate(".soulmate-suggestion", {mouseover: function () {
                return l.suggestions.focusElement(this)
            }, click: function (e) {
                return e.preventDefault(), l.suggestions.selectFocused(), l.input.focus()
            }}), this.input.keydown(this.handleKeydown).keyup(this.handleKeyup).mouseover(function () {
                return l.suggestions.blurAll()
            })
        }

        var n;
        return n = {9: "tab", 13: "enter", 27: "escape", 38: "up", 40: "down"}, r.prototype.handleKeydown = function (e) {
            var t;
            t = !0;
            switch (n[e.keyCode]) {
                case"escape":
                    this.hideContainer();
                    break;
                case"tab":
                    this.suggestions.selectFocused();
                    break;
                case"enter":
                    this.suggestions.selectFocused(), this.suggestions.allBlured() && (t = !1);
                    break;
                case"up":
                    this.suggestions.focusPrevious();
                    break;
                case"down":
                    this.suggestions.focusNext();
                    break;
                default:
                    t = !1
            }
            if (t)return e.stopImmediatePropagation(), e.preventDefault()
        }, r.prototype.handleKeyup = function (e) {
            this.query.setValue(this.input.val());
            if (this.query.hasChanged())return this.query.willHaveResults() ? (this.suggestions.blurAll(), this.fetchResults()) : this.hideContainer()
        }, r.prototype.hideContainer = function () {
            return this.suggestions.blurAll(), this.container.hide(), e(document).unbind("click.soulmate")
        }, r.prototype.showContainer = function () {
            var t = this;
            return this.container.show(), e(document).bind("click.soulmate", function (n) {
                if (!t.container.has(e(n.target)).length)return t.hideContainer()
            })
        }, r.prototype.fetchResults = function () {
            var t = this;
            return this.xhr != null && this.xhr.abort(), this.xhr = e.ajax({url: this.url, dataType: "jsonp", timeout: this.timeout, beforeSend: function () {
                t.input.addClass("loading"), typeof t.beforeSend != "undefined" && t.beforeSend()
            }, cache: !0, data: {term: this.query.getValue(), types: this.types, limit: this.maxResults}, success: function (n) {
                t.input.removeClass("loading"), t.update(n.results), e(".soulmate-suggestion").attr("unselectable", "on").css("user-select", "none").on("selectstart", !1);
                return
            }})
        }, r.prototype.update = function (t) {
            return this.suggestions.update(t), this.suggestions.count() > 0 ? (this.container.html(e(this.suggestions.render())), this.showContainer()) : (this.query.markEmpty(), this.hideContainer())
        }, r
    }(), e.fn.soulmate = function (t) {
        return new n(e(this), t), e(this)
    }, window._test = {Query: t, Suggestion: r, SuggestionCollection: i, Soulmate: n}
}.call(this), function (e) {
    e.extend(e.fn, {validate: function (t) {
        if (!this.length) {
            t && t.debug && window.console && console.warn("nothing selected, can't validate, returning nothing");
            return
        }
        var n = e.data(this[0], "validator");
        if (n)return n;
        this.attr("novalidate", "novalidate"), n = new e.validator(t, this[0]), e.data(this[0], "validator", n);
        if (n.settings.onsubmit) {
            var r = this.find("input, button");
            r.filter(".cancel").click(function () {
                n.cancelSubmit = !0
            }), n.settings.submitHandler && r.filter(":submit").click(function () {
                n.submitButton = this
            }), this.submit(function (t) {
                function r() {
                    if (n.settings.submitHandler) {
                        if (n.submitButton)var t = e("<input type='hidden'/>").attr("name", n.submitButton.name).val(n.submitButton.value).appendTo(n.currentForm);
                        return n.settings.submitHandler.call(n, n.currentForm), n.submitButton && t.remove(), !1
                    }
                    return!0
                }

                return n.settings.debug && t.preventDefault(), n.cancelSubmit ? (n.cancelSubmit = !1, r()) : n.form() ? n.pendingRequest ? (n.formSubmitted = !0, !1) : r() : (n.settings.userCustomFocusInvalid ? n.settings.customFocusInvalid(n.errorList) : n.focusInvalid(), !1)
            })
        }
        return n
    }, valid: function () {
        if (e(this[0]).is("form"))return this.validate().form();
        var t = !0, n = e(this[0].form).validate();
        return this.each(function () {
            t &= n.element(this)
        }), t
    }, removeAttrs: function (t) {
        var n = {}, r = this;
        return e.each(t.split(/\s/), function (e, t) {
            n[t] = r.attr(t), r.removeAttr(t)
        }), n
    }, rules: function (t, n) {
        var r = this[0];
        if (t) {
            var i = e.data(r.form, "validator").settings, s = i.rules, o = e.validator.staticRules(r);
            switch (t) {
                case"add":
                    e.extend(o, e.validator.normalizeRule(n)), s[r.name] = o, n.messages && (i.messages[r.name] = e.extend(i.messages[r.name], n.messages));
                    break;
                case"remove":
                    if (!n)return delete s[r.name], o;
                    var u = {};
                    return e.each(n.split(/\s/), function (e, t) {
                        u[t] = o[t], delete o[t]
                    }), u
            }
        }
        var a = e.validator.normalizeRules(e.extend({}, e.validator.metadataRules(r), e.validator.classRules(r), e.validator.attributeRules(r), e.validator.staticRules(r)), r);
        if (a.required) {
            var f = a.required;
            delete a.required, a = e.extend({required: f}, a)
        }
        return a
    }}), e.extend(e.expr[":"], {blank: function (t) {
        return!e.trim("" + t.value)
    }, filled: function (t) {
        return!!e.trim("" + t.value)
    }, unchecked: function (e) {
        return!e.checked
    }}), e.validator = function (t, n) {
        this.settings = e.extend(!0, {}, e.validator.defaults, t), this.currentForm = n, this.init()
    }, e.validator.format = function (t, n) {
        return arguments.length == 1 ? function () {
            var n = e.makeArray(arguments);
            return n.unshift(t), e.validator.format.apply(this, n)
        } : (arguments.length > 2 && n.constructor != Array && (n = e.makeArray(arguments).slice(1)), n.constructor != Array && (n = [n]), e.each(n, function (e, n) {
            t = t.replace(new RegExp("\\{" + e + "\\}", "g"), n)
        }), t)
    }, e.extend(e.validator, {defaults: {messages: {}, groups: {}, rules: {}, errorClass: "error", validClass: "valid", errorElement: "label", focusInvalid: !0, errorContainer: e([]), errorLabelContainer: e([]), onsubmit: !0, ignore: ":hidden", ignoreTitle: !1, userCustomFocusInvalid: !1, customFocusInvalid: function (e) {
    }, onfocusin: function (e, t) {
        this.lastActive = e, this.settings.focusCleanup && !this.blockFocusCleanup && (this.settings.unhighlight && this.settings.unhighlight.call(this, e, this.settings.errorClass, this.settings.validClass), this.addWrapper(this.errorsFor(e)).hide())
    }, onfocusout: function (e, t) {
        !this.checkable(e) && (e.name in this.submitted || !this.optional(e)) && this.element(e)
    }, onkeyup: function (e, t) {
        (e.name in this.submitted || e == this.lastElement) && this.element(e)
    }, onclick: function (e, t) {
        e.name in this.submitted ? this.element(e) : e.parentNode.name in this.submitted && this.element(e.parentNode)
    }, highlight: function (t, n, r) {
        t.type === "radio" ? this.findByName(t.name).addClass(n).removeClass(r) : e(t).addClass(n).removeClass(r)
    }, unhighlight: function (t, n, r) {
        t.type === "radio" ? this.findByName(t.name).removeClass(n).addClass(r) : e(t).removeClass(n).addClass(r)
    }}, setDefaults: function (t) {
        e.extend(e.validator.defaults, t)
    }, messages: {required: "This field is required.", remote: "Please fix this field.", email: "Please enter a valid email address.", url: "Please enter a valid URL.", date: "Please enter a valid date.", dateISO: "Please enter a valid date (ISO).", number: "Please enter a valid number.", digits: "Please enter only digits.", creditcard: "Please enter a valid credit card number.", equalTo: "Please enter the same value again.", accept: "Please enter a value with a valid extension.", maxlength: e.validator.format("Please enter no more than {0} characters."), minlength: e.validator.format("Please enter at least {0} characters."), rangelength: e.validator.format("Please enter a value between {0} and {1} characters long."), range: e.validator.format("Please enter a value between {0} and {1}."), max: e.validator.format("Please enter a value less than or equal to {0}."), min: e.validator.format("Please enter a value greater than or equal to {0}.")}, autoCreateRanges: !1, prototype: {init: function () {
        function r(t) {
            var n = e.data(this[0].form, "validator"), r = "on" + t.type.replace(/^validate/, "");
            n.settings[r] && n.settings[r].call(n, this[0], t)
        }

        this.labelContainer = e(this.settings.errorLabelContainer), this.errorContext = this.labelContainer.length && this.labelContainer || e(this.currentForm), this.containers = e(this.settings.errorContainer).add(this.settings.errorLabelContainer), this.submitted = {}, this.valueCache = {}, this.pendingRequest = 0, this.pending = {}, this.invalid = {}, this.reset();
        var t = this.groups = {};
        e.each(this.settings.groups, function (n, r) {
            e.each(r.split(/\s/), function (e, r) {
                t[r] = n
            })
        });
        var n = this.settings.rules;
        e.each(n, function (t, r) {
            n[t] = e.validator.normalizeRule(r)
        }), e(this.currentForm).validateDelegate("[type='text'], [type='password'], [type='file'], select, textarea, [type='number'], [type='search'] ,[type='tel'], [type='url'], [type='email'], [type='datetime'], [type='date'], [type='month'], [type='week'], [type='time'], [type='datetime-local'], [type='range'], [type='color'] ", "focusin focusout keyup", r).validateDelegate("[type='radio'], [type='checkbox'], select, option", "click", r), this.settings.invalidHandler && e(this.currentForm).bind("invalid-form.validate", this.settings.invalidHandler)
    }, form: function () {
        return this.checkForm(), e.extend(this.submitted, this.errorMap), this.invalid = e.extend({}, this.errorMap), this.valid() || e(this.currentForm).triggerHandler("invalid-form", [this]), this.showErrors(), this.valid()
    }, checkForm: function () {
        this.prepareForm();
        for (var e = 0, t = this.currentElements = this.elements(); t[e]; e++)if (this.findByName(t[e].name).length != undefined && this.findByName(t[e].name).length > 1)for (var n = 0; n < this.findByName(t[e].name).length; n++)this.check(this.findByName(t[e].name)[n]); else this.check(t[e]);
        return this.valid()
    }, element: function (t) {
        t = this.validationTargetFor(this.clean(t)), this.lastElement = t, this.prepareElement(t), this.currentElements = e(t);
        var n = this.check(t);
        return n ? delete this.invalid[t.name] : this.invalid[t.name] = !0, this.numberOfInvalids() || (this.toHide = this.toHide.add(this.containers)), this.showErrors(), n
    }, showErrors: function (t) {
        if (t) {
            e.extend(this.errorMap, t), this.errorList = [];
            for (var n in t)this.errorList.push({message: t[n], element: this.findByName(n)[0]});
            this.successList = e.grep(this.successList, function (e) {
                return!(e.name in t)
            })
        }
        this.settings.showErrors ? this.settings.showErrors.call(this, this.errorMap, this.errorList) : this.defaultShowErrors()
    }, resetForm: function () {
        e.fn.resetForm && e(this.currentForm).resetForm(), this.submitted = {}, this.lastElement = null, this.prepareForm(), this.hideErrors(), this.elements().removeClass(this.settings.errorClass)
    }, numberOfInvalids: function () {
        return this.objectLength(this.invalid)
    }, objectLength: function (e) {
        var t = 0;
        for (var n in e)t++;
        return t
    }, hideErrors: function () {
        this.addWrapper(this.toHide).hide()
    }, valid: function () {
        return this.size() == 0
    }, size: function () {
        return this.errorList.length
    }, focusInvalid: function () {
        if (this.settings.focusInvalid)try {
            e(this.findLastActive() || this.errorList.length && this.errorList[0].element || []).filter(":visible").focus().trigger("focusin")
        } catch (t) {
        }
    }, findLastActive: function () {
        var t = this.lastActive;
        return t && e.grep(this.errorList,function (e) {
            return e.element.name == t.name
        }).length == 1 && t
    }, elements: function () {
        var t = this, n = {};
        return e(this.currentForm).find("input, select, textarea").not(":submit, :reset, :image, [disabled]").not(this.settings.ignore).filter(function () {
            return!this.name && t.settings.debug && window.console && console.error("%o has no name assigned", this), this.name in n || !t.objectLength(e(this).rules()) ? !1 : (n[this.name] = !0, !0)
        })
    }, clean: function (t) {
        return e(t)[0]
    }, errors: function () {
        return e(this.settings.errorElement + "." + this.settings.errorClass, this.errorContext)
    }, reset: function () {
        this.successList = [], this.errorList = [], this.errorMap = {}, this.toShow = e([]), this.toHide = e([]), this.currentElements = e([])
    }, prepareForm: function () {
        this.reset(), this.toHide = this.errors().add(this.containers)
    }, prepareElement: function (e) {
        this.reset(), this.toHide = this.errorsFor(e)
    }, check: function (t) {
        t = this.validationTargetFor(this.clean(t));
        var n = e(t).rules(), r = !1;
        for (var i in n) {
            var s = {method: i, parameters: n[i]};
            try {
                var o = e.validator.methods[i].call(this, t.value.replace(/\r/g, ""), t, s.parameters);
                if (o == "dependency-mismatch") {
                    r = !0;
                    continue
                }
                r = !1;
                if (o == "pending") {
                    this.toHide = this.toHide.not(this.errorsFor(t));
                    return
                }
                if (!o)return this.formatAndAdd(t, s), !1
            } catch (u) {
                throw this.settings.debug && window.console && console.log("exception occured when checking element " + t.id + ", check the '" + s.method + "' method", u), u
            }
        }
        if (r)return;
        return this.objectLength(n) && this.successList.push(t), !0
    }, customMetaMessage: function (t, n) {
        if (!e.metadata)return;
        var r = this.settings.meta ? e(t).metadata()[this.settings.meta] : e(t).metadata();
        return r && r.messages && r.messages[n]
    }, customMessage: function (e, t) {
        var n = this.settings.messages[e];
        return n && (n.constructor == String ? n : n[t])
    }, findDefined: function () {
        for (var e = 0; e < arguments.length; e++)if (arguments[e] !== undefined)return arguments[e];
        return undefined
    }, defaultMessage: function (t, n) {
        return this.findDefined(this.customMessage(t.name, n), this.customMetaMessage(t, n), !this.settings.ignoreTitle && t.title || undefined, e.validator.messages[n], "<strong>Warning: No message defined for " + t.name + "</strong>")
    }, formatAndAdd: function (e, t) {
        var n = this.defaultMessage(e, t.method), r = /\$?\{(\d+)\}/g;
        typeof n == "function" ? n = n.call(this, t.parameters, e) : r.test(n) && (n = jQuery.format(n.replace(r, "{$1}"), t.parameters)), this.errorList.push({message: n, element: e}), this.errorMap[e.name] = n, this.submitted[e.name] = n
    }, addWrapper: function (e) {
        return this.settings.wrapper && (e = e.add(e.parent(this.settings.wrapper))), e
    }, defaultShowErrors: function () {
        for (var e = 0; this.errorList[e]; e++) {
            var t = this.errorList[e];
            this.settings.highlight && this.settings.highlight.call(this, t.element, this.settings.errorClass, this.settings.validClass), this.showLabel(t.element, t.message)
        }
        this.errorList.length && (this.toShow = this.toShow.add(this.containers));
        if (this.settings.success)for (var e = 0; this.successList[e]; e++)this.showLabel(this.successList[e]);
        if (this.settings.unhighlight)for (var e = 0, n = this.validElements(); n[e]; e++)this.settings.unhighlight.call(this, n[e], this.settings.errorClass, this.settings.validClass);
        this.toHide = this.toHide.not(this.toShow), this.hideErrors(), this.addWrapper(this.toShow).show()
    }, validElements: function () {
        return this.currentElements.not(this.invalidElements())
    }, invalidElements: function () {
        return e(this.errorList).map(function () {
            return this.element
        })
    }, showLabel: function (t, n) {
        var r = this.errorsFor(t);
        r.length ? (r.removeClass(this.settings.validClass).addClass(this.settings.errorClass), r.attr("generated") && r.html(n)) : (r = e("<" + this.settings.errorElement + "/>").attr({"for": this.idOrName(t), generated: !0}).addClass(this.settings.errorClass).html(n || ""), this.settings.wrapper && (r = r.hide().show().wrap("<" + this.settings.wrapper + "/>").parent()), this.labelContainer.append(r).length || (this.settings.errorPlacement ? this.settings.errorPlacement(r, e(t)) : r.insertAfter(t))), !n && this.settings.success && (r.text(""), typeof this.settings.success == "string" ? r.addClass(this.settings.success) : this.settings.success(r)), this.toShow = this.toShow.add(r)
    }, errorsFor: function (t) {
        var n = this.idOrName(t);
        return this.errors().filter(function () {
            return e(this).attr("for") == n
        })
    }, idOrName: function (e) {
        return this.groups[e.name] || (this.checkable(e) ? e.name : e.id || e.name)
    }, validationTargetFor: function (e) {
        return this.checkable(e) && (e = this.findByName(e.name).not(this.settings.ignore)[0]), e
    }, checkable: function (e) {
        return/radio|checkbox/i.test(e.type)
    }, findByName: function (t) {
        var n = this.currentForm;
        return e(document.getElementsByName(t)).map(function (e, r) {
            return r.form == n && r.name == t && r || null
        })
    }, getLength: function (t, n) {
        switch (n.nodeName.toLowerCase()) {
            case"select":
                return e("option:selected", n).length;
            case"input":
                if (this.checkable(n))return this.findByName(n.name).filter(":checked").length
        }
        return t.length
    }, depend: function (e, t) {
        return this.dependTypes[typeof e] ? this.dependTypes[typeof e](e, t) : !0
    }, dependTypes: {"boolean": function (e, t) {
        return e
    }, string: function (t, n) {
        return!!e(t, n.form).length
    }, "function": function (e, t) {
        return e(t)
    }}, optional: function (t) {
        return!e.validator.methods.required.call(this, e.trim(t.value), t) && "dependency-mismatch"
    }, startRequest: function (e) {
        this.pending[e.name] || (this.pendingRequest++, this.pending[e.name] = !0)
    }, stopRequest: function (t, n) {
        this.pendingRequest--, this.pendingRequest < 0 && (this.pendingRequest = 0), delete this.pending[t.name], n && this.pendingRequest == 0 && this.formSubmitted && this.form() ? (e(this.currentForm).submit(), this.formSubmitted = !1) : !n && this.pendingRequest == 0 && this.formSubmitted && (e(this.currentForm).triggerHandler("invalid-form", [this]), this.formSubmitted = !1)
    }, previousValue: function (t) {
        return e.data(t, "previousValue") || e.data(t, "previousValue", {old: null, valid: !0, message: this.defaultMessage(t, "remote")})
    }}, classRuleSettings: {required: {required: !0}, email: {email: !0}, url: {url: !0}, date: {date: !0}, dateISO: {dateISO: !0}, dateDE: {dateDE: !0}, number: {number: !0}, numberDE: {numberDE: !0}, digits: {digits: !0}, creditcard: {creditcard: !0}}, addClassRules: function (t, n) {
        t.constructor == String ? this.classRuleSettings[t] = n : e.extend(this.classRuleSettings, t)
    }, classRules: function (t) {
        var n = {}, r = e(t).attr("class");
        return r && e.each(r.split(" "), function () {
            this in e.validator.classRuleSettings && e.extend(n, e.validator.classRuleSettings[this])
        }), n
    }, attributeRules: function (t) {
        var n = {}, r = e(t);
        for (var i in e.validator.methods) {
            var s;
            i === "required" && typeof e.fn.prop == "function" ? s = r.prop(i) : s = r.attr(i), s ? n[i] = s : r[0].getAttribute("type") === i && (n[i] = !0)
        }
        return n.maxlength && /-1|2147483647|524288/.test(n.maxlength) && delete n.maxlength, n
    }, metadataRules: function (t) {
        if (!e.metadata)return{};
        var n = e.data(t.form, "validator").settings.meta;
        return n ? e(t).metadata()[n] : e(t).metadata()
    }, staticRules: function (t) {
        var n = {}, r = e.data(t.form, "validator");
        return r.settings.rules && (n = e.validator.normalizeRule(r.settings.rules[t.name]) || {}), n
    }, normalizeRules: function (t, n) {
        return e.each(t, function (r, i) {
            if (i === !1) {
                delete t[r];
                return
            }
            if (i.param || i.depends) {
                var s = !0;
                switch (typeof i.depends) {
                    case"string":
                        s = !!e(i.depends, n.form).length;
                        break;
                    case"function":
                        s = i.depends.call(n, n)
                }
                s ? t[r] = i.param !== undefined ? i.param : !0 : delete t[r]
            }
        }), e.each(t, function (r, i) {
            t[r] = e.isFunction(i) ? i(n) : i
        }), e.each(["minlength", "maxlength", "min", "max"], function () {
            t[this] && (t[this] = Number(t[this]))
        }), e.each(["rangelength", "range"], function () {
            t[this] && (t[this] = [Number(t[this][0]), Number(t[this][1])])
        }), e.validator.autoCreateRanges && (t.min && t.max && (t.range = [t.min, t.max], delete t.min, delete t.max), t.minlength && t.maxlength && (t.rangelength = [t.minlength, t.maxlength], delete t.minlength, delete t.maxlength)), t.messages && delete t.messages, t
    }, normalizeRule: function (t) {
        if (typeof t == "string") {
            var n = {};
            e.each(t.split(/\s/), function () {
                n[this] = !0
            }), t = n
        }
        return t
    }, addMethod: function (t, n, r) {
        e.validator.methods[t] = n, e.validator.messages[t] = r != undefined ? r : e.validator.messages[t], n.length < 3 && e.validator.addClassRules(t, e.validator.normalizeRule(t))
    }, methods: {required: function (t, n, r) {
        if (!this.depend(r, n))return"dependency-mismatch";
        switch (n.nodeName.toLowerCase()) {
            case"select":
                var i = e(n).val();
                return i && i.length > 0;
            case"input":
                if (this.checkable(n))return this.getLength(t, n) > 0;
            default:
                return e.trim(t).length > 0
        }
    }, remote: function (t, n, r) {
        if (this.optional(n))return"dependency-mismatch";
        var i = this.previousValue(n);
        this.settings.messages[n.name] || (this.settings.messages[n.name] = {}), i.originalMessage = this.settings.messages[n.name].remote, this.settings.messages[n.name].remote = i.message, r = typeof r == "string" && {url: r} || r;
        if (this.pending[n.name])return"pending";
        if (i.old === t)return i.valid;
        i.old = t;
        var s = this;
        this.startRequest(n);
        var o = {};
        return o[n.name] = t, e.ajax(e.extend(!0, {url: r, mode: "abort", port: "validate" + n.name, dataType: "json", data: o, success: function (r) {
            s.settings.messages[n.name].remote = i.originalMessage;
            var o = r === !0;
            if (o) {
                var u = s.formSubmitted;
                s.prepareElement(n), s.formSubmitted = u, s.successList.push(n), s.showErrors()
            } else {
                var a = {}, f = r || s.defaultMessage(n, "remote");
                a[n.name] = i.message = e.isFunction(f) ? f(t) : f, s.showErrors(a)
            }
            i.valid = o, s.stopRequest(n, o)
        }}, r)), "pending"
    }, minlength: function (t, n, r) {
        return this.optional(n) || this.getLength(e.trim(t), n) >= r
    }, maxlength: function (t, n, r) {
        return this.optional(n) || this.getLength(e.trim(t), n) <= r
    }, rangelength: function (t, n, r) {
        var i = this.getLength(e.trim(t), n);
        return this.optional(n) || i >= r[0] && i <= r[1]
    }, min: function (e, t, n) {
        return this.optional(t) || e >= n
    }, max: function (e, t, n) {
        return this.optional(t) || e <= n
    }, range: function (e, t, n) {
        return this.optional(t) || e >= n[0] && e <= n[1]
    }, email: function (e, t) {
        return this.optional(t) || /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i.test(e)
    }, url: function (e, t) {
        return this.optional(t) || /^(https?|ftp):\/\/(((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:)*@)?(((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5]))|((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?)(:\d*)?)(\/((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)+(\/(([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)*)*)?)?(\?((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|[\uE000-\uF8FF]|\/|\?)*)?(\#((([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(%[\da-f]{2})|[!\$&'\(\)\*\+,;=]|:|@)|\/|\?)*)?$/i.test(e)
    }, date: function (e, t) {
        return this.optional(t) || !/Invalid|NaN/.test(new Date(e))
    }, dateISO: function (e, t) {
        return this.optional(t) || /^\d{4}[\/-]\d{1,2}[\/-]\d{1,2}$/.test(e)
    }, number: function (e, t) {
        return this.optional(t) || /^-?(?:\d+|\d{1,3}(?:,\d{3})+)(?:\.\d+)?$/.test(e)
    }, digits: function (e, t) {
        return this.optional(t) || /^\d+$/.test(e)
    }, creditcard: function (e, t) {
        if (this.optional(t))return"dependency-mismatch";
        if (/[^0-9 -]+/.test(e))return!1;
        var n = 0, r = 0, i = !1;
        e = e.replace(/\D/g, "");
        for (var s = e.length - 1; s >= 0; s--) {
            var o = e.charAt(s), r = parseInt(o, 10);
            i && (r *= 2) > 9 && (r -= 9), n += r, i = !i
        }
        return n % 10 == 0
    }, accept: function (e, t, n) {
        return n = typeof n == "string" ? n.replace(/,/g, "|") : "png|jpe?g|gif", this.optional(t) || e.match(new RegExp(".(" + n + ")$", "i"))
    }, equalTo: function (t, n, r) {
        var i = e(r).unbind(".validate-equalTo").bind("blur.validate-equalTo", function () {
            e(n).valid()
        });
        return t == i.val()
    }}}), e.format = e.validator.format
}(jQuery), function (e) {
    var t = {};
    if (e.ajaxPrefilter)e.ajaxPrefilter(function (e, n, r) {
        var i = e.port;
        e.mode == "abort" && (t[i] && t[i].abort(), t[i] = r)
    }); else {
        var n = e.ajax;
        e.ajax = function (r) {
            var i = ("mode"in r ? r : e.ajaxSettings).mode, s = ("port"in r ? r : e.ajaxSettings).port;
            return i == "abort" ? (t[s] && t[s].abort(), t[s] = n.apply(this, arguments)) : n.apply(this, arguments)
        }
    }
}(jQuery), function (e) {
    !jQuery.event.special.focusin && !jQuery.event.special.focusout && document.addEventListener && e.each({focus: "focusin", blur: "focusout"}, function (t, n) {
        function r(t) {
            return t = e.event.fix(t), t.type = n, e.event.handle.call(this, t)
        }

        e.event.special[n] = {setup: function () {
            this.addEventListener(t, r, !0)
        }, teardown: function () {
            this.removeEventListener(t, r, !0)
        }, handler: function (t) {
            return arguments[0] = e.event.fix(t), arguments[0].type = n, e.event.handle.apply(this, arguments)
        }}
    }), e.extend(e.fn, {validateDelegate: function (t, n, r) {
        return this.bind(n, function (n) {
            var i = e(n.target);
            if (i.is(t))return r.apply(i, arguments)
        })
    }})
}(jQuery), function (e) {
    var t = e.browser.msie && e.browser.version < 8, n = 4;
    e.watermarker = function () {
    }, e.extend(e.watermarker, {defaults: {color: "#999", left: 0, top: 0, fallback: !1, animDuration: 300, minOpacity: .6}, setDefaults: function (t) {
        e.extend(e.watermarker.defaults, t)
    }, checkVal: function (t, n, r) {
        return t.length == 0 ? e(n).show() : e(n).hide(), t.length > 0
    }, html5_support: function () {
        var e = document.createElement("input");
        return"placeholder"in e
    }}), e.fn.watermark = function (r, i) {
        var i, s;
        i = e.extend(e.watermarker.defaults, i), s = this.filter("textarea, input:not(:checkbox,:radio,:file,:submit,:reset)");
        if (i.fallback && e.watermarker.html5_support())return;
        return s.each(function () {
            var s, o, u, a, f, l, c, h, p = 0, d, v;
            s = e(this);
            if (s.attr("data-jq-watermark") == "processed")return;
            o = s.attr("placeholder") != undefined && s.attr("placeholder") != "" ? "placeholder" : "title", u = r === undefined || r === "" ? e(this).attr(o) : r, a = e('<span class="watermark_container"></span>'), f = e('<span class="watermark">' + u + "</span>"), o == "placeholder" && s.removeAttr("placeholder"), a.css({display: "inline-block", position: "relative"}), t && a.css({zoom: 1, display: "inline"}), s.wrap(a).attr("data-jq-watermark", "processed"), this.nodeName.toLowerCase() == "textarea" ? (e_height = s.css("line-height"), e_height = e_height === "normal" ? parseInt(s.css("font-size")) : e_height, p = s.css("padding-top") != "auto" ? parseInt(s.css("padding-top")) : 0) : (e_height = s.outerHeight(), e_height <= 0 && (e_height = s.css("padding-top") != "auto" ? parseInt(s.css("padding-top")) : 0, e_height += s.css("padding-bottom") != "auto" ? parseInt(s.css("padding-bottom")) : 0, e_height += s.css("height") != "auto" ? parseInt(s.css("height")) : 0)), p += s.css("margin-top") != "auto" ? parseInt(s.css("margin-top")) : 0, l = s.css("margin-left") != "auto" ? parseInt(s.css("margin-left")) : 0, l += s.css("padding-left") != "auto" ? parseInt(s.css("padding-left")) : 0, f.css({position: "absolute", display: "block", fontFamily: s.css("font-family"), fontSize: s.css("font-size"), color: i.color, left: n + i.left + l, top: i.top + p, height: e_height, lineHeight: e_height + "px", textAlign: "left", pointerEvents: "none"}).data("jq_watermark_element", s), e.watermarker.checkVal(s.val(), f), f.click(function () {
                e(e(this).data("jq_watermark_element")).trigger("click").trigger("focus")
            }), s.before(f).bind("focus.jq_watermark",function () {
                e.watermarker.checkVal(e(this).val(), f) || f.stop().fadeTo(i.animDuration, i.minOpacity)
            }).bind("blur.jq_watermark change.jq_watermark",function () {
                e.watermarker.checkVal(e(this).val(), f) || f.stop().fadeTo(i.animDuration, 1)
            }).bind("keydown.jq_watermark, paste.jq_watermark",function (t) {
                e(f).hide()
            }).bind("keyup.jq_watermark", function (t) {
                e.watermarker.checkVal(e(this).val(), f)
            })
        }), this
    }, e(".jq_watermark").watermark()
}(jQuery);
var map, mkctn, mk, geocoder;
(function () {
}).call(this);
var reEscape = new RegExp("(\\" + ["/", ".", "*", "+", "?", "|", "(", ")", "[", "]", "{", "}", "\\"].join("|\\") + ")", "g"), suggestion_type = {apartment: "รายชื่อที่พัก", zone: "ทำเลที่พัก"};
(function () {
}).call(this);
var uploader, onChangeInterval = null, delayTime = 700, last_popover = undefined;
(function () {
}).call(this);
var insertZone = !1;
(function (e) {
    e.fn.shuffle = function (t) {
        return t = [], this.each(function () {
            t.push(e(this).clone(!0))
        }).each(function (n, r) {
            e(r).replaceWith(t[n = Math.floor(Math.random() * t.length)]), t.splice(n, 1)
        })
    }, e.shuffle2 = function (t) {
        return e(t).shuffle2()
    }
})(jQuery), function () {
}.call(this), function () {
}.call(this), Array.prototype.remove = function (e) {
    var t = -1;
    while ((t = this.indexOf(e)) > -1)this.splice(t, 1)
};
var vtour_uploader, wysihtml5 = {version: "0.3.0", commands: {}, dom: {}, quirks: {}, toolbar: {}, lang: {}, selection: {}, views: {}, INVISIBLE_SPACE: "﻿", EMPTY_FUNCTION: function () {
}, ELEMENT_NODE: 1, TEXT_NODE: 3, BACKSPACE_KEY: 8, ENTER_KEY: 13, ESCAPE_KEY: 27, SPACE_KEY: 32, DELETE_KEY: 46};
window.rangy = function () {
    function u(n, r) {
        var i = typeof n[r];
        return i == t || i == e && !!n[r] || i == "unknown"
    }

    function a(t, n) {
        return typeof t[n] == e && !!t[n]
    }

    function f(e, t) {
        return typeof e[t] != n
    }

    function l(e) {
        return function (t, n) {
            var r = n.length;
            while (r--)if (!e(t, n[r]))return!1;
            return!0
        }
    }

    function d(e) {
        return e && c(e, o) && p(e, s)
    }

    function m(e) {
        window.alert("Rangy not supported in your browser. Reason: " + e), v.initialized = !0, v.supported = !1
    }

    function g(e) {
        var t = "Rangy warning: " + e;
        v.config.alertOnWarn ? window.alert(t) : typeof window.console != n && typeof window.console.log != n && window.console.log(t)
    }

    function w() {
        if (v.initialized)return;
        var e, t = !1, n = !1;
        u(document, "createRange") && (e = document.createRange(), c(e, i) && p(e, r) && (t = !0), e.detach());
        var s = a(document, "body") ? document.body : document.getElementsByTagName("body")[0];
        s && u(s, "createTextRange") && (e = s.createTextRange(), d(e) && (n = !0)), !t && !n && m("Neither Range nor TextRange are implemented"), v.initialized = !0, v.features = {implementsDomRange: t, implementsTextRange: n};
        var o = b.concat(y);
        for (var f = 0, l = o.length; f < l; ++f)try {
            o[f](v)
        } catch (h) {
            a(window, "console") && u(window.console, "log") && window.console.log("Init listener threw an exception. Continuing.", h)
        }
    }

    function S(e) {
        e = e || window, w();
        for (var t = 0, n = E.length; t < n; ++t)E[t](e)
    }

    function x(e) {
        this.name = e, this.initialized = !1, this.supported = !1
    }

    var e = "object", t = "function", n = "undefined", r = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer", "START_TO_START", "START_TO_END", "END_TO_START", "END_TO_END"], i = ["setStart", "setStartBefore", "setStartAfter", "setEnd", "setEndBefore", "setEndAfter", "collapse", "selectNode", "selectNodeContents", "compareBoundaryPoints", "deleteContents", "extractContents", "cloneContents", "insertNode", "surroundContents", "cloneRange", "toString", "detach"], s = ["boundingHeight", "boundingLeft", "boundingTop", "boundingWidth", "htmlText", "text"], o = ["collapse", "compareEndPoints", "duplicate", "getBookmark", "moveToBookmark", "moveToElementText", "parentElement", "pasteHTML", "select", "setEndPoint", "getBoundingClientRect"], c = l(u), h = l(a), p = l(f), v = {version: "1.2.2", initialized: !1, supported: !0, util: {isHostMethod: u, isHostObject: a, isHostProperty: f, areHostMethods: c, areHostObjects: h, areHostProperties: p, isTextRange: d}, features: {}, modules: {}, config: {alertOnWarn: !1, preferTextRange: !1}};
    v.fail = m, v.warn = g, {}.hasOwnProperty ? v.util.extend = function (e, t) {
        for (var n in t)t.hasOwnProperty(n) && (e[n] = t[n])
    } : m("hasOwnProperty not supported");
    var y = [], b = [];
    v.init = w, v.addInitListener = function (e) {
        v.initialized ? e(v) : y.push(e)
    };
    var E = [];
    v.addCreateMissingNativeApiListener = function (e) {
        E.push(e)
    }, v.createMissingNativeApi = S, x.prototype.fail = function (e) {
        throw this.initialized = !0, this.supported = !1, new Error("Module '" + this.name + "' failed to load: " + e)
    }, x.prototype.warn = function (e) {
        v.warn("Module " + this.name + ": " + e)
    }, x.prototype.createError = function (e) {
        return new Error("Error in Rangy " + this.name + " module: " + e)
    }, v.createModule = function (e, t) {
        var n = new x(e);
        v.modules[e] = n, b.push(function (e) {
            t(e, n), n.initialized = !0, n.supported = !0
        })
    }, v.requireModules = function (e) {
        for (var t = 0, n = e.length, r, i; t < n; ++t) {
            i = e[t], r = v.modules[i];
            if (!r || !(r instanceof x))throw new Error("Module '" + i + "' not found");
            if (!r.supported)throw new Error("Module '" + i + "' not supported")
        }
    };
    var T = !1, N = function (e) {
        T || (T = !0, v.initialized || w())
    };
    if (typeof window == n) {
        m("No window found");
        return
    }
    if (typeof document == n) {
        m("No document found");
        return
    }
    return u(document, "addEventListener") && document.addEventListener("DOMContentLoaded", N, !1), u(window, "addEventListener") ? window.addEventListener("load", N, !1) : u(window, "attachEvent") ? window.attachEvent("onload", N) : m("Window does not have required addEventListener or attachEvent method"), v
}(), rangy.createModule("DomUtil", function (e, t) {
    function u(e) {
        var t;
        return typeof e.namespaceURI == n || (t = e.namespaceURI) === null || t == "http://www.w3.org/1999/xhtml"
    }

    function a(e) {
        var t = e.parentNode;
        return t.nodeType == 1 ? t : null
    }

    function f(e) {
        var t = 0;
        while (e = e.previousSibling)t++;
        return t
    }

    function l(e) {
        var t;
        return d(e) ? e.length : (t = e.childNodes) ? t.length : 0
    }

    function c(e, t) {
        var n = [], r;
        for (r = e; r; r = r.parentNode)n.push(r);
        for (r = t; r; r = r.parentNode)if (o(n, r))return r;
        return null
    }

    function h(e, t, n) {
        var r = n ? t : t.parentNode;
        while (r) {
            if (r === e)return!0;
            r = r.parentNode
        }
        return!1
    }

    function p(e, t, n) {
        var r, i = n ? e : e.parentNode;
        while (i) {
            r = i.parentNode;
            if (r === t)return i;
            i = r
        }
        return null
    }

    function d(e) {
        var t = e.nodeType;
        return t == 3 || t == 4 || t == 8
    }

    function v(e, t) {
        var n = t.nextSibling, r = t.parentNode;
        return n ? r.insertBefore(e, n) : r.appendChild(e), e
    }

    function m(e, t) {
        var n = e.cloneNode(!1);
        return n.deleteData(0, t), e.deleteData(t, e.length - t), v(n, e), n
    }

    function g(e) {
        if (e.nodeType == 9)return e;
        if (typeof e.ownerDocument != n)return e.ownerDocument;
        if (typeof e.document != n)return e.document;
        if (e.parentNode)return g(e.parentNode);
        throw new Error("getDocument: no document found for node")
    }

    function y(e) {
        var t = g(e);
        if (typeof t.defaultView != n)return t.defaultView;
        if (typeof t.parentWindow != n)return t.parentWindow;
        throw new Error("Cannot get a window object for node")
    }

    function b(e) {
        if (typeof e.contentDocument != n)return e.contentDocument;
        if (typeof e.contentWindow != n)return e.contentWindow.document;
        throw new Error("getIframeWindow: No Document object found for iframe element")
    }

    function w(e) {
        if (typeof
            e.contentWindow != n)return e.contentWindow;
        if (typeof e.contentDocument != n)return e.contentDocument.defaultView;
        throw new Error("getIframeWindow: No Window object found for iframe element")
    }

    function E(e) {
        return r.isHostObject(e, "body") ? e.body : e.getElementsByTagName("body")[0]
    }

    function S(e) {
        var t;
        while (t = e.parentNode)e = t;
        return e
    }

    function x(e, t, n, r) {
        var i, s, o, u, a;
        if (e == n)return t === r ? 0 : t < r ? -1 : 1;
        if (i = p(n, e, !0))return t <= f(i) ? -1 : 1;
        if (i = p(e, n, !0))return f(i) < r ? -1 : 1;
        s = c(e, n), o = e === s ? s : p(e, s, !0), u = n === s ? s : p(n, s, !0);
        if (o === u)throw new Error("comparePoints got to case 4 and childA and childB are the same!");
        a = s.firstChild;
        while (a) {
            if (a === o)return-1;
            if (a === u)return 1;
            a = a.nextSibling
        }
        throw new Error("Should not be here!")
    }

    function T(e) {
        var t = g(e).createDocumentFragment(), n;
        while (n = e.firstChild)t.appendChild(n);
        return t
    }

    function N(e) {
        if (!e)return"[No node]";
        if (d(e))return'"' + e.data + '"';
        if (e.nodeType == 1) {
            var t = e.id ? ' id="' + e.id + '"' : "";
            return"<" + e.nodeName + t + ">[" + e.childNodes.length + "]"
        }
        return e.nodeName
    }

    function C(e) {
        this.root = e, this._next = e
    }

    function k(e) {
        return new C(e)
    }

    function L(e, t) {
        this.node = e, this.offset = t
    }

    function A(e) {
        this.code = this[e], this.codeName = e, this.message = "DOMException: " + this.codeName
    }

    var n = "undefined", r = e.util;
    r.areHostMethods(document, ["createDocumentFragment", "createElement", "createTextNode"]) || t.fail("document missing a Node creation method"), r.isHostMethod(document, "getElementsByTagName") || t.fail("document missing getElementsByTagName method");
    var i = document.createElement("div");
    r.areHostMethods(i, ["insertBefore", "appendChild", "cloneNode"] || !r.areHostObjects(i, ["previousSibling", "nextSibling", "childNodes", "parentNode"])) || t.fail("Incomplete Element implementation"), r.isHostProperty(i, "innerHTML") || t.fail("Element is missing innerHTML property");
    var s = document.createTextNode("test");
    r.areHostMethods(s, ["splitText", "deleteData", "insertData", "appendData", "cloneNode"] || !r.areHostObjects(i, ["previousSibling", "nextSibling", "childNodes", "parentNode"]) || !r.areHostProperties(s, ["data"])) || t.fail("Incomplete Text Node implementation");
    var o = function (e, t) {
        var n = e.length;
        while (n--)if (e[n] === t)return!0;
        return!1
    };
    C.prototype = {_current: null, hasNext: function () {
        return!!this._next
    }, next: function () {
        var e = this._current = this._next, t, n;
        if (this._current) {
            t = e.firstChild;
            if (t)this._next = t; else {
                n = null;
                while (e !== this.root && !(n = e.nextSibling))e = e.parentNode;
                this._next = n
            }
        }
        return this._current
    }, detach: function () {
        this._current = this._next = this.root = null
    }}, L.prototype = {equals: function (e) {
        return this.node === e.node & this.offset == e.offset
    }, inspect: function () {
        return"[DomPosition(" + N(this.node) + ":" + this.offset + ")]"
    }}, A.prototype = {INDEX_SIZE_ERR: 1, HIERARCHY_REQUEST_ERR: 3, WRONG_DOCUMENT_ERR: 4, NO_MODIFICATION_ALLOWED_ERR: 7, NOT_FOUND_ERR: 8, NOT_SUPPORTED_ERR: 9, INVALID_STATE_ERR: 11}, A.prototype.toString = function () {
        return this.message
    }, e.dom = {arrayContains: o, isHtmlNamespace: u, parentElement: a, getNodeIndex: f, getNodeLength: l, getCommonAncestor: c, isAncestorOf: h, getClosestAncestorIn: p, isCharacterDataNode: d, insertAfter: v, splitDataNode: m, getDocument: g, getWindow: y, getIframeWindow: w, getIframeDocument: b, getBody: E, getRootContainer: S, comparePoints: x, inspectNode: N, fragmentFromNodeChildren: T, createIterator: k, DomPosition: L}, e.DOMException = A
}), rangy.createModule("DomRange", function (e, t) {
    function s(e, t) {
        return e.nodeType != 3 && (n.isAncestorOf(e, t.startContainer, !0) || n.isAncestorOf(e, t.endContainer, !0))
    }

    function o(e) {
        return n.getDocument(e.startContainer)
    }

    function u(e, t, n) {
        var r = e._listeners[t];
        if (r)for (var i = 0, s = r.length; i < s; ++i)r[i].call(e, {target: e, args: n})
    }

    function a(e) {
        return new r(e.parentNode, n.getNodeIndex(e))
    }

    function f(e) {
        return new r(e.parentNode, n.getNodeIndex(e) + 1)
    }

    function l(e, t, r) {
        var i = e.nodeType == 11 ? e.firstChild : e;
        return n.isCharacterDataNode(t) ? r == t.length ? n.insertAfter(e, t) : t.parentNode.insertBefore(e, r == 0 ? t : n.splitDataNode(t, r)) : r >= t.childNodes.length ? t.appendChild(e) : t.insertBefore(e, t.childNodes[r]), i
    }

    function c(e) {
        var t;
        for (var n, r = o(e.range).createDocumentFragment(), s; n = e.next();) {
            t = e.isPartiallySelectedSubtree(), n = n.cloneNode(!t), t && (s = e.getSubtreeIterator(), n.appendChild(c(s)), s.detach(!0));
            if (n.nodeType == 10)throw new i("HIERARCHY_REQUEST_ERR");
            r.appendChild(n)
        }
        return r
    }

    function h(e, t, r) {
        var i, s;
        r = r || {stop: !1};
        for (var o, u; o = e.next();)if (e.isPartiallySelectedSubtree()) {
            if (t(o) === !1) {
                r.stop = !0;
                return
            }
            u = e.getSubtreeIterator(), h(u, t, r), u.detach(!0);
            if (r.stop)return
        } else {
            i = n.createIterator(o);
            while (s = i.next())if (t(s) === !1) {
                r.stop = !0;
                return
            }
        }
    }

    function p(e) {
        var t;
        while (e.next())e.isPartiallySelectedSubtree() ? (t = e.getSubtreeIterator(), p(t), t.detach(!0)) : e.remove()
    }

    function d(e) {
        for (var t, n = o(e.range).createDocumentFragment(), r; t = e.next();) {
            e.isPartiallySelectedSubtree() ? (t = t.cloneNode(!1), r = e.getSubtreeIterator(), t.appendChild(d(r)), r.detach(!0)) : e.remove();
            if (t.nodeType == 10)throw new i("HIERARCHY_REQUEST_ERR");
            n.appendChild(t)
        }
        return n
    }

    function v(e, t, n) {
        var r = !!t && !!t.length, i, s = !!n;
        r && (i = new RegExp("^(" + t.join("|") + ")$"));
        var o = [];
        return h(new g(e, !1), function (e) {
            (!r || i.test(e.nodeType)) && (!s || n(e)) && o.push(e)
        }), o
    }

    function m(e) {
        var t = typeof e.getName == "undefined" ? "Range" : e.getName();
        return"[" + t + "(" + n.inspectNode(e.startContainer) + ":" + e.startOffset + ", " + n.inspectNode(e.endContainer) + ":" + e.endOffset + ")]"
    }

    function g(e, t) {
        this.range = e, this.clonePartiallySelectedTextNodes = t;
        if (!e.collapsed) {
            this.sc = e.startContainer, this.so = e.startOffset, this.ec = e.endContainer, this.eo = e.endOffset;
            var r = e.commonAncestorContainer;
            this.sc === this.ec && n.isCharacterDataNode(this.sc) ? (this.isSingleCharacterDataNode = !0, this._first = this._last = this._next = this.sc) : (this._first = this._next = this.sc === r && !n.isCharacterDataNode(this.sc) ? this.sc.childNodes[this.so] : n.getClosestAncestorIn(this.sc, r, !0), this._last = this.ec === r && !n.isCharacterDataNode(this.ec) ? this.ec.childNodes[this.eo - 1] : n.getClosestAncestorIn(this.ec, r, !0))
        }
    }

    function y(e) {
        this.code = this[e], this.codeName = e, this.message = "RangeException: " + this.codeName
    }

    function b(e, t, n) {
        this.nodes = v(e, t, n), this._next = this.nodes[0], this._position = 0
    }

    function N(e) {
        return function (t, r) {
            var i, s = r ? t : t.parentNode;
            while (s) {
                i = s.nodeType;
                if (n.arrayContains(e, i))return s;
                s = s.parentNode
            }
            return null
        }
    }

    function O(e, t) {
        if (A(e, t))throw new y("INVALID_NODE_TYPE_ERR")
    }

    function M(e) {
        if (!e.startContainer)throw new i("INVALID_STATE_ERR")
    }

    function _(e, t) {
        if (!n.arrayContains(t, e.nodeType))throw new y("INVALID_NODE_TYPE_ERR")
    }

    function D(e, t) {
        if (t < 0 || t > (n.isCharacterDataNode(e) ? e.length : e.childNodes.length))throw new i("INDEX_SIZE_ERR")
    }

    function P(e, t) {
        if (k(e, !0) !== k(t, !0))throw new i("WRONG_DOCUMENT_ERR")
    }

    function H(e) {
        if (L(e, !0))throw new i("NO_MODIFICATION_ALLOWED_ERR")
    }

    function B(e, t) {
        if (!e)throw new i(t)
    }

    function j(e) {
        return!n.arrayContains(E, e.nodeType) && !k(e, !0)
    }

    function F(e, t) {
        return t <= (n.isCharacterDataNode(e) ? e.length : e.childNodes.length)
    }

    function I(e) {
        M(e);
        if (j(e.startContainer) || j(e.endContainer) || !F(e.startContainer, e.startOffset) || !F(e.endContainer, e.endOffset))throw new Error("Range error: Range is no longer valid after DOM mutation (" + e.inspect() + ")")
    }

    function Z() {
    }

    function et(e) {
        e.START_TO_START = X, e.START_TO_END = V, e.END_TO_END = $, e.END_TO_START = J, e.NODE_BEFORE = K, e.NODE_AFTER = Q, e.NODE_BEFORE_AND_AFTER = G, e.NODE_INSIDE = Y
    }

    function tt(e) {
        et(e), et(e.prototype)
    }

    function nt(e, t) {
        return function () {
            I(this);
            var r = this.startContainer, i = this.startOffset, s = this.commonAncestorContainer, o = new g(this, !0), u, a;
            r !== s && (u = n.getClosestAncestorIn(r, s, !0), a = f(u), r = a.node, i = a.offset), h(o, H), o.reset();
            var l = e(o);
            return o.detach(), t(this, r, i, r, i), l
        }
    }

    function rt(t, r, i) {
        function o(e, t) {
            return function (n) {
                M(this), _(n, w), _(C(n), E);
                var r = (e ? a : f)(n);
                (t ? u : l)(this, r.node, r.offset)
            }
        }

        function u(e, t, i) {
            var s = e.endContainer, o = e.endOffset;
            if (t !== e.startContainer || i !== e.startOffset) {
                if (C(t) != C(s) || n.comparePoints(t, i, s, o) == 1)s = t, o = i;
                r(e, t, i, s, o)
            }
        }

        function l(e, t, i) {
            var s = e.startContainer, o = e.startOffset;
            if (t !== e.endContainer || i !== e.endOffset) {
                if (C(t) != C(s) || n.comparePoints(t, i, s, o) == -1)s = t, o = i;
                r(e, s, o, t, i)
            }
        }

        function c(e, t, n) {
            (t !== e.startContainer || n !== e.startOffset || t !== e.endContainer || n !== e.endOffset) && r(e, t, n, t, n)
        }

        t.prototype = new Z, e.util.extend(t.prototype, {setStart: function (e, t) {
            M(this), O(e, !0), D(e, t), u(this, e, t)
        }, setEnd: function (e, t) {
            M(this), O(e, !0), D(e, t), l(this, e, t)
        }, setStartBefore: o(!0, !0), setStartAfter: o(!1, !0), setEndBefore: o(!0, !1), setEndAfter: o(!1, !1), collapse: function (e) {
            I(this), e ? r(this, this.startContainer, this.startOffset, this.startContainer, this.startOffset) : r(this, this.endContainer, this.endOffset, this.endContainer, this.endOffset)
        }, selectNodeContents: function (e) {
            M(this), O(e, !0), r(this, e, 0, e, n.getNodeLength(e))
        }, selectNode: function (e) {
            M(this), O(e, !1), _(e, w);
            var t = a(e), n = f(e);
            r(this, t.node, t.offset, n.node, n.offset)
        }, extractContents: nt(d, r), deleteContents: nt(p, r), canSurroundContents: function () {
            I(this), H(this.startContainer), H(this.endContainer);
            var e = new g(this, !0), t = e._first && s(e._first, this) || e._last && s(e._last, this);
            return e.detach(), !t
        }, detach: function () {
            i(this)
        }, splitBoundaries: function () {
            I(this);
            var e = this.startContainer, t = this.startOffset, i = this.endContainer, s = this.endOffset, o = e === i;
            n.isCharacterDataNode(i) && s > 0 && s < i.length && n.splitDataNode(i, s), n.isCharacterDataNode(e) && t > 0 && t < e.length && (e = n.splitDataNode(e, t), o ? (s -= t, i = e) : i == e.parentNode && s >= n.getNodeIndex(e) && s++, t = 0), r(this, e, t, i, s)
        }, normalizeBoundaries: function () {
            I(this);
            var e = this.startContainer, t = this.startOffset, i = this.endContainer, s = this.endOffset, o = function (e) {
                var t = e.nextSibling;
                t && t.nodeType == e.nodeType && (i = e, s = e.length, e.appendData(t.data), t.parentNode.removeChild(t))
            }, u = function (r) {
                var o = r.previousSibling;
                if (o && o.nodeType == r.nodeType) {
                    e = r;
                    var u = r.length;
                    t = o.length, r.insertData(0, o.data), o.parentNode.removeChild(o);
                    if (e == i)s += t, i = e; else if (i == r.parentNode) {
                        var a = n.getNodeIndex(r);
                        s == a ? (i = r, s = u) : s > a && s--
                    }
                }
            }, a = !0;
            if (n.isCharacterDataNode(i))i.length == s && o(i); else {
                if (s > 0) {
                    var f = i.childNodes[s - 1];
                    f && n.isCharacterDataNode(f) && o(f)
                }
                a = !this.collapsed
            }
            if (a) {
                if (n.isCharacterDataNode(e))t == 0 && u(e); else if (t < e.childNodes.length) {
                    var l = e.childNodes[t];
                    l && n.isCharacterDataNode(l) && u(l)
                }
            } else e = i, t = s;
            r(this, e, t, i, s)
        }, collapseToPoint: function (e, t) {
            M(this), O(e, !0), D(e, t), c(this, e, t)
        }}), tt(t)
    }

    function it(e) {
        e.collapsed = e.startContainer === e.endContainer && e.startOffset === e.endOffset, e.commonAncestorContainer = e.collapsed ? e.startContainer : n.getCommonAncestor(e.startContainer, e.endContainer)
    }

    function st(e, t, n, r, i) {
        var s = e.startContainer !== t || e.startOffset !== n, o = e.endContainer !== r || e.endOffset !== i;
        e.startContainer = t, e.startOffset = n, e.endContainer = r, e.endOffset = i, it(e), u(e, "boundarychange", {startMoved: s, endMoved: o})
    }

    function ot(e) {
        M(e), e.startContainer = e.startOffset = e.endContainer = e.endOffset = null, e.collapsed = e.commonAncestorContainer = null, u(e, "detach", null), e._listeners = null
    }

    function ut(e) {
        this.startContainer = e, this.startOffset = 0, this.endContainer = e, this.endOffset = 0, this._listeners = {boundarychange: [], detach: []}, it(this)
    }

    e.requireModules(["DomUtil"]);
    var n = e.dom, r = n.DomPosition, i = e.DOMException;
    g.prototype = {_current: null, _next: null, _first: null, _last: null, isSingleCharacterDataNode: !1, reset: function () {
        this._current = null, this._next = this._first
    }, hasNext: function () {
        return!!this._next
    }, next: function () {
        var e = this._current = this._next;
        return e && (this._next = e !== this._last ? e.nextSibling : null, n.isCharacterDataNode(e) && this.clonePartiallySelectedTextNodes && (e === this.ec && (e = e.cloneNode(!0)).deleteData(this.eo, e.length - this.eo), this._current === this.sc && (e = e.cloneNode(!0)).deleteData(0, this.so))), e
    }, remove: function () {
        var e = this._current, t, r;
        !n.isCharacterDataNode(e) || e !== this.sc && e !== this.ec ? e.parentNode && e.parentNode.removeChild(e) : (t = e === this.sc ? this.so : 0, r = e === this.ec ? this.eo : e.length, t != r && e.deleteData(t, r - t))
    }, isPartiallySelectedSubtree: function () {
        var e = this._current;
        return s(e, this.range)
    }, getSubtreeIterator: function () {
        var e;
        if (this.isSingleCharacterDataNode)e = this.range.cloneRange(), e.collapse(); else {
            e = new ut(o(this.range));
            var t = this._current, r = t, i = 0, s = t, u = n.getNodeLength(t);
            n.isAncestorOf(t, this.sc, !0) && (r = this.sc, i = this.so), n.isAncestorOf(t, this.ec, !0) && (s = this.ec, u = this.eo), st(e, r, i, s, u)
        }
        return new g(e, this.clonePartiallySelectedTextNodes)
    }, detach: function (e) {
        e && this.range.detach(), this.range = this._current = this._next = this._first = this._last = this.sc = this.so = this.ec = this.eo = null
    }}, y.prototype = {BAD_BOUNDARYPOINTS_ERR: 1, INVALID_NODE_TYPE_ERR: 2}, y.prototype.toString = function () {
        return this.message
    }, b.prototype = {_current: null, hasNext: function () {
        return!!this._next
    }, next: function () {
        return this._current = this._next, this._next = this.nodes[++this._position], this._current
    }, detach: function () {
        this._current = this._next = this.nodes = null
    }};
    var w = [1, 3, 4, 5, 7, 8, 10], E = [2, 9, 11], S = [5, 6, 10, 12], x = [1, 3, 4, 5, 7, 8, 10, 11], T = [1, 3, 4, 5, 7, 8], C = n.getRootContainer, k = N([9, 11]), L = N(S), A = N([6, 10, 12]), q = document.createElement("style"), R = !1;
    try {
        q.innerHTML = "<b>x</b>", R = q.firstChild.nodeType == 3
    } catch (U) {
    }
    e.features.htmlParsingConforms = R;
    var z = R ? function (e) {
        var t = this.startContainer, r = n.getDocument(t);
        if (!t)throw new i("INVALID_STATE_ERR");
        var s = null;
        return t.nodeType == 1 ? s = t : n.isCharacterDataNode(t) && (s = n.parentElement(t)), s === null || s.nodeName == "HTML" && n.isHtmlNamespace(n.getDocument(s).documentElement) && n.isHtmlNamespace(s) ? s = r.createElement("body") : s = s.cloneNode(!1), s.innerHTML = e, n.fragmentFromNodeChildren(s)
    } : function (e) {
        M(this);
        var t = o(this), r = t.createElement("body");
        return r.innerHTML = e, n.fragmentFromNodeChildren(r)
    }, W = ["startContainer", "startOffset", "endContainer", "endOffset", "collapsed", "commonAncestorContainer"], X = 0, V = 1, $ = 2, J = 3, K = 0, Q = 1, G = 2, Y = 3;
    Z.prototype = {attachListener: function (e, t) {
        this._listeners[e].push(t)
    }, compareBoundaryPoints: function (e, t) {
        I(this), P(this.startContainer, t.startContainer);
        var r, i, s, o, u = e == J || e == X ? "start" : "end", a = e == V || e == X ? "start" : "end";
        return r = this[u + "Container"], i = this[u + "Offset"], s = t[a + "Container"], o = t[a + "Offset"], n.comparePoints(r, i, s, o)
    }, insertNode: function (e) {
        I(this), _(e, x), H(this.startContainer);
        if (n.isAncestorOf(e, this.startContainer, !0))throw new i("HIERARCHY_REQUEST_ERR");
        var t = l(e, this.startContainer, this.startOffset);
        this.setStartBefore(t)
    }, cloneContents: function () {
        I(this);
        var e, t;
        if (this.collapsed)return o(this).createDocumentFragment();
        if (this.startContainer === this.endContainer && n.isCharacterDataNode(this.startContainer))return e = this.startContainer.cloneNode(!0), e.data = e.data.slice(this.startOffset, this.endOffset), t = o(this).createDocumentFragment(), t.appendChild(e), t;
        var r = new g(this, !0);
        return e = c(r), r.detach(), e
    }, canSurroundContents: function () {
        I(this), H(this.startContainer), H(this.endContainer);
        var e = new g(this, !0), t = e._first && s(e._first, this) || e._last && s(e._last, this);
        return e.detach(), !t
    }, surroundContents: function (e) {
        _(e, T);
        if (!this.canSurroundContents())throw new y("BAD_BOUNDARYPOINTS_ERR");
        var t = this.extractContents();
        if (e.hasChildNodes())while (e.lastChild)e.removeChild(e.lastChild);
        l(e, this.startContainer, this.startOffset), e.appendChild(t), this.selectNode(e)
    }, cloneRange: function () {
        I(this);
        var e = new ut(o(this)), t = W.length, n;
        while (t--)n = W[t], e[n] = this[n];
        return e
    }, toString: function () {
        I(this);
        var e = this.startContainer;
        if (e === this.endContainer && n.isCharacterDataNode(e))return e.nodeType == 3 || e.nodeType == 4 ? e.data.slice(this.startOffset, this.endOffset) : "";
        var t = [], r = new g(this, !0);
        return h(r, function (e) {
            (e.nodeType == 3 || e.nodeType == 4) && t.push(e.data)
        }), r.detach(), t.join("")
    }, compareNode: function (e) {
        I(this);
        var t = e.parentNode, r = n.getNodeIndex(e);
        if (!t)throw new i("NOT_FOUND_ERR");
        var s = this.comparePoint(t, r), o = this.comparePoint(t, r + 1);
        return s < 0 ? o > 0 ? G : K : o > 0 ? Q : Y
    }, comparePoint: function (e, t) {
        return I(this), B(e, "HIERARCHY_REQUEST_ERR"), P(e, this.startContainer), n.comparePoints(e, t, this.startContainer, this.startOffset) < 0 ? -1 : n.comparePoints(e, t, this.endContainer, this.endOffset) > 0 ? 1 : 0
    }, createContextualFragment: z, toHtml: function () {
        I(this);
        var e = o(this).createElement("div");
        return e.appendChild(this.cloneContents()), e.innerHTML
    }, intersectsNode: function (e, t) {
        I(this), B(e, "NOT_FOUND_ERR");
        if (n.getDocument(e) !== o(this))return!1;
        var r = e.parentNode, i = n.getNodeIndex(e);
        B(r, "NOT_FOUND_ERR");
        var s = n.comparePoints(r, i, this.endContainer, this.endOffset), u = n.comparePoints(r, i + 1, this.startContainer, this.startOffset);
        return t ? s <= 0 && u >= 0 : s < 0 && u > 0
    }, isPointInRange: function (e, t) {
        return I(this), B(e, "HIERARCHY_REQUEST_ERR"), P(e, this.startContainer), n.comparePoints(e, t, this.startContainer, this.startOffset) >= 0 && n.comparePoints(e, t, this.endContainer, this.endOffset) <= 0
    }, intersectsRange: function (e, t) {
        I(this);
        if (o(e) != o(this))throw new i("WRONG_DOCUMENT_ERR");
        var r = n.comparePoints(this.startContainer, this.startOffset, e.endContainer, e.endOffset), s = n.comparePoints(this.endContainer, this.endOffset, e.startContainer, e.startOffset);
        return t ? r <= 0 && s >= 0 : r < 0 && s > 0
    }, intersection: function (e) {
        if (this.intersectsRange(e)) {
            var t = n.comparePoints(this.startContainer, this.startOffset, e.startContainer, e.startOffset), r = n.comparePoints(this.endContainer, this.endOffset, e.endContainer, e.endOffset), i = this.cloneRange();
            return t == -1 && i.setStart(e.startContainer, e.startOffset), r == 1 && i.setEnd(e.endContainer, e.endOffset), i
        }
        return null
    }, union: function (e) {
        if (this.intersectsRange(e, !0)) {
            var t = this.cloneRange();
            return n.comparePoints(e.startContainer, e.startOffset, this.startContainer, this.startOffset) == -1 && t.setStart(e.startContainer, e.startOffset), n.comparePoints(e.endContainer, e.endOffset, this.endContainer, this.endOffset) == 1 && t.setEnd(e.endContainer, e.endOffset), t
        }
        throw new y("Ranges do not intersect")
    }, containsNode: function (e, t) {
        return t ? this.intersectsNode(e, !1) : this.compareNode(e) == Y
    }, containsNodeContents: function (e) {
        return this.comparePoint(e, 0) >= 0 && this.comparePoint(e, n.getNodeLength(e)) <= 0
    }, containsRange: function (e) {
        return this.intersection(e).equals(e)
    }, containsNodeText: function (e) {
        var t = this.cloneRange();
        t.selectNode(e);
        var n = t.getNodes([3]);
        if (n.length > 0) {
            t.setStart(n[0], 0);
            var r = n.pop();
            t.setEnd(r, r.length);
            var i = this.containsRange(t);
            return t.detach(), i
        }
        return this.containsNodeContents(e)
    }, createNodeIterator: function (e, t) {
        return I(this), new b(this, e, t)
    }, getNodes: function (e, t) {
        return I(this), v(this, e, t)
    }, getDocument: function () {
        return o(this)
    }, collapseBefore: function (e) {
        M(this), this.setEndBefore(e), this.collapse(!1)
    }, collapseAfter: function (e) {
        M(this), this.setStartAfter(e), this.collapse(!0)
    }, getName: function () {
        return"DomRange"
    }, equals: function (e) {
        return ut.rangesEqual(this, e)
    }, inspect: function () {
        return m(this)
    }}, rt(ut, st, ot), e.rangePrototype = Z.prototype, ut.rangeProperties = W, ut.RangeIterator = g, ut.copyComparisonConstants = tt, ut.createPrototypeRange = rt, ut.inspect = m, ut.getRangeDocument = o, ut.rangesEqual = function (e, t) {
        return e.startContainer === t.startContainer && e.startOffset === t.startOffset && e.endContainer === t.endContainer && e.endOffset === t.endOffset
    }, e.DomRange = ut, e.RangeException = y
}), rangy.createModule("WrappedRange", function (e, t) {
    function o(e) {
        var t = e.parentElement(), n = e.duplicate();
        n.collapse(!0);
        var i = n.parentElement();
        n = e.duplicate(), n.collapse(!1);
        var s = n.parentElement(), o = i == s ? i : r.getCommonAncestor(i, s);
        return o == t ? o : r.getCommonAncestor(t, o)
    }

    function u(e) {
        return e.compareEndPoints("StartToEnd", e) == 0
    }

    function a(e, t, n, s) {
        var o = e.duplicate();
        o.collapse(n);
        var u = o.parentElement();
        r.isAncestorOf(t, u, !0) || (u = t);
        if (!u.canHaveHTML)return new i(u.parentNode, r.getNodeIndex(u));
        var a = r.getDocument(u).createElement("span"), f, l = n ? "StartToStart" : "StartToEnd", c, h, p, d;
        do u.insertBefore(a, a.previousSibling), o.moveToElementText(a); while ((f = o.compareEndPoints(l, e)) > 0 && a.previousSibling);
        d = a.nextSibling;
        if (f == -1 && d && r.isCharacterDataNode(d)) {
            o.setEndPoint(n ? "EndToStart" : "EndToEnd", e);
            var v;
            if (/[\r\n]/.test(d.data)) {
                var m = o.duplicate(), g = m.text.replace(/\r\n/g, "\r").length;
                v = m.moveStart("character", g);
                while ((f = m.compareEndPoints("StartToEnd", m)) == -1)v++, m.moveStart("character", 1)
            } else v = o.text.length;
            p = new i(d, v)
        } else c = (s || !n) && a.previousSibling, h = (s || n) && a.nextSibling, h && r.isCharacterDataNode(h) ? p = new i(h, 0) : c && r.isCharacterDataNode(c) ? p = new i(c, c.length) : p = new i(u, r.getNodeIndex(a));
        return a.parentNode.removeChild(a), p
    }

    function f(e, t) {
        var n, i, s = e.offset, o = r.getDocument(e.node), u, a, f = o.body.createTextRange(), l = r.isCharacterDataNode(e.node);
        return l ? (n = e.node, i = n.parentNode) : (a = e.node.childNodes, n = s < a.length ? a[s] : null, i = e.node), u = o.createElement("span"), u.innerHTML = "&#feff;", n ? i.insertBefore(u, n) : i.appendChild(u), f.moveToElementText(u), f.collapse(!t), i.removeChild(u), l && f[t ? "moveStart" : "moveEnd"]("character", s), f
    }

    e.requireModules(["DomUtil", "DomRange"]);
    var n, r = e.dom, i = r.DomPosition, s = e.DomRange;
    if (e.features.implementsDomRange && (!e.features.implementsTextRange || !e.config.preferTextRange))(function () {
        function u(e) {
            var t = i.length, n;
            while (t--)n = i[t], e[n] = e.nativeRange[n]
        }

        function a(e, t, n, r, i) {
            var s = e.startContainer !== t || e.startOffset != n, o = e.endContainer !== r || e.endOffset != i;
            if (s || o)e.setEnd(r, i), e.setStart(t, n)
        }

        function f(e) {
            e.nativeRange.detach(), e.detached = !0;
            var t = i.length, n;
            while (t--)n = i[t], e[n] = null
        }

        var t, i = s.rangeProperties, o, l;
        n = function (e) {
            if (!e)throw new Error("Range must be specified");
            this.nativeRange = e, u(this)
        }, s.createPrototypeRange(n, a, f), t = n.prototype, t.selectNode = function (e) {
            this.nativeRange.selectNode(e), u(this)
        }, t.deleteContents = function () {
            this.nativeRange.deleteContents(), u(this)
        }, t.extractContents = function () {
            var e = this.nativeRange.extractContents();
            return u(this), e
        }, t.cloneContents = function () {
            return this.nativeRange.cloneContents()
        }, t.surroundContents = function (e) {
            this.nativeRange.surroundContents(e), u(this)
        }, t.collapse = function (e) {
            this.nativeRange.collapse(e), u(this)
        }, t.cloneRange = function () {
            return new n(this.nativeRange.cloneRange())
        }, t.refresh = function () {
            u(this)
        }, t.toString = function () {
            return this.nativeRange.toString()
        };
        var c = document.createTextNode("test");
        r.getBody(document).appendChild(c);
        var h = document.createRange();
        h.setStart(c, 0), h.setEnd(c, 0);
        try {
            h.setStart(c, 1), o = !0, t.setStart = function (e, t) {
                this.nativeRange.setStart(e, t), u(this)
            }, t.setEnd = function (e, t) {
                this.nativeRange.setEnd(e, t), u(this)
            }, l = function (e) {
                return function (t) {
                    this.nativeRange[e](t), u(this)
                }
            }
        } catch (p) {
            o = !1, t.setStart = function (e, t) {
                try {
                    this.nativeRange.setStart(e, t)
                } catch (n) {
                    this.nativeRange.setEnd(e, t), this.nativeRange.setStart(e, t)
                }
                u(this)
            }, t.setEnd = function (e, t) {
                try {
                    this.nativeRange.setEnd(e, t)
                } catch (n) {
                    this.nativeRange.setStart(e, t), this.nativeRange.setEnd(e, t)
                }
                u(this)
            }, l = function (e, t) {
                return function (n) {
                    try {
                        this.nativeRange[e](n)
                    } catch (r) {
                        this.nativeRange[t](n), this.nativeRange[e](n)
                    }
                    u(this)
                }
            }
        }
        t.setStartBefore = l("setStartBefore", "setEndBefore"), t.setStartAfter = l("setStartAfter", "setEndAfter"), t.setEndBefore = l("setEndBefore", "setStartBefore"), t.setEndAfter = l("setEndAfter", "setStartAfter"), h.selectNodeContents(c), h.startContainer == c && h.endContainer == c && h.startOffset == 0 && h.endOffset == c.length ? t.selectNodeContents = function (e) {
            this.nativeRange.selectNodeContents(e), u(this)
        } : t.selectNodeContents = function (e) {
            this.setStart(e, 0), this.setEnd(e, s.getEndOffset(e))
        }, h.selectNodeContents(c), h.setEnd(c, 3);
        var d = document.createRange();
        d.selectNodeContents(c), d.setEnd(c, 4), d.setStart(c, 2), h.compareBoundaryPoints(h.START_TO_END, d) == -1 & h.compareBoundaryPoints(h.END_TO_START, d) == 1 ? t.compareBoundaryPoints = function (e, t) {
            return t = t.nativeRange || t, e == t.START_TO_END ? e = t.END_TO_START : e == t.END_TO_START && (e = t.START_TO_END), this.nativeRange.compareBoundaryPoints(e, t)
        } : t.compareBoundaryPoints = function (e, t) {
            return this.nativeRange.compareBoundaryPoints(e, t.nativeRange || t)
        }, e.util.isHostMethod(h, "createContextualFragment") && (t.createContextualFragment = function (e) {
            return this.nativeRange.createContextualFragment(e)
        }), r.getBody(document).removeChild(c), h.detach(), d.detach()
    })(), e.createNativeRange = function (e) {
        return e = e || document, e.createRange()
    }; else if (e.features.implementsTextRange) {
        n = function (e) {
            this.textRange = e, this.refresh()
        }, n.prototype = new s(document), n.prototype.refresh = function () {
            var e, t, n = o(this.textRange);
            u(this.textRange) ? t = e = a(this.textRange, n, !0, !0) : (e = a(this.textRange, n, !0, !1), t = a(this.textRange, n, !1, !1)), this.setStart(e.node, e.offset), this.setEnd(t.node, t.offset)
        }, s.copyComparisonConstants(n);
        var l = function () {
            return this
        }();
        typeof l.Range == "undefined" && (l.Range = n), e.createNativeRange = function (e) {
            return e = e || document, e.body.createTextRange()
        }
    }
    e.features.implementsTextRange && (n.rangeToTextRange = function (e) {
        if (e.collapsed) {
            var t = f(new i(e.startContainer, e.startOffset), !0);
            return t
        }
        var n = f(new i(e.startContainer, e.startOffset), !0), s = f(new i(e.endContainer, e.endOffset), !1), o = r.getDocument(e.startContainer).body.createTextRange();
        return o.setEndPoint("StartToStart", n), o.setEndPoint("EndToEnd", s), o
    }), n.prototype.getName = function () {
        return"WrappedRange"
    }, e.WrappedRange = n, e.createRange = function (t) {
        return t = t || document, new n(e.createNativeRange(t))
    }, e.createRangyRange = function (e) {
        return e = e || document, new s(e)
    }, e.createIframeRange = function (t) {
        return e.createRange(r.getIframeDocument(t))
    }, e.createIframeRangyRange = function (t) {
        return e.createRangyRange(r.getIframeDocument(t))
    }, e.addCreateMissingNativeApiListener(function (t) {
        var n = t.document;
        typeof n.createRange == "undefined" && (n.createRange = function () {
            return e.createRange(this)
        }), n = t = null
    })
}), rangy.createModule("WrappedSelection", function (e, t) {
    function p(e) {
        return(e || window).getSelection()
    }

    function d(e) {
        return(e || window).document.selection
    }

    function L(e, t, n) {
        var r = n ? "end" : "start", i = n ? "start" : "end";
        e.anchorNode = t[r + "Container"], e.anchorOffset = t[r + "Offset"], e.focusNode = t[i + "Container"], e.focusOffset = t[i + "Offset"]
    }

    function A(e) {
        var t = e.nativeSelection;
        e.anchorNode = t.anchorNode, e.anchorOffset = t.anchorOffset, e.focusNode = t.focusNode, e.focusOffset = t.focusOffset
    }

    function O(e) {
        e.anchorNode = e.focusNode = null, e.anchorOffset = e.focusOffset = 0, e.rangeCount = 0, e.isCollapsed = !0, e._ranges.length = 0
    }

    function M(t) {
        var n;
        return t instanceof o ? (n = t._selectionNativeRange, n || (n = e.createNativeRange(i.getDocument(t.startContainer)), n.setEnd(t.endContainer, t.endOffset), n.setStart(t.startContainer, t.startOffset), t._selectionNativeRange = n, t.attachListener("detach", function () {
            this._selectionNativeRange = null
        }))) : t instanceof u ? n = t.nativeRange : e.features.implementsDomRange && t instanceof i.getWindow(t.startContainer).Range && (n = t), n
    }

    function _(e) {
        if (!e.length || e[0].nodeType != 1)return!1;
        for (var t = 1, n = e.length; t < n; ++t)if (!i.isAncestorOf(e[0], e[t]))return!1;
        return!0
    }

    function D(e) {
        var t = e.getNodes();
        if (!_(t))throw new Error("getSingleElementFromRange: range " + e.inspect() + " did not consist of a single element");
        return t[0]
    }

    function P(e) {
        return!!e && typeof e.text != "undefined"
    }

    function H(e, t) {
        var n = new u(t);
        e._ranges = [n], L(e, n, !1), e.rangeCount = 1, e.isCollapsed = n.collapsed
    }

    function B(t) {
        t._ranges.length = 0;
        if (t.docSelection.type == "None")O(t); else {
            var n = t.docSelection.createRange();
            if (P(n))H(t, n); else {
                t.rangeCount = n.length;
                var r, s = i.getDocument(n.item(0));
                for (var o = 0; o < t.rangeCount; ++o)r = e.createRange(s), r.selectNode(n.item(o)), t._ranges.push(r);
                t.isCollapsed = t.rangeCount == 1 && t._ranges[0].collapsed, L(t, t._ranges[t.rangeCount - 1], !1)
            }
        }
    }

    function j(e, t) {
        var n = e.docSelection.createRange(), r = D(t), s = i.getDocument(n.item(0)), o = i.getBody(s).createControlRange();
        for (var u = 0, a = n.length; u < a; ++u)o.add(n.item(u));
        try {
            o.add(r)
        } catch (f) {
            throw new Error("addRange(): Element within the specified Range could not be added to control selection (does it have layout?)")
        }
        o.select(), B(e)
    }

    function I(e, t, n) {
        this.nativeSelection = e, this.docSelection = t, this._ranges = [], this.win = n, this.refresh()
    }

    function R(e, t) {
        var n = i.getDocument(t[0].startContainer), r = i.getBody(n).createControlRange();
        for (var s = 0, o; s < rangeCount; ++s) {
            o = D(t[s]);
            try {
                r.add(o)
            } catch (u) {
                throw new Error("setRanges(): Element within the one of the specified Ranges could not be added to control selection (does it have layout?)")
            }
        }
        r.select(), B(e)
    }

    function V(e, t) {
        if (e.anchorNode && i.getDocument(e.anchorNode) !== i.getDocument(t))throw new a("WRONG_DOCUMENT_ERR")
    }

    function $(e) {
        var t = [], n = new f(e.anchorNode, e.anchorOffset), r = new f(e.focusNode, e.focusOffset), i = typeof e.getName == "function" ? e.getName() : "Selection";
        if (typeof e.rangeCount != "undefined")for (var s = 0, u = e.rangeCount; s < u; ++s)t[s] = o.inspect(e.getRangeAt(s));
        return"[" + i + "(Ranges: " + t.join(", ") + ")(anchor: " + n.inspect() + ", focus: " + r.inspect() + "]"
    }

    e.requireModules(["DomUtil", "DomRange", "WrappedRange"]), e.config.checkSelectionRanges = !0;
    var n = "boolean", r = "_rangySelection", i = e.dom, s = e.util, o = e.DomRange, u = e.WrappedRange, a = e.DOMException, f = i.DomPosition, l, c, h = "Control", v = e.util.isHostMethod(window, "getSelection"), m = e.util.isHostObject(document, "selection"), g = m && (!v || e.config.preferTextRange);
    g ? (l = d, e.isSelectionValid = function (e) {
        var t = (e || window).document, n = t.selection;
        return n.type != "None" || i.getDocument(n.createRange().parentElement()) == t
    }) : v ? (l = p, e.isSelectionValid = function () {
        return!0
    }) : t.fail("Neither document.selection or window.getSelection() detected."), e.getNativeSelection = l;
    var y = l(), b = e.createNativeRange(document), w = i.getBody(document), E = s.areHostObjects(y, ["anchorNode", "focusNode"] && s.areHostProperties(y, ["anchorOffset", "focusOffset"]));
    e.features.selectionHasAnchorAndFocus = E;
    var S = s.isHostMethod(y, "extend");
    e.features.selectionHasExtend = S;
    var x = typeof y.rangeCount == "number";
    e.features.selectionHasRangeCount = x;
    var T = !1, N = !0;
    s.areHostMethods(y, ["addRange", "getRangeAt", "removeAllRanges"]) && typeof y.rangeCount == "number" && e.features.implementsDomRange && function () {
        var e = document.createElement("iframe");
        w.appendChild(e);
        var t = i.getIframeDocument(e);
        t.open(), t.write("<html><head></head><body>12</body></html>"), t.close();
        var n = i.getIframeWindow(e).getSelection(), r = t.documentElement, s = r.lastChild, o = s.firstChild, u = t.createRange();
        u.setStart(o, 1), u.collapse(!0), n.addRange(u), N = n.rangeCount == 1, n.removeAllRanges();
        var a = u.cloneRange();
        u.setStart(o, 0), a.setEnd(o, 2), n.addRange(u), n.addRange(a), T = n.rangeCount == 2, u.detach(), a.detach(), w.removeChild(e)
    }(), e.features.selectionSupportsMultipleRanges = T, e.features.collapsedNonEditableSelectionsSupported = N;
    var C = !1, k;
    w && s.isHostMethod(w, "createControlRange") && (k = w.createControlRange(), s.areHostProperties(k, ["item", "add"]) && (C = !0)), e.features.implementsControlRange = C, E ? c = function (e) {
        return e.anchorNode === e.focusNode && e.anchorOffset === e.focusOffset
    } : c = function (e) {
        return e.rangeCount ? e.getRangeAt(e.rangeCount - 1).collapsed : !1
    };
    var F;
    s.isHostMethod(y, "getRangeAt") ? F = function (e, t) {
        try {
            return e.getRangeAt(t)
        } catch (n) {
            return null
        }
    } : E && (F = function (t) {
        var n = i.getDocument(t.anchorNode), r = e.createRange(n);
        return r.setStart(t.anchorNode, t.anchorOffset), r.setEnd(t.focusNode, t.focusOffset), r.collapsed !== this.isCollapsed && (r.setStart(t.focusNode, t.focusOffset), r.setEnd(t.anchorNode, t.anchorOffset)), r
    }), e.getSelection = function (e) {
        e = e || window;
        var t = e[r], n = l(e), i = m ? d(e) : null;
        return t ? (t.nativeSelection = n, t.docSelection = i, t.refresh(e)) : (t = new I(n, i, e), e[r] = t), t
    }, e.getIframeSelection = function (t) {
        return e.getSelection(i.getIframeWindow(t))
    };
    var q = I.prototype;
    if (!g && E && s.areHostMethods(y, ["removeAllRanges", "addRange"])) {
        q.removeAllRanges = function () {
            this.nativeSelection.removeAllRanges(), O(this)
        };
        var U = function (t, n) {
            var r = o.getRangeDocument(n), i = e.createRange(r);
            i.collapseToPoint(n.endContainer, n.endOffset), t.nativeSelection.addRange(M(i)), t.nativeSelection.extend(n.startContainer, n.startOffset), t.refresh()
        };
        x ? q.addRange = function (t, n) {
            if (C && m && this.docSelection.type == h)j(this, t); else if (n && S)U(this, t); else {
                var r;
                T ? r = this.rangeCount : (this.removeAllRanges(), r = 0), this.nativeSelection.addRange(M(t)), this.rangeCount = this.nativeSelection.rangeCount;
                if (this.rangeCount == r + 1) {
                    if (e.config.checkSelectionRanges) {
                        var i = F(this.nativeSelection, this.rangeCount - 1);
                        i && !o.rangesEqual(i, t) && (t = new u(i))
                    }
                    this._ranges[this.rangeCount - 1] = t, L(this, t, X(this.nativeSelection)), this.isCollapsed = c(this)
                } else this.refresh()
            }
        } : q.addRange = function (e, t) {
            t && S ? U(this, e) : (this.nativeSelection.addRange(M(e)), this.refresh())
        }, q.setRanges = function (e) {
            if (C && e.length > 1)R(this, e); else {
                this.removeAllRanges();
                for (var t = 0, n = e.length; t < n; ++t)this.addRange(e[t])
            }
        }
    } else {
        if (!(s.isHostMethod(y, "empty") && s.isHostMethod(b, "select") && C && g))return t.fail("No means of selecting a Range or TextRange was found"), !1;
        q.removeAllRanges = function () {
            try {
                this.docSelection.empty();
                if (this.docSelection.type != "None") {
                    var e;
                    if (this.anchorNode)e = i.getDocument(this.anchorNode); else if (this.docSelection.type == h) {
                        var t = this.docSelection.createRange();
                        t.length && (e = i.getDocument(t.item(0)).body.createTextRange())
                    }
                    if (e) {
                        var n = e.body.createTextRange();
                        n.select(), this.docSelection.empty()
                    }
                }
            } catch (r) {
            }
            O(this)
        }, q.addRange = function (e) {
            this.docSelection.type == h ? j(this, e) : (u.rangeToTextRange(e).select(), this._ranges[0] = e, this.rangeCount = 1, this.isCollapsed = this._ranges[0].collapsed, L(this, e, !1))
        }, q.setRanges = function (e) {
            this.removeAllRanges();
            var t = e.length;
            t > 1 ? R(this, e) : t && this.addRange(e[0])
        }
    }
    q.getRangeAt = function (e) {
        if (e < 0 || e >= this.rangeCount)throw new a("INDEX_SIZE_ERR");
        return this
            ._ranges[e]
    };
    var z;
    if (g)z = function (t) {
        var n;
        e.isSelectionValid(t.win) ? n = t.docSelection.createRange() : (n = i.getBody(t.win.document).createTextRange(), n.collapse(!0)), t.docSelection.type == h ? B(t) : P(n) ? H(t, n) : O(t)
    }; else if (s.isHostMethod(y, "getRangeAt") && typeof y.rangeCount == "number")z = function (t) {
        if (C && m && t.docSelection.type == h)B(t); else {
            t._ranges.length = t.rangeCount = t.nativeSelection.rangeCount;
            if (t.rangeCount) {
                for (var n = 0, r = t.rangeCount; n < r; ++n)t._ranges[n] = new e.WrappedRange(t.nativeSelection.getRangeAt(n));
                L(t, t._ranges[t.rangeCount - 1], X(t.nativeSelection)), t.isCollapsed = c(t)
            } else O(t)
        }
    }; else {
        if (!E || typeof y.isCollapsed != n || typeof b.collapsed != n || !e.features.implementsDomRange)return t.fail("No means of obtaining a Range or TextRange from the user's selection was found"), !1;
        z = function (e) {
            var t, n = e.nativeSelection;
            n.anchorNode ? (t = F(n, 0), e._ranges = [t], e.rangeCount = 1, A(e), e.isCollapsed = c(e)) : O(e)
        }
    }
    q.refresh = function (e) {
        var t = e ? this._ranges.slice(0) : null;
        z(this);
        if (e) {
            var n = t.length;
            if (n != this._ranges.length)return!1;
            while (n--)if (!o.rangesEqual(t[n], this._ranges[n]))return!1;
            return!0
        }
    };
    var W = function (e, t) {
        var n = e.getAllRanges(), r = !1;
        e.removeAllRanges();
        for (var i = 0, s = n.length; i < s; ++i)r || t !== n[i] ? e.addRange(n[i]) : r = !0;
        e.rangeCount || O(e)
    };
    C ? q.removeRange = function (e) {
        if (this.docSelection.type == h) {
            var t = this.docSelection.createRange(), n = D(e), r = i.getDocument(t.item(0)), s = i.getBody(r).createControlRange(), o, u = !1;
            for (var a = 0, f = t.length; a < f; ++a)o = t.item(a), o !== n || u ? s.add(t.item(a)) : u = !0;
            s.select(), B(this)
        } else W(this, e)
    } : q.removeRange = function (e) {
        W(this, e)
    };
    var X;
    !g && E && e.features.implementsDomRange ? (X = function (e) {
        var t = !1;
        return e.anchorNode && (t = i.comparePoints(e.anchorNode, e.anchorOffset, e.focusNode, e.focusOffset) == 1), t
    }, q.isBackwards = function () {
        return X(this)
    }) : X = q.isBackwards = function () {
        return!1
    }, q.toString = function () {
        var e = [];
        for (var t = 0, n = this.rangeCount; t < n; ++t)e[t] = "" + this._ranges[t];
        return e.join("")
    }, q.collapse = function (t, n) {
        V(this, t);
        var r = e.createRange(i.getDocument(t));
        r.collapseToPoint(t, n), this.removeAllRanges(), this.addRange(r), this.isCollapsed = !0
    }, q.collapseToStart = function () {
        if (!this.rangeCount)throw new a("INVALID_STATE_ERR");
        var e = this._ranges[0];
        this.collapse(e.startContainer, e.startOffset)
    }, q.collapseToEnd = function () {
        if (!this.rangeCount)throw new a("INVALID_STATE_ERR");
        var e = this._ranges[this.rangeCount - 1];
        this.collapse(e.endContainer, e.endOffset)
    }, q.selectAllChildren = function (t) {
        V(this, t);
        var n = e.createRange(i.getDocument(t));
        n.selectNodeContents(t), this.removeAllRanges(), this.addRange(n)
    }, q.deleteFromDocument = function () {
        if (C && m && this.docSelection.type == h) {
            var e = this.docSelection.createRange(), t;
            while (e.length)t = e.item(0), e.remove(t), t.parentNode.removeChild(t);
            this.refresh()
        } else if (this.rangeCount) {
            var n = this.getAllRanges();
            this.removeAllRanges();
            for (var r = 0, i = n.length; r < i; ++r)n[r].deleteContents();
            this.addRange(n[i - 1])
        }
    }, q.getAllRanges = function () {
        return this._ranges.slice(0)
    }, q.setSingleRange = function (e) {
        this.setRanges([e])
    }, q.containsNode = function (e, t) {
        for (var n = 0, r = this._ranges.length; n < r; ++n)if (this._ranges[n].containsNode(e, t))return!0;
        return!1
    }, q.toHtml = function () {
        var e = "";
        if (this.rangeCount) {
            var t = o.getRangeDocument(this._ranges[0]).createElement("div");
            for (var n = 0, r = this._ranges.length; n < r; ++n)t.appendChild(this._ranges[n].cloneContents());
            e = t.innerHTML
        }
        return e
    }, q.getName = function () {
        return"WrappedSelection"
    }, q.inspect = function () {
        return $(this)
    }, q.detach = function () {
        this.win[r] = null, this.win = this.anchorNode = this.focusNode = null
    }, I.inspect = $, e.Selection = I, e.selectionPrototype = q, e.addCreateMissingNativeApiListener(function (t) {
        typeof t.getSelection == "undefined" && (t.getSelection = function () {
            return e.getSelection(this)
        }), t = null
    })
});
var Base = function () {
};
Base.extend = function (e, t) {
    var n = Base.prototype.extend;
    Base._prototyping = !0;
    var r = new this;
    n.call(r, e), r.base = function () {
    }, delete Base._prototyping;
    var i = r.constructor, s = r.constructor = function () {
        if (!Base._prototyping)if (this._constructing || this.constructor == s)this._constructing = !0, i.apply(this, arguments), delete this._constructing; else if (arguments[0] != null)return(arguments[0].extend || n).call(arguments[0], r)
    };
    return s.ancestor = this, s.extend = this.extend, s.forEach = this.forEach, s.implement = this.implement, s.prototype = r, s.toString = this.toString, s.valueOf = function (e) {
        return e == "object" ? s : i.valueOf()
    }, n.call(s, t), typeof s.init == "function" && s.init(), s
}, Base.prototype = {extend: function (e, t) {
    if (arguments.length > 1) {
        var n = this[e];
        if (n && typeof t == "function" && (!n.valueOf || n.valueOf() != t.valueOf()) && /\bbase\b/.test(t)) {
            var r = t.valueOf();
            t = function () {
                var e = this.base || Base.prototype.base;
                this.base = n;
                var t = r.apply(this, arguments);
                return this.base = e, t
            }, t.valueOf = function (e) {
                return e == "object" ? t : r
            }, t.toString = Base.toString
        }
        this[e] = t
    } else if (e) {
        var i = Base.prototype.extend;
        !Base._prototyping && typeof this != "function" && (i = this.extend || i);
        var s = {toSource: null}, o = ["constructor", "toString", "valueOf"], u = Base._prototyping ? 0 : 1;
        while (a = o[u++])e[a] != s[a] && i.call(this, a, e[a]);
        for (var a in e)s[a] || i.call(this, a, e[a])
    }
    return this
}}, Base = Base.extend({constructor: function () {
    this.extend(arguments[0])
}}, {ancestor: Object, version: "1.1", forEach: function (e, t, n) {
    for (var r in e)this.prototype[r] === undefined && t.call(n, e[r], r, e)
}, implement: function () {
    for (var e = 0; e < arguments.length; e++)typeof arguments[e] == "function" ? arguments[e](this.prototype) : this.prototype.extend(arguments[e]);
    return this
}, toString: function () {
    return String(this.valueOf())
}}), wysihtml5.browser = function () {
    function u(e) {
        return(/ipad|iphone|ipod/.test(e) && e.match(/ os (\d+).+? like mac os x/) || [, 0])[1]
    }

    var e = navigator.userAgent, t = document.createElement("div"), n = e.indexOf("MSIE") !== -1 && e.indexOf("Opera") === -1, r = e.indexOf("Gecko") !== -1 && e.indexOf("KHTML") === -1, i = e.indexOf("AppleWebKit/") !== -1, s = e.indexOf("Chrome/") !== -1, o = e.indexOf("Opera/") !== -1;
    return{USER_AGENT: e, supported: function () {
        var e = this.USER_AGENT.toLowerCase(), n = "contentEditable"in t, r = document.execCommand && document.queryCommandSupported && document.queryCommandState, i = document.querySelector && document.querySelectorAll, s = this.isIos() && u(e) < 5 || e.indexOf("opera mobi") !== -1 || e.indexOf("hpwos/") !== -1;
        return n && r && i && !s
    }, isTouchDevice: function () {
        return this.supportsEvent("touchmove")
    }, isIos: function () {
        var e = this.USER_AGENT.toLowerCase();
        return e.indexOf("webkit") !== -1 && e.indexOf("mobile") !== -1
    }, supportsSandboxedIframes: function () {
        return n
    }, throwsMixedContentWarningWhenIframeSrcIsEmpty: function () {
        return!("querySelector"in document)
    }, displaysCaretInEmptyContentEditableCorrectly: function () {
        return!r
    }, hasCurrentStyleProperty: function () {
        return"currentStyle"in t
    }, insertsLineBreaksOnReturn: function () {
        return r
    }, supportsPlaceholderAttributeOn: function (e) {
        return"placeholder"in e
    }, supportsEvent: function (e) {
        return"on" + e in t || function () {
            return t.setAttribute("on" + e, "return;"), typeof t["on" + e] == "function"
        }()
    }, supportsEventsInIframeCorrectly: function () {
        return!o
    }, firesOnDropOnlyWhenOnDragOverIsCancelled: function () {
        return i || r
    }, supportsDataTransfer: function () {
        try {
            return i && (window.Clipboard || window.DataTransfer).prototype.getData
        } catch (e) {
            return!1
        }
    }, supportsHTML5Tags: function (e) {
        var t = e.createElement("div"), n = "<article>foo</article>";
        return t.innerHTML = n, t.innerHTML.toLowerCase() === n
    }, supportsCommand: function () {
        var e = {formatBlock: n, insertUnorderedList: n || o || i, insertOrderedList: n || o || i}, t = {insertHTML: r};
        return function (n, r) {
            var i = e[r];
            if (!i) {
                try {
                    return n.queryCommandSupported(r)
                } catch (s) {
                }
                try {
                    return n.queryCommandEnabled(r)
                } catch (o) {
                    return!!t[r]
                }
            }
            return!1
        }
    }(), doesAutoLinkingInContentEditable: function () {
        return n
    }, canDisableAutoLinking: function () {
        return this.supportsCommand(document, "AutoUrlDetect")
    }, clearsContentEditableCorrectly: function () {
        return r || o || i
    }, supportsGetAttributeCorrectly: function () {
        var e = document.createElement("td");
        return e.getAttribute("rowspan") != "1"
    }, canSelectImagesInContentEditable: function () {
        return r || n || o
    }, clearsListsInContentEditableCorrectly: function () {
        return r || n || i
    }, autoScrollsToCaret: function () {
        return!i
    }, autoClosesUnclosedTags: function () {
        var e = t.cloneNode(!1), n, r;
        return e.innerHTML = "<p><div></div>", r = e.innerHTML.toLowerCase(), n = r === "<p></p><div></div>" || r === "<p><div></div></p>", this.autoClosesUnclosedTags = function () {
            return n
        }, n
    }, supportsNativeGetElementsByClassName: function () {
        return String(document.getElementsByClassName).indexOf("[native code]") !== -1
    }, supportsSelectionModify: function () {
        return"getSelection"in window && "modify"in window.getSelection()
    }, supportsClassList: function () {
        return"classList"in t
    }, needsSpaceAfterLineBreak: function () {
        return o
    }, supportsSpeechApiOn: function (t) {
        var n = e.match(/Chrome\/(\d+)/) || [, 0];
        return n[1] >= 11 && ("onwebkitspeechchange"in t || "speech"in t)
    }, crashesWhenDefineProperty: function (e) {
        return n && (e === "XMLHttpRequest" || e === "XDomainRequest")
    }, doesAsyncFocus: function () {
        return n
    }, hasProblemsSettingCaretAfterImg: function () {
        return n
    }, hasUndoInContextMenu: function () {
        return r || s || o
    }}
}(), wysihtml5.lang.array = function (e) {
    return{contains: function (t) {
        if (e.indexOf)return e.indexOf(t) !== -1;
        for (var n = 0, r = e.length; n < r; n++)if (e[n] === t)return!0;
        return!1
    }, without: function (t) {
        t = wysihtml5.lang.array(t);
        var n = [], r = 0, i = e.length;
        for (; r < i; r++)t.contains(e[r]) || n.push(e[r]);
        return n
    }, get: function () {
        var t = 0, n = e.length, r = [];
        for (; t < n; t++)r.push(e[t]);
        return r
    }}
}, wysihtml5.lang.Dispatcher = Base.extend({observe: function (e, t) {
    return this.events = this.events || {}, this.events[e] = this.events[e] || [], this.events[e].push(t), this
}, on: function () {
    return this.observe.apply(this, wysihtml5.lang.array(arguments).get())
}, fire: function (e, t) {
    this.events = this.events || {};
    var n = this.events[e] || [], r = 0;
    for (; r < n.length; r++)n[r].call(this, t);
    return this
}, stopObserving: function (e, t) {
    this.events = this.events || {};
    var n = 0, r, i;
    if (e) {
        r = this.events[e] || [], i = [];
        for (; n < r.length; n++)r[n] !== t && t && i.push(r[n]);
        this.events[e] = i
    } else this.events = {};
    return this
}}), wysihtml5.lang.object = function (e) {
    return{merge: function (t) {
        for (var n in t)e[n] = t[n];
        return this
    }, get: function () {
        return e
    }, clone: function () {
        var t = {}, n;
        for (n in e)t[n] = e[n];
        return t
    }, isArray: function () {
        return Object.prototype.toString.call(e) === "[object Array]"
    }}
}, function () {
    var e = /^\s+/, t = /\s+$/;
    wysihtml5.lang.string = function (n) {
        return n = String(n), {trim: function () {
            return n.replace(e, "").replace(t, "")
        }, interpolate: function (e) {
            for (var t in e)n = this.replace("#{"+t+"}").by(e[t]);
            return n
        }, replace: function (e) {
            return{by: function (t) {
                return n.split(e).join(t)
            }}
        }}
    }
}(), function (e) {
    function o(e) {
        return l(e) ? e : (e === e.ownerDocument.documentElement && (e = e.ownerDocument.body), c(e))
    }

    function u(e) {
        return e.replace(n, function (e, t) {
            var n = (t.match(r) || [])[1] || "", o = s[n];
            t = t.replace(r, ""), t.split(o).length > t.split(n).length && (t += n, n = "");
            var u = t, a = t;
            return t.length > i && (a = a.substr(0, i) + "..."), u.substr(0, 4) === "www." && (u = "http://" + u), '<a href="' + u + '">' + a + "</a>" + n
        })
    }

    function a(e) {
        var t = e._wysihtml5_tempElement;
        return t || (t = e._wysihtml5_tempElement = e.createElement("div")), t
    }

    function f(e) {
        var t = e.parentNode, n = a(t.ownerDocument);
        n.innerHTML = "<span></span>" + u(e.data), n.removeChild(n.firstChild);
        while (n.firstChild)t.insertBefore(n.firstChild, e);
        t.removeChild(e)
    }

    function l(e) {
        var n;
        while (e.parentNode) {
            e = e.parentNode, n = e.nodeName;
            if (t.contains(n))return!0;
            if (n === "body")return!1
        }
        return!1
    }

    function c(r) {
        if (t.contains(r.nodeName))return;
        if (r.nodeType === e.TEXT_NODE && r.data.match(n)) {
            f(r);
            return
        }
        var i = e.lang.array(r.childNodes).get(), s = i.length, o = 0;
        for (; o < s; o++)c(i[o]);
        return r
    }

    var t = e.lang.array(["CODE", "PRE", "A", "SCRIPT", "HEAD", "TITLE", "STYLE"]), n = /((https?:\/\/|www\.)[^\s<]{3,})/gi, r = /([^\w\/\-](,?))$/i, i = 100, s = {")": "(", "]": "[", "}": "{"};
    e.dom.autoLink = o, e.dom.autoLink.URL_REG_EXP = n
}(wysihtml5), function (e) {
    var t = e.browser.supportsClassList(), n = e.dom;
    n.addClass = function (e, r) {
        if (t)return e.classList.add(r);
        if (n.hasClass(e, r))return;
        e.className += " " + r
    }, n.removeClass = function (e, n) {
        if (t)return e.classList.remove(n);
        e.className = e.className.replace(new RegExp("(^|\\s+)" + n + "(\\s+|$)"), " ")
    }, n.hasClass = function (e, n) {
        if (t)return e.classList.contains(n);
        var r = e.className;
        return r.length > 0 && (r == n || (new RegExp("(^|\\s)" + n + "(\\s|$)")).test(r))
    }
}(wysihtml5), wysihtml5.dom.contains = function () {
    var e = document.documentElement;
    if (e.contains)return function (e, t) {
        return t.nodeType !== wysihtml5.ELEMENT_NODE && (t = t.parentNode), e !== t && e.contains(t)
    };
    if (e.compareDocumentPosition)return function (e, t) {
        return!!(e.compareDocumentPosition(t) & 16)
    }
}(), wysihtml5.dom.convertToList = function () {
    function e(e, t) {
        var n = e.createElement("li");
        return t.appendChild(n), n
    }

    function t(e, t) {
        return e.createElement(t)
    }

    function n(n, r) {
        if (n.nodeName === "UL" || n.nodeName === "OL" || n.nodeName === "MENU")return n;
        var i = n.ownerDocument, s = t(i, r), o = n.querySelectorAll("br"), u = o.length, a, f, l, c, h, p, d, v, m;
        for (m = 0; m < u; m++) {
            c = o[m];
            while ((h = c.parentNode) && h !== n && h.lastChild === c) {
                if (wysihtml5.dom.getStyle("display").from(h) === "block") {
                    h.removeChild(c);
                    break
                }
                wysihtml5.dom.insert(c).after(c.parentNode)
            }
        }
        a = wysihtml5.lang.array(n.childNodes).get(), f = a.length;
        for (m = 0; m < f; m++) {
            v = v || e(i, s), l = a[m], p = wysihtml5.dom.getStyle("display").from(l) === "block", d = l.nodeName === "BR";
            if (p) {
                v = v.firstChild ? e(i, s) : v, v.appendChild(l), v = null;
                continue
            }
            if (d) {
                v = v.firstChild ? null : v;
                continue
            }
            v.appendChild(l)
        }
        return n.parentNode.replaceChild(s, n), s
    }

    return n
}(), wysihtml5.dom.copyAttributes = function (e) {
    return{from: function (t) {
        return{to: function (n) {
            var r, i = 0, s = e.length;
            for (; i < s; i++)r = e[i], typeof t[r] != "undefined" && t[r] !== "" && (n[r] = t[r]);
            return{andTo: arguments.callee}
        }}
    }}
}, function (e) {
    var t = ["-webkit-box-sizing", "-moz-box-sizing", "-ms-box-sizing", "box-sizing"], n = function (t) {
        return r(t) ? parseInt(e.getStyle("width").from(t), 10) < t.offsetWidth : !1
    }, r = function (n) {
        var r = 0, i = t.length;
        for (; r < i; r++)if (e.getStyle(t[r]).from(n) === "border-box")return t[r]
    };
    e.copyStyles = function (r) {
        return{from: function (i) {
            n(i) && (r = wysihtml5.lang.array(r).without(t));
            var s = "", o = r.length, u = 0, a;
            for (; u < o; u++)a = r[u], s += a + ":" + e.getStyle(a).from(i) + ";";
            return{to: function (t) {
                return e.setStyles(s).on(t), {andTo: arguments.callee}
            }}
        }}
    }
}(wysihtml5.dom), function (e) {
    e.dom.delegate = function (t, n, r, i) {
        return e.dom.observe(t, r, function (r) {
            var s = r.target, o = e.lang.array(t.querySelectorAll(n));
            while (s && s !== t) {
                if (o.contains(s)) {
                    i.call(s, r);
                    break
                }
                s = s.parentNode
            }
        })
    }
}(wysihtml5), wysihtml5.dom.getAsDom = function () {
    var e = function (e, t) {
        var n = t.createElement("div");
        n.style.display = "none", t.body.appendChild(n);
        try {
            n.innerHTML = e
        } catch (r) {
        }
        return t.body.removeChild(n), n
    }, t = function (e) {
        if (e._wysihtml5_supportsHTML5Tags)return;
        for (var t = 0, r = n.length; t < r; t++)e.createElement(n[t]);
        e._wysihtml5_supportsHTML5Tags = !0
    }, n = ["abbr", "article", "aside", "audio", "bdi", "canvas", "command", "datalist", "details", "figcaption", "figure", "footer", "header", "hgroup", "keygen", "mark", "meter", "nav", "output", "progress", "rp", "rt", "ruby", "svg", "section", "source", "summary", "time", "track", "video", "wbr"];
    return function (n, r) {
        r = r || document;
        var i;
        return typeof n == "object" && n.nodeType ? (i = r.createElement("div"), i.appendChild(n)) : wysihtml5.browser.supportsHTML5Tags(r) ? (i = r.createElement("div"), i.innerHTML = n) : (t(r), i = e(n, r)), i
    }
}(), wysihtml5.dom.getParentElement = function () {
    function e(e, t) {
        return!t || !t.length ? !0 : typeof t == "string" ? e === t : wysihtml5.lang.array(t).contains(e)
    }

    function t(e) {
        return e.nodeType === wysihtml5.ELEMENT_NODE
    }

    function n(e, t, n) {
        var r = (e.className || "").match(n) || [];
        return t ? r[r.length - 1] === t : !!r.length
    }

    function r(t, n, r) {
        while (r-- && t && t.nodeName !== "BODY") {
            if (e(t.nodeName, n))return t;
            t = t.parentNode
        }
        return null
    }

    function i(r, i, s, o, u) {
        while (u-- && r && r.nodeName !== "BODY") {
            if (t(r) && e(r.nodeName, i) && n(r, s, o))return r;
            r = r.parentNode
        }
        return null
    }

    return function (e, t, n) {
        return n = n || 50, t.className || t.classRegExp ? i(e, t.nodeName, t.className, t.classRegExp, n) : r(e, t.nodeName, n)
    }
}(), wysihtml5.dom.getStyle = function () {
    function n(e) {
        return e.replace(t, function (e) {
            return e.charAt(1).toUpperCase()
        })
    }

    var e = {"float": "styleFloat"in document.createElement("div").style ? "styleFloat" : "cssFloat"}, t = /\-[a-z]/g;
    return function (t) {
        return{from: function (r) {
            if (r.nodeType !== wysihtml5.ELEMENT_NODE)return;
            var i = r.ownerDocument, s = e[t] || n(t), o = r.style, u = r.currentStyle, a = o[s];
            if (a)return a;
            if (u)try {
                return u[s]
            } catch (f) {
            }
            var l = i.defaultView || i.parentWindow, c = (t === "height" || t === "width") && r.nodeName === "TEXTAREA", h, p;
            if (l.getComputedStyle)return c && (h = o.overflow, o.overflow = "hidden"), p = l.getComputedStyle(r, null).getPropertyValue(t), c && (o.overflow = h || ""), p
        }}
    }
}(), wysihtml5.dom.hasElementWithTagName = function () {
    function n(e) {
        return e._wysihtml5_identifier || (e._wysihtml5_identifier = t++)
    }

    var e = {}, t = 1;
    return function (t, r) {
        var i = n(t) + ":" + r, s = e[i];
        return s || (s = e[i] = t.getElementsByTagName(r)), s.length > 0
    }
}(), function (e) {
    function r(e) {
        return e._wysihtml5_identifier || (e._wysihtml5_identifier = n++)
    }

    var t = {}, n = 1;
    e.dom.hasElementWithClassName = function (n, i) {
        if (!e.browser.supportsNativeGetElementsByClassName())return!!n.querySelector("." + i);
        var s = r(n) + ":" + i, o = t[s];
        return o || (o = t[s] = n.getElementsByClassName(i)), o.length > 0
    }
}(wysihtml5), wysihtml5.dom.insert = function (e) {
    return{after: function (t) {
        t.parentNode.insertBefore(e, t.nextSibling)
    }, before: function (t) {
        t.parentNode.insertBefore(e, t)
    }, into: function (t) {
        t.appendChild(e)
    }}
}, wysihtml5.dom.insertCSS = function (e) {
    return e = e.join("\n"), {into: function (t) {
        var n = t.head || t.getElementsByTagName("head")[0], r = t.createElement("style");
        r.type = "text/css", r.styleSheet ? r.styleSheet.cssText = e : r.appendChild(t.createTextNode(e)), n && n.appendChild(r)
    }}
}, wysihtml5.dom.observe = function (e, t, n) {
    t = typeof t == "string" ? [t] : t;
    var r, i, s = 0, o = t.length;
    for (; s < o; s++)i = t[s], e.addEventListener ? e.addEventListener(i, n, !1) : (r = function (t) {
        "target"in t || (t.target = t.srcElement), t.preventDefault = t.preventDefault || function () {
            this.returnValue = !1
        }, t.stopPropagation = t.stopPropagation || function () {
            this.cancelBubble = !0
        }, n.call(e, t)
    }, e.attachEvent("on" + i, r));
    return{stop: function () {
        var i, s = 0, o = t.length;
        for (; s < o; s++)i = t[s], e.removeEventListener ? e.removeEventListener(i, n, !1) : e.detachEvent("on" + i, r)
    }}
}, wysihtml5.dom.parse = function () {
    function s(e, t, n, s) {
        wysihtml5.lang.object(i).merge(r).merge(t).get(), n = n || e.ownerDocument || document;
        var u = n.createDocumentFragment(), a = typeof e == "string", f, l, c;
        a ? f = wysihtml5.dom.getAsDom(e, n) : f = e;
        while (f.firstChild)c = f.firstChild, f.removeChild(c), l = o(c, s), l && u.appendChild(l);
        return f.innerHTML = "", f.appendChild(u), a ? wysihtml5.quirks.getCorrectInnerHTML(f) : f
    }

    function o(n, r) {
        var i = n.nodeType, s = n.childNodes, u = s.length, a, f = e[i], l = 0;
        a = f && f(n);
        if (!a)return null;
        for (l = 0; l < u; l++)newChild = o(s[l], r), newChild && a.appendChild(newChild);
        return r && a.childNodes.length <= 1 && a.nodeName.toLowerCase() === t && !a.attributes.length ? a.firstChild : a
    }

    function u(e) {
        var n, r, s, o = i.tags, u = e.nodeName.toLowerCase(), f = e.scopeName;
        if (e._wysihtml5)return null;
        e._wysihtml5 = 1;
        if (e.className === "wysihtml5-temp")return null;
        f && f != "HTML" && (u = f + ":" + u), "outerHTML"in e && !wysihtml5.browser.autoClosesUnclosedTags() && e.nodeName === "P" && e.outerHTML.slice(-4).toLowerCase() !== "</p>" && (u = "div");
        if (u in o) {
            n = o[u];
            if (!n || n.remove)return null;
            n = typeof n == "string" ? {rename_tag: n} : n
        } else {
            if (!e.firstChild)return null;
            n = {rename_tag: t}
        }
        return r = e.ownerDocument.createElement(n.rename_tag || u), a(e, r, n), e = null, r
    }

    function a(e, t, r) {
        var s = {}, o = r.set_class, u = r.add_class, a = r.set_attributes, f = r.check_attributes, c = i.classes, h = 0, v = [], m = [], g = [], y = [], b, w, E, S, x, T, N;
        a && (s = wysihtml5.lang.object(a).clone());
        if (f)for (x in f) {
            N = p[f[x]];
            if (!N)continue;
            T = N(l(e, x)), typeof T == "string" && (s[x] = T)
        }
        o && v.push(o);
        if (u)for (x in u) {
            N = d[u[x]];
            if (!N)continue;
            S = N(l(e, x)), typeof S == "string" && v.push(S)
        }
        c["_wysihtml5-temp-placeholder"] = 1, y = e.getAttribute("class"), y && (v = v.concat(y.split(n))), b = v.length;
        for (; h < b; h++)E = v[h], c[E] && m.push(E);
        w = m.length;
        while (w--)E = m[w], wysihtml5.lang.array(g).contains(E) || g.unshift(E);
        g.length && (s["class"] = g.join(" "));
        for (x in s)try {
            t.setAttribute(x, s[x])
        } catch (C) {
        }
        s.src && (typeof s.width != "undefined" && t.setAttribute("width", s.width), typeof s.height != "undefined" && t.setAttribute("height", s.height))
    }

    function l(e, t) {
        t = t.toLowerCase();
        var n = e.nodeName;
        if (n == "IMG" && t == "src" && c(e) === !0)return e.src;
        if (f && "outerHTML"in e) {
            var r = e.outerHTML.toLowerCase(), i = r.indexOf(" " + t + "=") != -1;
            return i ? e.getAttribute(t) : null
        }
        return e.getAttribute(t)
    }

    function c(e) {
        try {
            return e.complete && !e.mozMatchesSelector(":-moz-broken")
        } catch (t) {
            if (e.complete && e.readyState === "complete")return!0
        }
    }

    function h(e) {
        return e.ownerDocument.createTextNode(e.data)
    }

    var e = {1: u, 3: h}, t = "span", n = /\s+/, r = {tags: {}, classes: {}}, i = {}, f = !wysihtml5.browser.supportsGetAttributeCorrectly(), p = {url: function () {
        var e = /^https?:\/\//i;
        return function (t) {
            return!t || !t.match(e) ? null : t.replace(e, function (e) {
                return e.toLowerCase()
            })
        }
    }(), alt: function () {
        var e = /[^ a-z0-9_\-]/gi;
        return function (t) {
            return t ? t.replace(e, "") : ""
        }
    }(), numbers: function () {
        var e = /\D/g;
        return function (t) {
            return t = (t || "").replace(e, ""), t || null
        }
    }()}, d = {align_img: function () {
        var e = {left: "wysiwyg-float-left", right: "wysiwyg-float-right"};
        return function (t) {
            return e[String(t).toLowerCase()]
        }
    }(), align_text: function () {
        var e = {left: "wysiwyg-text-align-left", right: "wysiwyg-text-align-right", center: "wysiwyg-text-align-center", justify: "wysiwyg-text-align-justify"};
        return function (t) {
            return e[String(t).toLowerCase()]
        }
    }(), clear_br: function () {
        var e = {left: "wysiwyg-clear-left", right: "wysiwyg-clear-right", both: "wysiwyg-clear-both", all: "wysiwyg-clear-both"};
        return function (t) {
            return e[String(t).toLowerCase()]
        }
    }(), size_font: function () {
        var e = {1: "wysiwyg-font-size-xx-small", 2: "wysiwyg-font-size-small", 3: "wysiwyg-font-size-medium", 4: "wysiwyg-font-size-large", 5: "wysiwyg-font-size-x-large", 6: "wysiwyg-font-size-xx-large", 7: "wysiwyg-font-size-xx-large", "-": "wysiwyg-font-size-smaller", "+": "wysiwyg-font-size-larger"};
        return function (t) {
            return e[String(t).charAt(0)]
        }
    }()};
    return s
}(), wysihtml5.dom.removeEmptyTextNodes = function (e) {
    var t, n = wysihtml5.lang.array(e.childNodes).get(), r = n.length, i = 0;
    for (; i < r; i++)t = n[i], t.nodeType === wysihtml5.TEXT_NODE && t.data === "" && t.parentNode.removeChild(t)
}, wysihtml5.dom.renameElement = function (e, t) {
    var n = e.ownerDocument.createElement(t), r;
    while (r = e.firstChild)n.appendChild(r);
    return wysihtml5.dom.copyAttributes(["align", "className"]).from(e).to(n), e.parentNode.replaceChild(n, e), n
}, wysihtml5.dom.replaceWithChildNodes = function (e) {
    if (!e.parentNode)return;
    if (!e.firstChild) {
        e.parentNode.removeChild(e);
        return
    }
    var t = e.ownerDocument.createDocumentFragment();
    while (e.firstChild)t.appendChild(e.firstChild);
    e.parentNode.replaceChild(t, e), e = t = null
}, function (e) {
    function t(t) {
        return e.getStyle("display").from(t) === "block"
    }

    function n(e) {
        return e.nodeName === "BR"
    }

    function r(e) {
        var t = e.ownerDocument.createElement("br");
        e.appendChild(t)
    }

    function i(e) {
        if (e.nodeName !== "MENU" && e.nodeName !== "UL" && e.nodeName !== "OL")return;
        var i = e.ownerDocument, s = i.createDocumentFragment(), o = e.previousElementSibling || e.previousSibling, u, a, f, l, c;
        o && !t(o) && r(s);
        while (c = e.firstChild) {
            a = c.lastChild;
            while (u = c.firstChild)f = u === a, l = f && !t(u) && !n(u), s.appendChild(u), l && r(s);
            c.parentNode.removeChild(c)
        }
        e.parentNode.replaceChild(s, e)
    }

    e.resolveList = i
}(wysihtml5.dom), function (e) {
    var t = document, n = ["parent", "top", "opener", "frameElement", "frames", "localStorage", "globalStorage", "sessionStorage", "indexedDB"], r = ["open", "close", "openDialog", "showModalDialog", "alert", "confirm", "prompt", "openDatabase", "postMessage", "XMLHttpRequest", "XDomainRequest"], i = ["referrer", "write", "open", "close"];
    e.dom.Sandbox = Base.extend({constructor: function (t, n) {
        this.callback = t || e.EMPTY_FUNCTION, this.config = e.lang.object({}).merge(n).get(), this.iframe = this._createIframe()
    }, insertInto: function (e) {
        typeof e == "string" && (e = t.getElementById(e)), e.appendChild(this.iframe)
    }, getIframe: function () {
        return this.iframe
    }, getWindow: function () {
        this._readyError()
    }, getDocument: function () {
        this._readyError()
    }, destroy: function () {
        var e = this.getIframe();
        e.parentNode.removeChild(e)
    }, _readyError: function () {
        throw new Error("wysihtml5.Sandbox: Sandbox iframe isn't loaded yet")
    }, _createIframe: function () {
        var n = this, r = t.createElement("iframe");
        return r.className = "wysihtml5-sandbox", e.dom.setAttributes({security: "restricted", allowtransparency: "true", frameborder: 0, width: 0, height: 0, marginwidth: 0, marginheight: 0}).on(r), e.browser.throwsMixedContentWarningWhenIframeSrcIsEmpty() && (r.src = "javascript:'<html></html>'"), r.onload = function () {
            r.onreadystatechange = r.onload = null, n._onLoadIframe(r)
        }, r.onreadystatechange = function () {
            /loaded|complete/.test(r.readyState) && (r.onreadystatechange = r.onload = null, n._onLoadIframe(r))
        }, r
    }, _onLoadIframe: function (s) {
        if (!e.dom.contains(t.documentElement, s))return;
        var o = this, u = s.contentWindow, a = s.contentWindow.document, f = t.characterSet || t.charset || "utf-8", l = this._getHtml({charset: f, stylesheets: this.config.stylesheets});
        a.open("text/html", "replace"), a.write(l), a.close(), this.getWindow = function () {
            return s.contentWindow
        }, this.getDocument = function () {
            return s.contentWindow.document
        }, u.onerror = function (e, t, n) {
            throw new Error("wysihtml5.Sandbox: " + e, t, n)
        };
        if (!e.browser.supportsSandboxedIframes()) {
            var c, h;
            for (c = 0, h = n.length; c < h; c++)this._unset(u, n[c]);
            for (c = 0, h = r.length; c < h; c++)this._unset(u, r[c], e.EMPTY_FUNCTION);
            for (c = 0, h = i.length; c < h; c++)this._unset(a, i[c]);
            this._unset(a, "cookie", "", !0)
        }
        this.loaded = !0, setTimeout(function () {
            o.callback(o)
        }, 0)
    }, _getHtml: function (t) {
        var n = t.stylesheets, r = "", i = 0, s;
        n = typeof n == "string" ? [n] : n;
        if (n) {
            s = n.length;
            for (; i < s; i++)r += '<link rel="stylesheet" href="' + n[i] + '">'
        }
        return t.stylesheets = r, e.lang.string('<!DOCTYPE html><html><head><meta charset="#{charset}">#{stylesheets}</head><body></body></html>').interpolate(t)
    }, _unset: function (t, n, r, i) {
        try {
            t[n] = r
        } catch (s) {
        }
        try {
            t.__defineGetter__(n, function () {
                return r
            })
        } catch (s) {
        }
        if (i)try {
            t.__defineSetter__(n, function () {
            })
        } catch (s) {
        }
        if (!e.browser.crashesWhenDefineProperty(n))try {
            var o = {get: function () {
                return r
            }};
            i && (o.set = function () {
            }), Object.defineProperty(t, n, o)
        } catch (s) {
        }
    }})
}(wysihtml5), function () {
    var e = {className: "class"};
    wysihtml5.dom.setAttributes = function (t) {
        return{on: function (n) {
            for (var r in t)n.setAttribute(e[r] || r, t[r])
        }}
    }
}(), wysihtml5.dom.setStyles = function (e) {
    return{on: function (t) {
        var n = t.style;
        if (typeof e == "string") {
            n.cssText += ";" + e;
            return
        }
        for (var r in e)r === "float" ? (n.cssFloat = e[r], n.styleFloat = e[r]) : n[r] = e[r]
    }}
}, function (e) {
    e.simulatePlaceholder = function (t, n, r) {
        var i = "placeholder", s = function () {
            n.hasPlaceholderSet() && n.clear(), e.removeClass(n.element, i)
        }, o = function () {
            n.isEmpty() && (n.setValue(r), e.addClass(n.element, i))
        };
        t.observe("set_placeholder", o).observe("unset_placeholder", s).observe("focus:composer", s).observe("paste:composer", s).observe("blur:composer", o), o()
    }
}(wysihtml5.dom), function (e) {
    var t = document.documentElement;
    "textContent"in t ? (e.setTextContent = function (e, t) {
        e.textContent = t
    }, e.getTextContent = function (e) {
        return e.textContent
    }) : "innerText"in t ? (e.setTextContent = function (e, t) {
        e.innerText = t
    }, e.getTextContent = function (e) {
        return e.innerText
    }) : (e.setTextContent = function (e, t) {
        e.nodeValue = t
    }, e.getTextContent = function (e) {
        return e.nodeValue
    })
}(wysihtml5.dom), wysihtml5.quirks.cleanPastedHTML = function () {
    function t(t, n, r) {
        n = n || e, r = r || t.ownerDocument || document;
        var i, s = typeof t == "string", o, u, a, f, l = 0;
        s ? i = wysihtml5.dom.getAsDom(t, r) : i = t;
        for (f in n) {
            u = i.querySelectorAll(f), o = n[f], a = u.length;
            for (; l < a; l++)o(u[l])
        }
        return u = t = n = null, s ? i.innerHTML : i
    }

    var e = {"a u": wysihtml5.dom.replaceWithChildNodes};
    return t
}(), function (e) {
    var t = e.dom;
    e.quirks.ensureProperClearing = function () {
        var e = function (e) {
            var t = this;
            setTimeout(function () {
                var e = t.innerHTML.toLowerCase();
                if (e == "<p>&nbsp;</p>" || e == "<p>&nbsp;</p><p>&nbsp;</p>")t.innerHTML = ""
            }, 0)
        };
        return function (n) {
            t.observe(n.element, ["cut", "keydown"], e)
        }
    }(), e.quirks.ensureProperClearingOfLists = function () {
        var n = ["OL", "UL", "MENU"], r = function (r, i) {
            if (!i.firstChild || !e.lang.array(n).contains(i.firstChild.nodeName))return;
            var s = t.getParentElement(r, {nodeName: n});
            if (!s)return;
            var o = s == i.firstChild;
            if (!o)return;
            var u = s.childNodes.length <= 1;
            if (!u)return;
            var a = s.firstChild ? s.firstChild.innerHTML === "" : !0;
            if (!a)return;
            s.parentNode.removeChild(s)
        };
        return function (n) {
            t.observe(n.element, "keydown", function (t) {
                if (t.keyCode !== e.BACKSPACE_KEY)return;
                var i = n.selection.getSelectedNode();
                r(i, n.element)
            })
        }
    }()
}(wysihtml5), function (e) {
    var t = "%7E";
    e.quirks.getCorrectInnerHTML = function (n) {
        var r = n.innerHTML;
        if (r.indexOf(t) === -1)return r;
        var i = n.querySelectorAll("[href*='~'], [src*='~']"), s, o, u, a;
        for (a = 0, u = i.length; a < u; a++)s = i[a].href || i[a].src, o = e.lang.string(s).replace("~").by(t), r = e.lang.string(r).replace(o).by(s);
        return r
    }
}(wysihtml5), function (e) {
    var t = e.dom, n = ["LI", "P", "H1", "H2", "H3", "H4", "H5", "H6"], r = ["UL", "OL", "MENU"];
    e.quirks.insertLineBreakOnReturn = function (i) {
        function s(n) {
            var r = t.getParentElement(n, {nodeName: ["P", "DIV"]}, 2);
            if (!r)return;
            var s = document.createTextNode(e.INVISIBLE_SPACE);
            t.insert(s).before(r), t.replaceWithChildNodes(r), i.selection.selectNode(s)
        }

        function o(o) {
            var u = o.keyCode;
            if (o.shiftKey || u !== e.ENTER_KEY && u !== e.BACKSPACE_KEY)return;
            var a = o.target, f = i.selection.getSelectedNode(), l = t.getParentElement(f, {nodeName: n}, 4);
            if (l) {
                l.nodeName !== "LI" || u !== e.ENTER_KEY && u !== e.BACKSPACE_KEY ? l.nodeName.match(/H[1-6]/) && u === e.ENTER_KEY && setTimeout(function () {
                    s(i.selection.getSelectedNode())
                }, 0) : setTimeout(function () {
                    var e = i.selection.getSelectedNode(), n, o;
                    if (!e)return;
                    n = t.getParentElement(e, {nodeName: r}, 2);
                    if (n)return;
                    s(e)
                }, 0);
                return
            }
            u === e.ENTER_KEY && !e.browser.insertsLineBreaksOnReturn() && (i.commands.exec("insertLineBreak"), o.preventDefault())
        }

        t.observe(i.element.ownerDocument, "keydown", o)
    }
}(wysihtml5), function (e) {
    var t = "wysihtml5-quirks-redraw";
    e.quirks.redraw = function (n) {
        e.dom.addClass(n, t), e.dom.removeClass(n, t);
        try {
            var r = n.ownerDocument;
            r.execCommand("italic", !1, null), r.execCommand("italic", !1, null)
        } catch (i) {
        }
    }
}(wysihtml5), function (e) {
    function n(e) {
        var t = 0;
        if (e.parentNode)do t += e.offsetTop || 0, e = e.offsetParent; while (e);
        return t
    }

    var t = e.dom;
    e.Selection = Base.extend({constructor: function (e) {
        window.rangy.init(), this.editor = e, this.composer = e.composer, this.doc = this.composer.doc
    }, getBookmark: function () {
        var e = this.getRange();
        return e && e.cloneRange()
    }, setBookmark: function (e) {
        if (!e)return;
        this.setSelection(e)
    }, setBefore: function (e) {
        var t = rangy.createRange(this.doc);
        return t.setStartBefore(e), t.setEndBefore(e), this.setSelection(t)
    }, setAfter: function (e) {
        var t = rangy.createRange(this.doc);
        return t.setStartAfter(e), t.setEndAfter(e), this.setSelection(t)
    }, selectNode: function (n) {
        var r = rangy.createRange(this.doc), i = n.nodeType === e.ELEMENT_NODE, s = "canHaveHTML"in n ? n.canHaveHTML : n.nodeName !== "IMG", o = i ? n.innerHTML : n.data, u = o === "" || o === e.INVISIBLE_SPACE, a = t.getStyle("display").from(n), f = a === "block" || a === "list-item";
        if (u && i && s)try {
            n.innerHTML = e.INVISIBLE_SPACE
        } catch (l) {
        }
        s ? r.selectNodeContents(n) : r.selectNode(n), s && u && i ? r.collapse(f) : s && u && (r.setStartAfter(n), r.setEndAfter(n)), this.setSelection(r)
    }, getSelectedNode: function (e) {
        var t, n;
        if (e && this.doc.selection && this.doc.selection.type === "Control") {
            n = this.doc.selection.createRange();
            if (n && n.length)return n.item(0)
        }
        return t = this.getSelection(this.doc), t.focusNode === t.anchorNode ? t.focusNode : (n = this.getRange(this.doc), n ? n.commonAncestorContainer : this.doc.body)
    }, executeAndRestore: function (t, n) {
        var r = this.doc.body, i = n && r.scrollTop, s = n && r.scrollLeft, o = "_wysihtml5-temp-placeholder", u = '<span class="' + o + '">' + e.INVISIBLE_SPACE + "</span>", a = this.getRange(this.doc), f;
        if (!a) {
            t(r, r);
            return
        }
        var l = a.createContextualFragment(u);
        a.insertNode(l);
        try {
            t(a.startContainer, a.endContainer)
        } catch (c) {
            setTimeout(function () {
                throw c
            }, 0)
        }
        caretPlaceholder = this.doc.querySelector("." + o), caretPlaceholder ? (f = rangy.createRange(this.doc), f.selectNode(caretPlaceholder), f.deleteContents(), this.setSelection(f)) : r.focus(), n && (r.scrollTop = i, r.scrollLeft = s);
        try {
            caretPlaceholder.parentNode.removeChild(caretPlaceholder)
        } catch (h) {
        }
    }, executeAndRestoreSimple: function (e) {
        var t = this.getRange(), n = this.doc.body, r, i, s, o, u;
        if (!t) {
            e(n, n);
            return
        }
        o = t.getNodes([3]), i = o[0] || t.startContainer, s = o[o.length - 1] || t.endContainer, u = {collapsed: t.collapsed, startContainer: i, startOffset: i === t.startContainer ? t.startOffset : 0, endContainer: s, endOffset: s === t.endContainer ? t.endOffset : s.length};
        try {
            e(t.startContainer, t.endContainer)
        } catch (a) {
            setTimeout(function () {
                throw a
            }, 0)
        }
        r = rangy.createRange(this.doc);
        try {
            r.setStart(u.startContainer, u.startOffset)
        } catch (f) {
        }
        try {
            r.setEnd(u.endContainer, u.endOffset)
        } catch (l) {
        }
        try {
            this.setSelection(r)
        } catch (c) {
        }
    }, insertHTML: function (e) {
        var t = rangy.createRange(this.doc), n = t.createContextualFragment(e), r = n.lastChild;
        this.insertNode(n), r && this.setAfter(r)
    }, insertNode: function (e) {
        var t = this.getRange();
        t && t.insertNode(e)
    }, surround: function (e) {
        var t = this.getRange();
        if (!t)return;
        try {
            t.surroundContents(e), this.selectNode(e)
        } catch (n) {
            e.appendChild(t.extractContents()), t.insertNode(e)
        }
    }, scrollIntoView: function () {
        var t = this.doc, r = t.documentElement.scrollHeight > t.documentElement.offsetHeight, i = t._wysihtml5ScrollIntoViewElement = t._wysihtml5ScrollIntoViewElement || function () {
            var n = t.createElement("span"
            );
            return n.innerHTML = e.INVISIBLE_SPACE, n
        }(), s;
        r && (this.insertNode(i), s = n(i), i.parentNode.removeChild(i), s > t.body.scrollTop && (t.body.scrollTop = s))
    }, selectLine: function () {
        e.browser.supportsSelectionModify() ? this._selectLine_W3C() : this.doc.selection && this._selectLine_MSIE()
    }, _selectLine_W3C: function () {
        var e = this.doc.defaultView, t = e.getSelection();
        t.modify("extend", "left", "lineboundary"), t.modify("extend", "right", "lineboundary")
    }, _selectLine_MSIE: function () {
        var e = this.doc.selection.createRange(), t = e.boundingTop, n = e.boundingHeight, r = this.doc.body.scrollWidth, i, s, o, u, a;
        if (!e.moveToPoint)return;
        t === 0 && (o = this.doc.createElement("span"), this.insertNode(o), t = o.offsetTop, o.parentNode.removeChild(o)), t += 1;
        for (u = -10; u < r; u += 2)try {
            e.moveToPoint(u, t);
            break
        } catch (f) {
        }
        i = t, s = this.doc.selection.createRange();
        for (a = r; a >= 0; a--)try {
            s.moveToPoint(a, i);
            break
        } catch (l) {
        }
        e.setEndPoint("EndToEnd", s), e.select()
    }, getText: function () {
        var e = this.getSelection();
        return e ? e.toString() : ""
    }, getNodes: function (e, t) {
        var n = this.getRange();
        return n ? n.getNodes([e], t) : []
    }, getRange: function () {
        var e = this.getSelection();
        return e && e.rangeCount && e.getRangeAt(0)
    }, getSelection: function () {
        return rangy.getSelection(this.doc.defaultView || this.doc.parentWindow)
    }, setSelection: function (e) {
        var t = this.doc.defaultView || this.doc.parentWindow, n = rangy.getSelection(t);
        return n.setSingleRange(e)
    }})
}(wysihtml5), function (e, t) {
    function i(e, t, n) {
        if (!e.className)return!1;
        var r = e.className.match(n) || [];
        return r[r.length - 1] === t
    }

    function s(e, t, n) {
        e.className ? (o(e, n), e.className += " " + t) : e.className = t
    }

    function o(e, t) {
        e.className && (e.className = e.className.replace(t, ""))
    }

    function u(e, t) {
        return e.className.replace(r, " ") == t.className.replace(r, " ")
    }

    function a(e) {
        var t = e.parentNode;
        while (e.firstChild)t.insertBefore(e.firstChild, e);
        t.removeChild(e)
    }

    function f(e, t) {
        if (e.attributes.length != t.attributes.length)return!1;
        for (var n = 0, r = e.attributes.length, i, s, o; n < r; ++n) {
            i = e.attributes[n], o = i.name;
            if (o != "class") {
                s = t.attributes.getNamedItem(o);
                if (i.specified != s.specified)return!1;
                if (i.specified && i.nodeValue !== s.nodeValue)return!1
            }
        }
        return!0
    }

    function l(e, n) {
        return t.dom.isCharacterDataNode(e) ? n == 0 ? !!e.previousSibling : n == e.length ? !!e.nextSibling : !0 : n > 0 && n < e.childNodes.length
    }

    function c(e, n, r) {
        var i;
        t.dom.isCharacterDataNode(n) && (r == 0 ? (r = t.dom.getNodeIndex(n), n = n.parentNode) : r == n.length ? (r = t.dom.getNodeIndex(n) + 1, n = n.parentNode) : i = t.dom.splitDataNode(n, r));
        if (!i) {
            i = n.cloneNode(!1), i.id && i.removeAttribute("id");
            var s;
            while (s = n.childNodes[r])i.appendChild(s);
            t.dom.insertAfter(i, n)
        }
        return n == e ? i : c(e, i.parentNode, t.dom.getNodeIndex(i))
    }

    function h(t) {
        this.isElementMerge = t.nodeType == e.ELEMENT_NODE, this.firstTextNode = this.isElementMerge ? t.lastChild : t, this.textNodes = [this.firstTextNode]
    }

    function p(e, t, r, i) {
        this.tagNames = e || [n], this.cssClass = t || "", this.similarClassRegExp = r, this.normalize = i, this.applyToAnyTagName = !1
    }

    var n = "span", r = /\s+/g;
    h.prototype = {doMerge: function () {
        var e = [], t, n, r;
        for (var i = 0, s = this.textNodes.length; i < s; ++i)t = this.textNodes[i], n = t.parentNode, e[i] = t.data, i && (n.removeChild(t), n.hasChildNodes() || n.parentNode.removeChild(n));
        return this.firstTextNode.data = r = e.join(""), r
    }, getLength: function () {
        var e = this.textNodes.length, t = 0;
        while (e--)t += this.textNodes[e].length;
        return t
    }, toString: function () {
        var e = [];
        for (var t = 0, n = this.textNodes.length; t < n; ++t)e[t] = "'" + this.textNodes[t].data + "'";
        return"[Merge(" + e.join(",") + ")]"
    }}, p.prototype = {getAncestorWithClass: function (n) {
        var r;
        while (n) {
            r = this.cssClass ? i(n, this.cssClass, this.similarClassRegExp) : !0;
            if (n.nodeType == e.ELEMENT_NODE && t.dom.arrayContains(this.tagNames, n.tagName.toLowerCase()) && r)return n;
            n = n.parentNode
        }
        return!1
    }, postApply: function (e, t) {
        var n = e[0], r = e[e.length - 1], i = [], s, o = n, u = r, a = 0, f = r.length, l, c;
        for (var p = 0, d = e.length; p < d; ++p)l = e[p], c = this.getAdjacentMergeableTextNode(l.parentNode, !1), c ? (s || (s = new h(c), i.push(s)), s.textNodes.push(l), l === n && (o = s.firstTextNode, a = o.length), l === r && (u = s.firstTextNode, f = s.getLength())) : s = null;
        var v = this.getAdjacentMergeableTextNode(r.parentNode, !0);
        v && (s || (s = new h(r), i.push(s)), s.textNodes.push(v));
        if (i.length) {
            for (p = 0, d = i.length; p < d; ++p)i[p].doMerge();
            t.setStart(o, a), t.setEnd(u, f)
        }
    }, getAdjacentMergeableTextNode: function (t, n) {
        var r = t.nodeType == e.TEXT_NODE, i = r ? t.parentNode : t, s, o = n ? "nextSibling" : "previousSibling";
        if (r) {
            s = t[o];
            if (s && s.nodeType == e.TEXT_NODE)return s
        } else {
            s = i[o];
            if (s && this.areElementsMergeable(t, s))return s[n ? "firstChild" : "lastChild"]
        }
        return null
    }, areElementsMergeable: function (e, n) {
        return t.dom.arrayContains(this.tagNames, (e.tagName || "").toLowerCase()) && t.dom.arrayContains(this.tagNames, (n.tagName || "").toLowerCase()) && u(e, n) && f(e, n)
    }, createContainer: function (e) {
        var t = e.createElement(this.tagNames[0]);
        return this.cssClass && (t.className = this.cssClass), t
    }, applyToTextNode: function (e) {
        var n = e.parentNode;
        if (n.childNodes.length == 1 && t.dom.arrayContains(this.tagNames, n.tagName.toLowerCase()))this.cssClass && s(n, this.cssClass, this.similarClassRegExp); else {
            var r = this.createContainer(t.dom.getDocument(e));
            e.parentNode.insertBefore(r, e), r.appendChild(e)
        }
    }, isRemovable: function (n) {
        return t.dom.arrayContains(this.tagNames, n.tagName.toLowerCase()) && e.lang.string(n.className).trim() == this.cssClass
    }, undoToTextNode: function (e, t, n) {
        if (!t.containsNode(n)) {
            var r = t.cloneRange();
            r.selectNode(n), r.isPointInRange(t.endContainer, t.endOffset) && l(t.endContainer, t.endOffset) && (c(n, t.endContainer, t.endOffset), t.setEndAfter(n)), r.isPointInRange(t.startContainer, t.startOffset) && l(t.startContainer, t.startOffset) && (n = c(n, t.startContainer, t.startOffset))
        }
        this.similarClassRegExp && o(n, this.similarClassRegExp), this.isRemovable(n) && a(n)
    }, applyToRange: function (t) {
        var n = t.getNodes([e.TEXT_NODE]);
        if (!n.length)try {
            var r = this.createContainer(t.endContainer.ownerDocument);
            t.surroundContents(r), this.selectNode(t, r);
            return
        } catch (i) {
        }
        t.splitBoundaries(), n = t.getNodes([e.TEXT_NODE]);
        if (n.length) {
            var s;
            for (var o = 0, u = n.length; o < u; ++o)s = n[o], this.getAncestorWithClass(s) || this.applyToTextNode(s);
            t.setStart(n[0], 0), s = n[n.length - 1], t.setEnd(s, s.length), this.normalize && this.postApply(n, t)
        }
    }, undoToRange: function (t) {
        var n = t.getNodes([e.TEXT_NODE]), r, i;
        if (n.length)t.splitBoundaries(), n = t.getNodes([e.TEXT_NODE]); else {
            var s = t.endContainer.ownerDocument, o = s.createTextNode(e.INVISIBLE_SPACE);
            t.insertNode(o), t.selectNode(o), n = [o]
        }
        for (var u = 0, a = n.length; u < a; ++u)r = n[u], i = this.getAncestorWithClass(r), i && this.undoToTextNode(r, t, i);
        a == 1 ? this.selectNode(t, n[0]) : (t.setStart(n[0], 0), r = n[n.length - 1], t.setEnd(r, r.length), this.normalize && this.postApply(n, t))
    }, selectNode: function (t, n) {
        var r = n.nodeType === e.ELEMENT_NODE, i = "canHaveHTML"in n ? n.canHaveHTML : !0, s = r ? n.innerHTML : n.data, o = s === "" || s === e.INVISIBLE_SPACE;
        if (o && r && i)try {
            n.innerHTML = e.INVISIBLE_SPACE
        } catch (u) {
        }
        t.selectNodeContents(n), o && r ? t.collapse(!1) : o && (t.setStartAfter(n), t.setEndAfter(n))
    }, getTextSelectedByRange: function (e, t) {
        var n = t.cloneRange();
        n.selectNodeContents(e);
        var r = n.intersection(t), i = r ? r.toString() : "";
        return n.detach(), i
    }, isAppliedToRange: function (t) {
        var n = [], r, i = t.getNodes([e.TEXT_NODE]);
        if (!i.length)return r = this.getAncestorWithClass(t.startContainer), r ? [r] : !1;
        for (var s = 0, o = i.length, u; s < o; ++s) {
            u = this.getTextSelectedByRange(i[s], t), r = this.getAncestorWithClass(i[s]);
            if (u != "" && !r)return!1;
            n.push(r)
        }
        return n
    }, toggleRange: function (e) {
        this.isAppliedToRange(e) ? this.undoToRange(e) : this.applyToRange(e)
    }}, e.selection.HTMLApplier = p
}(wysihtml5, rangy), wysihtml5.Commands = Base.extend({constructor: function (e) {
    this.editor = e, this.composer = e.composer, this.doc = this.composer.doc
}, support: function (e) {
    return wysihtml5.browser.supportsCommand(this.doc, e)
}, exec: function (e, t) {
    var n = wysihtml5.commands[e], r = wysihtml5.lang.array(arguments).get(), i = n && n.exec, s = null;
    this.editor.fire("beforecommand:composer");
    if (i)r.unshift(this.composer), s = i.apply(n, r); else try {
        s = this.doc.execCommand(e, !1, t)
    } catch (o) {
    }
    return this.editor.fire("aftercommand:composer"), s
}, state: function (e, t) {
    var n = wysihtml5.commands[e], r = wysihtml5.lang.array(arguments).get(), i = n && n.state;
    if (i)return r.unshift(this.composer), i.apply(n, r);
    try {
        return this.doc.queryCommandState(e)
    } catch (s) {
        return!1
    }
}, value: function (e) {
    var t = wysihtml5.commands[e], n = t && t.value;
    if (n)return n.call(t, this.composer, e);
    try {
        return this.doc.queryCommandValue(e)
    } catch (r) {
        return null
    }
}}), function (e) {
    var t;
    e.commands.bold = {exec: function (t, n) {
        return e.commands.formatInline.exec(t, n, "b")
    }, state: function (t, n, r) {
        return e.commands.formatInline.state(t, n, "b")
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    function i(e, t) {
        var n = t.length, i = 0, s, o, u;
        for (; i < n; i++)s = t[i], o = r.getParentElement(s, {nodeName: "code"}), u = r.getTextContent(s), u.match(r.autoLink.URL_REG_EXP) && !o ? o = r.renameElement(s, "code") : r.replaceWithChildNodes(s)
    }

    function s(i, s) {
        var o = i.doc, u = "_wysihtml5-temp-" + +(new Date), a = /non-matching-class/g, f = 0, l, c, h, p, d, v, m, g, y;
        e.commands.formatInline.exec(i, t, n, u, a), c = o.querySelectorAll(n + "." + u), l = c.length;
        for (; f < l; f++) {
            h = c[f], h.removeAttribute("class");
            for (y in s)h.setAttribute(y, s[y])
        }
        v = h, l === 1 && (m = r.getTextContent(h), p = !!h.querySelector("*"), d = m === "" || m === e.INVISIBLE_SPACE, !p && d && (r.setTextContent(h, s.text || h.href), g = o.createTextNode(" "), i.selection.setAfter(h), i.selection.insertNode(g), v = g)), i.selection.setAfter(v)
    }

    var t, n = "A", r = e.dom;
    e.commands.createLink = {exec: function (e, t, n) {
        var r = this.state(e, t);
        r ? e.selection.executeAndRestore(function () {
            i(e, r)
        }) : (n = typeof n == "object" ? n : {href: n}, s(e, n))
    }, state: function (t, n) {
        return e.commands.formatInline.state(t, n, "A")
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t, n = /wysiwyg-font-size-[a-z\-]+/g;
    e.commands.fontSize = {exec: function (t, r, i) {
        return e.commands.formatInline.exec(t, r, "span", "wysiwyg-font-size-" + i, n)
    }, state: function (t, r, i) {
        return e.commands.formatInline.state(t, r, "span", "wysiwyg-font-size-" + i, n)
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t, n = /wysiwyg-color-[a-z]+/g;
    e.commands.foreColor = {exec: function (t, r, i) {
        return e.commands.formatInline.exec(t, r, "span", "wysiwyg-color-" + i, n)
    }, state: function (t, r, i) {
        return e.commands.formatInline.state(t, r, "span", "wysiwyg-color-" + i, n)
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    function s(e, t, n) {
        e.className ? (o(e, n), e.className += " " + t) : e.className = t
    }

    function o(e, t) {
        e.className = e.className.replace(t, "")
    }

    function u(t) {
        return t.nodeType === e.TEXT_NODE && !e.lang.string(t.data).trim()
    }

    function a(e) {
        var t = e.previousSibling;
        while (t && u(t))t = t.previousSibling;
        return t
    }

    function f(e) {
        var t = e.nextSibling;
        while (t && u(t))t = t.nextSibling;
        return t
    }

    function l(e) {
        var t = e.ownerDocument, n = f(e), r = a(e);
        n && !d(n) && e.parentNode.insertBefore(t.createElement("br"), n), r && !d(r) && e.parentNode.insertBefore(t.createElement("br"), e)
    }

    function c(e) {
        var t = f(e), n = a(e);
        t && p(t) && t.parentNode.removeChild(t), n && p(n) && n.parentNode.removeChild(n)
    }

    function h(e) {
        var t = e.lastChild;
        t && p(t) && t.parentNode.removeChild(t)
    }

    function p(e) {
        return e.nodeName === "BR"
    }

    function d(e) {
        return p(e) ? !0 : n.getStyle("display").from(e) === "block" ? !0 : !1
    }

    function v(t, r, i, s) {
        if (s)var o = n.observe(t, "DOMNodeInserted", function (t) {
            var r = t.target, i;
            if (r.nodeType !== e.ELEMENT_NODE)return;
            i = n.getStyle("display").from(r), i.substr(0, 6) !== "inline" && (r.className += " " + s)
        });
        t.execCommand(r, !1, i), o && o.stop()
    }

    function m(e, t) {
        e.selection.selectLine(), e.selection.surround(t), c(t), h(t), e.selection.selectNode(t)
    }

    function g(t) {
        return!!e.lang.string(t.className).trim()
    }

    var t, n = e.dom, r = "DIV", i = ["H1", "H2", "H3", "H4", "H5", "H6", "P", "BLOCKQUOTE", r];
    e.commands.formatBlock = {exec: function (t, u, a, f, c) {
        var h = t.doc, p = this.state(t, u, a, f, c), d;
        a = typeof a == "string" ? a.toUpperCase() : a;
        if (p) {
            t.selection.executeAndRestoreSimple(function () {
                c && o(p, c);
                var e = g(p);
                !e && p.nodeName === (a || r) ? (l(p), n.replaceWithChildNodes(p)) : e && n.renameElement(p, r)
            });
            return
        }
        if (a === null || e.lang.array(i).contains(a)) {
            d = t.selection.getSelectedNode(), p = n.getParentElement(d, {nodeName: i});
            if (p) {
                t.selection.executeAndRestoreSimple(function () {
                    a && (p = n.renameElement(p, a)), f && s(p, f, c)
                });
                return
            }
        }
        if (t.commands.support(u)) {
            v(h, u, a || r, f);
            return
        }
        p = h.createElement(a || r), f && (p.className = f), m(t, p)
    }, state: function (e, t, r, i, s) {
        r = typeof r == "string" ? r.toUpperCase() : r;
        var o = e.selection.getSelectedNode();
        return n.getParentElement(o, {nodeName: r, className: i, classRegExp: s})
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    function i(e) {
        var t = n[e];
        return t ? [e.toLowerCase(), t.toLowerCase()] : [e.toLowerCase()]
    }

    function s(t, n, s) {
        var o = t + ":" + n;
        return r[o] || (r[o] = new e.selection.HTMLApplier(i(t), n, s, !0)), r[o]
    }

    var t, n = {strong: "b", em: "i", b: "strong", i: "em"}, r = {};
    e.commands.formatInline = {exec: function (e, t, n, r, i) {
        var o = e.selection.getRange();
        if (!o)return!1;
        s(n, r, i).toggleRange(o), e.selection.setSelection(o)
    }, state: function (t, r, i, o, u) {
        var a = t.doc, f = n[i] || i, l;
        return!e.dom.hasElementWithTagName(a, i) && !e.dom.hasElementWithTagName(a, f) ? !1 : o && !e.dom.hasElementWithClassName(a, o) ? !1 : (l = t.selection.getRange(), l ? s(i, o, u).isAppliedToRange(l) : !1)
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t;
    e.commands.insertHTML = {exec: function (e, t, n) {
        e.commands.support(t) ? e.doc.execCommand(t, !1, n) : e.selection.insertHTML(n)
    }, state: function () {
        return!1
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t = "IMG";
    e.commands.insertImage = {exec: function (n, r, i) {
        i = typeof i == "object" ? i : {src: i};
        var s = n.doc, o = this.state(n), u, a, f;
        if (o) {
            n.selection.setBefore(o), f = o.parentNode, f.removeChild(o), e.dom.removeEmptyTextNodes(f), f.nodeName === "A" && !f.firstChild && (n.selection.setAfter(f), f.parentNode.removeChild(f)), e.quirks.redraw(n.element);
            return
        }
        o = s.createElement(t);
        for (a in i)o[a] = i[a];
        n.selection.insertNode(o), e.browser.hasProblemsSettingCaretAfterImg() ? (u = s.createTextNode(e.INVISIBLE_SPACE), n.selection.insertNode(u), n.selection.setAfter(u)) : n.selection.setAfter(o)
    }, state: function (n) {
        var r = n.doc, i, s, o;
        return e.dom.hasElementWithTagName(r, t) ? (i = n.selection.getSelectedNode(), i ? i.nodeName === t ? i : i.nodeType !== e.ELEMENT_NODE ? !1 : (s = n.selection.getText(), s = e.lang.string(s).trim(), s ? !1 : (o = n.selection.getNodes(e.ELEMENT_NODE, function (e) {
            return e.nodeName === "IMG"
        }), o.length !== 1 ? !1 : o[0])) : !1) : !1
    }, value: function (e) {
        var t = this.state(e);
        return t && t.src
    }}
}(wysihtml5), function (e) {
    var t, n = "<br>" + (e.browser.needsSpaceAfterLineBreak() ? " " : "");
    e.commands.insertLineBreak = {exec: function (t, r) {
        t.commands.support(r) ? (t.doc.execCommand(r, !1, null), e.browser.autoScrollsToCaret() || t.selection.scrollIntoView()) : t.commands.exec("insertHTML", n)
    }, state: function () {
        return!1
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t;
    e.commands.insertOrderedList = {exec: function (t, n) {
        var r = t.doc, i = t.selection.getSelectedNode(), s = e.dom.getParentElement(i, {nodeName: "OL"}), o = e.dom.getParentElement(i, {nodeName: "UL"}), u = "_wysihtml5-temp-" + (new Date).getTime(), a, f;
        if (t.commands.support(n)) {
            r.execCommand(n, !1, null);
            return
        }
        s ? t.selection.executeAndRestoreSimple(function () {
            e.dom.resolveList(s)
        }) : o ? t.selection.executeAndRestoreSimple(function () {
            e.dom.renameElement(o, "ol")
        }) : (t.commands.exec("formatBlock", "div", u), f = r.querySelector("." + u), a = f.innerHTML === "" || f.innerHTML === e.INVISIBLE_SPACE, t.selection.executeAndRestoreSimple(function () {
            s = e.dom.convertToList(f, "ol")
        }), a && t.selection.selectNode(s.querySelector("li")))
    }, state: function (t) {
        var n = t.selection.getSelectedNode();
        return e.dom.getParentElement(n, {nodeName: "OL"})
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t;
    e.commands.insertUnorderedList = {exec: function (t, n) {
        var r = t.doc, i = t.selection.getSelectedNode(), s = e.dom.getParentElement(i, {nodeName: "UL"}), o = e.dom.getParentElement(i, {nodeName: "OL"}), u = "_wysihtml5-temp-" + (new Date).getTime(), a, f;
        if (t.commands.support(n)) {
            r.execCommand(n, !1, null);
            return
        }
        s ? t.selection.executeAndRestoreSimple(function () {
            e.dom.resolveList(s)
        }) : o ? t.selection.executeAndRestoreSimple(function () {
            e.dom.renameElement(o, "ul")
        }) : (t.commands.exec("formatBlock", "div", u), f = r.querySelector("." + u), a = f.innerHTML === "" || f.innerHTML === e.INVISIBLE_SPACE, t.selection.executeAndRestoreSimple(function () {
            s = e.dom.convertToList(f, "ul")
        }), a && t.selection.selectNode(s.querySelector("li")))
    }, state: function (t) {
        var n = t.selection.getSelectedNode();
        return e.dom.getParentElement(n, {nodeName: "UL"})
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t;
    e.commands.italic = {exec: function (t, n) {
        return e.commands.formatInline.exec(t, n, "i")
    }, state: function (t, n, r) {
        return e.commands.formatInline.state(t, n, "i")
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t, n = "wysiwyg-text-align-center", r = /wysiwyg-text-align-[a-z]+/g;
    e.commands.justifyCenter = {exec: function (t, i) {
        return e.commands.formatBlock.exec(t, "formatBlock", null, n, r)
    }, state: function (t, i) {
        return e.commands.formatBlock.state(t, "formatBlock", null, n, r)
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t, n = "wysiwyg-text-align-left", r = /wysiwyg-text-align-[a-z]+/g;
    e.commands.justifyLeft = {exec: function (t, i) {
        return e.commands.formatBlock.exec(t, "formatBlock", null, n, r)
    }, state: function (t, i) {
        return e.commands.formatBlock.state(t, "formatBlock", null, n, r)
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t, n = "wysiwyg-text-align-right", r = /wysiwyg-text-align-[a-z]+/g;
    e.commands.justifyRight = {exec: function (t, i) {
        return e.commands.formatBlock.exec(t, "formatBlock", null, n, r)
    }, state: function (t, i) {
        return e.commands.formatBlock.state(t, "formatBlock", null, n, r)
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    var t;
    e.commands.underline = {exec: function (t, n) {
        return e.commands.formatInline.exec(t, n, "u")
    }, state: function (t, n) {
        return e.commands.formatInline.state(t, n, "u")
    }, value: function () {
        return t
    }}
}(wysihtml5), function (e) {
    function f(e) {
        var t;
        while (t = e.querySelector("._wysihtml5-temp"))t.parentNode.removeChild(t)
    }

    var t = 90, n = 89, r = 8, i = 46, s = 40, o = '<span id="_wysihtml5-undo" class="_wysihtml5-temp">' + e.INVISIBLE_SPACE + "</span>", u = '<span id="_wysihtml5-redo" class="_wysihtml5-temp">' + e.INVISIBLE_SPACE + "</span>", a = e.dom;
    e.UndoManager = e.lang.Dispatcher.extend({constructor: function (e) {
        this.editor = e, this.composer = e.composer, this.element = this.composer.element, this.history = [this.composer.getValue()], this.position = 1, this.composer.commands.support("insertHTML") && this._observe()
    }, _observe: function () {
        var s = this, l = this.composer.sandbox.getDocument(), c;
        a.observe(this.element, "keydown", function (e) {
            if (e.altKey || !e.ctrlKey && !e.metaKey)return;
            var r = e.keyCode, i = r === t && !e.shiftKey, o = r === t && e.shiftKey || r === n;
            i ? (s.undo(), e.preventDefault()) : o && (s.redo(), e.preventDefault())
        }), a.observe(this.element, "keydown", function (e) {
            var t = e.keyCode;
            if (t === c)return;
            c = t, (t === r || t === i) && s.transact()
        });
        if (e.browser.hasUndoInContextMenu()) {
            var h, p, d = function () {
                f(l), clearInterval(h)
            };
            a.observe(this.element, "contextmenu", function () {
                d(), s.composer.selection.executeAndRestoreSimple(function () {
                    s.element.lastChild && s.composer.selection.setAfter(s.element.lastChild), l.execCommand("insertHTML", !1, o), l.execCommand("insertHTML", !1, u), l.execCommand("undo", !1, null)
                }), h = setInterval(function () {
                    l.getElementById("_wysihtml5-redo") ? (d(), s.redo()) : l.getElementById("_wysihtml5-undo") || (d(), s.undo())
                }, 400), p || (p = !0, a.observe(document, "mousedown", d), a.observe(l, ["mousedown", "paste", "cut", "copy"], d))
            })
        }
        this.editor.observe("newword:composer",function () {
            s.transact()
        }).observe("beforecommand:composer", function () {
            s.transact()
        })
    }, transact: function () {
        var e = this.history[this.position - 1], t = this.composer.getValue();
        if (t == e)return;
        var n = this.history.length = this.position;
        n > s && (this.history.shift(), this.position--), this.position++, this.history.push(t)
    }, undo: function () {
        this.transact();
        if (this.position <= 1)return;
        this.set(this.history[--this.position - 1]), this.editor.fire("undo:composer")
    }, redo: function () {
        if (this.position >= this.history.length)return;
        this.set(this.history[++this.position - 1]), this.editor.fire("redo:composer")
    }, set: function (e) {
        this.composer.setValue(e), this.editor.focus(!0)
    }})
}(wysihtml5), wysihtml5.views.View = Base.extend({constructor: function (e, t, n) {
    this.parent = e, this.element = t, this.config = n, this._observeViewChange()
}, _observeViewChange: function () {
    var e = this;
    this.parent.observe("beforeload", function () {
        e.parent.observe("change_view", function (t) {
            t === e.name ? (e.parent.currentView = e, e.show(), setTimeout(function () {
                e.focus()
            }, 0)) : e.hide()
        })
    })
}, focus: function () {
    if (this.element.ownerDocument.querySelector(":focus") === this.element)return;
    try {
        this.element.focus()
    } catch (e) {
    }
}, hide: function () {
    this.element.style.display = "none"
}, show: function () {
    this.element.style.display = ""
}, disable: function () {
    this.element.setAttribute("disabled", "disabled")
}, enable: function () {
    this.element.removeAttribute("disabled")
}}), function (e) {
    var t = e.dom, n = e.browser;
    e.views.Composer = e.views.View.extend({name: "composer", CARET_HACK: "<br>", constructor: function (e, t, n) {
        this.base(e, t, n), this.textarea = this.parent.textarea, this._initSandbox()
    }, clear: function () {
        this.element.innerHTML = n.displaysCaretInEmptyContentEditableCorrectly() ? "" : this.CARET_HACK
    }, getValue: function (t) {
        var n = this.isEmpty() ? "" : e.quirks.getCorrectInnerHTML(this.element);
        return t && (n = this.parent.parse(n)), n = e.lang.string(n).replace(e.INVISIBLE_SPACE).by(""), n
    }, setValue: function (e, t) {
        t && (e = this.parent.parse(e)), this.element.innerHTML = e
    }, show: function () {
        this.iframe.style.display = this._displayStyle || "", this.disable(), this.enable()
    }, hide: function () {
        this._displayStyle = t.getStyle("display").from(this.iframe), this._displayStyle === "none" && (this._displayStyle = null), this.iframe.style.display = "none"
    }, disable: function () {
        this.element.removeAttribute("contentEditable"), this.base()
    }, enable: function () {
        this.element.setAttribute("contentEditable", "true"), this.base()
    }, focus: function (t) {
        e.browser.doesAsyncFocus() && this.hasPlaceholderSet() && this.clear(), this.base();
        var n = this.element.lastChild;
        t && n && (n.nodeName === "BR" ? this.selection.setBefore(this.element.lastChild) : this.selection.setAfter(this.element.lastChild))
    }, getTextContent: function () {
        return t.getTextContent(this.element)
    }, hasPlaceholderSet: function () {
        return this.getTextContent() == this.textarea.element.getAttribute("placeholder")
    }, isEmpty: function () {
        var e = this.element.innerHTML, t = "blockquote, ul, ol, img, embed, object, table, iframe, svg, video, audio, button, input, select, textarea";
        return e === "" || e === this.CARET_HACK || this.hasPlaceholderSet() || this.getTextContent() === "" && !this.element.querySelector(t)
    }, _initSandbox: function () {
        var e = this;
        this.sandbox = new t.Sandbox(function () {
            e._create()
        }, {stylesheets: this.config.stylesheets}), this.iframe = this.sandbox.getIframe();
        var n = document.createElement("input");
        n.type = "hidden", n.name = "_wysihtml5_mode", n.value = 1;
        var r = this.textarea.element;
        t.insert(this.iframe).after(r), t.insert(n).after(r)
    }, _create: function () {
        var r = this;
        this.doc = this.sandbox.getDocument(), this.element = this.doc.body, this.textarea = this.parent.textarea, this.element.innerHTML = this.textarea.getValue(!0), this.enable(), this.selection = new e.Selection(this.parent), this.commands = new e.Commands(this.parent), t.copyAttributes(["className", "spellcheck", "title", "lang", "dir", "accessKey"]).from(this.textarea.element).to(this.element), t.addClass(this.element, this.config.composerClassName), this.config.style && this.style(), this.observe();
        var i = this.config.name;
        i && (t.addClass(this.element, i), t.addClass(this.iframe, i));
        var s = typeof this.config.placeholder == "string" ? this.config.placeholder : this.textarea.element.getAttribute("placeholder");
        s && t.simulatePlaceholder(this.parent, this, s), this.commands.exec("styleWithCSS", !1), this._initAutoLinking(), this._initObjectResizing(), this._initUndoManager(), (this.textarea.element.hasAttribute("autofocus") || document.querySelector(":focus") == this.textarea.element) && setTimeout(function () {
            r.focus()
        }, 100), e.quirks.insertLineBreakOnReturn(this), n.clearsContentEditableCorrectly() || e.quirks.ensureProperClearing(this), n.clearsListsInContentEditableCorrectly() || e.quirks.ensureProperClearingOfLists(this), this.initSync && this.config.sync && this.initSync(), this.textarea.hide(), this.parent.fire("beforeload").fire("load")
    }, _initAutoLinking: function () {
        var r = this, i = n.canDisableAutoLinking(), s = n.doesAutoLinkingInContentEditable();
        i && this.commands.exec("autoUrlDetect", !1);
        if (!this.config.autoLink)return;
        (!s || s && i) && this.parent.observe("newword:composer", function () {
            r.selection.executeAndRestore(function (e, n) {
                t.autoLink(n.parentNode)
            })
        });
        var o = this.sandbox.getDocument().getElementsByTagName("a"), u = t.autoLink.URL_REG_EXP, a = function (n) {
            var r = e.lang.string(t.getTextContent(n)).trim();
            return r.substr(0, 4) === "www." && (r = "http://" + r), r
        };
        t.observe(this.element, "keydown", function (e) {
            if (!o.length)return;
            var n = r.selection.getSelectedNode(e.target.ownerDocument), i = t.getParentElement(n, {nodeName: "A"}, 4), s;
            if (!i)return;
            s = a(i), setTimeout(function () {
                var e = a(i);
                if (e === s)return;
                e.match(u) && i.setAttribute("href", e)
            }, 0)
        })
    }, _initObjectResizing: function () {
        var r = ["width", "height"], i = r.length, s = this.element;
        this.commands.exec("enableObjectResizing", this.config.allowObjectResizing), this.config.allowObjectResizing ? n.supportsEvent("resizeend") && t.observe(s, "resizeend", function (t) {
            var n = t.target || t.srcElement, o = n.style, u = 0, a;
            for (; u < i; u++)a = r[u], o[a] && (n.setAttribute(a, parseInt(o[a], 10)), o[a] = "");
            e.quirks.redraw(s)
        }) : n.supportsEvent("resizestart") && t.observe(s, "resizestart", function (e) {
            e.preventDefault()
        })
    }, _initUndoManager: function () {
        new e.UndoManager(this.parent)
    }})
}(wysihtml5), function (e) {
    var t = e.dom, n = document, r = window, i = n.createElement("div"), s = ["background-color", "color", "cursor", "font-family", "font-size", "font-style", "font-variant", "font-weight", "line-height", "letter-spacing", "text-align", "text-decoration", "text-indent", "text-rendering", "word-break", "word-wrap", "word-spacing"], o = ["background-color", "border-collapse", "border-bottom-color", "border-bottom-style", "border-bottom-width", "border-left-color", "border-left-style", "border-left-width", "border-right-color", "border-right-style", "border-right-width", "border-top-color", "border-top-style", "border-top-width", "clear", "display", "float", "margin-bottom", "margin-left", "margin-right", "margin-top", "outline-color", "outline-offset", "outline-width", "outline-style", "padding-left", "padding-right", "padding-top", "padding-bottom", "position", "top", "left", "right", "bottom", "z-index", "vertical-align", "text-align", "-webkit-box-sizing", "-moz-box-sizing", "-ms-box-sizing", "box-sizing", "-webkit-box-shadow", "-moz-box-shadow", "-ms-box-shadow", "box-shadow", "-webkit-border-top-right-radius", "-moz-border-radius-topright", "border-top-right-radius", "-webkit-border-bottom-right-radius", "-moz-border-radius-bottomright", "border-bottom-right-radius", "-webkit-border-bottom-left-radius", "-moz-border-radius-bottomleft", "border-bottom-left-radius", "-webkit-border-top-left-radius", "-moz-border-radius-topleft", "border-top-left-radius", "width", "height"], u = ["width", "height", "top", "left", "right", "bottom"], a = ["html             { height: 100%; }", "body             { min-height: 100%; padding: 0; margin: 0; margin-top: -1px; padding-top: 1px; }", "._wysihtml5-temp { display: none; }", e.browser.isGecko ? "body.placeholder { color: graytext !important; }" : "body.placeholder { color: #a9a9a9 !important; }", "body[disabled]   { background-color: #eee !important; color: #999 !important; cursor: default !important; }", "img:-moz-broken  { -moz-force-broken-image-icon: 1; height: 24px; width: 24px; }"], f = function (e) {
        if (e.setActive)try {
            e.setActive()
        } catch (i) {
        } else {
            var s = e.style, o = n.documentElement.scrollTop || n.body.scrollTop, u = n.documentElement.scrollLeft || n.body.scrollLeft, a = {position: s.position, top: s.top, left: s.left, WebkitUserSelect: s.WebkitUserSelect};
            t.setStyles({position: "absolute", top: "-99999px", left: "-99999px", WebkitUserSelect: "none"}).on(e), e.focus(), t.setStyles(a).on(e), r.scrollTo && r.scrollTo(u, o)
        }
    };
    e.views.Composer.prototype.style = function () {
        var l = this, c = n.querySelector(":focus"), h = this.textarea.element, p = h.hasAttribute("placeholder"), d = p && h.getAttribute("placeholder");
        this.focusStylesHost = this.focusStylesHost || i.cloneNode(!1), this.blurStylesHost = this.blurStylesHost || i.cloneNode(!1), p && h.removeAttribute("placeholder"), h === c && h.blur(), t.copyStyles(o).from(h).to(this.iframe).andTo(this.blurStylesHost), t.copyStyles(s).from(h).to(this.element).andTo(this.blurStylesHost), t.insertCSS(a).into(this.element.ownerDocument), f(h), t.copyStyles(o).from(h).to(this.focusStylesHost), t.copyStyles(s).from(h).to(this.focusStylesHost);
        var v = e.lang.array(o).without(["display"]);
        c ? c.focus() : h.blur(), p && h.setAttribute("placeholder", d);
        if (!e.browser.hasCurrentStyleProperty())var m = t.observe(r, "resize", function () {
            if (!t.contains(document.documentElement, l.iframe)) {
                m.stop();
                return
            }
            var e = t.getStyle("display").from(h), n = t.getStyle("display").from(l.iframe);
            h.style.display = "", l.iframe.style.display = "none", t.copyStyles(u).from(h).to(l.iframe).andTo(l.focusStylesHost).andTo(l.blurStylesHost), l.iframe.style.display = n, h.style.display = e
        });
        return this.parent.observe("focus:composer", function () {
            t.copyStyles(v).from(l.focusStylesHost).to(l.iframe), t.copyStyles(s).from(l.focusStylesHost).to(l.element)
        }), this.parent.observe("blur:composer", function () {
            t.copyStyles(v).from(l.blurStylesHost).to(l.iframe), t.copyStyles(s).from(l.blurStylesHost).to(l.element)
        }), this
    }
}(wysihtml5), function (e) {
    var t = e.dom, n = e.browser, r = {66: "bold", 73: "italic", 85: "underline"};
    e.views.Composer.prototype.observe = function () {
        var i = this, s = this.getValue(), o = this.sandbox.getIframe(), u = this.element, a = n.supportsEventsInIframeCorrectly() ? u : this.sandbox.getWindow(), f = n.supportsEvent("drop") ? ["drop", "paste"] : ["dragdrop", "paste"];
        t.observe(o, "DOMNodeRemoved", function () {
            clearInterval(l), i.parent.fire("destroy:composer")
        });
        var l = setInterval(function () {
            t.contains(document.documentElement, o) || (clearInterval(l), i.parent.fire("destroy:composer"))
        }, 250);
        t.observe(a, "focus", function () {
            i.parent.fire("focus").fire("focus:composer"), setTimeout(function () {
                s = i.getValue()
            }, 0)
        }), t.observe(a, "blur", function () {
            s !== i.getValue() && i.parent.fire("change").fire("change:composer"), i.parent.fire("blur").fire("blur:composer")
        }), e.browser.isIos() && t.observe(u, "blur", function () {
            var e = u.ownerDocument.createElement("input"), t = document.documentElement.scrollTop || document.body.scrollTop, n = document.documentElement.scrollLeft || document.body.scrollLeft;
            try {
                i.selection.insertNode(e)
            } catch (r) {
                u.appendChild(e)
            }
            e.focus(), e.parentNode.removeChild(e), window.scrollTo(n, t)
        }), t.observe(u, "dragenter", function () {
            i.parent.fire("unset_placeholder")
        }), n.firesOnDropOnlyWhenOnDragOverIsCancelled() && t.observe(u, ["dragover", "dragenter"], function (e) {
            e.preventDefault()
        }), t.observe(u, f, function (e) {
            var t = e.dataTransfer, r;
            t && n.supportsDataTransfer() && (r = t.getData("text/html") || t.getData("text/plain")), r ? (u.focus(), i.commands.exec("insertHTML", r), i.parent.fire("paste").fire("paste:composer"), e.stopPropagation(), e.preventDefault()) : setTimeout(function () {
                i.parent.fire("paste").fire("paste:composer")
            }, 0)
        }), t.observe(u, "keyup", function (t) {
            var n = t.keyCode;
            (n === e.SPACE_KEY || n === e.ENTER_KEY) && i.parent.fire("newword:composer")
        }), this.parent.observe("paste:composer", function () {
            setTimeout(function () {
                i.parent.fire("newword:composer")
            }, 0)
        }), n.canSelectImagesInContentEditable() || t.observe(u, "mousedown", function (e) {
            var t = e.target;
            t.nodeName === "IMG" && (i.selection.selectNode(t), e.preventDefault())
        }), t.observe(u, "keydown", function (e) {
            var t = e.keyCode, n = r[t];
            (e.ctrlKey || e.metaKey) && !e.altKey && n && (i.commands.exec(n), e.preventDefault())
        }), t.observe(u, "keydown", function (t) {
            var n = i.selection.getSelectedNode(!0), r = t.keyCode, s;
            n && n.nodeName === "IMG" && (r === e.BACKSPACE_KEY || r === e.DELETE_KEY) && (s = n.parentNode, s.removeChild(n), s.nodeName === "A" && !s.firstChild && s.parentNode.removeChild(s), setTimeout(function () {
                e.quirks.redraw(u)
            }, 0), t.preventDefault())
        });
        var c = {IMG: "Image: ", A: "Link: "};
        t.observe(u, "mouseover", function (e) {
            var t = e.target, n = t.nodeName, r;
            if (n !== "A" && n !== "IMG")return;
            var i = t.hasAttribute("title");
            i || (r = c[n] + (t.getAttribute("href") || t.getAttribute("src")), t.setAttribute("title", r))
        })
    }
}(wysihtml5), function (e) {
    var t = 400;
    e.views.Synchronizer = Base.extend({constructor: function (e, t, n) {
        this.editor = e, this.textarea = t, this.composer = n, this._observe()
    }, fromComposerToTextarea: function (t) {
        this.textarea.setValue(e.lang.string(this.composer.getValue()).trim(), t)
    }, fromTextareaToComposer: function (e) {
        var t = this.textarea.getValue();
        t ? this.composer.setValue(t, e) : (this.composer.clear(), this.editor.fire("set_placeholder"))
    }, sync: function (e) {
        this.editor.currentView.name === "textarea" ? this.fromTextareaToComposer(e) : this.fromComposerToTextarea(e)
    }, _observe: function () {
        var n, r = this, i = this.textarea.element.form, s = function () {
            n = setInterval(function () {
                r.fromComposerToTextarea()
            }, t)
        }, o = function () {
            clearInterval(n), n = null
        };
        s(), i && (e.dom.observe(i, "submit", function () {
            r.sync(!0)
        }), e.dom.observe(i, "reset", function () {
            setTimeout(function () {
                r.fromTextareaToComposer()
            }, 0)
        })), this.editor.observe("change_view", function (e) {
            e === "composer" && !n ? (r.fromTextareaToComposer(!0), s()) : e === "textarea" && (r.fromComposerToTextarea(!0), o())
        }), this.editor.observe("destroy:composer", o)
    }})
}(wysihtml5), wysihtml5.views.Textarea = wysihtml5.views.View.extend
({name: "textarea", constructor: function (e, t, n) {
    this.base(e, t, n), this._observe()
}, clear: function () {
    this.element.value = ""
}, getValue: function (e) {
    var t = this.isEmpty() ? "" : this.element.value;
    return e && (t = this.parent.parse(t)), t
}, setValue: function (e, t) {
    t && (e = this.parent.parse(e)), this.element.value = e
}, hasPlaceholderSet: function () {
    var e = wysihtml5.browser.supportsPlaceholderAttributeOn(this.element), t = this.element.getAttribute("placeholder") || null, n = this.element.value, r = !n;
    return e && r || n === t
}, isEmpty: function () {
    return!wysihtml5.lang.string(this.element.value).trim() || this.hasPlaceholderSet()
}, _observe: function () {
    var e = this.element, t = this.parent, n = {focusin: "focus", focusout: "blur"}, r = wysihtml5.browser.supportsEvent("focusin") ? ["focusin", "focusout", "change"] : ["focus", "blur", "change"];
    t.observe("beforeload", function () {
        wysihtml5.dom.observe(e, r, function (e) {
            var r = n[e.type] || e.type;
            t.fire(r).fire(r + ":textarea")
        }), wysihtml5.dom.observe(e, ["paste", "drop"], function () {
            setTimeout(function () {
                t.fire("paste").fire("paste:textarea")
            }, 0)
        })
    })
}}), function (e) {
    var t = e.dom, n = "wysihtml5-command-dialog-opened", r = "input, select, textarea", i = "[data-wysihtml5-dialog-field]", s = "data-wysihtml5-dialog-field";
    e.toolbar.Dialog = e.lang.Dispatcher.extend({constructor: function (e, t) {
        this.link = e, this.container = t
    }, _observe: function () {
        if (this._observed)return;
        var i = this, s = function (e) {
            var t = i._serialize();
            t == i.elementToChange ? i.fire("edit", t) : i.fire("save", t), i.hide(), e.preventDefault(), e.stopPropagation()
        };
        t.observe(i.link, "click", function (e) {
            t.hasClass(i.link, n) && setTimeout(function () {
                i.hide()
            }, 0)
        }), t.observe(this.container, "keydown", function (t) {
            var n = t.keyCode;
            n === e.ENTER_KEY && s(t), n === e.ESCAPE_KEY && i.hide()
        }), t.delegate(this.container, "[data-wysihtml5-dialog-action=save]", "click", s), t.delegate(this.container, "[data-wysihtml5-dialog-action=cancel]", "click", function (e) {
            i.fire("cancel"), i.hide(), e.preventDefault(), e.stopPropagation()
        });
        var o = this.container.querySelectorAll(r), u = 0, a = o.length, f = function () {
            clearInterval(i.interval)
        };
        for (; u < a; u++)t.observe(o[u], "change", f);
        this._observed = !0
    }, _serialize: function () {
        var e = this.elementToChange || {}, t = this.container.querySelectorAll(i), n = t.length, r = 0;
        for (; r < n; r++)e[t[r].getAttribute(s)] = t[r].value;
        return e
    }, _interpolate: function (e) {
        var t, n, r, o = document.querySelector(":focus"), u = this.container.querySelectorAll(i), a = u.length, f = 0;
        for (; f < a; f++) {
            t = u[f];
            if (t === o)continue;
            if (e && t.type === "hidden")continue;
            n = t.getAttribute(s), r = this.elementToChange ? this.elementToChange[n] || "" : t.defaultValue, t.value = r
        }
    }, show: function (e) {
        var i = this, s = this.container.querySelector(r);
        this.elementToChange = e, this._observe(), this._interpolate(), e && (this.interval = setInterval(function () {
            i._interpolate(!0)
        }, 500)), t.addClass(this.link, n), this.container.style.display = "", this.fire("show");
        if (s && !e)try {
            s.focus()
        } catch (o) {
        }
    }, hide: function () {
        clearInterval(this.interval), this.elementToChange = null, t.removeClass(this.link, n), this.container.style.display = "none", this.fire("hide")
    }})
}(wysihtml5), function (e) {
    var t = e.dom, n = {position: "relative"}, r = {left: 0, margin: 0, opacity: 0, overflow: "hidden", padding: 0, position: "absolute", top: 0, zIndex: 1}, i = {cursor: "inherit", fontSize: "50px", height: "50px", marginTop: "-25px", outline: 0, padding: 0, position: "absolute", right: "-4px", top: "50%"}, s = {"x-webkit-speech": "", speech: ""};
    e.toolbar.Speech = function (o, u) {
        var a = document.createElement("input");
        if (!e.browser.supportsSpeechApiOn(a)) {
            u.style.display = "none";
            return
        }
        var f = document.createElement("div");
        e.lang.object(r).merge({width: u.offsetWidth + "px", height: u.offsetHeight + "px"}), t.insert(a).into(f), t.insert(f).into(u), t.setStyles(i).on(a), t.setAttributes(s).on(a), t.setStyles(r).on(f), t.setStyles(n).on(u);
        var l = "onwebkitspeechchange"in a ? "webkitspeechchange" : "speechchange";
        t.observe(a, l, function () {
            o.execCommand("insertText", a.value), a.value = ""
        }), t.observe(a, "click", function (e) {
            t.hasClass(u, "wysihtml5-command-disabled") && e.preventDefault(), e.stopPropagation()
        })
    }
}(wysihtml5), function (e) {
    var t = "wysihtml5-command-disabled", n = "wysihtml5-commands-disabled", r = "wysihtml5-command-active", i = "wysihtml5-action-active", s = e.dom;
    e.toolbar.Toolbar = Base.extend({constructor: function (t, n) {
        this.editor = t, this.container = typeof n == "string" ? document.getElementById(n) : n, this.composer = t.composer, this._getLinks("command"), this._getLinks("action"), this._observe(), this.show();
        var r = this.container.querySelectorAll("[data-wysihtml5-command=insertSpeech]"), i = r.length, s = 0;
        for (; s < i; s++)new e.toolbar.Speech(this, r[s])
    }, _getLinks: function (t) {
        var n = this[t + "Links"] = e.lang.array(this.container.querySelectorAll("[data-wysihtml5-" + t + "]")).get(), r = n.length, i = 0, s = this[t + "Mapping"] = {}, o, u, a, f, l;
        for (; i < r; i++)o = n[i], a = o.getAttribute("data-wysihtml5-" + t), f = o.getAttribute("data-wysihtml5-" + t + "-value"), u = this.container.querySelector("[data-wysihtml5-" + t + "-group='" + a + "']"), l = this._getDialog(o, a), s[a + ":" + f] = {link: o, group: u, name: a, value: f, dialog: l, state: !1}
    }, _getDialog: function (t, n) {
        var r = this, i = this.container.querySelector("[data-wysihtml5-dialog='" + n + "']"), s, o;
        return i && (s = new e.toolbar.Dialog(t, i), s.observe("show", function () {
            o = r.composer.selection.getBookmark(), r.editor.fire("show:dialog", {command: n, dialogContainer: i, commandLink: t})
        }), s.observe("save", function (e) {
            o && r.composer.selection.setBookmark(o), r._execCommand(n, e), r.editor.fire("save:dialog", {command: n, dialogContainer: i, commandLink: t})
        }), s.observe("cancel", function () {
            r.editor.focus(!1), r.editor.fire("cancel:dialog", {command: n, dialogContainer: i, commandLink: t})
        })), s
    }, execCommand: function (e, t) {
        if (this.commandsDisabled)return;
        var n = this.commandMapping[e + ":" + t];
        n && n.dialog && !n.state ? n.dialog.show() : this._execCommand(e, t)
    }, _execCommand: function (e, t) {
        this.editor.focus(!1), this.composer.commands.exec(e, t), this._updateLinkStates()
    }, execAction: function (e) {
        var t = this.editor;
        switch (e) {
            case"change_view":
                t.currentView === t.textarea ? t.fire("change_view", "composer") : t.fire("change_view", "textarea")
        }
    }, _observe: function () {
        var e = this, t = this.editor, r = this.container, i = this.commandLinks.concat(this.actionLinks), o = i.length, u = 0;
        for (; u < o; u++)s.setAttributes({href: "javascript:;", unselectable: "on"}).on(i[u]);
        s.delegate(r, "[data-wysihtml5-command]", "mousedown", function (e) {
            e.preventDefault()
        }), s.delegate(r, "[data-wysihtml5-command]", "click", function (t) {
            var n = this, r = n.getAttribute("data-wysihtml5-command"), i = n.getAttribute("data-wysihtml5-command-value");
            e.execCommand(r, i), t.preventDefault()
        }), s.delegate(r, "[data-wysihtml5-action]", "click", function (t) {
            var n = this.getAttribute("data-wysihtml5-action");
            e.execAction(n), t.preventDefault()
        }), t.observe("focus:composer", function () {
            e.bookmark = null, clearInterval(e.interval), e.interval = setInterval(function () {
                e._updateLinkStates()
            }, 500)
        }), t.observe("blur:composer", function () {
            clearInterval(e.interval)
        }), t.observe("destroy:composer", function () {
            clearInterval(e.interval)
        }), t.observe("change_view", function (t) {
            setTimeout(function () {
                e.commandsDisabled = t !== "composer", e._updateLinkStates(), e.commandsDisabled ? s.addClass(r, n) : s.removeClass(r, n)
            }, 0)
        })
    }, _updateLinkStates: function () {
        var n = this.composer.element, o = this.commandMapping, u = this.actionMapping, a, f, l, c;
        for (a in o) {
            c = o[a], this.commandsDisabled ? (f = !1, s.removeClass(c.link, r), c.group && s.removeClass(c.group, r), c.dialog && c.dialog.hide()) : (f = this.composer.commands.state(c.name, c.value), e.lang.object(f).isArray() && (f = f.length === 1 ? f[0] : !0), s.removeClass(c.link, t), c.group && s.removeClass(c.group, t));
            if (c.state === f)continue;
            c.state = f, f ? (s.addClass(c.link, r), c.group && s.addClass(c.group, r), c.dialog && (typeof f == "object" ? c.dialog.show(f) : c.dialog.hide())) : (s.removeClass(c.link, r), c.group && s.removeClass(c.group, r), c.dialog && c.dialog.hide())
        }
        for (a in u)l = u[a], l.name === "change_view" && (l.state = this.editor.currentView === this.editor.textarea, l.state ? s.addClass(l.link, i) : s.removeClass(l.link, i))
    }, show: function () {
        this.container.style.display = ""
    }, hide: function () {
        this.container.style.display = "none"
    }})
}(wysihtml5), function (e) {
    var t, n = {name: t, style: !0, toolbar: t, autoLink: !0, parserRules: {tags: {br: {}, span: {}, div: {}, p: {}}, classes: {}}, parser: e.dom.parse, composerClassName: "wysihtml5-editor", bodyClassName: "wysihtml5-supported", stylesheets: [], placeholderText: t, allowObjectResizing: !0, supportTouchDevices: !0};
    e.Editor = e.lang.Dispatcher.extend({constructor: function (t, r) {
        this.textareaElement = typeof t == "string" ? document.getElementById(t) : t, this.config = e.lang.object({}).merge(n).merge(r).get(), this.textarea = new e.views.Textarea(this, this.textareaElement, this.config), this.currentView = this.textarea, this._isCompatible = e.browser.supported();
        if (!this._isCompatible || !this.config.supportTouchDevices && e.browser.isTouchDevice()) {
            var i = this;
            setTimeout(function () {
                i.fire("beforeload").fire("load")
            }, 0);
            return
        }
        e.dom.addClass(document.body, this.config.bodyClassName), this.composer = new e.views.Composer(this, this.textareaElement, this.config), this.currentView = this.composer, typeof this.config.parser == "function" && this._initParser(), this.observe("beforeload", function () {
            this.synchronizer = new e.views.Synchronizer(this, this.textarea, this.composer), this.config.toolbar && (this.toolbar = new e.toolbar.Toolbar(this, this.config.toolbar))
        });
        try {
        } catch (s) {
        }
    }, isCompatible: function () {
        return this._isCompatible
    }, clear: function () {
        return this.currentView.clear(), this
    }, getValue: function (e) {
        return this.currentView.getValue(e)
    }, setValue: function (e, t) {
        return e ? (this.currentView.setValue(e, t), this) : this.clear()
    }, focus: function (e) {
        return this.currentView.focus(e), this
    }, disable: function () {
        return this.currentView.disable(), this
    }, enable: function () {
        return this.currentView.enable(), this
    }, isEmpty: function () {
        return this.currentView.isEmpty()
    }, hasPlaceholderSet: function () {
        return this.currentView.hasPlaceholderSet()
    }, parse: function (t) {
        var n = this.config.parser(t, this.config.parserRules, this.composer.sandbox.getDocument(), !0);
        return typeof t == "object" && e.quirks.redraw(t), n
    }, _initParser: function () {
        this.observe("paste:composer", function () {
            var t = !0, n = this;
            n.composer.selection.executeAndRestore(function () {
                e.quirks.cleanPastedHTML(n.composer.element), n.parse(n.composer.element)
            }, t)
        }), this.observe("paste:textarea", function () {
            var e = this.textarea.getValue(), t;
            t = this.parse(e), this.textarea.setValue(t)
        })
    }})
}(wysihtml5);
var wysihtml5ParserRules = {classes: {"wysiwyg-clear-both": 1, "wysiwyg-clear-left": 1, "wysiwyg-clear-right": 1, "wysiwyg-color-aqua": 1, "wysiwyg-color-black": 1, "wysiwyg-color-blue": 1, "wysiwyg-color-fuchsia": 1, "wysiwyg-color-gray": 1, "wysiwyg-color-green": 1, "wysiwyg-color-lime": 1, "wysiwyg-color-maroon": 1, "wysiwyg-color-navy": 1, "wysiwyg-color-olive": 1, "wysiwyg-color-purple": 1, "wysiwyg-color-red": 1, "wysiwyg-color-silver": 1, "wysiwyg-color-teal": 1, "wysiwyg-color-white": 1, "wysiwyg-color-yellow": 1, "wysiwyg-float-left": 1, "wysiwyg-float-right": 1, "wysiwyg-font-size-large": 1, "wysiwyg-font-size-larger": 1, "wysiwyg-font-size-medium": 1, "wysiwyg-font-size-small": 1, "wysiwyg-font-size-smaller": 1, "wysiwyg-font-size-x-large": 1, "wysiwyg-font-size-x-small": 1, "wysiwyg-font-size-xx-large": 1, "wysiwyg-font-size-xx-small": 1, "wysiwyg-text-align-center": 1, "wysiwyg-text-align-justify": 1, "wysiwyg-text-align-left": 1, "wysiwyg-text-align-right": 1}, tags: {tr: {add_class: {align: "align_text"}}, strike: {remove: 1}, form: {rename_tag: "div"}, rt: {rename_tag: "span"}, code: {}, acronym: {rename_tag: "span"}, br: {add_class: {clear: "clear_br"}}, details: {rename_tag: "div"}, h4: {add_class: {align: "align_text"}}, em: {}, title: {remove: 1}, multicol: {rename_tag: "div"}, figure: {rename_tag: "div"}, xmp: {rename_tag: "span"}, small: {rename_tag: "span", set_class: "wysiwyg-font-size-smaller"}, area: {remove: 1}, time: {rename_tag: "span"}, dir: {rename_tag: "ul"}, bdi: {rename_tag: "span"}, command: {remove: 1}, ul: {}, progress: {rename_tag: "span"}, dfn: {rename_tag: "span"}, iframe: {remove: 1}, figcaption: {rename_tag: "div"}, a: {check_attributes: {href: "url"}, set_attributes: {rel: "nofollow", target: "_blank"}}, img: {check_attributes: {width: "numbers", alt: "alt", src: "url", height: "numbers"}, add_class: {align: "align_img"}}, rb: {rename_tag: "span"}, footer: {rename_tag: "div"}, noframes: {remove: 1}, abbr: {rename_tag: "span"}, u: {}, bgsound: {remove: 1}, sup: {rename_tag: "span"}, address: {rename_tag: "div"}, basefont: {remove: 1}, nav: {rename_tag: "div"}, h1: {add_class: {align: "align_text"}}, head: {remove: 1}, tbody: {add_class: {align: "align_text"}}, dd: {rename_tag: "div"}, s: {rename_tag: "span"}, li: {}, td: {check_attributes: {rowspan: "numbers", colspan: "numbers"}, add_class: {align: "align_text"}}, object: {remove: 1}, div: {add_class: {align: "align_text"}}, option: {rename_tag: "span"}, select: {rename_tag: "span"}, i: {}, track: {remove: 1}, wbr: {remove: 1}, fieldset: {rename_tag: "div"}, big: {rename_tag: "span", set_class: "wysiwyg-font-size-larger"}, button: {rename_tag: "span"}, noscript: {remove: 1}, svg: {remove: 1}, input: {remove: 1}, table: {}, keygen: {remove: 1}, h5: {add_class: {align: "align_text"}}, meta: {remove: 1}, map: {rename_tag: "div"}, isindex: {remove: 1}, mark: {rename_tag: "span"}, caption: {add_class: {align: "align_text"}}, tfoot: {add_class: {align: "align_text"}}, base: {remove: 1}, video: {remove: 1}, strong: {}, canvas: {remove: 1}, output: {rename_tag: "span"}, marquee: {rename_tag: "span"}, b: {}, q: {check_attributes: {cite: "url"}}, applet: {remove: 1}, span: {}, rp: {rename_tag: "span"}, spacer: {remove: 1}, source: {remove: 1}, aside: {rename_tag: "div"}, frame: {remove: 1}, section: {rename_tag: "div"}, body: {rename_tag: "div"}, ol: {}, nobr: {rename_tag: "span"}, html: {rename_tag: "div"}, summary: {rename_tag: "span"}, "var": {rename_tag: "span"}, del: {remove: 1}, blockquote: {check_attributes: {cite: "url"}}, style: {remove: 1}, device: {remove: 1}, meter: {rename_tag: "span"}, h3: {add_class: {align: "align_text"}}, textarea: {rename_tag: "span"}, embed: {remove: 1}, hgroup: {rename_tag: "div"}, font: {rename_tag: "span", add_class: {size: "size_font"}}, tt: {rename_tag: "span"}, noembed: {remove: 1}, thead: {add_class: {align: "align_text"}}, blink: {rename_tag: "span"}, plaintext: {rename_tag: "span"}, xml: {remove: 1}, h6: {add_class: {align: "align_text"}}, param: {remove: 1}, th: {check_attributes: {rowspan: "numbers", colspan: "numbers"}, add_class: {align: "align_text"}}, legend: {rename_tag: "span"}, hr: {}, label: {rename_tag: "span"}, dl: {rename_tag: "div"}, kbd: {rename_tag: "span"}, listing: {rename_tag: "div"}, dt: {rename_tag: "span"}, nextid: {remove: 1}, pre: {}, center: {rename_tag: "div", set_class: "wysiwyg-text-align-center"}, audio: {remove: 1}, datalist: {rename_tag: "span"}, samp: {rename_tag: "span"}, col: {remove: 1}, article: {rename_tag: "div"}, cite: {}, link: {remove: 1}, script: {remove: 1}, bdo: {rename_tag: "span"}, menu: {rename_tag: "ul"}, colgroup: {remove: 1}, ruby: {rename_tag: "span"}, h2: {add_class: {align: "align_text"}}, ins: {rename_tag: "span"}, p: {add_class: {align: "align_text"}}, sub: {rename_tag: "span"}, comment: {remove: 1}, frameset: {remove: 1}, optgroup: {rename_tag: "span"}, header: {rename_tag: "div"}}};
(function () {
    function r(e, t) {
        return function () {
            return e.apply(t, arguments)
        }
    }

    var e, t, n;
    e = function () {
        function e(e) {
            var t = this;
            this.el = e, this.resetHeight = r(this.resetHeight, this), this.adjustHeight = r(this.adjustHeight, this), this.watchForChanges = r(this.watchForChanges, this), this.makeTestContainer = r(this.makeTestContainer, this), this.preventScrollBars = r(this.preventScrollBars, this), this.sourceContents = r(this.sourceContents, this), this.source = r(this.source, this), this.$el = $(this.el).css({resize: "none"}), this.heightLimit = this.$el.data("autoresize-limit"), this.$source = this.source(), this.originalHeight = this.$el.height(), this.$testContainer = this.makeTestContainer(), this.preventScrollBars(), setTimeout(function () {
                t.adjustHeight(), t.watchForChanges()
            }, 1)
        }

        return e.prototype.resizeBy = 2, e.install = function (e) {
            if (!$(e).is("[data-autoresize]"))return $(e).attr("data-autoresize", !0), new this(e)
        }, e.prototype.source = function () {
            return this.$el
        }, e.prototype.sourceContents = function () {
            return this.$source.val().replace(/\n/g, "<br>").replace(/</g, "&lt;").replace(/>/g, "&gt;")
        }, e.prototype.preventScrollBars = function () {
            return this.$source.css("overflow", "hidden")
        }, e.prototype.makeTestContainer = function () {
            var e, t, n, r, i;
            e = $("<div>").css({position: "absolute", left: -9999, top: 0, "word-wrap": "break-word"}), t = ["fontSize", "fontFamily", "fontWeight", "letterSpacing", "lineHeight", "textDecoration", "padding"];
            for (r = 0, i = t.length; r < i; r++)n = t[r], e.css(n, this.$source.css(n));
            return e.insertBefore(this.$el)
        }, e.prototype.watchForChanges = function () {
            var e = this;
            this.$source.bind("keyup keydown paste change focus", _.throttle(function () {
                return e.adjustHeight()
            }, $.support.touch ? 300 : 5)), this.$el.closest("form").bind("reset", function () {
                return e.resetHeight()
            })
        }, e.prototype.adjustHeight = function () {
            var e, t, n, r, i;
            return this.$testContainer.width(this.$source.width()), i = this.$testContainer.html("X").height(), this.$testContainer.html(this.sourceContents()), r = parseInt(this.$el.data("rows") || this.$el.attr("rows")) || !1, n = r === 1 ? 1 : this.resizeBy * i, e = r ? i * r + 1 : this.originalHeight, t = this.$testContainer.height() + n, this.heightLimit && t > this.heightLimit && (t = this.heightLimit), t < e && (t = e), t = Math.round(t), this.$el.css("min-height", t)
        }, e.prototype.resetHeight = function () {
            return this.$el.css("min-height", this.originalHeight)
        }, e
    }(), t = function (e) {
        function t() {
            this.preventScrollBars = r(this.preventScrollBars, this), this.sourceContents = r(this.sourceContents, this), this.source = r(this.source, this), t.__super__.constructor.apply(this, arguments)
        }

        function n(e, t) {
            function n() {
                this.constructor = e
            }

            for (var r in t)Object.prototype.hasOwnProperty.call(t, r) && (e[r] = t[r]);
            return n.prototype = t.prototype, e.prototype = new n, e.__super__ = t.prototype, e
        }

        return n(t, e), t.prototype.source = function () {
            return this.$el.contents().find("body")
        }, t.prototype.sourceContents = function () {
            return this.$source.html()
        }, t.prototype.preventScrollBars = function () {
            return this.$source.parent("html").css({overflow: "hidden"})
        }, t
    }(e), $.fn.autoResize = function () {
        return this.each(function () {
            this.tagName.toLowerCase() === "iframe" ? t.install(this) : e.install(this)
        })
    }
})();
var favorites = undefined;
$(function () {
    touch(!1), initTab(), initNavZone(), $(".dropdown-toggle").dropdown(), $("#new_apartment_link").click(function () {
        var e = this;
        return _gaq.push(["_set", "hitCallback", function () {
            window.location.href = $(e).attr("href")
        }]), _gaq.push(["_trackEvent", "New Aparment Link", "click"]), !window._gat
    }), $(document).ajaxSend(function (e, t, n) {
        var r = $("meta[name='csrf-token']").attr("content");
        t.setRequestHeader("X-CSRF-Token", r)
    })
});