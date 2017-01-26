import { App } from '../component/app/app';
import { logger } from '../../common/logger';
import { ipcRenderer, remote } from 'electron';
const dialog = remote.dialog;
const BrowserWindow = remote.BrowserWindow;

export class CommandExecutor {
    [key: string]: any;
    private app: App;

    constructor(app: App) {
        this.app = app;

        ipcRenderer.on('command', (event, command, args) => {
            this.execCommand(command, args);
        });
    }

    execCommand(command: string, args: any) {
        logger.info(`CommandExecutor - execCommand cmd= ${command} args=${args}`);

        // exec
        if (this[command] instanceof Function) {
            this[command](args);
        }
    }

    open() {
        // this.app.open(["/Users/mazhibin/project/blog/blog/source/_posts/java"]);
        

        dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
            properties: ['openFile', 'openDirectory']
        }, (filenames) => {
            logger.info(`CommandExecutor - open filenames=${filenames}`);
            this.app.open(filenames);
        });
    }

    save(){
        
    }
}