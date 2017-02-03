import { initStateMap } from './state';
import { createStore, compose, applyMiddleware } from 'redux';
import { Iterable } from 'immutable';
import thunkMiddleware from 'redux-thunk'
import * as createLogger from 'redux-logger'
import DevTools from '../container/dev-tools';

import { reducer } from '../reducer/reducer';

const stateTransformer = (state: Iterable<any,any>) => {
    if (Iterable.isIterable(state)) return state.toJS();
    else return state;
};
const loggerMiddleware = createLogger({ stateTransformer });

export const store = createStore(
    reducer,
    initStateMap,
    compose(
        applyMiddleware(
            thunkMiddleware,
            loggerMiddleware
        ),
        DevTools.instrument()
    )
);