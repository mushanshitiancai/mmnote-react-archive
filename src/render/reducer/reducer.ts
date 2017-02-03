import { getCurrentDocument } from '../store/state';
import { ACT_EDITOR_UPDATE, ACT_OPEN_SUCCESS } from '../action/action';
import { fromJS, Map } from 'immutable';
import * as Actions from '../action/action';
import { combineReducers } from 'redux-immutable';

export type ActionType = { type: string, payload?: any, error?: boolean };

/**
{
    files: {
        currentFile: {
            path: "a_path"
        }
        files: {
            "a_path": {
                content: ""
            }
        }
    }
}
*/

/**
{
    editor: {
        options: {
            mode: 'gfm'
        }
    }
}
 */

function editor(state: Map<string, any>, action: ActionType) {
    return state;
}

function documents(state: Map<string, any>, action: ActionType) {
    if (action.type === ACT_OPEN_SUCCESS) {
        state = state.set('current', action.payload.path);
        state = state.setIn(['entities', action.payload.path], fromJS(action.payload));
        return state;
    } else if (action.type == ACT_EDITOR_UPDATE) {
        const path = state.get('current');
        return state.setIn(['entities', path, 'data'], action.payload);
    }
    return state;
}


export const reducer = combineReducers({
    editor,
    documents
});
