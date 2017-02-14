import { URLUtil } from '../../../util/url-util';
import * as CodeMirror from 'codemirror';
import isUrl = require('is-url');
import * as p from 'path';
import * as $ from 'jquery';

declare module 'codemirror' {
    interface Editor {
        mmAutoPreview(line?: CodeMirror.LineHandle | number): void;
    }
    interface TextMarker {
        changed(): void;
    }
}

const AutoPreviewConf = {
    img: {
        regex: /!\[([^\]]*)\]\(([\(\)\[\]-a-zA-Z0-9@:%_\+~#=\.\\\/ ]+\.(jpg|jpeg|png|gif|svg))(\s("|')([-a-zA-Z0-9@:%_\+~#=\.\/! ]*)("|')\s?)?\)/gi,
        createMarker: function (doc: CodeMirror.Doc, match: RegExpExecArray | null, from: CodeMirror.Position, to: CodeMirror.Position) {
            // TODO deal link
            let link = match[2];
            if(!isUrl(link)){
               link = URLUtil.pathToURL(link);
            }

            let img = $('<img/>', {
                class: 'cm-img',
                src: link
            });

            let cursor = doc.getCursor();
            let marker = doc.markText(from, to, {
                replacedWith: img.get(0)
            });

            img.on('load', () => {
                marker.changed();
            });

            img.on('error', (e) => {
                e.preventDefault();
                marker.clear();

                marker = doc.markText(from, to, {
                    className: "cm-error"
                });
                doc.setCursor(cursor);
            });

        }
    }
}

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

        while ((match = AutoPreviewConf.img.regex.exec(lineHandle.text)) !== null) {
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

            AutoPreviewConf.img.createMarker(doc, match, from, to);
        }
    }
});
