import { CommandExecutor } from '../../service/command-executor';
import { logger } from '../../../common/logger';
import { Tree, TreeNode } from '../tree/tree';
import * as React from 'react';
import { FSNode, FSTreeService } from '../../service/tree-service';
import { remote, ipcRenderer } from 'electron';
import * as SplitPane from 'react-split-pane';
import { Editor } from '../editor/editor'
import * as fs from 'fs';
import './app.less';
import './resizer.less';

interface AppProps {
    path?: string;
}

interface AppState {
    curFolders?: TreeNode[];
    curContent?: string;
}

export class App extends React.Component<AppProps, AppState>{

    private commandExecutor: CommandExecutor;
    public editor:Editor;

    constructor(props: AppProps) {
        super(props);

        // init dep
        this.commandExecutor = new CommandExecutor(this);

        if (props.path) {
            let curNode = new TreeNode(FSTreeService.getNode(this.props.path));
            console.log(curNode);
            this.state = {
                curFolders: [curNode]
            }
        } else {
            this.state = {
                curFolders: []
            }
        }
    }

    open(paths: string[]) {
        this.setState({
            curFolders: [new TreeNode(FSTreeService.getNode(paths[0]))]
        });
    }

    onTreeItemClick = (item: TreeNode) => {
        if (item.isFile()) {
            if (item.content === null) {
                fs.readFile(item.path, 'utf-8', (err, data) => {
                    if (err) {
                        logger.error(`App:onTreeItemClick load file error=${err}`);
                        return;
                    }

                    this.setState({
                        curContent: data
                    });
                });
            }
        } else {
            FSTreeService.getSubNode(item, () => {

            }, () => {
                this.setState(this.state);
            });
        }
    }

    render() {
        return <div className="app">
            <SplitPane split="vertical" minSize={50} defaultSize={200}>
                <div className="left">
                    <Tree items={this.state.curFolders} onItemClick={this.onTreeItemClick}>app</Tree>
                </div>
                <div className="right">
                    <Editor content={this.state.curContent}/>
                </div>
            </SplitPane>
        </div>
    }
}