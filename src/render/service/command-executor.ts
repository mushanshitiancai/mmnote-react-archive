import { getCurrentDocument } from '../store/state';
import { openAction, saveAction } from '../action/action';
import { ipcRenderer, remote } from 'electron';
const dialog = remote.dialog;
const BrowserWindow = remote.BrowserWindow;
import { Store } from 'redux';
import { Map } from 'immutable';

import { App } from '../component/app/app';
import { logger } from '../../common/logger';

declare module 'redux' {
    interface Dispatch<S> {
        (action: any): any;
    }
}

export class CommandExecutor {
    [key: string]: any;
    private app: App;
    private store: Store<Map<string, any>>;

    constructor(app: App, store: Store<any>) {
        this.app = app;
        this.store = store;

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
        dialog.showOpenDialog(BrowserWindow.getFocusedWindow(), {
            properties: ['openFile', 'openDirectory']
        }, (filenames) => {
            logger.info(`CommandExecutor - open filenames=${filenames}`);
            if (filenames) {
                this.store.dispatch(openAction(filenames[0]));
            }
        });
    }

    save() {
        let state = this.store.getState();
        let doc = getCurrentDocument(state);

        if (doc) {
            this.store.dispatch(saveAction(doc.get('path'), doc.get('data')));
        }
    }
}