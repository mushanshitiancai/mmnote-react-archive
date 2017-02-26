import { store } from '../store/store';
import { AppState, StateType } from '../store/state';
import { FileUtil, NodeType } from '../../util/file-util';
import { logger } from '../../../common/logger';
import { ActionType } from '../reducer/reducer';
import * as fs from 'fs';
import * as fsp from 'fs-promise';
import * as p from 'path';
import { Dispatch } from 'redux';
import walk = require('klaw');

declare module 'redux' {
    interface Dispatch<S> {
        (action: any): any;
    }
}

function sendFailAction(dispatch: Dispatch<any>, type: string): (err: any) => void {
    return (err: any) => dispatch({ type: ACT_OPEN_FAIL, error: true, payload: err })
}


// open file or folder
export const ACT_OPEN_BEGIN = "ACT_OPEN_BEGIN";
export const ACT_OPEN_SUCCESS = "ACT_OPEN_SUCCESS";
export const ACT_OPEN_FAIL = "ACT_OPEN_FAIL";

export function openAction(path: string) {
    return function (dispatch: Dispatch<any>) {
        dispatch({ type: ACT_OPEN_BEGIN });

        fsp.stat(path).then(stats => {
            if (stats.isFile()) {
                dispatch(openFileAction(path));
            } else if (stats.isDirectory()) {
                dispatch(openFolderAction(path));
            }
            return null;
        }).catch(sendFailAction(dispatch, ACT_OPEN_FAIL));
    }
}

// open file
export const ACT_OPEN_FILE_BEGIN = "ACT_OPEN_FILE_BEGIN";
export const ACT_OPEN_FILE_SUCCESS = "ACT_OPEN_FILE_SUCCESS";
export const ACT_OPEN_FILE_FAIL = "ACT_OPEN_FILE_FAIL";

// TODO 对于不同的文件使用不同的打开器
export function openFileAction(path: string) {
    return function (dispatch: Dispatch<any>) {
        dispatch({ type: ACT_OPEN_FILE_BEGIN });

        fsp.readFile(path, 'utf-8').then(data => {
            dispatch({
                type: ACT_OPEN_FILE_SUCCESS, payload: {
                    url: path,
                    content: data
                }
            });
            return null;
        }).catch(sendFailAction(dispatch, ACT_OPEN_FILE_FAIL));;
    }
}

export const ACT_OPEN_FOLDER_BEGIN = "ACT_OPEN_FOLDER_BEGIN";
export const ACT_OPEN_FOLDER_SUCCESS = "ACT_OPEN_FOLDER_SUCCESS";
export const ACT_OPEN_FOLDER_FAIL = "ACT_OPEN_FOLDER_FAIL";

export function openFolderAction(path: string) {
    return function (dispatch: Dispatch<any>) {
        dispatch({
            type: ACT_OPEN_FOLDER_SUCCESS, payload: {
                url: path,
                name: p.basename(path),
                type: NodeType.Folder,
                childUrls: []
            }
        });
    }
}

export const ACT_SAVE_BEGIN = "ACT_SAVE_BEGIN";
export const ACT_SAVE_SUCCESS = "ACT_SAVE_SUCCESS";
export const ACT_SAVE_FAIL = "ACT_SAVE_FAIL";

export function saveAction(path: string, content: string) {
    console.log('saveAction', path, content);

    return function (dispatch: Dispatch<any>) {
        dispatch({ type: ACT_SAVE_BEGIN });

        fs.writeFile(path, content, 'utf-8', err => {
            if (err) {
                dispatch({ type: ACT_SAVE_FAIL, error: true, payload: err });
            } else {
                dispatch({ type: ACT_SAVE_SUCCESS });
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


export const ACT_TREE_NODE_CLICK = "ACT_TREE_NODE_CLICK";

export function treeNodeClickAction(nodeUrl: string) {
    return function (dispatch: Dispatch<any>, getState: () => StateType) {
        let nodeCursor = AppState.treeCursor(getState()).getNodeCurosr(nodeUrl);
        if (nodeCursor.getType() == NodeType.Folder && nodeCursor.getIsLoaded() == false) {
            dispatch(treeNodeLoadChildrenAction(nodeUrl));
        }
        if(nodeCursor.getType() == NodeType.File){
            dispatch(openFileAction(nodeUrl))
        }

        dispatch({
            type: ACT_TREE_NODE_CLICK,
            payload: nodeUrl
        })
    }
}

export const ACT_TREE_NODE_LOAD_CHILDREN = "ACT_TREE_NODE_LOAD_CHILDREN";

export function treeNodeLoadChildrenAction(nodeUrl: string) {
    return function (dispatch: Dispatch<any>, getState: () => StateType) {

        fsp.readdir(nodeUrl).then(paths => {

            paths.forEach(path => {
                let fullPath = p.resolve(nodeUrl, path)
                fsp.stat(fullPath).then(stats => {
                    dispatch(treeNodeAddNodeAction({
                        url: fullPath,
                        parentUrl: nodeUrl,
                        type: FileUtil.getNodeTypeFromStats(stats)
                    }))
                })
            })

        })
    }
}

export const ACT_TREE_NODE_ADD_NODE = "ACT_TREE_NODE_ADD_NODE";

export function treeNodeAddNodeAction({parentUrl, url, type}: { parentUrl?: string, url: string, type: NodeType }) {
    return {
        type: ACT_TREE_NODE_ADD_NODE,
        payload: {
            url: url,
            parentUrl: parentUrl,
            type: type,
            name: p.basename(url),
            childUrls: [] as string[]
        }
    }
}