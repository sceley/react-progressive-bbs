import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { List, Avatar, Tag } from 'antd';
import config from '../config';
import moment from 'moment';
export default class Tab extends Component {
    state = {
        topics: []
    }
    componentWillMount = () => {
        const tab = this.props.tab;
        fetch(`${config.server}/api/topics?tab=${tab}`)
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
            <div className="Tab">
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.topics}
                    bordered={true}
                    renderItem={item => (
                        <List.Item actions={[<span>{moment(item.createAt).format("YYYY-MM-DD HH:mm:ss")}</span>]}>
                            <List.Item.Meta
                                avatar={
                                    <Link to={`user/${item.uid}`}>
                                        <Avatar src={item.avatar} />
                                    </Link>
                                }
                                title={
                                    <Link to={`/topic/${item.id}`}>
                                        <em style={{marginRight: 16}}>
                                            {`${item.collects_count}/${item.comments_count}/${item.visit_count}`}
                                        </em>
                                        <Tag color="#87d068">
                                            {item.tab === 'tech'?"技术":"生活"}
                                        </Tag>
                                        {item.title}
                                    </Link>
                                }
                            />
                        </List.Item>
                    )}
                />
            </div>
        );
    }
}