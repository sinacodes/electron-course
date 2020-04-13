const fs = require('fs');

const { app, BrowserWindow, dialog } = require('electron');

let mainWindow = null;

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        show: false
    });

    mainWindow.loadFile(`${__dirname}/index.html`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
});

const getFileFromUser = () => {
    const files = dialog.showOpenDialog({
        properties: ['openFile']
    });

    if (!files) return;

    const file = files[0];

    // you get a Buffer that needs to be converted to a string
    const content = fs.readFileSync(file).toString;

    console.log(files)
}