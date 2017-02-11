import constant from '../common/constant';
const path = require('path')
const url = require('url')

import { app, BrowserWindow } from 'electron';

export class Window {
    win: Electron.BrowserWindow;

    constructor() {
        this.win = new BrowserWindow({ width: 800, height: 1600 })

        this.win.loadURL(url.format({
            pathname: constant.path.window,
            protocol: 'file:',
            slashes: true
        }));

        // electron-connect
        if (process.env.NODE_ENV === constant.env.nodeEnv.development) {
            var client = require('electron-connect').client;
            client.create(this.win);
        }

        // this.win.webContents.openDevTools();

        this.win.on('closed', () => {
            this.win = null
        });
    }

    execCommand(command: string, parameters: any) {
        console.log(`Window execCommand - ${command} params: %{parameters}`);
        this.win.webContents.send("command", command, parameters);
    }

}