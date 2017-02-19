import { AppState, StateType } from '../../redux/store/state';
import { logger } from '../../../common/logger';
import { TreeItemContainer } from './tree-item';
import * as React from 'react';
import './tree.less';
import * as fs from 'fs';
import { FSNode } from '../../service/tree-service';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

export interface ITreeProps {
    tree?: StateType;
    onItemClick?(nodeUrl: string): void;
}

/**
 * 目录树控件
 */
export class Tree extends React.Component<ITreeProps, undefined>{

    constructor(props: ITreeProps) {
        super(props);
    }

    render() {
        let topNodeCursor = AppState.treeCursor(this.props.tree).getTopNodeCursor()

        return <ol className="tree">
            {topNodeCursor && <TreeItemContainer nodeUrl={topNodeCursor.getUrl()} />}
        </ol>
    }
}

export const TreeContainer = connect(
    function (state: StateType, ownProps: ITreeProps): ITreeProps {
        return {
            tree: AppState.treeCursor(state).get()
        }
    }, function (dispatch): ITreeProps {
        return bindActionCreators({
            // onItemClick: treeNodeClickAction
        }, dispatch);
    }
)(Tree);