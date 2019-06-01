$(document).ready(function(){

    $.jstree.defaults.core.themes.variant = "medium";

    // research tree
    $('#research_tree').jstree({
    'core' : {
        'data' : {
            'url' : 'research',
            'type': 'GET',
            'dataType' : 'json',
            'data' : (node) => {
                return { 'id' : node.id };
            },
            success: (data) => {

            }
        },
        'animation' : 150,
        "check_callback" : false
    },
    'plugins' : ['search'],
    "search": {
        "case_insensitive": true,
        "show_only_matches": true
    }
    }).on('select_node.jstree', (e, data) => {
        $('#lecturerInfo > tbody').empty();
        console.log("Node selected: " + data.node.id);
        $.ajax({
            type:'POST',
            url:'/result/field',
            dataType: 'json',
            data: {
                field_id: data.node.id
            },
            success: (response) => {
                console.log("success");
                var tr_html = '';
                $.each(response, function (i, item) {
                    tr_html += '<tr><td>' + item.degree_level + '</td><td>' + '<a href="profile/?id=' + item.staff_id + '">' + item.full_name +'</a>' +'</td><td>' + item.name + '</td></tr>';
                });
                $('#lecturerInfo').append(tr_html);
            }
        });
    });


    // division tree
    $('#division_tree').jstree({
    'core' : {
        'data' : {
            'url' : 'search/division',
            'type': 'GET',
            'dataType' : 'json',
            'data' : (node) => {
                return { 'id' : node.id };
            },
            success: (data) => {

            }
        },
        'animation' : 150,
        "check_callback" : false
    },
    'plugins' : ['search'],
    "search": {
        "case_insensitive": true,
        "show_only_matches": true
    }
    }).on('select_node.jstree', (e, data) => {
        $('#lecturerInfo > tbody').empty();
        console.log("Node selected: " + data.node.id);
        $.ajax({
            type:'POST',
            url:'/result/division',
            dataType: 'json',
            data: {
                division_id: data.node.id
            },
            success: (response) => {
                console.log("success");
                var tr_html = '';
                $.each(response, function (i, item) {
                    tr_html += '<tr><td>' + item.degree_level + '</td><td>' + '<a href="profile/?id=' + item.staff_id + '">' + item.full_name +'</a>' +'</td><td>' + item.name + '</td></tr>';
                });
                $('#lecturerInfo').append(tr_html);
            }
        });
    });


    // searchbox
    $( "#search_division" ).keyup(function() {
       var text = $(this).val();
       searchDivision(text);
    });

    $( "#search_field" ).keyup(function() {
       var text = $(this).val();
       searchField(text);
    });

    function searchField(text) {
        $('#research_tree').jstree(true).search(text);
    }

    function searchDivision(text) {
        $('#division_tree').jstree(true).search(text);
    }
});