const {ipcRenderer} = require("electron")
const {dialog,session,BrowserWindow} = require('electron').remote
const prompt = require('electron-prompt');

$(document).ready( function () {
    init();
} );
function init()
{
    ipcRenderer.send("get-network-name",{})
    ipcRenderer.on("network-name",(e,name) => {
        document.getElementById("page-title").innerHTML = "Dashboard - " + name ;
    })
    ipcRenderer.send("get-username",{})
    ipcRenderer.on("username",(e,name) => {
        document.getElementById("username").innerHTML = name ;
    })
    document.getElementById("close-btn").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    });

    document.getElementById("min-btn").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize();
    });

    document.getElementById("logout-btn").addEventListener("click", (e) => {
        ipcRenderer.send("logout",{})
    });

    document.getElementById("customers").addEventListener("click",(e) => {
        ipcRenderer.send("get-customers-window");
        // openDev()
    });

    //SECTION ipcrender.on
    ipcRenderer.on("sent-customers-window",(e,data) => {
        changeContent(data)
        makeTable("table1")
    })

    document.getElementById("villages").addEventListener("click",(e) => {
        ipcRenderer.send("get-villages-window");
        // openDev()
    });


    document.getElementById("packages").addEventListener("click",(e) => {
        ipcRenderer.send("get-packages-window");
        // openDev()
    });

    //SECTION ipcrender.on
    ipcRenderer.on("sent-villages-window",(e,data) => {
        changeContent(data.html)
        data.villages.forEach((village) => {
            $("#table1 tbody").append(`<tr>
            <td>${village.name}</td>
            <td>
            <button onclick="openVillage('${village._id}')" class="view">View</button>
            <button onclick="editVillage('${village._id}','${village.name}')" class="edit">Edit</button>
            <button onclick="deleteVillage('${village._id}')" class="delete">delete</button>
            </td>
            </tr>`);
        })
        makeTable("table1")
    })

    ipcRenderer.on("sent-packages-window",(e,data) => {
        changeContent(data.html)
        data.packages.forEach((package) => {
            $("#table1 tbody").append(`<tr>
            <td>${package.name}</td>
            <td>${package.price}</td>
            <td>${package.type}</td>
            <td>
            <button onclick="openVillage('${package._id}')" class="view">View</button>
            <button onclick="editVillage('${package._id}','${package.name}')" class="edit">Edit</button>
            <button onclick="deleteVillage('${package._id}')" class="delete">delete</button>
            </td>
            </tr>`);
        })
        makeTable("table1")
    })


    ipcRenderer.on("sent-open-village",(e,data) => {
        changeContent(data.html)
        $("#villageName").attr("dataid",data.village._id)
        if(data.streets)
        {
            data.streets.forEach((street) => {
                $("#table2 tbody").append(`<tr>
                <td>${street.name}</td>
                <td>
                <button onclick="editStreet('${street._id}','${street.name}')" class="Edit">Edit</button>
                <button onclick="deleteStreet('${street._id}')" class="delete">delete</button>
                </td>
                </tr>`);
            })
            makeTable("table2")
            $("#villageName").text(data.village.name)
        }
        else
        {
            $("#villageName").text(data.village.name)
            $("#table2").remove()
            $("#customerslist").append("<p>There is no streets to show</p>")
        }
    })

    ipcRenderer.on("sent-add-new-village",(e,data) => {
        changeContent(data)
    });

    ipcRenderer.on("sent-street-add-new",(e,data) => {
        changeContent(data.html)
        $("#streetname").attr("dataid",data.id)
    });

    ipcRenderer.on("add-new-village-success",(e,data) => {
        ipcRenderer.send("get-villages-window")
    });

    ipcRenderer.on("add-new-street-success",(e,data) => {
        openVillage($("#streetname").attr("dataid"))
    });

    ipcRenderer.on("add-new-village-error",(e,data) => {
        dialog.showErrorBox("SCBS","ERROR:DB_ERROR please contact 6303234711")
    });

    ipcRenderer.on("DB_ERROR",(e) => {
        dialog.showErrorBox("SCBS","DB:ERROR Please contact 6303234711")
    })

    ipcRenderer.on("village-edit-success",(e) => {
        ipcRenderer.send("get-villages-window");
    })
    ipcRenderer.on("village-delete-success",(e) => {
        ipcRenderer.send("get-villages-window");
    })

    ipcRenderer.on("street-delete-success",(e) => {
        openVillage($("#villageName").attr("dataid"))
    })

    ipcRenderer.on("street-edit-success",(e) => {
        openVillage($("#villageName").attr("dataid"))
    })
}

function setDailogBody(data)
{
    document.getElementById("dailogBody").innerHTML = data;
}

function changeContent(html)
{
    document.getElementById("content").innerHTML = html;
}
function openDev()
{
    BrowserWindow.getFocusedWindow().webContents.openDevTools()
}

function addNewBtn()
{
    ipcRenderer.send("get-village-add-new")
}

function addnewvillage()
{
    villagename = document.getElementById("villagename").value
    if(villagename == "")
    {
        dialog.showErrorBox("SCBS","Please enter village Name");
    }
    else
    {
        if(villagename.length > 15 || villagename.length < 3)
        {
            dialog.showErrorBox("SCBS","Village name should be greater than 3 and less than 15 length!")
        }
        else
        {
            ipcRenderer.send("add-new-village",{villageName:villagename})
        }
    }
}

function addnewbybtn(event)
{
    if (event.keyCode === 13) {
        event.preventDefault();
        addnewvillage()
    }
}

function openVillage(id)
{
    ipcRenderer.send("open-village",id)
}

function editVillage(id,name)
{
    prompt({title:"SCBS",label:"Enter New Village Name:",value:name}).then((value) => {
        if(value != name)
        {
            if(value == "")
            {
                dialog.showErrorBox("SCBS","Null Name is not accepted!")
            }
            else
            {
                if(value.length < 3 || value.length > 15)
                {
                    dialog.showErrorBox("SCBS","Village name should be greater than 3 and less than 15 length!")
                }
                else
                {
                    ipcRenderer.send("edit-village-name",{id:id,newname:value})
                }
            }
        }
    })
}

function deleteVillage(id)
{
    let options  = {
        buttons: ["Yes","No"],
        message: "Do you really want to delete?"
    }       
    var response = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(),options)
    if(response == 0)
    {
        ipcRenderer.send("delete-village",id)
    }
}

function deleteStreet(id)
{
    let options  = {
        buttons: ["Yes","No"],
        message: "Do you really want to delete?"
    }       
    var response = dialog.showMessageBoxSync(BrowserWindow.getFocusedWindow(),options)
    if(response == 0)
    {
        ipcRenderer.send("delete-street",id)
    }
}


function editStreet(id,name)
{
    prompt({title:"SCBS",label:"Enter New Street Name:",value:name}).then((value) => {
        if(value != name)
        {
            if(value == "")
            {
                dialog.showErrorBox("SCBS","Null Name is not accepted!")
            }
            else
            {
                if(value.length < 3 || value.length > 15)
                {
                    dialog.showErrorBox("SCBS","Street name should be greater than 3 and less than 15 length!")
                }
                else
                {
                    ipcRenderer.send("edit-street-name",{id:id,newname:value})
                }
            }
        }
    })
}

function addNewStreetBtn()
{
    ipcRenderer.send("street-add-new",$("#villageName").attr("dataid"))
}

function addnewstreet()
{
    streetname = document.getElementById("streetname").value
    if(streetname == "")
    {
        dialog.showErrorBox("SCBS","Please enter street Name");
    }
    else
    {
        if(streetname.length > 15 || streetname.length < 3)
        {
            dialog.showErrorBox("SCBS","Village name should be greater than 3 and less than 15 length!")
        }
        else
        {
            villageid = $("#streetname").attr("dataid")
            ipcRenderer.send("add-new-street",{name:streetname,villageid:villageid})
        }
    }
}


function addnewstreetbykeyup(event)
{
    if (event.keyCode === 13) {
        event.preventDefault();
        addnewstreet()
    }
}

function makeTable(tablename)
{
    $(`#${tablename} thead tr`).clone(true).appendTo( '#example thead' );
    $(`#${tablename} thead tr:eq(1) th`).each( function (i) {
        var title = $(this).text();
        $(this).html( '<input type="text" placeholder="Search '+title+'" />' );
 
        $( 'input', this ).on( 'keyup change', function () {
            if ( table.column(i).search() !== this.value ) {
                table
                    .column(i)
                    .search( this.value )
                    .draw();
            }
        } );
    } );
 
    var table = $(`#${tablename}`).DataTable( {
        orderCellsTop: true,
        fixedHeader: true
    } );
}