import * as React from 'react';
import './tree.less';
import * as fs from 'fs';

export interface TreeData {
    name: string;
    path: string;
    stats: fs.Stats;
    content: string;
    isFolder: boolean;
    isLoaded: boolean;
    isOpen: boolean;
    isSelected: boolean;
    children: TreeData[];
}

export interface TreeProps {
    items: TreeData[];
    onItemClick(item: TreeData): void;
}

interface TreeState {

}

export class Tree extends React.Component<TreeProps, TreeState>{
    selectedItems: TreeData[] = [];

    constructor(props: TreeProps) {
        super(props);
    }

    componentWillReceiveProps(nextProps: TreeProps, nextContext: any): void {

    }

    onItemClick = (item: TreeData) => {
        item.isOpen = !item.isOpen;
        item.isSelected = true;

        if (item.isSelected) {
            this.selectedItems.map((i) => {
                if (item !== i) {
                    i.isSelected = false;
                }
            });
            this.selectedItems.length = 0;

            this.selectedItems.push(item);
        }

        this.props.onItemClick(item);
    }

    render() {
        return <ol className="tree">
            {
                this.props.items.map((item, i) => {
                    return <TreeItem item={item} onItemClick={this.onItemClick} key={i}></TreeItem>
                })
            }
        </ol>
    }
}

interface TreeItemProps {
    item: TreeData;
    onItemClick(item: TreeData): void;
}

interface TreeItemStat {

}


class TreeItem extends React.Component<TreeItemProps, TreeItemStat>{
    constructor(props: TreeItemProps) {
        super(props);
    }

    render(): JSX.Element {
        const item = this.props.item;

        let className = "tree-item";
        if (item.isFolder) {
            className += " container";
        } else {
            className += " single";
        }

        if (item.isSelected) {
            className += " selected";
        }

        let children = null;

        if (item.children && item.children.length != 0) {
            if (item.isOpen) {
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
    item: TreeData;
    onItemClick(item: TreeData): void;
}

interface TreeItemHeaderState {

}

class TreeItemHeader extends React.Component<TreeItemHeaderProps, TreeItemHeaderState>{
    constructor(props: TreeItemHeaderProps) {
        super(props);

    }

    onClick = () => {
        this.props.onItemClick(this.props.item);
    }

    render() {
        let itemClass = "icon fa fa-file";
        let toggle = null;
        if (this.props.item.isFolder) {
            itemClass = "icon fa fa-folder"

            let toggleClassName = "toggle ";
            if (this.props.item.isOpen) {
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