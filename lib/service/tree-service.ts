import * as fs from 'fs-extra';
import * as p from 'path';
import * as fsp from 'mz/fs';
import * as _ from 'lodash';

export class Node {
    name: string;
    path: string;
    stats: fs.Stats;
    content: string = null;
    isLoaded: boolean = false;
    isOpen: boolean = false;
    isSelected: boolean = false;
    children: Node[] = [];

    constructor(path: string, stats: fs.Stats, name?: string) {
        this.name = name && name || p.basename(path);
        this.path = path;
        this.stats = stats;
    }

    toString() {
        return `Node=${this.path}, children=${this.children.length}`
    }
}

export class TreeService {
    constructor() {
    }

    readSubNode(node: Node, loadSingleNode: (node: Node) => void, done: (node: Node) => void) {
        fs.readdir(node.path, (err, paths) => {
            paths = paths.map(item => p.join(node.path, item));

            let promises: Promise<Node>[] = [];
            paths.forEach(path => {
                promises.push(new Promise((resolve, reject) => {
                    fs.lstat(path, (err, stats) => {

                        let tempNode = new Node(path, stats);
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


