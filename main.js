const setupEvents = require('./installers/setupEvents')
if (setupEvents.handleSquirrelEvent()) {
    return;
}

const {app, BrowserWindow} = require('electron');
const path = require('path');

// Create the app's main window
function createWindow() {
    let window = new BrowserWindow({
        width: 800,
        height: 600,
        title: 'Live Telemetry - Einstein Motorsport',
        autoHideMenuBar: true,
        icon: path.join(__dirname, 'img/logo-black-128x128.png'),
        webPreferences: {
            nodeIntegration: true
        }
    });

    // Load index.html file as main entry
    window.loadFile('index.html');
}

app.on('ready', createWindow);

// Quit app if all windows closed
app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        // Except it is macOS
        app.quit()
    }
});
