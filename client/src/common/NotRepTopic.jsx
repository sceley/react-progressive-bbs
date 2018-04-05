import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, List } from 'antd';
import config from '../config';
export default class NotRepTopic extends Component {
    state = {
        topics: []
    }
    componentWillMount = () => {
        fetch(`${config.server}/api/topics/notreply`)
        .then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                this.setState({
                    topics: json.topics
                });
            }
        });
    }
    render () {
        return (
            <div className="NotRepTopic" style={this.props.style}>
                <Card
                    title="无人回复的话题"
                >
                    <List
                        size="small"
                        split={false}
                        dataSource={this.state.topics}
                        renderItem={item => (
                            <List.Item>
                                <Link style={{ color: 'rgba(0, 0, 0, 0.65)' }} to={`topic/${item.id}`}>{item.title}</Link>
                            </List.Item>
                        )}
                    />
                </Card>
            </div>
        );
    }
}