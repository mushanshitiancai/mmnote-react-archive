import * as fs from 'fs';

export namespace fsp {
    
    export function writeFile(filename: string, data: any): Promise<void> {
        return new Promise<void>((resolve, reject) => {
            fs.writeFile(filename, data, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            })
        });
    }
}