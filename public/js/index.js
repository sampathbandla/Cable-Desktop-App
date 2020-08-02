const {BrowserWindow} = require('electron').remote
const { ipcRenderer } = require('electron')

function init() {
    document.getElementById("close-btn").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.close();
    });

    document.getElementById("min-btn").addEventListener("click", (e) => {
        var window = BrowserWindow.getFocusedWindow();
        window.minimize();
    });

    document.getElementById("login").addEventListener("click",(e) => {
        var username = document.getElementById("username").value;
        var password =  document.getElementById("password").value;
        ipcRenderer.send('loginUser', {username:username,password:password})
    })


    ipcRenderer.on("userNotLoogedIn",(e,user) => {
        document.getElementById("warning").style.display = "block"
        document.getElementById("warning").innerHTML = "* Please check details!"
    })
};

document.onreadystatechange =  () => {
    if (document.readyState == "complete") {
        init();
    }
};