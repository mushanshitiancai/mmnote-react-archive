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

    static getNode(path: string) {
        path = p.resolve(path);
        let stat = fs.lstatSync(path);

        return new FSNode(path, stat);
    }

    /**
     * 读取当前目录节点的直接子节点
     * 
     * @param {FSNode} node 当前节点，必须是目录
     * @param {(node: FSNode) => void} loadSingleNode 读取一个子节点后的回调
     * @param {(node: FSNode) => void} done 读取完毕的回调
     * 
     * @memberOf TreeService
     */
    static getSubNode(node: FSNode, loadSingleNode: (node: FSNode) => void, done: (node: FSNode) => void) {
        if (node.isFile()) return;

        fs.readdir(node.path, (err, paths) => {
            if (err) {
                logger.error("getSubNode error", err);
                return;
            }
            paths = paths.map(item => p.join(node.path, item));

            let promises: Promise<FSNode>[] = [];
            paths.forEach(path => {
                promises.push(new Promise((resolve, reject) => {
                    fs.lstat(path, (err, stats) => {

                        let tempNode = new FSNode(path, stats);
                        node.children.push(tempNode);

                        if (loadSingleNode instanceof Function) {
                            loadSingleNode(tempNode);
                        }
                        resolve(tempNode);
                    });
                }));
            });
            Promise.all(promises).then(() => done(node));
        });
    }
}


