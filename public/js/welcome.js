const {BrowserWindow} = require('electron').remote
const { ipcRenderer } = require('electron')

function init() {
    document.getElementById("start").addEventListener("click",(e) => {
        var networkName = document.getElementById("nname").value;
        if(networkName != ""){
            document.getElementById("warning").style.display = "none"
            ipcRenderer.send('registerWindow',networkName)
            
        }
        else
        {
            
            document.getElementById("warning").style.display = "block"
        }
    })
}

document.onreadystatechange =  () => {
    if (document.readyState == "complete") {
        init();
    }
};