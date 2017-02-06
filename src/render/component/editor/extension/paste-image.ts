import { ClipboardUtil } from '../../../util/clipboard-util';
import * as CodeMirror from 'codemirror';
import * as p from 'path';
import * as moment from 'moment';

declare module 'codemirror' {
    interface Editor {
        registerPasteImage(): void;
    }
}

function genImagePath(doc: CodeMirror.Doc): string {
    if (doc.mmGetURL()) {
        let dir = p.dirname(doc.mmGetURL());

        if (doc.getSelection()) {
            return p.join(dir, doc.getSelection() + '.png');
        } else {
            return p.join(dir, moment().format("Y-MM-DD-HH-mm-ss") + '.png');
        }
    }
}

CodeMirror.defineExtension('registerPasteImage', function () {
    let cm: CodeMirror.Editor = this;

    cm.on('paste', (instance, clipboardEvent) => {
        let path = genImagePath(cm.getDoc());
        ClipboardUtil.saveImageToFile(path).then((success) => {
            if (success !== false) {
                clipboardEvent.preventDefault();
                cm.getDoc().replaceSelection(`![](${path})`);
                // let img = document.createElement('img');
                // img.src = "file://" + path;
                // cm.operation(() => {
                //     cm.addLineWidget(cm.getDoc().getCursor().line,
                //         img, {
                //             handleMouseEvents: true
                //         } as any);
                // })
            }
        })
    });
});

