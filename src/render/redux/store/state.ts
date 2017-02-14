import { Map, fromJS, Record } from 'immutable';
import Cursor = require('immutable/contrib/cursor');

export type StateType = Map<string, any>;

class DocCursor {

    static create(state: StateType, onChange?: (newValue: any, oldValue?: any, keyPath?: Array<any>) => any): DocCursor {
        let keyPath: string[] = [];
        if (state.has('doc')) {
            keyPath = ['doc']
        }
        return new DocCursor(Cursor.from(state, keyPath, onChange));
    }

    cursor: Cursor.Cursor;

    constructor(cursor: Cursor.Cursor) {
        this.cursor = cursor;
    }

    get(): StateType {
        return this.cursor.deref();
    }

    getCurrentDoc(): StateType {
        return this.cursor.getIn(['docs', this.cursor.get('currentDocUrl')]);
    }

    getCurrentDocUrl(): string {
        return this.cursor.get('currentDocUrl');
    }

    getCurrentDocContent(): string {
        return this.getCurrentDoc().get('content');
    }

    getDocs(): StateType {
        return this.cursor.get('docs');
    }

    isOpenDoc():boolean{
        return !!this.getCurrentDocUrl();
    }
}

export class AppState {
    static initState: StateType = fromJS({
        doc: {
            currentDocUrl: null,
            docs: {}
        }
    });

    static docCursor = DocCursor.create;

    // static docAccesser = {
    //     getFromRoot(state: StateType) {
    //         if (state === AppState.initState)
    //             return state.get('doc');
    //     },
    //     getCurrentDoc(docState: StateType): StateType {
    //         return docState.getIn(['docs', docState.get('currentDocUrl')]);
    //     },
    //     getCurrentDocUrl(docState: StateType): string {
    //         return docState.get('currentDocUrl');
    //     },
    //     getCurrentDocContent(docState: StateType): string {
    //         return this.getCurrentDoc(docState).get('content');
    //     },
    //     getDocs(docState: StateType): StateType {
    //         return docState.get('docs');
    //     }
    // };
}

