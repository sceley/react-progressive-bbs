import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, Layout, Card, Button } from 'antd';
import Tab from '../common/Tab';
import Profile from '../common/Profile';
import NotRepTopic from '../common/NotRepTopic';
import config from '../config';
const { TabPane } = Tabs;
const { Content, Sider } = Layout;
export default class Container extends Component {
    state = {
        user: ''
    }
    componentDidMount = () => {
        fetch(`${config.server}/api/user/info`, {
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
                    user: json.user
                });
            }
        });
    }
    render() {
        return (
            <div className="Container">
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, marginRight: 24, minHeight: 280 }}>
                        <Tabs defaultActiveKey="1">
                            <TabPane tab="全部" key="1">
                                <Tab tab=""/>
                            </TabPane>
                            <TabPane tab="技术" key="2">
                                <Tab tab="tech"/>
                            </TabPane>
                            <TabPane tab="生活" key="3">
                                <Tab tab="life"/>
                            </TabPane>
                        </Tabs>
                    </Content>
                    <Sider width={250} style={{ background: '#f0f2f5' }}>
                        <Profile user={this.state.user}/>
                        
                        <Card
                            style={{ marginTop: '24px' }}
                        >
                            <Link to="/topic/create">
                                <Button type="primary" style={{ width: '100%' }}>发表话题</Button>
                            </Link>
                        </Card>
                        <NotRepTopic style={{marginTop: 24}}/>
                    </Sider>
                </Layout>
            </div>
        );
    }
}