import { logger } from '../../common/logger';
import * as fs from 'fs-extra';
import * as p from 'path';
import * as fsp from 'mz/fs';
import * as _ from 'lodash';

export class FSNode {
    name: string;
    path: string;
    stats: fs.Stats;
    content: string = null;
    children: FSNode[] = [];

    constructor(path: string, stats: fs.Stats) {
        this.name = p.basename(path);
        this.path = path;
        this.stats = stats;
    }

    isFile() {
        return this.stats.isFile();
    }

    isFolder() {
        return this.stats.isDirectory();
    }

    toString() {
        return `Node=${this.path}, children=${this.children.length}`
    }
}

export class FSTreeService {

}


