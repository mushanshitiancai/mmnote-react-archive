import * as fs from 'fs-extra';
import * as p from 'path';
import * as fsp from 'mz/fs';

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
}

export class TreeService {
    constructor() {
    }

    readSubNode(node: Node, updateSingleNode: (node: Node) => void): Promise<Node> {
        return new Promise((resolve, reject) => {
            fs.readdir(node.path, (err, paths) => {
                paths = paths.map(item => p.join(node.path, item));

                console.log("paths:" + paths);

                let promises: Promise<Node>[];
                paths.forEach(path => {
                    promises.push(new Promise((resolve, reject) => {
                        fs.lstat(path, (err, stats) => {

                            let tempNode = new Node(path, stats);
                            node.children.push(tempNode);

                            if (updateSingleNode instanceof Function) {
                                updateSingleNode(tempNode);
                            }
                            resolve(tempNode);
                        });
                    }));

                    Promise.all(promises).then(() => resolve(node));
                })
            });
        });
    }
}


