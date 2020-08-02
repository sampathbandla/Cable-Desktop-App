const { session,app, BrowserWindow,ipcMain,ipcRenderer,screen,globalShortcut } = require('electron')

var screens = screen.getPrimaryDisplay()
console.log(screens);

