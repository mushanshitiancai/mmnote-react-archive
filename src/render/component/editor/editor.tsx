import { ClipboardUtil } from '../../util/clipboard-util';
import { FileUtil } from '../../util/file-util';
import { logger } from '../../../common/logger';
import * as React from 'react';
import * as CodeMirror from 'codemirror';
import { clipboard } from 'electron';
import * as fs from 'fs';

import './codemirror.css';
// import 'codemirror/addon/mode/overlay.js'
// import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/mode/gfm/gfm.js';
import 'codemirror/mode/javascript/javascript.js';

import './extension/doc-meta';
import './extension/swap-doc-by-url';
import './extension/paste-image';
import './extension/auto-preview';

declare module 'codemirror' {
    interface Editor {
        on(eventName: 'paste', handler: (instance: CodeMirror.Editor, event: ClipboardEvent) => void): void;
    }
}

export interface EditorProps {
    url?: string;
    content?: string;
    options?: CodeMirror.EditorConfiguration;
    onChange?: (content: string) => void;
}

export class Editor extends React.Component<EditorProps, undefined>{

    codeMirror: CodeMirror.EditorFromTextArea;

    constructor(props: EditorProps) {
        super(props);

    }

    componentWillReceiveProps(nextProps: EditorProps, nextContext: any) {
        logger.ui(`Editor:componentWillReceiveProps nextProps=${nextProps} nextContext=${nextContext}`, nextProps, nextContext);

        this.codeMirror.swapDocByUrl(nextProps.url, nextProps.content);
    }

    componentDidMount() {
        this.codeMirror = CodeMirror.fromTextArea(this.refs["textarea"] as HTMLTextAreaElement, this.props.options);
        (window as any)['cm'] = this.codeMirror;

        if (this.props.content)
            this.codeMirror.setValue(this.props.content);

        this.codeMirror.on('change', (instance, change) => {
            this.props.onChange(this.codeMirror.getValue());
            // logger.info("editor on change", change, instance.getValue());

            let count = this.codeMirror.getDoc().lineCount();
            for (let i = 0; i < count; i++) {
                this.codeMirror.mmAutoPreview(i);
            }
        });

        this.codeMirror.registerPasteImage();
    }

    render() {
        return <div>
            <img ref='img' src="" alt="" />
            <textarea ref="textarea" />
        </div>
    }
}