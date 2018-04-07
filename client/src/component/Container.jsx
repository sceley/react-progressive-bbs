import React, { Component } from 'react';
import { Route, Switch, Link } from 'react-router-dom';
import { Layout, Input } from 'antd';
import Home from './Home';
import Login from './Login';
import Logup from './Logup';
import CreateTopic from './CreateTopic';
import ForgotPass from './ForgotPass';
import Topic from './Topic';
import LoginCallback from './LoginCallback';
import Setting from './Setting';
import User from './User';
import config from '../config';
import './Container.css';
const { Header, Content, Footer } = Layout;
const Search = Input.Search;
export default class Container extends Component {
    state = {
        login: false
    }
    handleLogout = () => {
        delete localStorage.token;
        this.setState({
            login: false
        });
        this.props.history.push('/');
    }
    componentDidMount = () => {
        if (localStorage.token) {
            this.setState({
                login: true
            });
        }
    }
    handleSearch = (content) => {
        fetch(`${config.server}/api/search?content=${content}`)
        .then(res => {
            if (res.ok)
                return res.json();
        }).then(json => {
            if (json && !json.err) {
                if (json.result) {
                    this.props.history.push(`/${json.field}/${json.result.id}`);
                }
            }
        });
    }
    componentWillReceiveProps = this.componentDidMount;
    render () {
        return (
            <div className="Container">
                <Layout>
                    <Header>
                        <div className="logo-wrapper">
                            <Link to="/">
                                <img className="logo" src="//o4j806krb.qnssl.com/public/images/cnodejs_light.svg" alt="logo" />
                            </Link>
                        </div>
                        <div className="media-left">一个分享与发现的地方</div>
                        <Search
                            placeholder="搜索用户/话题"
                            onSearch={this.handleSearch}
                            enterButton
                            style={{ width: 250 }}
                        />
                        {
                            this.state.login?
                            <ul className="media-right">
                                <li>
                                    <Link to="/setting">
                                        设置
                                    </Link>
                                </li>
                                <li>
                                    <a onClick={this.handleLogout}>
                                        退出
                                    </a>
                                </li>
                            </ul>
                            :
                            <ul className="media-right">
                                <li>
                                    <Link to="/login">
                                        登陆
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/logup">
                                        注册
                                    </Link>
                                </li>
                            </ul>
                        }
                    </Header>
                    <Content style={{ marginTop: '24px', padding: '0 50px' }}>
                        <Switch>
                            <Route exact path={`${this.props.match.url}`} component={Home} />
                            <Route exact path={`${this.props.match.url}login`} component={Login} />
                            <Route path={`${this.props.match.url}login/callback`} component={LoginCallback}/>
                            <Route path={`${this.props.match.url}logup`} component={Logup} />
                            <Route path={`${this.props.match.url}forgotpassword`} component={ForgotPass} />
                            <Route path={`${this.props.match.url}topic/create`} component={CreateTopic} />
                            <Route path={`${this.props.match.url}topic/:id`} component={Topic} />
                            <Route path={`${this.props.match.url}setting`} component={Setting} />
                            <Route path={`${this.props.match.url}user/:id`} component={User} />
                        </Switch>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        ©2018 Created by QinYongLi
                    </Footer>
                </Layout>
            </div>
        );
    }
}