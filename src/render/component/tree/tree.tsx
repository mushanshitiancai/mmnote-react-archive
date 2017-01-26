import { logger } from '../../../common/logger';
import { TreeItem } from './tree-item';
import * as React from 'react';
import './tree.less';
import * as fs from 'fs';
import { FSNode } from '../../service/tree-service';

export class TreeNode extends FSNode {
    isSelected: boolean = false;
    isUnfolded: boolean = false;
    children: TreeNode[] = [];

    constructor(node: FSNode) {
        super(node.path, node.stats);
    }
}

export interface TreeProps {
    items: TreeNode[];
    onItemClick(item: TreeNode): void;
}

interface TreeState {
    items: TreeNode[];
}

/**
 * 目录树控件
 * 
 * @export
 * @class Tree
 * @extends {React.Component<TreeProps, TreeState>}
 */
export class Tree extends React.Component<TreeProps, TreeState>{
    selectedItems: TreeNode[] = [];

    constructor(props: TreeProps) {
        super(props);

        this.state = {
            items: this.props.items
        }
    }

    componentWillReceiveProps(nextProps: TreeProps, nextContext: any): void {
        logger.ui(`Tree:componentWillReceiveProps nextProps=${nextProps} nextContext=${nextContext}`,nextProps,nextContext);
        this.setState({
            items: nextProps.items
        });
    }

    onItemClick = (item: TreeNode) => {
        item.isUnfolded = !item.isUnfolded;
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
        this.setState(this.state);
    }

    render() {
        return <ol className="tree">
            {
                this.state.items && this.state.items.map((item, i) => {
                    return <TreeItem item={item} onItemClick={this.onItemClick} key={i}></TreeItem>
                })
            }
        </ol>
    }
}
