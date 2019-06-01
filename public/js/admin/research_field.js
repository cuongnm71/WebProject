var maxID;

$(document).ready(function(){
    // jstree
    $.jstree.defaults.core.themes.variant = "medium";
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
                maxID = data[0].id;
                for (var i = 1; i < data.length; i++)
                    if (data[i].id > maxID)
                        maxID = data[i].id;
            }
        },
        'animation' : 150,
        "check_callback" : (operation, node, parent, position, more) => {
            if(operation === "delete_node" || operation === "copy_node" || operation === "move_node") {
                if(parent.id === "#") {
                    return false; // prevent moving a child above or below the root
                }
            }
            return true; // allow everything else
        }
    },
    'plugins' : ['state','contextmenu','search'],
    "search": {
        "case_insensitive": true,
        "show_only_matches": true
    },
    "contextmenu": {
        "items": ($node) => {
            var tree = $("#research_tree").jstree(true);
            return {
                "create": {
                    "separator_before": false,
                    "separator_after": true,
                    "label": "Thêm lĩnh vực",
                    "action": (obj) => {
                        $node = tree.create_node($node);
                        tree.edit($node);
                    }
                },
                "rename": {
                    "separator_before": false,
                    "separator_after": false,
                    "label": "Đổi tên",
                    "action": (obj) => {
                        tree.edit($node);
                    }
                },
                "delete": {
                    "separator_before": false,
                    "separator_after": false,
                    "label": "Xóa",
                    "action": (obj) => {
                        if (confirm("Bạn chắc chắn muốn xóa mục này?")) {
                            tree.delete_node($node);
                        }
                    }
                }
            };
        }
    }
    }).on('create_node.jstree', (e, data) => {
        maxID++;
        data.instance.set_id(data.node, maxID);
        $.ajax({
            type:'POST',
            url:'research/create',
            dataType: 'json',
            data: {
                id: maxID,
                parent_id: data.node.parent,
                text: data.node.text
            }
        });

    }).on('rename_node.jstree', (e, data) => {
        $.ajax({
            type:'POST',
            url:'research/rename',
            dataType: 'json',
            data: {
                id: data.node.id,
                text: data.text
            }
        });
    }).on('delete_node.jstree', (e, data) => {
        $.ajax({
            type:'POST',
            url:'research/delete',
            dataType: 'json',
            data: {
                id: data.node.id
            }
        });
    });


    $( "#search_field" ).keyup(function() {
       var text = $(this).val();
       search(text);
    });

    function search(text) {
        $('#research_tree').jstree(true).search(text);
    }
});