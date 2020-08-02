const { session,app, BrowserWindow,ipcMain,ipcRenderer,screen,globalShortcut } = require('electron')
const configController = require("./controllers/config.js")
const userController = require("./controllers/user.js")
const settings = require('electron-settings');
const fs =  require("fs")
const villageController = require("./controllers/villages")
const streetController = require("./controllers/streets")
const channelController = require("./controllers/channel")


var indexWindow;
var villageAddNewWindow;

function indexwindow () {
    // Create the browser window.
    globalShortcut.register('f5', function() {
      indexWindow.reload()
    })
    globalShortcut.register('CommandOrControl+R', function() {
      indexWindow.reload()
    })
    indexWindow = new BrowserWindow({
      width: 400,
      height: 600,
      frame:false,
      resizable:false,
      webPreferences: {
        nodeIntegration: true
      }
    })
  
    indexWindow.setMenu(null);
    // and load the index.html of the app.
    indexWindow.loadFile('templates/index.html')
    // win.webContents.openDevTools()
}
function welcomeWindow () {
  // Create the browser window.
  indexWindow = new BrowserWindow({
    width: 600,
    height: 400,
    frame:false,
    resizable:false,
    webPreferences: {
      nodeIntegration: true
    }
  })

  indexWindow.setMenu(null);
  // and load the index.html of the app.
  indexWindow.loadFile('templates/welcome.html')
  // win.webContents.openDevTools()
}

if(configController.check() == 1)
{
  userController.isUsersExist((result) => {
    if(result == 0)
    {
      app.whenReady().then(welcomeWindow)
    }
    else
    {
      app.whenReady().then(indexwindow)
    }
  })
}
else
{
  app.whenReady().then(welcomeWindow)

}

//SECTION register Window
function registerWindow()
{
  indexWindow.setSize(400,600,false)
  indexWindow.loadFile('templates/register.html')
}

//SECTION Dashboard
function openDashboard()
{
  // var screens = screen.getPrimaryDisplay()
  // console.log(screens.size.width);
  var primaryScreen = screen.getPrimaryDisplay()
  indexWindow.setSize((primaryScreen.size.width / 100)*80,(primaryScreen.size.height / 100)*80
  )
  indexWindow.center()
  indexWindow.loadFile("templates/dashboard.html")
  indexWindow.webContents.openDevTools()
}

//SECTION network name set
ipcMain.on("registerWindow",(e,networkName) => {
  configController.setNetworkName(networkName)
  registerWindow()
});


ipcMain.on("registerUser",(e,user) => {
  userController.register(user,(result) => {
    if(result.status == true)
    {
      settings.set("userLoggedIn",user.username)
      openDashboard()
    }
    else
    {
      e.reply("userNotRegistered",result.err)
    }
  })
});

ipcMain.on("loginUser",(e,user) => {
  userController.login(user,(result) => {
    if(result == false)
    {
      e.reply("userNotLoogedIn")
    }
    else
    {
      settings.set("userLoggedIn",user.username)
      openDashboard()
    }
  })
});

  
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.























//SECTION Logout
ipcMain.on("logout",(e,args) => {
settings.delete("userLoggedIn");
indexWindow.setMinimumSize(400,600)
indexWindow.setSize(400,600)
indexWindow.loadFile("templates/index.html")
});


//SECTION Get network name and username

ipcMain.on("get-network-name",(e,args) => {
  e.reply("network-name",configController.getNetworkName())
});

ipcMain.on("get-username",(e,args) => {
  e.reply("username",settings.get("userLoggedIn"))
});


//SECTION get menu window
ipcMain.on("get-customers-window",(e) => {
  fs.readFile(__dirname + '/templates/customers.html',{encoding:"utf8"},function(err, data) {
    e.reply("sent-customers-window",data)
  });
});

ipcMain.on("get-villages-window",(e) => {
  fs.readFile(__dirname + '/templates/villages.html',{encoding:"utf8"},function(err, data) {
    villageController.getVillages((result) => {
      if(result.status == "SUCCESS")
      {
          e.reply("sent-villages-window",{html:data,villages:result.villages})
      }
      else
      {
        e.reply("DB_ERROR")
      }
    })
  });
});

ipcMain.on("get-packages-window",(e) => {
  fs.readFile(__dirname + '/templates/packagesandboxes.html',{encoding:"utf8"},function(err, data) {
    // packageController.getPackages((result) => {
    //   if(result.status == "SUCCESS")
    //   {
    //       e.reply("sent-packages-window",{html:data,packages:result.packages})
    //   }
    //   else
    //   {
    //     e.reply("DB_ERROR")
    //   }
    // })
  });
});

ipcMain.on("get-village-add-new",(e) => {
  fs.readFile(__dirname + '/templates/villageaddnew.html',{encoding:"utf8"},function(err, data) {
    e.reply("sent-add-new-village",data)
  });
});

ipcMain.on("street-add-new",(e,id) => {
  fs.readFile(__dirname + '/templates/streetaddnew.html',{encoding:"utf8"},function(err, data) {
    e.reply("sent-street-add-new",{html:data,id:id})
  });
});


ipcMain.on("close-add-new-village-window",(e) => {
  villageAddNewWindow.close()
  indexWindow.reload()
})

ipcMain.on("add-new-village",(e,data) => {
  villageController.setVillage(data.villageName,(result) => {
    if(result.status ==  "SUCCESS")
    {
      e.reply("add-new-village-success",result.village)
    }
    else
    {
      e.reply("DB_ERROR")
    }
  })
})


ipcMain.on("open-village",(e,id) => {
  villageController.getVillageById(id,(result) => {
    if(result.status == "SUCCESS")
    {
      streetController.getStreetsByVillageId(id,(resultStreets) => {
        if(resultStreets.status == "SUCCESS")
        {
          fs.readFile(__dirname + '/templates/streets.html',{encoding:"utf8"},function(err, data) {
            e.reply("sent-open-village",{html:data,village:result.village,streets:resultStreets.streets})
          });
        }
        else
        {
          e.reply("DB_ERROR")
        }
      })
    }
    else
    {
      e.reply("DB_ERROR")
    }
  })
})

ipcMain.on("add-new-street",(e,data) => {
  streetController.setStreet(data.villageid,data.name,(result) => {
    if(result.status == "SUCCESS")
    {
      e.reply("add-new-street-success")
    }
    else
    {
      e.reply("DB_ERROR")
    }
  })
})

ipcMain.on("edit-village-name",(e,data) => {
  villageController.changeVillageName(data.id,data.newname,(result) => {
    if(result == "SUCCESS")
    {
      e.reply("village-edit-success")
    }
    else
    {
      e.reply("DB_ERROR")
    }
  })
})

ipcMain.on("delete-village",(e,data) => {
  villageController.deleteVillage(data,(result) => {
    if(result == "SUCCESS")
    {
      e.reply("village-delete-success")
    }
    else
    {
      e.reply("DB_ERROR")
    }
  })
})


ipcMain.on("delete-street",(e,data) => {
  streetController.deleteStreet(data,(result) => {
    if(result == "SUCCESS")
    {
      e.reply("street-delete-success")
    }
    else
    {
      e.reply("DB_ERROR")
    }
  })
})

ipcMain.on("edit-street-name",(e,data) => {
  streetController.changeStreetName(data.id,data.newname,(result) => {
    if(result == "SUCCESS")
    {
      e.reply("street-edit-success")
    }
    else
    {
      e.reply("DB_ERROR")
    }
  })
})