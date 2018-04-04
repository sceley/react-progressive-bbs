import React, { Component } from 'react';
import { List, Avatar } from 'antd';
export default class Tab extends Component {
    state = {
        topics: []
    }
    render () {
        return (
            <div className="Tab">
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.topics}
                    bordered={true}
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
                                title={<a href="https://ant.design">{item.title}</a>}
                                description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}