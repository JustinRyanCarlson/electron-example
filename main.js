const { app, BrowserWindow } = require('electron')
const ipc = require('electron').ipcMain
const dialog = require('electron').dialog;
var fs = require('fs'); 
var parse = require('csv-parse');

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let win

function createWindow() {
    // Create the browser window.
    win = new BrowserWindow({ width: 1440, height: 900 })

    // and load the index.html of the app.
    win.loadFile('index.html')

    // Open the DevTools.
    win.webContents.openDevTools()

    // Emitted when the window is closed.
    win.on('closed', () => {
        // Dereference the window object, usually you would store windows
        // in an array if your app supports multi windows, this is the time
        // when you should delete the corresponding element.
        win = null
    })
}

// function load_csv() {
//     // Let the user specifify file to load 
//     file = dialog.showOpenDialog(win)
//     console.log(file)
//     if (file != undefined) {
//         var csvData=[];
//         fs.createReadStream(file[0])
//             .pipe(parse({delimiter: ','}))
//             .on('data', function(csvrow) {
//                 console.log(csvrow);
//                 //do something with csvrow
//                 csvData.push(csvrow);        
//             })
//             .on('end',function() {
//                 //do something wiht csvData
//                 console.log(csvData);
//             });
//         return csvData
//     }
//     else {
//         load_csv()
//     }
// }

ipc.on('load_csv', function (event) {
    console.log('got to load_csv')

    // Let the user specifify file to load 
    file = dialog.showOpenDialog(win)
    console.log(file)
    var csvData=[];
    fs.createReadStream(file[0])
        .pipe(parse({delimiter: ','}))
        .on('data', function(csvrow) {
            // console.log(csvrow);
            //do something with csvrow
            csvData.push(csvrow);        
        })
        .on('end',function() {
            //do something wiht csvData
            // console.log(csvData);
            event.sender.send('csv_data', csvData)
        });
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
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
    if (win === null) {
        createWindow()
    }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.