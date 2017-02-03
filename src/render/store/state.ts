import { Map, fromJS } from 'immutable';

export type RootStateType = Map<string, any>;

let data = `hello
functionx
`

console.log(data);

export const initState = {
    documents: {
        current: "path",
        entities: {
            "path": {
                path: "",
                data: data
            }
        }
    },
    editor: {
        options: {
            mode: 'gfm',
            // theme: 'base-16-light'
            theme: 'default'
        }
    }
};



export const initStateMap = fromJS(initState);

const demoState = {
    documents: {
        current: "path",
        entities: {
            "a_path": {
                path: "",
                data: ""
            }
        }
    },
    editor: {
        options: {
            mode: 'gfm'
        }
    }
}

export function getCurrentDocument(rootState: RootStateType): Map<string, any> {
    let path = rootState.getIn(['documents', 'current']);
    if (path) {
        return rootState.getIn(['documents', 'entities', path]);
    }
}