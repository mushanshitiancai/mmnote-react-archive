import * as CodeMirror from 'codemirror';
import isUrl = require('is-url');
import * as p from 'path';

declare module 'codemirror' {
    interface Editor {
        mmAutoPreview(lineNumber: number): void;
    }
}

const regex = /!\[([^\]]*)\]\(([\(\)\[\]-a-zA-Z0-9@:%_\+~#=\.\\\/ ]+\.(jpg|jpeg|png|gif|svg))(\s("|')([-a-zA-Z0-9@:%_\+~#=\.\/! ]*)("|')\s?)?\)/gi;

CodeMirror.defineExtension('mmAutoPreview', function (lineNumber: number): void {
    let cm = this as CodeMirror.Editor;
    let doc = cm.getDoc();

    let line = doc.getLine(lineNumber);
    let match: RegExpExecArray | null;
    while ((match = regex.exec(line)) !== null) {
        let from = {
            line: lineNumber,
            ch: match.index
        };

        let to = {
            line: lineNumber,
            ch: match.index + match[0].length
        };

        if (doc.findMarks(from, to).length > 0) {
            continue;
        }

        // create element
        let link = match[2];


        let element = document.createElement('img');
        element.src = 'file://' + link;

        doc.markText(from, to, {
            replacedWith: element
        });
    }
});