import { NodeType } from '../../util/file-util';
import { Map, fromJS, Record } from 'immutable';
import Cursor = require('immutable/contrib/cursor');

export type StateType = Map<string, any>;

class BaseCursor {
    cursor: Cursor.Cursor;

    constructor(cursor: Cursor.Cursor) {
        this.cursor = cursor;
    }
    get(): StateType {
        return this.cursor.deref();
    }
}

class DocCursor extends BaseCursor {

    static create(state: StateType, onChange?: (newValue: any, oldValue?: any, keyPath?: Array<any>) => any): DocCursor {
        let keyPath: string[] = [];
        if (state.has('doc')) {
            keyPath = ['doc']
        }
        return new DocCursor(Cursor.from(state, keyPath, onChange));
    }

    constructor(cursor: Cursor.Cursor) {
        super(cursor);
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

    getCurrentDocIsSaved(): boolean {
        return !!this.getCurrentDoc().get('isSaved');
    }

    getDocs(): StateType {
        return this.cursor.get('docs');
    }

    isOpenDoc(): boolean {
        return !!this.getCurrentDocUrl();
    }
}

class TreeCursor extends BaseCursor {
    static create(state: StateType, onChange?: (newValue: any, oldValue?: any, keyPath?: Array<any>) => any): TreeCursor {
        let keyPath: string[] = [];
        if (state.has('tree')) {
            keyPath = ['tree']
        }
        return new TreeCursor(Cursor.from(state, keyPath, onChange));
    }

    constructor(cursor: Cursor.Cursor) {
        super(cursor);
    }

    getNodeCurosr(url: string): TreeNodeCursor {
        return TreeNodeCursor.create(this.cursor.getIn(['nodes', url]))
    }

    getTopNodeCursor(): TreeNodeCursor {
        return this.getNodeCurosr(this.cursor.get('topNodeUrl'))
    }

    getSelectedNodeCursor(): TreeNodeCursor {
        return this.getNodeCurosr(this.cursor.get('selectedNodeUrl'))
    }
}

class TreeNodeCursor extends BaseCursor {
    static create(state: StateType, onChange?: (newValue: any, oldValue?: any, keyPath?: Array<any>) => any): TreeNodeCursor {
        if (!state) return null;
        let keyPath: string[] = [];
        return new TreeNodeCursor(Cursor.from(state, keyPath, onChange));
    }

    constructor(cursor: Cursor.Cursor) {
        super(cursor);
    }

    getName(): string {
        return this.cursor.get('name');
    }

    getUrl(): string {
        return this.cursor.get('url');
    }

    getType(): NodeType {
        return this.cursor.get('type');
    }

    getIsUnfolded(): boolean {
        return !!this.cursor.get('isUnfolded');
    }

    getIsSelected(): boolean {
        return !!this.cursor.get('isSelected');
    }

    getIsLoaded(): boolean {
        return !!this.cursor.get('isLoaded');
    }

    getChildUrls(): string[] {
        return this.cursor.get('childUrls');
    }
}

interface IAppState {
    doc: {
        currentDocUrl: string | null;
        docs: {
            [url: string]: {
                url: string;
                content: string;
                isSaved: boolean;
            }
        }
    },
    tree: {
        topNodeUrl: string | null;
        selectedNodeUrl: string | null;
        nodes: {
            [url: string]: {
                name: string;
                url: string;
                parentUrl: string;
                type: NodeType;
                isUnfolded: boolean;
                isSelected: boolean;
                isLoaded: boolean;
                childUrls: string[];
            }
        }
    }
}

export class AppState {
    static initStateObj: IAppState = {
        doc: {
            currentDocUrl: null,
            docs: {}
        },
        tree: {
            topNodeUrl: null,
            selectedNodeUrl: null,
            nodes: {}
        }
    }

    static initState: StateType = fromJS(AppState.initStateObj);

    static docCursor = DocCursor.create;
    static treeCursor = TreeCursor.create;
    static treeNodeCursor = TreeNodeCursor.create;
}

