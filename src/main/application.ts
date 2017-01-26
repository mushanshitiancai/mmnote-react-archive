import constant from '../common/constant';
import { ApplicationMenu } from './menu';
import { Window } from './window';
import { app, ipcMain, BrowserWindow } from 'electron';

export class Application {
    openWindows: Window[] = [];
    applicationMenu: ApplicationMenu;

    constructor() {
        this.applicationMenu = new ApplicationMenu(this)
    }

    newWindow() {
        this.openWindows.push(new Window());
    }

    execCommand(command: string, args: any) {
        console.log(`Application execCommand - ${command} params: ${args}`);
        let win = BrowserWindow.getFocusedWindow();
        if (win) {
            return win.webContents.send('command', command, args);
        }
    }

    onReady() {
        this.applicationMenu.attach();
        this.newWindow();

        // console.log(constant.path);
    }

    onActivate() {
        if (this.openWindows.length == 0) {
            this.newWindow();
        }
    }

    onQuit() {

    }
}