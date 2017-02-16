import { AppState, StateType } from '../../redux/store/state';
import { ClipboardUtil } from '../../util/clipboard-util';
import { FileUtil } from '../../util/file-util';
import { logger } from '../../../common/logger';
import * as React from 'react';
import * as CodeMirror from 'codemirror';
import { clipboard } from 'electron';
import * as fs from 'fs';

import './codemirror.css';
import 'codemirror/addon/edit/continuelist.js';
// import 'codemirror/addon/mode/overlay.js'
// import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/javascript/javascript.js';

import './extension/doc-meta';
import './extension/swap-doc-by-url';
import './extension/paste-image';
import './extension/auto-preview';

export interface EditorProps {
    doc?: StateType;
    onChange?: (content: string) => void;
}

export class Editor extends React.Component<EditorProps, undefined>{

    codeMirror: CodeMirror.EditorFromTextArea;

    constructor(props: EditorProps) {
        super(props);
        let a: [any];
    }

    shouldComponentUpdate(nextProps: EditorProps, nextState: undefined, nextContext: any): boolean {
        return false;
    }

    componentWillReceiveProps(nextProps: EditorProps, nextContext: any) {
        // logger.ui/(`Editor:componentWillReceiveProps nextProps=${nextProps} nextContext=${nextContext}`, nextProps, nextContext);

        let cursor = AppState.docCursor(nextProps.doc)
        this.swapDoc(cursor.getCurrentDocUrl(),cursor.getCurrentDocContent());
    }

    componentDidMount() {
        let options = {
            mode: 'gfm',
            // theme: 'base-16-light'
            theme: 'default',
            extraKeys: { "Enter": "newlineAndIndentContinueMarkdownList" }
        }
        this.codeMirror = CodeMirror.fromTextArea(this.refs["textarea"] as HTMLTextAreaElement, options);
        (window as any)['cm'] = this.codeMirror;

        this.codeMirror.on('change', (instance, change) => {
            this.props.onChange(this.codeMirror.getValue());
            // logger.info("editor on change", change, instance.getValue());
            logger.info("editor on change" + this.printCursor());

            let markers = this.codeMirror.getDoc().findMarksAt(this.codeMirror.getDoc().getCursor());
            markers.forEach((marker) => {
                marker.clear();
            })

            this.codeMirror.mmAutoPreview(change.from.line);
        });

        this.codeMirror.registerPasteImage();

        // init doc
        let cursor = AppState.docCursor(this.props.doc)
        this.swapDoc(cursor.getCurrentDocUrl(),cursor.getCurrentDocContent());
    }

    swapDoc(url:string,content:string){
        this.codeMirror.swapDocByUrl({
            url: url,
            mode: 'gfm',
            content: content,
            newDocSwapCallback: (cm, doc) => {
                cm.mmAutoPreview();
            }
        });
    }

    printCursor() {
        let cursor = this.codeMirror.getDoc().getCursor();
        return `${cursor.line} ${cursor.ch}`;
    }

    render() {
        return <div>
            <img ref='img' src="" alt="" />
            <textarea ref="textarea" />
        </div>
    }
}