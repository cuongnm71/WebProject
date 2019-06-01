function returnBlank(item){
    if(item == null){
        return "";
    }else{
        return item;
    }
}
var getUrlParameter = function getUrlParameter(sParam) {
    var sPageURL = window.location.search.substring(1),
        sURLVariables = sPageURL.split('&'),
        sParameterName,
        i;
    for (i = 0; i < sURLVariables.length; i++) {
        sParameterName = sURLVariables[i].split('=');

        if (sParameterName[0] === sParam) {
            return sParameterName[1] === undefined ? true : decodeURIComponent(sParameterName[1]);
        }
    }
};
var isRelease = false;
var staff_id = getUrlParameter("id");
 $(document).ready(()=>{
    loadBasicInfoAndInterestedField();
 });
function loadBasicInfoAndInterestedField(){
    $.ajax({
        url: 'lecturer_info/' + staff_id,
        type: 'GET',
        dataType: 'json',
        success: (data) =>{
            document.getElementById("full_name").innerHTML = returnBlank(data[0]["degree_level"]) + " " +returnBlank(data[0]["full_name"]);
            document.getElementById("staff_id").innerHTML = staff_id;
            document.getElementById("staff_type").innerHTML = returnBlank(data[0]["staff_type"]);
            document.getElementById("address").innerHTML = returnBlank(data[0]["address"]);
            document.getElementById("degree_level").innerHTML = returnBlank(data[0]["degree_level"]);
            document.getElementById("phone_number").innerHTML = returnBlank(data[0]["phone_number"]);
            document.getElementById("vnu_email").innerHTML = returnBlank(data[0]["vnu_email"]);
            document.getElementById("other_email").innerHTML = returnBlank(data[0]["other_email"]);
            document.getElementById("website").innerHTML = returnBlank(data[0]["website"]);
            document.getElementById("staff_address").innerHTML = returnBlank(data[0]["staff_address"]);
            document.getElementById("interested-field-editor").value = returnBlank(data[0]["interested_field"]);

        }
    });
}
function editBasicInfo(id){
    document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
    document.getElementById("notification").style.color ="green";
    document.getElementById("notification").innerHTML = 'ENTER để "Lưu"/ ESC để "Huỷ" thay đổi';
    $("#notification").fadeOut(5000, function() {
        $(this).css({
            "visibility": "hidden",
            "display": "block"
        });
    });

    let originVal = document.getElementById(id).innerHTML;
    document.getElementById(id).innerHTML = "<input type='text' id='"+ id +"_text' value='"+originVal+"'>";
    // if(id=="website"){
    //     document.getElementById(id).getAttribute("href").value = "javascript:void(0)";
    //     document.getElementById(id).innerHTML = "<input type='text' id='"+ id +"_text' value='"+originVal+"'>";
    // }
    document.getElementById(id+"_text").addEventListener("keydown",function(e){
        if(e.key=="Enter"){
            saveBasicInfo(id);
        } else if(e.key=="Esc"||e.key=="Escape"){
            // "Esc": // IE/Edge specific value
            cancelBasicInfo(id);
        }
    });
}
function saveBasicInfo(id){
    let staff_id= document.getElementById("staff_id").innerHTML;
    let originVal= document.getElementById(id+"_text").getAttribute("value");
    let newVal = document.getElementById(id+"_text").value;

    //console.log("origin: " + originVal, "new: "+ newVal);
    document.getElementById(id).innerHTML=newVal;

    if(id=="phone_number"){
        $.ajax({
            type:'POST',
            url:'lecturer_info/' + staff_id + '/editPhoneNumber',
            dataType: 'json',
            data:{
                staff_id: staff_id,
                phone_number: newVal
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success"){
                    document.getElementById("notification").style.color ="green";
                    document.getElementById("notification").innerHTML = "Sửa thành công";
                } else {
                    document.getElementById("notification").style.color ="red";
                    document.getElementById("notification").innerHTML = response.message;
                    document.getElementById(id).innerHTML = originVal;
                }
                $("#notification").fadeOut(3000, function() {
                    $(this).css({
                        "visibility": "hidden",
                        "display": "block"
                    });
                });
            }
        });
    } else if (id=="vnu_email"){
        $.ajax({
            type:'POST',
            url:'lecturer_info/' + staff_id + '/editVnuEmail',
            dataType: 'json',
            data:{
                staff_id: staff_id,
                vnu_email: newVal
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success"){
                    document.getElementById("notification").style.color ="green";
                    document.getElementById("notification").innerHTML = "Sửa thành công";
                } else {
                    document.getElementById("notification").style.color ="red";
                    document.getElementById("notification").innerHTML = response.message;
                    document.getElementById(id).innerHTML = originVal;
                }
                $("#notification").fadeOut(3000, function() {
                    $(this).css({
                        "visibility": "hidden",
                        "display": "block"
                    });
                });
            }
        });
    } else if (id=="other_email"){
        $.ajax({
            type:'POST',
            url:'lecturer_info/' + staff_id + '/editOtherEmail',
            dataType: 'json',
            data:{
                staff_id: staff_id,
                other_email: newVal
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success"){
                    document.getElementById("notification").style.color ="green";
                    document.getElementById("notification").innerHTML = "Sửa thành công";
                } else {
                    document.getElementById("notification").style.color ="red";
                    document.getElementById("notification").innerHTML = response.message;
                    document.getElementById(id).innerHTML = originVal;
                }
                $("#notification").fadeOut(3000, function() {
                    $(this).css({
                        "visibility": "hidden",
                        "display": "block"
                    });
                });
            }
        });
    } else if (id=="website") {
        $.ajax({
            type:'POST',
            url:'lecturer_info/' + staff_id + '/editWebsite',
            dataType: 'json',
            data:{
                staff_id: staff_id,
                website: newVal
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success"){
                    //document.getElementById("website").getAttribute("href") = newVal;
                    document.getElementById("notification").style.color ="green";
                    document.getElementById("notification").innerHTML = "Sửa thành công";
                } else {
                    document.getElementById("notification").style.color ="red";
                    document.getElementById("notification").innerHTML = response.message;
                    document.getElementById(id).innerHTML = originVal;
                }
                $("#notification").fadeOut(3000, function() {
                    $(this).css({
                        "visibility": "hidden",
                        "display": "block"
                    });
                });
            }
        });
    } else if (id=="staff_address"){
        $.ajax({
            type:'POST',
            url:'lecturer_info/' + staff_id + '/editStaffAddress',
            dataType: 'json',
            data:{
                staff_id: staff_id,
                staff_address: newVal
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success"){
                    document.getElementById("notification").style.color ="green";
                    document.getElementById("notification").innerHTML = "Sửa thành công";
                } else {
                    document.getElementById("notification").style.color ="red";
                    document.getElementById("notification").innerHTML = response.message;
                    document.getElementById(id).innerHTML = originVal;
                }
                $("#notification").fadeOut(3000, function() {
                    $(this).css({
                        "visibility": "hidden",
                        "display": "block"
                    });
                });
            }
        });
    }
}
function cancelBasicInfo(id){
    let originVal= document.getElementById(id+"_text").getAttribute("value");
    document.getElementById(id).innerHTML = originVal;
}


function editInterestedField(id){
    let originVal = document.getElementById(id).value;
    document.getElementById(id).removeAttribute("disabled");

    document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
    document.getElementById("notification").style.color ="green";
    document.getElementById("notification").innerHTML = 'ENTER để "Xuống dòng"/  CTR ENTER để "Lưu" /ESC để "Huỷ" thay đổi';
    $("#notification").fadeOut(8000, function() {
        $(this).css({
            "visibility": "hidden",
            "display": "block"
        });
    });

    document.getElementById(id).addEventListener("keydown",function(e){
        if(e.which == 13 && e.ctrlKey){
            document.getElementById(id).setAttribute("disabled","true");
            saveInterestedField(id,originVal);

            /* prevent handle twice submit */
            event.preventDefault();
        } else if(e.key=="Esc"||e.key=="Escape"){
            // "Esc": // IE/Edge specific value
            cancelInterestedField(id,originVal);
        } else if(e.key=="Enter"){
            // &#10;
            //document.getElementById(id).insertAdjacentHTML("beforeend","&#10");
            e.stopPropagation();
        }
    });
}

function saveInterestedField(id,originVal){
    //console.log("interested field save");
    let staff_id= document.getElementById("staff_id").innerHTML;
    let newVal = document.getElementById(id).value;
    $.ajax({
        type:'POST',
        url:'lecturer_info/' + staff_id + '/editInterestedField',
        dataType: 'json',
        data:{
            staff_id: staff_id,
            interested_field: newVal
        },
        success:(response) => {
            document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
            if(response.message=="success"){
                document.getElementById("notification").style.color ="green";
                document.getElementById("notification").innerHTML = "Sửa thành công";
            } else {
                document.getElementById("notification").style.color ="red";
                document.getElementById("notification").innerHTML = response.message;
                document.getElementById(id).innerHTML = originVal;
            }
            $("#notification").fadeOut(3000, function() {
                $(this).css({
                    "visibility": "hidden",
                    "display": "block"
                });
            });
        }
    });
}

function cancelInterestedField(id,originVal){
    // console.log("interested field cancel");
    //console.log(originVal);
    document.getElementById(id).value = originVal;
    document.getElementById(id).setAttribute("disabled","true");
}

// for tree
$.jstree.defaults.core.themes.variant = "medium";
$(document).ready(function () {
    displayFields();
    $("#btn_updateDB").hide();
    $("#heading").hide();
    $('#btn_edit').on("click", function() {
            $("#heading").show();
            renderTree();
            $("#btn_updateDB").show();
            $('#btn_updateDB').on("click", function() {
            var checked = $('#research_tree').jstree("get_checked",null,true);
            console.log("Updated!");
            updateCheckedFields(checked);
    });
    });
});

function renderTree(jsondata) {
    $('#research_tree').jstree({
        "core": {
            'data': {
                'url': 'research',
                'type': 'GET',
                'dataType' : 'json',
                'data' : (node) => {
                    return { 'id' : node.id };
                }
            },
            'animation': 150
        },
        "multiple": true,
        "plugins": ["search", "checkbox"],
        "search": {
            "case_sensitive": true,
            "show_only_matches": true
        }
    }).bind("loaded.jstree", (event, data) => {
        $(this).jstree("open_all");
    });
}

function displayFields() {
    $.ajax({
        url: '/lecturer_interests/' + staff_id,
        type: 'GET',
        dataType: 'json',
        success: (response) => {
            console.log("success");
            var tr_html = '';
            $.each(response, function (i, item) {
                tr_html += '<li>+ ' + item.name + '</li>';
            });
            $('#researchList').append(tr_html);
        }
    });
}

function updateCheckedFields(selected) {
    $.ajax({
        url: '/lecturer_interests/' + staff_id,
        type: 'POST',
        dataType: 'json',
        data: {
            IDs: selected
        },
        success: (response) => {
            $('#researchList').empty();
            var tr_html = '';
            $.each(response, function (i, item) {
                tr_html += '<li>+ ' + item.name + '</li>';
            });
            $('#researchList').append(tr_html);
        }
    });
}

$( "#search_field" ).keyup(function() {
        var text = $(this).val();
        search(text);
});

function search(text) {
    $('#research_tree').jstree(true).search(text);
}
