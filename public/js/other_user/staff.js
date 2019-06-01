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
    $('#researchList').empty();
    displayFields();
    loadBasicInfoAndInterestedField();
 });

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
            document.getElementById("interested-field-editor").value = returnBlank(data[0]['interested_field']);
        }
    });
}
