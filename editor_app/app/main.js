const fs = require('fs');

const { app, BrowserWindow, dialog, Menu } = require('electron');

let mainWindow = null;

const template = [
    {
        label: 'File',
        submenu: [
            {
                label: 'Open File',
                click() {
                    console.log('Open File');
                }
            }
        ]
    }
];

if (process.platform === 'darwin') {
    const applicationName = "Editor";
    template.unshift({
        label: applicationName,
        submenu: [
            {
                label: `About ${applicationName}`,
            },
            {
                label: `Quit ${applicationName}`,
                click() {
                    app.quit;
                }
            }
        ]
    })
}

const applicationM = Menu.buildFromTemplate(template);

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        show: false
    });

    Menu.setApplicationMenu(applicationM)

    mainWindow.loadFile(`${__dirname}/index.html`);

    mainWindow.once('ready-to-show', () => {
        mainWindow.show();
    });
});

exports.getFileFromUser = () => {
    const files = dialog.showOpenDialog(mainWindow, {
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

exports.saveMarkdown = (file, content) => {
    if (!file) {
        file = dialog.showSaveDialog(mainWindow, {
            title: 'Save Markdown',
            defaultPath: app.getPath('desktop'),
            filters: [
                {
                    name: 'Markdown Files', 
                    extentions: ['md', 'mdown', 'markdown']
                }
            ]
        })
    }

    if (!file) return;

    fs.writeFileSync(file, content);
    // this makes sure if the file is just created to have file system file and app file in sync
    openFile(file);
}

exports.saveHtml = content => {
    const file = dialog.showSaveDialog(mainWindow, {
        title: 'Save HTML',
        defaultPath: app.getPath('desktop'),
        filters: [
            {
                name: 'HTML Files',
                extentions: ['html', 'htm']
            }
        ]
    })

    if (!file) return;

    fs.writeFileSync(file, content);
}

const openFile = (exports.openFile = (file) => {
    // you get a Buffer that needs to be converted to a string
    const content = fs.readFileSync(file).toString();

    app.addRecentDocument(file);

    mainWindow.webContents.send('file-opened', file, content);
});
