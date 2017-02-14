declare module 'redux-devtools-chart-monitor';
declare module 'redux-devtools-diff-monitor';
declare module 'redux-devtools-inspector';
declare module 'blob-to-buffer';

declare module 'file-uri-to-path' {
    function uri2path(uri: string): string;
    export = uri2path;
}