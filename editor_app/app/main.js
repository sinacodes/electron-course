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

exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog({
        properties: ['openFile'],
        filters: [
            {
                name: 'Markdown Files', 
                extentions: ['md', 'mdown', 'markdown']
            },
            {
                name: 'Text Files',
                extentions: ['txt', 'text']
            }
        ]
    });

    if (!files) return;

    const file = files[0];

    openFile(file);
};

const openFile = (file) => {
    // you get a Buffer that needs to be converted to a string
    const content = fs.readFileSync(file).toString();
    console.log(content)
    mainWindow.webContents.send('file-opened', file, content);
}