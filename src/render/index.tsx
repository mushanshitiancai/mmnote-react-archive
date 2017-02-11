/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import DevTools from './container/dev-tools';

import { App } from './component/app/app';
import { logger } from '../common/logger';
import { store } from './store/store';

import 'normalize.css/normalize.css';
// import 'font-awesome/css/font-awesome.css'

(window as any)['store'] = store;
// store.dispatch({type:"ACT_EDITOR_UPDATE",payload:"ad"})

ReactDOM.render(
    <Provider store={store}>
        <div>
            <App store={store} path="/Users/mazhibin/project/xxx/demonote"></App>
            {/*<DevTools />*/}
        </div>
    </Provider>,
    document.getElementById("root")
);