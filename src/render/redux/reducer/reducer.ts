import { AppState } from '../store/state';
import { fromJS, Map } from 'immutable';
import * as Actions from '../action/action';
import { combineReducers } from 'redux-immutable';

export type ActionType = { type: string, payload?: any, error?: boolean };

function editor(state: Map<string, any>, action: ActionType) {
    return state;
}

function doc(state: Map<string, any>, action: ActionType) {
    if (action.type === Actions.ACT_OPEN_FILE_SUCCESS) {
        state = state.set('currentDocUrl', action.payload.url);
        action.payload.isSaved = true;
        state = state.setIn(['docs', action.payload.url], fromJS(action.payload));
        return state;
    } else if (action.type == Actions.ACT_EDITOR_UPDATE) {
        const currentDocUrl = state.get('currentDocUrl');
        return state
            .setIn(['docs', currentDocUrl, 'content'], action.payload)
            .setIn(['docs', currentDocUrl, 'isSaved'], false);
    } else if (action.type == Actions.ACT_SAVE_SUCCESS) {
        const currentDocUrl = state.get('currentDocUrl');
        return state
            .setIn(['docs', currentDocUrl, 'isSaved'], true);
    }
    return state;
}

function tree(state: Map<string, any>, action: ActionType) {
    if (action.type === Actions.ACT_OPEN_FOLDER_SUCCESS) {
        return state.set('topNodeUrl', action.payload.url)
            .setIn(['nodes', action.payload.url], fromJS(action.payload))
    } else if (action.type === Actions.ACT_TREE_NODE_CLICK) {
        const nodeUrl = action.payload;

        // unSelect node
        let selectedNodeUrl = state.get('selectedNodeUrl');
        if (selectedNodeUrl != nodeUrl) {
            state = state.setIn(['nodes', selectedNodeUrl, 'isSelected'], false);
            state = state.set('selectedNodeUrl', nodeUrl);

            state = state.updateIn(['nodes', nodeUrl], node => {
                return node.update('isSelected', (oldValue: boolean) => !oldValue)
            })
        }

        state = state.updateIn(['nodes', nodeUrl], node => {
            return node.update('isUnfolded', (oldValue: boolean) => !oldValue)
        })
        return state;
    } else if (action.type === Actions.ACT_TREE_NODE_ADD_NODE) {
        const node = action.payload;
        const url = node.url;
        const parentUrl = node.parentUrl;

        state = state.setIn(['nodes', url], fromJS(node))

        // update parent node
        if (state.hasIn(['nodes', parentUrl]) && state.getIn(['nodes', parentUrl, 'childUrls']).indexOf(url) === -1) {
            state = state.setIn(['nodes', parentUrl, 'isLoaded'], true);
            state = state.updateIn(['nodes', parentUrl, 'childUrls'], (childUrls: string[]) => {
                return childUrls.push(url);
            });
        }
        return state;
    }
    return state;
}


export const reducer = combineReducers({
    doc,
    tree
});
