import constant from '../common/constant';
import { Application } from './application';
import { app, BrowserWindow } from 'electron';
const path = require('path')
const url = require('url')

let application = new Application();

app.on('ready', () => {
  console.log("process.env.NODE_ENV = " + process.env.NODE_ENV);
  installChromeExtensions();

  application.onReady()
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    application.onQuit();
    app.quit()
  }
});

app.on('activate', () => application.onActivate());

function installChromeExtensions() {
  if (process.env.NODE_ENV === constant.env.nodeEnv.development) {
    require('electron-debug')({ showDevTools: true });
    const path = require('path'); // eslint-disable-line
    const p = path.join(__dirname, '..', 'app', 'node_modules'); // eslint-disable-line
    require('module').globalPaths.push(p); // eslint-disable-line

    const installer = require('electron-devtools-installer');

    const extensions = [
      'REACT_DEVELOPER_TOOLS',
      'REDUX_DEVTOOLS'
    ]

    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;

    console.log("start to install debug extensions....");
    return Promise
      .all(extensions.map(name => installer.default(installer[name], forceDownload)))
      .then(() => {
        console.log("install debug extensions finish");
      }).catch((err) => {
        console.log("install debug extensions error:" + err);
      });
  }
}