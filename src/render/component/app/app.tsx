import { TreeItem, TreeItemContainer } from '../tree/tree-item';
import { ALL_COMMANDS } from '../../../common/command';
import * as React from 'react';
import { remote, ipcRenderer } from 'electron';
import * as SplitPane from 'react-split-pane';
import * as fs from 'fs';
import { Store } from 'redux';

import { AppState, StateType } from '../../redux/store/state';
import { openAction } from '../../redux/action/action';
import { EditorContainer } from '../../container/editor-container';
import { CommandExecutor } from '../../service/command-executor';
import { logger } from '../../../common/logger';
import { TreeContainer } from '../tree/tree';
import { FSNode, FSTreeService } from '../../service/tree-service';
import { Welcome } from '../../component/control/control';

import './app.less';
import './resizer.less';

export interface IAppProps {
    state?: StateType
}

export class App extends React.Component<IAppProps, undefined>{
    static contextTypes = { store: React.PropTypes.object };

    private commandExecutor: CommandExecutor;

    private welcome = [
        { label: "Create NoteBook", command: ALL_COMMANDS.open },
        { label: "Open Note", command: ALL_COMMANDS.open }
    ];

    onWelcomeClick = (command: string) => {
        this.commandExecutor.execCommand(command);
    }

    constructor(props: IAppProps, context: any) {
        super(props, context);
        // console.log("App constructor", this.props, this.context);

        // init dep
        this.commandExecutor = new CommandExecutor(this, this.context.store);

        // this.props.store.dispatch(openAction('/Users/mazhibin/project/xxx/demonote/hehe.md'));
    }

    open(paths: string[]) {
        this.context.store.dispatch(openAction(paths[0]));
    }

    getState(): StateType {
        return this.context.store.getState();
    }

    renderTitle() {
        let state = this.getState();
        let docCursor = AppState.docCursor(state)
        if (docCursor.isOpenDoc()) {
            let unSaveSign = docCursor.getCurrentDocIsSaved() ? "" : "*"
            document.title = `MMNote - ${unSaveSign}${docCursor.getCurrentDocUrl()}`
        } else {
            document.title = "MMNote"
        }
    }

    render() {
        console.log("app re render");

        this.renderTitle();

        let state = this.context.store.getState();

        return <div className="app">
            <SplitPane split="vertical" minSize={50} defaultSize={200}>
                <div className="left">
                    <TreeContainer />
                </div>
                <div className="right">
                    {AppState.docCursor(state).isOpenDoc()
                        ? <EditorContainer />
                        : <Welcome actions={this.welcome} onClick={(action) => { this.onWelcomeClick(action) }} />
                    }
                </div>
            </SplitPane>
        </div>
    }
}