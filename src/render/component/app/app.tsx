import * as React from 'react';
import { remote, ipcRenderer } from 'electron';
import * as SplitPane from 'react-split-pane';
import * as fs from 'fs';
import { Store } from 'redux';

import { AppState } from '../../redux/store/state';
import { openAction } from '../../redux/action/action';
import { EditorContainer } from '../../container/editor-container';
import { CommandExecutor } from '../../service/command-executor';
import { logger } from '../../../common/logger';
import { Tree, TreeNode } from '../tree/tree';
import { FSNode, FSTreeService } from '../../service/tree-service';
import { Welcome } from '../../component/control/control';

import './app.less';
import './resizer.less';

interface IAppProps {
    path?: string;
    store: Store<any>
}

interface IAppState {
    curFolders?: TreeNode[];
    curContent?: string;
}

export class App extends React.Component<IAppProps, IAppState>{

    private commandExecutor: CommandExecutor;

    constructor(props: IAppProps) {
        super(props);
        // console.log("App constructor", this.props, this.context);

        // init dep
        this.commandExecutor = new CommandExecutor(this, this.props.store);

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

        // this.props.store.dispatch(openAction('/Users/mazhibin/project/xxx/demonote/hehe.md'));
    }

    open(paths: string[]) {
        // this.setState({
        //     curFolders: [new TreeNode(FSTreeService.getNode(paths[0]))]
        // });
        this.props.store.dispatch(openAction(paths[0]));
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
        let state = this.props.store.getState();

        return <div className="app">
            {AppState.docCursor(state).isOpenDoc()
                ? <EditorContainer />
                : <Welcome />
            }

            {/*<SplitPane split="vertical" minSize={50} defaultSize={200}>
                <div className="left">
                    <Tree items={this.state.curFolders} onItemClick={this.onTreeItemClick}>app</Tree>
                </div>
                <div className="right">
                    <EditorContainer />
                </div>
            </SplitPane>*/}
        </div>
    }
}