import React, { Component } from 'react';
import { Link } from 'react-router-dom';
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
            {
                props.me_id ?
                    <div style={{ float: 'right', fontSize: 16 }}>
                        {
                            props.me_id === props.user.id ?
                                <a style={{ marginLeft: 5 }} onClick={props.handleDeleteTopic}>
                                    <Icon type="delete" />
                                </a>
                                :
                                <a onClick={props.handleCollect}>
                                    {
                                        props.collected ?
                                            <Icon type="heart" />
                                            :
                                            <Icon type="heart-o" />
                                    }
                                </a>
                        }
                    </div>
                    :
                    null
            }
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
                    {moment(props.topic.createAt).format('YYYY-MM-DD HH:mm:ss')}
                </em>
            </li>
            <li>
                <em>
                    <span className="item-label">板块：</span>
                    {
                        props.topic.tab === 'tech' ? "技术" : "生活"
                    }
                </em>
            </li>
            <li>
                <em>
                    <span className="item-label">浏览数：</span>
                    {props.topic.visit_count}
                </em>
            </li>
            <li>
                <em>
                    <span className="item-label">收藏数：</span>
                    {props.topic.collects_count}
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
        collected: '',
        me_id: ''
    }
    componentDidMount = () => {
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
                    collected: json.collected,
                    me_id: json.me_id
                });
                this.pullUserInfo(json.topic.uid);
            } else {
                message.error(json.msg);
            }
        });
    }
    componentWillReceiveProps = this.componentDidMount;
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
                } else {
                    message.error(json.msg);
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
                this.setState({
                    comments: [...this.state.comments, json.comment]
                });
                this.refs.editor.setValue('');
            } else {
                message.error(json.msg);
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
                this.setState({
                    collected: !this.state.collected
                });
            } else {
                message.error(json.msg);
            }
        });
    }
    handleEnter = (author) => {
        this.refs.editor.setValue(`@${author} `);
    }
    handleDeleteTopic = () => {
        let id = this.state.topic.id;
        fetch(`${config.server}/api/topic/${id}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': localStorage.token
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                this.props.history.push('/');
            }
        });
    }
    handleDeleteComment = (cid) => {
        let tid = this.state.topic.id;
        fetch(`${config.server}/api/topic/${tid}/comment/${cid}`, {
            method: 'DELETE',
            headers: {
                'x-access-token': localStorage.token
            }
        }).then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                let comments = this.state.comments;
                comments = comments.filter(comment => {
                    return comment.id !== cid;
                });
                this.setState({
                    comments: comments
                });
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
                            title={
                                <Title
                                    handleCollect={this.handleCollect}
                                    me_id={this.state.me_id}
                                    user={this.state.user}
                                    topic={this.state.topic}
                                    collected={this.state.collected}
                                    handleDeleteTopic={this.handleDeleteTopic}
                                />}
                        >
                            <div dangerouslySetInnerHTML={{
                                __html: md.render(this.state.topic.body || '')
                            }} />
                        </Card>
                        <Card
                            title={<div>{this.state.topic.comments_count}个回复</div>}
                            style={{ marginTop: 24 }}
                        >
                            <List
                                itemLayout="horizontal"
                                dataSource={this.state.comments}
                                bordered={true}
                                renderItem={item => (
                                    <List.Item
                                        actions={
                                                this.state.me_id ?
                                                [
                                                    <a href="#editor" onClick={() => this.handleEnter(item.author)}>
                                                        <Icon type="enter" />
                                                    </a>,
                                                    item.uid === this.state.me_id ?
                                                    <a onClick={() => this.handleDeleteComment(item.id)}>
                                                        <Icon type="delete" />
                                                    </a>
                                                    :null
                                                ]
                                                :
                                                []
                                        }
                                    >
                                        <div className="list-item-meta">
                                            <Link to={`/user/${item.uid}`}>
                                                <Avatar style={{ marginRight: 16 }} src={item.avatar} />
                                            </Link>
                                            <div>
                                                <div style={{ marginBottom: 16 }}>
                                                    <em>
                                                        <span className="item-label">作者：</span>
                                                        {item.author}
                                                    </em>
                                                    <em style={{ marginLeft: 16 }}>
                                                        <span className="item-label">时间：</span>
                                                        {moment(item.createAt).format("YYYY-MM-DD HH:mm:ss")}
                                                    </em>
                                                </div>
                                                <div dangerouslySetInnerHTML={{
                                                    __html: md.render(item.body || '')
                                                }} />
                                            </div>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        </Card>
                        <div style={{ marginTop: 24 }}>
                            <div id="editor">
                                <Editor ref="editor" />
                            </div>
                            <div style={{ marginTop: 24, textAlign: 'center' }}>
                                <Button onClick={this.handleSubmit} type="primary">回复</Button>
                            </div>
                        </div>
                    </Content>
                    <Sider width={250} style={{ background: '#f0f2f5' }}>
                        <Profile user={this.state.user} />
                        <NotRepTopic style={{ marginTop: 24 }} />
                    </Sider>
                </Layout>
            </div>
        );
    }
};