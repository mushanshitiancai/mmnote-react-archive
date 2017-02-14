import { AppState } from '../store/state';
import { ACT_EDITOR_UPDATE, ACT_OPEN_SUCCESS } from '../action/action';
import { fromJS, Map } from 'immutable';
import * as Actions from '../action/action';
import { combineReducers } from 'redux-immutable';

export type ActionType = { type: string, payload?: any, error?: boolean };

function editor(state: Map<string, any>, action: ActionType) {
    return state;
}

function doc(state: Map<string, any>, action: ActionType) {
    if (action.type === ACT_OPEN_SUCCESS) {
        state = state.set('currentDocUrl', action.payload.url);
        state = state.setIn(['docs', action.payload.url], fromJS(action.payload));
        return state;
    } else if (action.type == ACT_EDITOR_UPDATE) {
        const path = state.get('currentDocUrl');
        return state.setIn(['docs', path, 'content'], action.payload);
    }
    return state;
}


export const reducer = combineReducers({
    doc
});
