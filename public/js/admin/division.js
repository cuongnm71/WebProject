var isRelease = false;
  function returnBlank(item){
    if(item == null){
      return "";
    }else{
      return item;
    }
  }

  $(document).ready(()=>{
    loadTable();
  });
  function loadTable(){
    $.ajax({
        url: 'division',
        type: 'GET',
        dataType: 'json',
        success: (data) =>{
          let x = ' <thead> <tr class="title">\
            <th>Thứ tự</th>\
            <th>Tên đơn vị</th>\
            <th>Loại đơn vị</th>\
            <th>Địa chỉ</th>\
            <th>Điện thoại</th>\
            <th>Website </th>\
            <th>Thao tác</th>\
            </tr> </thead>';
        if(!isRelease){
        console.log('ajax success!',data);
        }      
        let nextIndexRow=document.getElementById("table-u").lastChild.childNodes.length;
        // no childs -> nextIndexRow = 0;
        
        // if(!isRelease){
        //   console.log(document.getElementById("table-u").lastChild.childNodes);
        // }
        x += '<tbody><tr id="new_row">' + '<td id = "insert_row_o">'+ nextIndexRow + '</td>';
        x+= '<td id = "insert_row"><input type="text" id="new_unit" required=""></td>\
        <td><input type="text" id="new_unitType" required=""></td>\
        <td><input type="text" id="new_add" required=""></td>\
        <td><input type="text" id="new_phone" required=""></td>\
        <td><input type="text" id="new_webAdd" required=""></td>\
        <td><input type="button" value="Thêm mới" onclick="insert_row();"></td>\
        </tr>';
        for(i in data){
        let id = data[i]["division_id"];
        nextIndexRow++;
        x += '<tr id="row'+id+'">'
            +'<td id="indexRow'+id+'">'+ nextIndexRow + '</td>';
        x +='<td id="unit'+id+'">'+ returnBlank(data[i]["name"])  + '</td>'
            +'<td id="unitType'+id+'">'+ returnBlank(data[i]["type"]) + '</td>'
            +'<td id="add'+id+'">'+ returnBlank(data[i]["address"]) + '</td>'
            +'<td id="phone'+id+'">'+ returnBlank(data[i]["phone_number"]) + '</td>'
            + '<td id="webAdd'+id+'">'+ returnBlank(data[i]["website"]) + '</td>'
        x+='<td>\
                <input type="button" value="Sửa" id="edit_button'+id+'" onclick="edit_row('+id +');">'
            +'<input type="button" value="Lưu" style="display:none" id="save_button'+id+'" onclick="save_row('+id +');">'
            +'<input type="button" value="Hủy" style="display:none" id="cancel_button'+id+'" onclick="cancel_row('+id +');">'
            +'<input type="button" value="Xóa" id="delete_button'+id+'" onclick="delete_row('+id +');">'
            +'</td></tr>';
        }
        x += '</tbody>';
        // if(!isRelease){
        //  console.log("new Body: ",x);
        // }
        document.getElementById("table-u").innerHTML = x;
    }
    });
  }
  function insert_row(){
    let table = document.getElementById("table-u");  
    
    //real row index
    let lastRow = table.rows.length - 1;
    let nextIDtoInsert = parseInt(table.rows[lastRow].getAttribute("id").split("row")[1]) + 1;
    // if(!isRelease){
    //   console.log("next ID to insert",nextIDtoInsert);
    // }

    //row order ~ ..
    let nextIndexRow=table.lastChild.childNodes.length;
    // if(!isRelease){
    //   console.log(nextIndexRow+1);
    // }

    let unit=document.getElementById("new_unit").value.trim();
    let unitType=document.getElementById("new_unitType").value.trim();
    let add=document.getElementById("new_add").value.trim();
    let webAdd=document.getElementById("new_webAdd").value.trim();
    let phone=document.getElementById("new_phone").value.trim();
    
    $.ajax({
      type:'POST',
      url:'division/insert',
      dataType: 'json',
      data:{
        division_id: nextIDtoInsert,
        name:unit,
        type:unitType,
        address:add,
        phone_number:phone,
        website: webAdd
      },
      success:(response) => {
        document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>"
        if(response.message=="success")
          {
            document.getElementById("notification").style.color ="green";
            document.getElementById("notification").innerHTML = "Thêm thành công";
            // if(!isRelease){
            //   console.log("running in inserting block");
            // }
            let id=nextIDtoInsert;
            let table=document.getElementById("table-u");
            let table_len=(table.rows.length);
            let row = table.insertRow(table_len).outerHTML=
            '<tr id="row'+id+'">'
              +'<td id="indexRow'+id+'">'+(nextIndexRow)+'</td>'
              +'<td id="unit'+id+'">'+unit+'</td>'
              +'<td id="unitType'+id+'">'+unitType+'</td>'
              +'<td id="add'+id+'">'+add+'</td>'
              +'<td id="phone'+id+'">'+phone+'</td>'
              +'<td id="webAdd'+id+'">'+webAdd+'</td>'
              +'<td>\
                  <input type="button" value="Sửa" id="edit_button'+id+'" onclick="edit_row('+id +');">'
                  +'<input type="button" value="Lưu" style="display:none" id="save_button'+id+'" onclick="save_row('+id +');">'
                  +'<input type="button" value="Hủy" style="display:none" id="cancel_button'+id+'" onclick="cancel_row('+id +');">'
                  +'<input type="button" value="Xóa" id="delete_button'+id+'" onclick="delete_row('+id +');">'
                  +'</td></tr>';
            //Reset to ""
            document.getElementById("new_unit").value="";
            document.getElementById("new_unitType").value="";
            document.getElementById("new_add").value="";
            document.getElementById("new_phone").value="";
            document.getElementById("new_webAdd").value="";
          } else {
            document.getElementById("notification").style.color ="red";
            document.getElementById("notification").innerHTML = response.message;
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

  function edit_row(id){
    let unit=document.getElementById("unit"+id).innerHTML;
    let unitType=document.getElementById("unitType"+id).innerHTML;
    let add=document.getElementById("add"+id).innerHTML;
    let phone=document.getElementById("phone"+id).innerHTML;
    let webAdd=document.getElementById("webAdd"+id).innerHTML;
    document.getElementById("unit"+id).innerHTML="<input type='text' id='unit_text"+id+"' value='"+unit+"'>";
    document.getElementById("unitType"+id).innerHTML="<input type='text' id='unitType_text"+id+"' value='"+unitType+"'>";
    document.getElementById("add"+id).innerHTML="<input type='text' id='add_text"+id+"' value='"+add+"'>";
    document.getElementById("phone"+id).innerHTML="<input type='text' id='phone_text"+id+"' value='"+phone+"'>";
    document.getElementById("webAdd"+id).innerHTML="<input type='text' id='webAdd_text"+id+"' value='"+webAdd+"'>";
    
    document.getElementById("edit_button"+id).style.display="none";
    document.getElementById("delete_button"+id).style.display="none";
    document.getElementById("save_button"+id).style.display="inline-block";
    document.getElementById("cancel_button"+id).style.display="inline-block";
    // if(!isRelease){
    //   console.log("data from edit_row(id): ",unit,unitType,add,webAdd,phone); 
    // }
  }

  function save_row(id){
    let unit_old=document.getElementById("unit_text"+id).getAttribute("value");
    let unitType_old=document.getElementById("unitType_text"+id).getAttribute("value");
    let add_old=document.getElementById("add_text"+id).getAttribute("value");
    let phone_old=document.getElementById("phone_text"+id).getAttribute("value");
    let webAdd_old=document.getElementById("webAdd_text"+id).getAttribute("value");
    
    let unit=document.getElementById("unit_text"+id).value.trim();
    let unitType=document.getElementById("unitType_text"+id).value.trim();
    let add=document.getElementById("add_text"+id).value.trim();
    let phone=document.getElementById("phone_text"+id).value.trim();
    let webAdd=document.getElementById("webAdd_text"+id).value.trim();
    // if(!isRelease){
    //   console.log("data from save_row(id): ",unit,unitType,add,webAdd,phone); 
    //   /*console.log(document.getElementById("add"+id));*/
    // }

    document.getElementById("unit"+id).innerHTML=unit;
    document.getElementById("unitType"+id).innerHTML=unitType;
    document.getElementById("add"+id).innerHTML=add;
    document.getElementById("phone"+id).innerHTML=phone;
    document.getElementById("webAdd"+id).innerHTML=webAdd;
    $.ajax({
      type:'POST',
      url:'division/edit',
      dataType: 'json',
      data:{
        division_id: id,
        name:unit,
        type:unitType,
        address:add,
        phone_number:phone,
        website: webAdd
      },
      success:(response) => {
        document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
        if(response.message=="success")
          {
            document.getElementById("notification").style.color ="green";
            document.getElementById("notification").innerHTML = "Sửa thành công";
          } else {

            document.getElementById("notification").style.color ="red";
            document.getElementById("notification").innerHTML = response.message;
            //reset to origin
            document.getElementById("unit"+id).innerHTML=unit_old;
            document.getElementById("unitType"+id).innerHTML=unitType_old;
            document.getElementById("add"+id).innerHTML=add_old;
            document.getElementById("phone"+id).innerHTML=phone_old;
            document.getElementById("webAdd"+id).innerHTML=webAdd_old;
          }
          $("#notification").fadeOut(3000, function() {
            $(this).css({
                "visibility": "hidden",
                "display": "block"
            });
          });
      }
    });

    document.getElementById("edit_button"+id).style.display="inline-block";
    document.getElementById("delete_button"+id).style.display="inline-block";
    document.getElementById("save_button"+id).style.display="none";
    document.getElementById("cancel_button"+id).style.display="none";
  }

  function cancel_row(id){
    let unit=document.getElementById("unit_text"+id).getAttribute("value");
    let unitType=document.getElementById("unitType_text"+id).getAttribute("value");
    let add=document.getElementById("add_text"+id).getAttribute("value");
    let phone=document.getElementById("phone_text"+id).getAttribute("value");
    let webAdd=document.getElementById("webAdd_text"+id).getAttribute("value");
    // if(!isRelease){
    //   console.log("data from cancel_row(id): ",unit,unitType,add,webAdd,phone); 
    // }

    document.getElementById("unit"+id).innerHTML=unit;
    document.getElementById("unitType"+id).innerHTML=unitType;
    document.getElementById("add"+id).innerHTML=add;
    document.getElementById("phone"+id).innerHTML=phone;
    document.getElementById("webAdd"+id).innerHTML=webAdd;

    document.getElementById("edit_button"+id).style.display="inline-block";
    document.getElementById("delete_button"+id).style.display="inline-block";
    document.getElementById("save_button"+id).style.display="none";
    document.getElementById("cancel_button"+id).style.display="none";
  }

  function delete_row(id){
    $.ajax({
      type:'POST',
      url:'division/delete',
      dataType: 'json',
      data:{
        division_id: id
      },
      success:(response) => {
        document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
        if(response.message=="success")
          {
            document.getElementById("notification").style.color ="green";
            document.getElementById("notification").innerHTML = "Xóa thành công";
            let row_toDelete = document.getElementById("row"+id);
            // if(!isRelease){
            //  console.log(row_toDelete);
            //   console.log(document.getElementById("table-u").rows[id+2].cells[0].innerHTML);
            // }           
            
            // update order index column
            let table = document.getElementById("table-u");  
            let indexRowNext = parseInt(document.getElementById("indexRow"+id).innerHTML);
            // if(!isRelease){
            //   console.log("row next, order number to be:",indexRowNext);
            //   //console.log("info row delete",table.rows[indexRowNext+1]);
            // }
            let lenthRow = table.rows.length;
            let curRowToChangeOrd = indexRowNext+2;
            for (let i = curRowToChangeOrd; i <= lenthRow-1; i++) {
              table.rows[i].cells[0].innerHTML = indexRowNext;
              // if(!isRelease){
              //   console.log(table.rows[i].cells[0].innerHTML);
              // }
              ++indexRowNext;  
            }
            row_toDelete.parentNode.removeChild(row_toDelete);
          } else {
            document.getElementById("notification").style.color ="red";
            document.getElementById("notification").innerHTML = response.message;
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