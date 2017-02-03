import { ActionType } from '../reducer/reducer';
import * as fs from 'fs';
import { Dispatch } from 'redux';

export const ACT_OPEN_BEGIN = "ACT_OPEN_BEGIN";
export const ACT_OPEN_SUCCESS = "ACT_OPEN_SUCCESS";
export const ACT_OPEN_FAIL = "ACT_OPEN_FAIL";

export function openAction(path: string) {
    return function (dispath: Dispatch<any>) {
        dispath({ type: ACT_OPEN_BEGIN });

        fs.readFile(path, 'utf-8', (err, data) => {
            if (err) {
                dispath({ type: ACT_OPEN_FAIL, error: true, payload: err });
            } else {
                dispath({
                    type: ACT_OPEN_SUCCESS, payload: {
                        path: path,
                        data: data
                    }
                });
            }
        });
    }
}

export const ACT_SAVE_BEGIN = "ACT_SAVE_BEGIN";
export const ACT_SAVE_SUCCESS = "ACT_SAVE_SUCCESS";
export const ACT_SAVE_FAIL = "ACT_SAVE_FAIL";

export function saveAction(path: string, content: string) {
    console.log('saveAction', path, content);

    return function (dispath: Dispatch<any>) {
        dispath({ type: ACT_SAVE_BEGIN });

        fs.writeFile(path, content, 'utf-8', err => {
            if (err) {
                dispath({ type: ACT_SAVE_FAIL, error: true, payload: err });
            } else {
                dispath({ type: ACT_SAVE_SUCCESS });
            }
        });
    }
}


export const ACT_EDITOR_UPDATE = "ACT_EDITOR_UPDATE";

export function editorUpdateAction(content: string) {
    // console.log('editorUpdateAction', content);
    
    return {
        type: ACT_EDITOR_UPDATE,
        payload: content
    }
}
