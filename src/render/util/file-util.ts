import { logger } from '../../common/logger';
import * as fs from 'fs-extra';
import * as toBuffer from 'blob-to-buffer';

export const enum NodeType {
    File, Folder, Other
}


export class FileUtil {

    static writeBlob(blob: Blob, path: string): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            console.log('toBuffer', toBuffer);
            toBuffer(blob, (err: any, buffer: Buffer) => {
                if (err) {
                    logger.error('writeBlob toBuffer error', err);
                    reject(err);
                } else {
                    fs.writeFile(path, buffer, (err) => {
                        if (err) {
                            logger.error('writeBlob writeFile error', err);
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                }
            });
        });
    }

    static getNodeTypeFromStats(stats: fs.Stats) {
        if (stats.isFile()) {
            return NodeType.File;
        } else if (stats.isDirectory()) {
            return NodeType.Folder
        } else {
            return NodeType.Other
        }
    }
}