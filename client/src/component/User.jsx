import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Layout, Avatar, List, Tag } from 'antd';
import config from '../config';
import moment from 'moment';
import NotRepTopic from '../common/NotRepTopic';
import Profile from '../common/Profile';
const { Content, Sider } = Layout;
export default class User extends Component {
    state = {
        user: '',
        topics: [],
        collect_topics: []
    }
    componentWillMount = () => {
        let id = this.props.match.params.id;
        fetch(`${config.server}/api/user/${id}`)
            .then(res => {
                if (res.ok)
                    return res.json();
            }).then(json => {
                if (json && !json.err) {
                    this.setState({
                        user: json.user,
                        topics: json.topics,
                        collect_topics: json.collect_topics
                    });
                }
            });
    }
    render() {
        return (
            <div className="User">
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, marginRight: 24, minHeight: 280 }}>
                        <Card
                            title="他发表的话题"
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.topics}
                                bordered={true}
                                renderItem={item => (
                                    <List.Item actions={[<span>{moment(item.CreateAt).format("YYYY-MM-DD hh:mm:ss")}</span>]}>
                                        <List.Item.Meta
                                            avatar={
                                                <Link to={`/user/${item.uid}`}>
                                                    <Avatar src={item.avatar} />
                                                </Link>
                                            }
                                            title={
                                                <Link to={`/topic/${item.id}`}>
                                                    <Tag color="#87d068">
                                                        {item.tab === 'tech' ? "技术" : "生活"}
                                                    </Tag>
                                                    {item.title}
                                                </Link>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                        <Card
                            title="他收藏的话题"
                            style={{marginTop: 24}}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.collect_topics}
                                bordered={true}
                                renderItem={item => (
                                    <List.Item actions={[<span>{moment(item.CreateAt).format("YYYY-MM-DD hh:mm:ss")}</span>]}>
                                        <List.Item.Meta
                                            avatar={
                                                <Link to={`/user/${item.id}`}>
                                                    <Avatar src={item.avatar} />
                                                </Link>
                                            }
                                            title={
                                                <Link to={`/topic/${item.id}`}>
                                                    <Tag color="#87d068">
                                                        {item.tab === 'tech' ? "技术" : "生活"}
                                                    </Tag>
                                                    {item.title}
                                                </Link>
                                            }
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Content>
                    <Sider width={250} style={{ background: '#f0f2f5' }}>
                        <Profile user={this.state.user} />
                        <NotRepTopic style={{ marginTop: 24 }} />
                    </Sider>
                </Layout>
            </div>
        );
    }
}