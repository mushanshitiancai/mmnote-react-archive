import * as CodeMirror from 'codemirror';
import isUrl = require('is-url');
import * as p from 'path';

declare module 'codemirror' {
    interface Editor {
        mmAutoPreview(line?: CodeMirror.LineHandle | number): void;
    }
    interface TextMarker {
        changed(): void;
    }
}

const regex = /!\[([^\]]*)\]\(([\(\)\[\]-a-zA-Z0-9@:%_\+~#=\.\\\/ ]+\.(jpg|jpeg|png|gif|svg))(\s("|')([-a-zA-Z0-9@:%_\+~#=\.\/! ]*)("|')\s?)?\)/gi;

CodeMirror.defineExtension('mmAutoPreview', function (line?: CodeMirror.LineHandle | number): void {
    let cm = this as CodeMirror.Editor;
    let doc = cm.getDoc();
    let lineHandle: CodeMirror.LineHandle;

    if (line === undefined) {
        doc.eachLine(_lineHandle => {
            previewLine(_lineHandle);
        });
        return;
    } else if (typeof line === 'number') {
        lineHandle = doc.getLineHandle(line);
    } else {
        lineHandle = line;
    }

    previewLine(lineHandle);

    function previewLine(lineHandle: CodeMirror.LineHandle): void {
        let match: RegExpExecArray | null;
        let lineNumber = doc.getLineNumber(lineHandle);

        while ((match = regex.exec(lineHandle.text)) !== null) {
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
            element.classList.add('img');

            if (isUrl(link)) {
                element.src = link;
            } else {
                element.src = 'file://' + link;
            }

            let marker: CodeMirror.TextMarker;
            let cursor = doc.getCursor();

            marker = doc.markText(from, to, {
                    replacedWith: element,
                    handleMouseEvents: true
                });

            element.addEventListener("load", () => {
                console.log('on load');
                // marker = doc.markText(from, to, {
                //     replacedWith: element,
                //     handleMouseEvents: true
                // });
                marker.changed();
            });

            element.addEventListener("error", () => {
                console.log('on error', arguments);
                marker.clear();

                marker = doc.markText(from, to, {
                    className: "cm-error"
                });
                doc.setCursor(cursor);
            });
        }
    }
});