import { logger } from '../../../common/logger';
import * as React from 'react';
import * as cm from 'codemirror';

import './codemirror.css';
import 'codemirror/mode/gfm/gfm.js';

export interface EditorProps {
    content?: string;
    options?: CodeMirror.EditorConfiguration;
}

export class Editor extends React.Component<EditorProps, undefined>{
    static defaultProps: EditorProps = {
        options: {
            mode: 'gfm'
        }
    }

    codeMirror: CodeMirror.EditorFromTextArea;

    constructor(props: EditorProps) {
        super(props);

    }

    componentWillReceiveProps(nextProps: EditorProps, nextContext: any) {
        logger.ui(`Editor:componentWillReceiveProps nextProps=${nextProps} nextContext=${nextContext}`, nextProps, nextContext);

        if (nextProps.content) {
            this.codeMirror.setValue(nextProps.content);
        }
    }

    componentDidMount() {
        this.codeMirror = cm.fromTextArea(this.refs["textarea"] as HTMLTextAreaElement, this.props.options);

        if (this.props.content)
            this.codeMirror.setValue(this.props.content);
    }

    render() {
        return <div>
            <textarea ref="textarea" />
        </div>
    }
}