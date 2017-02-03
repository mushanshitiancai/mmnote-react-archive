import * as CodeMirror from 'codemirror';

declare module 'codemirror' {
    interface Doc {
        mmMetaInfo: Map<string, any>;
        mmSetMetaInfo(key: string, value: any): void;
        mmGetMetaInfo(key?: string): any;
        mmSetURL(url: string): void;
        mmGetURL(): string;
    }
}

CodeMirror.defineDocExtension('mmSetMetaInfo', function (key: string, value: any): void {
    let doc = this as CodeMirror.Doc;

    if (!doc.mmMetaInfo) {
        doc.mmMetaInfo = new Map();
    }
    if (key === undefined || key === null) return;

    doc.mmMetaInfo.set(key,value);
});

CodeMirror.defineDocExtension('mmGetMetaInfo', function (key?: string): any {
    let doc = this as CodeMirror.Doc;

    if (!key) return doc.mmMetaInfo;

    return doc.mmMetaInfo ? doc.mmMetaInfo.get(key) : undefined;
});

CodeMirror.defineDocExtension('mmSetURL', function (url: string) {
    let doc = this as CodeMirror.Doc;

    doc.mmSetMetaInfo('url', url);
});

CodeMirror.defineDocExtension('mmGetURL', function (url: string) {
    let doc = this as CodeMirror.Doc;

    return doc.mmGetMetaInfo('url');
});