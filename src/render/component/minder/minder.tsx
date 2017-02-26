import * as React from 'react';

export class Minder extends React.Component<undefined, undefined>{
    private kityminder = window['kityminder'] as any;
    private km: any;

    componentDidMount() {
        this.km = new this.kityminder.Minder();

        this.km.renderTo('#kity-minder');
        this.km.importJson({
            "root": {
                "data": {
                    "text": "百度产品",
                    "imageSize": { "width": 270, "height": 129 }
                },
                "children": [
                    { "data": { "text": "新闻" } },
                    { "data": { "text": "网页", "priority": 1 } },
                    { "data": { "text": "贴吧", "priority": 2 } },
                    { "data": { "text": "知道", "priority": 2 } },
                    { "data": { "text": "音乐", "priority": 3 } },
                    { "data": { "text": "图片", "priority": 3 } },
                    { "data": { "text": "视频", "priority": 3 } },
                    { "data": { "text": "地图", "priority": 3 } },
                    { "data": { "text": "百科", "priority": 3 } },
                    { "data": { "text": "更多", "hyperlink": "http://www.baidu.com/more" } }
                ]
            }
        });
    }

    render() {
        return <div id="kity-minder"></div>
    }
}