import { app } from 'electron';
import * as p from 'path';

const appPath = app.getAppPath();
const outputPath = p.join(appPath, 'dist');

export default {
    env: {
        nodeEnv: {
            development: 'development',
            production: 'production',
            test: 'test'
        }
    },
    path: {
        app: appPath,
        window: p.join(outputPath, 'main/res/index.html')
    }
}