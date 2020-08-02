const {BrowserWindow} = require('electron').remote
const { ipcRenderer,ipcMain } = require('electron')

function init() {
    document.getElementById("close-btn").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    });

    document.getElementById("min-btn").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize();
    });

    document.getElementById("register").addEventListener("click",(e) => {
        var username = document.getElementById("username").value;
        var password =  document.getElementById("password").value;
        ipcRenderer.send('registerUser', {username:username,password:password})
    })

    ipcRenderer.on("userRegisterd",() => {
        var username = document.getElementById("username").value;
        alert(`Welcome ${username} you are now admin of this software :)`)    
             
    })

    ipcRenderer.on("userNotRegistered",(e,err) => {
        document.getElementById("warning").style.display = "block";
        document.getElementById("warning").innerHTML = "* Please check username and password";
    })
};

document.onreadystatechange =  () => {
    if (document.readyState == "complete") {
        init();
    }
};