import { logger } from '../../../common/logger';
import * as React from 'react';
import { TreeNode } from "./tree"

import './tree.less';

interface TreeItemProps {
    item: TreeNode;
    onItemClick(item: TreeNode): void;
}

interface TreeItemStat {

}

export class TreeItem extends React.Component<TreeItemProps, TreeItemStat>{
    constructor(props: TreeItemProps) {
        super(props);
    }

    componentWillReceiveProps(nextProps: TreeItemProps, nextContext: any): void {
        logger.ui(`TreeItem:componentWillReceiveProps nextProps=${nextProps} nextContext=${nextContext}`,nextProps,nextContext);
    }

    render(): JSX.Element {
        const item = this.props.item;

        let className = "tree-item";
        if (item.isFolder()) {
            className += " container";
        } else {
            className += " single";
        }

        if (item.isSelected) {
            className += " selected";
        }

        let children = null;

        if (item.children && item.children.length != 0) {
            if (item.isUnfolded) {
                children = <ol className="tree-item-children">
                    {item.children.map((item, i) => <TreeItem item={item} onItemClick={this.props.onItemClick} key={i} />)}
                </ol>
            }
        }

        return <li className={className}>
            <TreeItemHeader {...this.props} />
            {children}
        </li>
    }
}

interface TreeItemHeaderProps {
    item: TreeNode;
    onItemClick(item: TreeNode): void;
}

interface TreeItemHeaderState {

}

export class TreeItemHeader extends React.Component<TreeItemHeaderProps, TreeItemHeaderState>{
    constructor(props: TreeItemHeaderProps) {
        super(props);

    }

    onClick = () => {
        this.props.onItemClick(this.props.item);
    }

    render() {
        let itemClass = "icon fa fa-file";
        let toggle = null;
        if (this.props.item.isFolder()) {
            itemClass = "icon fa fa-folder"

            let toggleClassName = "toggle ";
            if (this.props.item.isUnfolded) {
                toggleClassName += "fa fa-caret-down"
            } else {
                toggleClassName += "fa fa-caret-right"
            }
            toggle = <span className={toggleClassName}></span>
        }

        return <div className="tree-item-header" onClick={this.onClick}>
            {toggle}
            <span className={itemClass}></span>
            <span className="name">{this.props.item.name}</span>
        </div>
    }
}