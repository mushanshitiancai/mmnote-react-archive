/// <reference path="./index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import DevTools from './container/dev-tools';

import { AppContainer } from './container/app-container';
import { logger } from '../common/logger';
import { store } from './redux/store/store';

import 'normalize.css/normalize.css';
// import 'font-awesome/css/font-awesome.css'

(window as any)['store'] = store;
// store.dispatch({type:"ACT_EDITOR_UPDATE",payload:"ad"})

ReactDOM.render(
    <Provider store={store}>
        <div>
            <AppContainer/>
            {/*<DevTools />*/}
        </div>
    </Provider>,
    document.getElementById("root")
);