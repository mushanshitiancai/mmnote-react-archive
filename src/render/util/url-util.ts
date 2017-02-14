import * as URI from 'urijs';
import uri2path = require('file-uri-to-path');
import fileUrl = require('file-url');

export class URLUtil{

    static pathToURL(path:string):string{
        return fileUrl(path);
    }
}


