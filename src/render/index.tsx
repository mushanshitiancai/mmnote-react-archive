import { logger } from '../common/logger';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { App } from './component/app/app';

import 'normalize.css/normalize.css';
// import 'font-awesome/css/font-awesome.css'

logger.info('start');
console.log("star");

ReactDOM.render(
    <App path="/Users/mazhibin/project/xxx/demonote"></App>,
    document.getElementById("root")
);