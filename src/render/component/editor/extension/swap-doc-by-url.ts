import * as CodeMirror from 'codemirror';

declare module 'codemirror' {
    interface Editor {
        swapDocByUrl({url, content, newDocSwapCallback}: SwapDocByUrlParam): void;
        mmDocMap: Map<string, any>;
    }
}

interface SwapDocByUrlParam {
    url: string;
    mode: string;
    content?: string;
    newDocSwapCallback?: (cm: CodeMirror.Editor, doc: CodeMirror.Doc) => void
}

CodeMirror.defineExtension('swapDocByUrl', function ({url, mode, content, newDocSwapCallback}: SwapDocByUrlParam) {
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
        let newDoc = CodeMirror.Doc(content ? content : '', mode);
        newDoc.mmSetURL(url);
        cm.mmDocMap.set(url, newDoc);
        cm.swapDoc(newDoc);

        if (newDocSwapCallback instanceof Function) {
            newDocSwapCallback(cm, newDoc);
        }
    }
})