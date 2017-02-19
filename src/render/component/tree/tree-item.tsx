import { treeNodeClickAction } from '../../redux/action/action';
import { NodeType } from '../../util/file-util';
import { AppState, StateType } from '../../redux/store/state';
import { logger } from '../../../common/logger';
import * as React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import './tree.less';

interface TreeItemProps {
    nodeUrl?: string;
    node?: StateType
    onItemClick?(url: string): void;
}

export class TreeItem extends React.Component<TreeItemProps, undefined>{
    constructor(props: TreeItemProps) {
        super(props);
    }

    render(): JSX.Element {
        const cursor = AppState.treeNodeCursor(this.props.node);

        let className = "tree-item";
        if (cursor.getType() === NodeType.Folder) {
            className += " container";
        } else {
            className += " single";
        }

        if (cursor.getIsSelected()) {
            className += " selected";
        }

        let children = null;
        const childUrls = cursor.getChildUrls();

        if (childUrls && childUrls.length != 0) {
            if (cursor.getIsUnfolded()) {
                children = <ol className="tree-item-children">
                    {childUrls.map((url, i) => <TreeItemContainer nodeUrl={url} key={url} />)}
                </ol>
            }
        }

        return <li className={className}>
            <TreeItemHeader name={cursor.getName()} nodeType={cursor.getType()} isUnfolded={cursor.getIsUnfolded()} onClick={() => this.props.onItemClick(cursor.getUrl())} />
            {children}
        </li>
    }
}

export const TreeItemContainer = connect(
    function (state: StateType, ownProps: TreeItemProps): TreeItemProps {
        return {
            node: AppState.treeCursor(state).getNodeCurosr(ownProps.nodeUrl).get()
        }
    }, function (dispatch): TreeItemProps {
        return bindActionCreators({
            onItemClick: treeNodeClickAction
        }, dispatch);
    }
)(TreeItem);

function TreeItemHeader({name, nodeType, isUnfolded, onClick}: {
    name: string
    nodeType: NodeType,
    isUnfolded: boolean,
    onClick: () => void
}) {
    let itemClass = "icon fa fa-file";
    let toggle = null;
    if (nodeType === NodeType.Folder) {
        itemClass = "icon fa fa-folder"

        let toggleClassName = "toggle ";
        if (isUnfolded) {
            toggleClassName += "fa fa-caret-down"
        } else {
            toggleClassName += "fa fa-caret-right"
        }
        toggle = <span className={toggleClassName}></span>
    }

    return <div className="tree-item-header" onClick={onClick}>
        {toggle}
        <span className={itemClass}></span>
        <span className="name">{name}</span>
    </div>
}
