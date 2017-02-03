import * as CodeMirror from 'codemirror';

declare module 'codemirror' {
    interface Editor {
        swapDocByUrl(url: string, content?: string): void;
        mmDocMap: Map<string,any>;
    }
}

CodeMirror.defineExtension('swapDocByUrl', function (url: string, content?: string) {
    let cm: CodeMirror.Editor = this;

    if (!cm.mmDocMap) {
        cm.mmDocMap = new Map();
    }

    if (cm.mmDocMap.has(url) && cm.mmDocMap.get(url) instanceof CodeMirror.Doc) {
        if (cm.mmDocMap.get(url) !== cm.getDoc()) {
            cm.swapDoc(cm.mmDocMap.get(url));
        }

        // update content
        if (content && cm.getDoc().getValue() != content) {
            cm.getDoc().setValue(content);
        }
    } else {
        let newDoc = CodeMirror.Doc(content ? content : '');
        newDoc.mmSetURL(url);
        cm.mmDocMap.set(url,newDoc);
        cm.swapDoc(newDoc);
    }
})