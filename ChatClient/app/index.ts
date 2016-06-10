import * as electron from 'electron';  // Module to control application life.
import * as fs from 'fs';
import * as rimraf from 'rimraf';

import {SocketManager} from "./scripts/connect";

var socket = new SocketManager();
//190.128.55.241;
socket.Connect("192.168.0.34", 9999);
global["socket"] = socket;

// Quit when all windows are closed.
electron.app.on('window-all-closed', () => {
    if (process.platform != "darwin") {
        electron.app.quit();
    }
});

electron.app.on("ready", () => {
    // Create the browser window.
    var mainWindow = new electron.BrowserWindow({
        "width": 920,
        "height": 550,
        "minWidth": 920,
        "minHeight": 550
    });

    var registerWindow = new electron.BrowserWindow({
        "width": 920,
        "height": 550,
        "minWidth": 920,
        "minHeight": 550,
        "show": false
    });

    mainWindow.loadURL('file://' + __dirname + '/views/login.html');
    registerWindow.loadURL('file://' + __dirname + '/views/register.html');
    mainWindow.on('closed', () => {
        rimraf(__dirname + '/../tmp', (err) => {
            if (err) console.error(err);
        });
    });

    electron.ipcMain.on('loadWindow', (event, arg) => {
        switch (arg) {
            case 1:
                mainWindow.hide();
                registerWindow.show();
                break;
            case 2:
                registerWindow.hide();
                mainWindow.show();
                break;
            case 3:
                mainWindow.loadURL('file://' + __dirname + '/views/chat.html');
                break;
            case 4:
                mainWindow.loadURL('file://' + __dirname + '/views/room.html');
                break;
            default:
                registerWindow.hide();
                mainWindow.show();
        }
        socket.removeAllListeners("receive");
    });

    electron.ipcMain.on('updateFile', (event, arg) => {
        switch (arg.type) {
            case "rooms":
                //console.log(JSON.stringify(arg, null, 4));
                fs.writeFile(__dirname + '/../tmp/rooms.json', JSON.stringify({"rooms": arg.data}, null, 4));
                break;
            case "room":
                fs.writeFile(__dirname + '/../tmp/room.json', JSON.stringify({"room": arg.data}, null, 4));
                break;
            case "users":
                fs.writeFile(__dirname + '/../tmp/users.json', JSON.stringify({"users": arg.data}, null, 4));
                break;
            case "user":
                fs.writeFile(__dirname + '/../tmp/data.json', JSON.stringify({"user": arg.data}, null, 4));
                break;
        }
    });
});
