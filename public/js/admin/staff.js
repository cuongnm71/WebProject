/* insert, delete, edit table */
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
            url: 'staff',
            type: 'GET',
            dataType: 'json',
            success: (data) =>{
                let x = ' <thead> <tr class="title">\
                    <th>Thứ tự</th>\
                    <th>Mã cán bộ</th>\
                    <th>Họ và tên</th>\
                    <th>Tài khoản</th>\
                    <th>VNU email</th>\
                    <th>Loại cán bộ</th>\
                    <th>Học vị</th>\
                    <th>Đơn vị công tác</th>\
                    <th>Thao tác</th>\
                    </tr> </thead>';
                if(!isRelease){
                    console.log('ajax success!',data);
                }
                let nextIndexRow=document.getElementById("table-u").lastChild.childNodes.length;
                x+= '<tbody><tr id="new_row">' + '<td id = "index_insertRow">'+ nextIndexRow + '</td>';
                x+= '<td><input type="text" id="new_offCode" required=""></td>\
                <td><input type="text" id="new_fullName" required=""></td>\
                <td><input type="text" id="new_account" required=""></td>\
                <td><input type="text" id="new_vnuMail" required=""></td>\
                <td><input type="text" id="new_offType" required=""></td>\
                <td><input type="text" id="new_degree" required=""></td>\
                <td><input type="text" id="new_workingUnit" required=""></td>\
                <td><input type="button" value="Thêm mới" onclick="insert_row();"></td>\
                </tr>';
                for(i in data){
                    let id = i;
                    // self-defined id is not related to staff code
                    // If using the staff code as the above id,
                    // there will be many problems to be solved
                    // because the current id above is used to create
                    // unique id for the element to help query.
                    // (ex: Changing staff code -> must update all elements id,
                    // duplicate handling when querying elements,
                    // error token passes parameters to the function)
                    nextIndexRow++;
                    x += '<tr id="row'+id+'">'
                        +'<td id="indexRow'+id+'">'+ nextIndexRow + '</td>';
                    x +='<td id="offCode'+id+'">'+ returnBlank(data[i]["staff_id"]) + '</td>'
                        +'<td id="fullName'+id+'">'+ returnBlank(data[i]["full_name"]) + '</td>'
                        +'<td id="account'+id+'">'+ returnBlank(data[i]["username"]) + '</td>'
                        +'<td id="vnuMail'+id+'">'+ returnBlank(data[i]["vnu_email"]) + '</td>'
                        +'<td id="offType'+id+'">'+ returnBlank(data[i]["staff_type"]) + '</td>'
                        +'<td id="degree'+id+'">'+ returnBlank(data[i]["degree_level"]) + '</td>'
                        +'<td id="workingUnit'+id+'">'+ data[i]["address"] + '</td>'
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
        let offCode=document.getElementById("new_offCode").value.trim();
        let fullName=document.getElementById("new_fullName").value.trim();
        let account=document.getElementById("new_account").value.trim();
        let vnuMail=document.getElementById("new_vnuMail").value.trim();
        let offType=document.getElementById("new_offType").value.trim();
        let degree=document.getElementById("new_degree").value.trim();
        let workingUnit=document.getElementById("new_workingUnit").value.trim();

        $.ajax({
            type:'POST',
            url:'staff/insert',
            dataType: 'json',
            data:{
                staff_id: offCode,
                full_name:fullName,
                username: account,
                vnu_email:vnuMail,
                staff_type:offType,
                degree_level: degree,
                address: workingUnit
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
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
                        +'<td id="offCode'+id+'">'+offCode+'</td>'
                        +'<td id="fullName'+id+'">'+fullName+'</td>'
                        +'<td id="account'+id+'">'+account+'</td>'
                        +'<td id="vnuMail'+id+'">'+vnuMail+'</td>'
                        +'<td id="offType'+id+'">'+offType+'</td>'
                        +'<td id="degree'+id+'">'+degree+'</td>'
                        +'<td id="workingUnit'+id+'">'+workingUnit+'</td>'
                        +'<td>\
                            <input type="button" value="Sửa" id="edit_button'+id+'" onclick="edit_row('+id +');">'
                            +'<input type="button" value="Lưu" style="display:none" id="save_button'+id+'" onclick="save_row('+id +');">'
                            +'<input type="button" value="Hủy" style="display:none" id="cancel_button'+id+'" onclick="cancel_row('+id +');">'
                            +'<input type="button" value="Xóa" id="delete_button'+id+'" onclick="delete_row('+id +');">'
                            +'</td></tr>';
                    //Reset to ""
                    document.getElementById("new_offCode").value="";
                    document.getElementById("new_fullName").value="";
                    document.getElementById("new_account").value="";
                    document.getElementById("new_vnuMail").value="";
                    document.getElementById("new_offType").value="";
                    document.getElementById("new_degree").value="";
                    document.getElementById("new_workingUnit").value="";
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
        //let offCode=document.getElementById("offCode"+id).innerHTML;
        //let fullName=document.getElementById("fullName"+id).innerHTML;
        //let account=document.getElementById("account"+id).innerHTML;
        //let vnuMail=document.getElementById("vnuMail"+id).innerHTML;
        let offType=document.getElementById("offType"+id).innerHTML;
        let degree=document.getElementById("degree"+id).innerHTML;
        let workingUnit=document.getElementById("workingUnit"+id).innerHTML;
        //document.getElementById("offCode"+id).innerHTML="<input type='text' id='offCode_text"+id+"' value='"+offCode+"'>";
        //document.getElementById("fullName"+id).innerHTML="<input type='text' id='fullName_text"+id+"' value='"+fullName+"'>";
        //document.getElementById("account"+id).innerHTML="<input type='text' id='account_text"+id+"' value='"+account+"'>";
        //document.getElementById("vnuMail"+id).innerHTML="<input type='text' id='vnuMail_text"+id+"' value='"+vnuMail+"'>";
        document.getElementById("offType"+id).innerHTML="<input type='text' id='offType_text"+id+"' value='"+offType+"'>";
        document.getElementById("degree"+id).innerHTML="<input type='text' id='degree_text"+id+"' value='"+degree+"'>";
        document.getElementById("workingUnit"+id).innerHTML="<input type='text' id='workingUnit_text"+id+"' value='"+workingUnit+"'>";

        document.getElementById("edit_button"+id).style.display="none";
        document.getElementById("delete_button"+id).style.display="none";
        document.getElementById("save_button"+id).style.display="inline-block";
        document.getElementById("cancel_button"+id).style.display="inline-block";
        // if(!isRelease){
        //   console.log("data from edit_row(id): ",unit,fullName,add,webAdd,phone);
        // }
    }
    function save_row(id){
        //let old_offCode=document.getElementById("offCode_text"+id).getAttribute("value");
        let offCode=document.getElementById("offCode"+id).innerHTML;
        let fullName=document.getElementById("fullName"+id).innerHTML;
        let account=document.getElementById("account"+id).innerHTML;
        let vnuMail=document.getElementById("vnuMail"+id).innerHTML;

        let degree_old=document.getElementById("degree_text"+id).getAttribute("value");
        let workingUnit_old=document.getElementById("workingUnit_text"+id).getAttribute("value");
        let offType_old=document.getElementById("offType_text"+id).getAttribute("value");

        let degree=document.getElementById("degree_text"+id).value.trim();
        let workingUnit=document.getElementById("workingUnit_text"+id).value.trim();
        let offType=document.getElementById("offType_text"+id).value.trim();
        // if(!isRelease){
        //   console.log("data from save_row(id): ",unit,unitType,add,webAdd,phone);
        //   /*console.log(document.getElementById("add"+id));*/
        // }

        // cach moi
        document.getElementById("offType"+id).innerHTML=offType;
        document.getElementById("degree"+id).innerHTML=degree;
        document.getElementById("workingUnit"+id).innerHTML=workingUnit;
        $.ajax({
            type:'POST',
            url:'staff/edit',
            dataType: 'json',
            data:{
                staff_id: offCode,
                full_name:fullName,
                username: account,
                vnu_email:vnuMail,
                staff_type:offType,
                degree_level: degree,
                address: workingUnit
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success")
                    {
                        document.getElementById("notification").style.color ="green";
                        document.getElementById("notification").innerHTML = "Sửa thành công";
                        //document.getElementById("offCode"+id).innerHTML=offCode;
                        //document.getElementById("fullName"+id).innerHTML=fullName;
                        //document.getElementById("account"+id).innerHTML=account;
                        //document.getElementById("vnuMail"+id).innerHTML=vnuMail;

                        /*cach cu
                        // document.getElementById("offType"+id).innerHTML=offType;
                        // document.getElementById("degree"+id).innerHTML=degree;
                        // document.getElementById("workingUnit"+id).innerHTML=workingUnit;
                        */
                } else {
                    document.getElementById("notification").style.color ="red";
                    document.getElementById("notification").innerHTML = response.message;
                    //reset to origin
                    /* cach cu
                    // let offType=document.getElementById("offType_text"+id).getAttribute("value");
                    // let degree=document.getElementById("degree_text"+id).getAttribute("value");
                    // let workingUnit=document.getElementById("workingUnit_text"+id).getAttribute("value");
                    */
                    document.getElementById("offType"+id).innerHTML = offType_old;
                    document.getElementById("degree"+id).innerHTML = degree_old;
                    document.getElementById("workingUnit"+id).innerHTML = workingUnit_old;
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
        //let offCode=document.getElementById("offCode_text"+id).getAttribute("value");
        // let fullName=document.getElementById("fullName_text"+id).getAttribute("value");
        // let account=document.getElementById("account_text"+id).getAttribute("value");
        // let vnuMail=document.getElementById("vnuMail_text"+id).getAttribute("value");
        let offType=document.getElementById("offType_text"+id).getAttribute("value");
        let degree=document.getElementById("degree_text"+id).getAttribute("value");
        let workingUnit=document.getElementById("workingUnit_text"+id).getAttribute("value");
        // if(!isRelease){
        //   console.log("data from cancel_row(id): ",unit,fullName,add,webAdd,phone);
        // }
        //document.getElementById("offCode"+id).innerHTML = offCode;
        // document.getElementById("fullName"+id).innerHTML = fullName;
        // document.getElementById("account"+id).innerHTML = account;
        // document.getElementById("vnuMail"+id).innerHTML = vnuMail;
        document.getElementById("offType"+id).innerHTML = offType;
        document.getElementById("degree"+id).innerHTML = degree;
        document.getElementById("workingUnit"+id).innerHTML = workingUnit;
        document.getElementById("edit_button"+id).style.display="inline-block";
        document.getElementById("delete_button"+id).style.display="inline-block";
        document.getElementById("save_button"+id).style.display="none";
        document.getElementById("cancel_button"+id).style.display="none";
    }
    function delete_row(id){
        let offCode=document.getElementById("offCode"+id).innerHTML;
        let username=document.getElementById("account"+id).innerHTML;
        $.ajax({
            type:'POST',
            url:'staff/delete',
            dataType: 'json',
            data:{
                staff_id: offCode,
                username: username
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success"){
                    document.getElementById("notification").style.color ="green";
                    document.getElementById("notification").innerHTML = "Xóa thành công";
                    //loadTable();
                    let row_toDelete = document.getElementById("row"+id);
                    // if(!isRelease){
                    //   console.log("row to delete", row_toDelete);
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

    function insertAccountByExcel(staff_idI,usernameI,passwordI,full_nameI,vnu_emailI,division_nameI){
        //console.log("In insertAccountByExcel function",usernameI,passwordI,full_nameI,vnu_emailI);
        $.ajax({
            type:'POST',
            url:'account/excel',
            dataType: 'json',
            data:{
                staff_id: staff_idI,
                username: usernameI,
                password: passwordI,
                full_name: full_nameI,
                vnu_email: vnu_emailI,
                division_name: division_nameI
            },
            success:(response) => {
                document.getElementById("div-ntf").innerHTML = "<strong id='notification'></strong>";
                if(response.message=="success"){
                    loadTable();
                    // document.getElementById("notification").style.color ="green";
                    // document.getElementById("notification").innerHTML = "Thêm thành công";
                    alert("Thêm thành công tài khoản của: " + full_nameI);
                } else {
                    // document.getElementById("notification").style.color ="red";
                    // document.getElementById("notification").innerHTML = response.message;
                    alert("Không thêm được tài khoản của: " + full_nameI + " ~ " + response.message);
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

// Handle excel file - convert to json
    var ExcelToJSON = function() {
        this.parseExcel = function(file) {
            let reader = new FileReader();

            reader.onload = function(e) {
                let data = e.target.result;
                let workbook = XLSX.read(data, {
                    type: 'binary'
                });
                workbook.SheetNames.forEach(function(sheetName) {
                    let XL_row_object = XLSX.utils.sheet_to_row_object_array(workbook.Sheets[sheetName]);
                    let json_object = JSON.stringify(XL_row_object);
                    let data = JSON.parse(json_object);
                    // console.log(data);
                    // console.log(data[0]["Họ và tên"]);
                    // console.log("json_object",typeof json_object );
                    for(i in data){
                        // console.log(data[i]["Mã cán bộ"],data[i]["Tên đăng nhập"],data[i]["Mật khẩu"],data[i]["Họ và tên"],data[i]["VNU email"]);
                        insertAccountByExcel(data[i]["Mã cán bộ"],data[i]["Tên đăng nhập"],data[i]["Mật khẩu"],data[i]["Họ và tên"],data[i]["VNU email"],data[i]["Bộ môn"]);
                    }
                })
            };

            reader.onerror = function(ex) {
                console.log(ex);
            };
            reader.readAsBinaryString(file);
        };
    };
    function handleFileSelect(evt) {
        let files = evt.target.files; // FileList object
        let xl2json = new ExcelToJSON();
        xl2json.parseExcel(files[0]);
    }
