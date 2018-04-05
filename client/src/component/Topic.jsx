import React, { Component } from 'react';
import { Layout, List, Avatar, Card, Button, message, Icon } from 'antd';
import moment from 'moment';
import Editor from '../common/Editor';
import config from '../config';
import Markdown from 'markdown-it';
import hljs from 'highlightjs';
import 'highlightjs/styles/atom-one-light.css';
import NotRepTopic from '../common/NotRepTopic';
import Profile from '../common/Profile';
const { Content, Sider } = Layout;
const md = new Markdown({
    highlight: function (str, lang) {
        if (lang && hljs.getLanguage(lang)) {
            try {
                return '<pre class="hljs"><code>' +
                    hljs.highlight(lang, str, true).value +
                    '</code></pre>';
            } catch (__) { }
        }
        return '<pre class="hljs"><code>' + md.utils.escapeHtml(str) + '</code></pre>';
    }
});
const Title = (props) => (
    <div className="topic-title">
        <h2>
            {props.topic.title}
            <a onClick={props.handleCollect}>
                {
                    props.collected ? <Icon style={{ float: 'right' }} type="heart" />:<Icon style={{float: 'right'}} type="heart-o" />
                }
                
            </a>
        </h2>
        <ul className="item-list">
            <li>
                <em>
                    <span className="item-label">作者：</span>
                    {props.topic.author}
                </em>
            </li>
            <li>
                <em>
                    <span className="item-label">时间：</span>
                    {moment(props.topic.createAt).format('YYYY-MM-DD HH:SS')}
                </em>
            </li>
            <li>
                <em>
                    <span className="item-label">板块：</span>
                    {
                        props.topic.tab == 'tech'?"技术":"生活"
                    }
                </em>
            </li>
        </ul> 
    </div>
);
export default class Topic extends Component {
    state = {
        topic: '',
        comments: [],
        user: '',
        collected: ''
    }
    componentWillMount = () => {
        let id = this.props.match.params.id
        fetch(`${config.server}/api/topic/${id}`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.token
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                this.setState({
                    topic: json.topic,
                    comments: json.comments,
                    collected: json.collected
                });
                this.pullUserInfo(json.topic.uid);
            }
        });
    }
    pullUserInfo = (id) => {
        fetch(`${config.server}/api/user/${id}/info`)
        .then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                this.setState({
                    user: json.user
                });
            }
        });
    }
    handleSubmit = () => {
        let id = this.props.match.params.id;
        let body = this.refs.editor.getValue();
        let value = {
            body: body
        };
        fetch(`${config.server}/api/topic/${id}/comment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-access-token': localStorage.token
            },
            body: JSON.stringify(value)
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                message.info(json.msg);
            }
        });
    }
    handleCollect = () => {
        let id = this.props.match.params.id;
        fetch(`${config.server}/api/topic/${id}/collect`, {
            method: 'GET',
            headers: {
                'x-access-token': localStorage.token
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                message.info(json.msg);
            } else {
                message.error(json.msg);
            }
        });
    }
    render() {
        return (
            <div className="Tab">
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, marginRight: 24, minHeight: 280 }}>
                        <Card
                            title={<Title handleCollect={this.handleCollect} topic={this.state.topic} collected={this.state.collected} />}
                        >
                            <div dangerouslySetInnerHTML={{
                                __html: md.render(this.state.topic.body || '')
                            }} />
                        </Card>
                        <Card
                            title={<div>{this.state.comments.length}个回复</div>}
                            style={{ marginTop: 24 }}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.comments}
                                bordered={true}
                                renderItem={item => (
                                    <List.Item
                                        actions={[<span>{moment(item.CreateAt).format("YYYY-MM-DD HH:MM")}</span>]}
                                    >
                                        <List.Item.Meta
                                            avatar={<Avatar src={item.avatar} />}
                                            description={<div dangerouslySetInnerHTML={{
                                                __html: md.render(item.body || '')
                                            }} />}
                                        />
                                    </List.Item>
                                )}
                            />
                        </Card>
                        <div style={{ marginTop: 24 }}>
                            <Editor ref="editor" />
                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                <Button onClick={this.handleSubmit} type="primary">回复</Button>
                            </div>
                            
                        </div>
                    </Content>
                    <Sider width={250} style={{ background: '#f0f2f5' }}>
                        <Profile user={this.state.user}/>
                        <NotRepTopic style={{ marginTop: 24 }} />
                    </Sider>
                </Layout>
            </div>
        );
    }
};