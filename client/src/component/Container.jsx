import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Link } from 'react-router-dom';
import { Layout, Menu, Input, Button, Card } from 'antd';
import Home from './Home';
import Login from './Login';
import Logup from './Logup';
import CreateTopic from './CreateTopic';
import ForgotPass from './ForgotPass';
import Topic from './Topic';
import './Container.css';
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
export default class Container extends Component {
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
                            placeholder="搜索"
                            onSearch={this.handleSearch}
                            enterButton
                            style={{ width: 250 }}
                        />
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
                    </Header>
                    <Content style={{ marginTop: '24px', padding: '0 50px' }}>
                        <Layout>
                            <Content style={{ background: '#fff', padding: 24, marginRight: 24, minHeight: 280 }}>
                                <Switch>
                                    <Route exact path={`${this.props.match.url}`} component={Home} />
                                    <Route path={`${this.props.match.url}login`} component={Login} />
                                    <Route path={`${this.props.match.url}logup`} component={Logup} />
                                    <Route path={`${this.props.match.url}forgotpassword`} component={ForgotPass} />
                                    <Route path={`${this.props.match.url}topic/create`} component={CreateTopic} />
                                    <Route path={`${this.props.match.url}topic/:id`} component={Topic} />
                                </Switch>
                            </Content>
                            <Sider width={250} style={{ background: '#f0f2f5' }}>
                                <Card 
                                    title="无人回复的话题"
                                >
                                </Card>
                                <Card
                                    style={{marginTop: '24px'}}
                                >
                                    <Link to="/topic/create">
                                        <Button type="primary" style={{width: '100%'}}>发表话题</Button>
                                    </Link>
                                </Card>
                            </Sider>
                        </Layout>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        ©2018 Created by QinYongLi
                    </Footer>
                </Layout>
            </div>
        );
    }
}