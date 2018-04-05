import React, { Component } from 'react';
import { Card, Layout, Icon, Form, Input, Button, Select, message } from 'antd';
import config from '../config';
import NotRepTopic from '../common/NotRepTopic';
import Profile from '../common/Profile';
const FormItem = Form.Item;
const Option = Select.Option;
const { TextArea } = Input;
const { Content, Sider } = Layout;
class SettingForm extends Component {
    state = {
        user: ''
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                fetch(`${config.server}/api/user/info/edit`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'x-access-token': localStorage.token
                    },
                    body: JSON.stringify(values)
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
        });
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
        const { getFieldDecorator } = this.props.form;
        return (
            <Form style={{ maxWidth: 500, margin: '0 auto' }} onSubmit={this.handleSubmit} className="SettingForm">
                <FormItem
                    label="用户名"
                >
                    {getFieldDecorator('username', {
                        rules: [{ required: true, message: '请输入用户名!' }],
                        initialValue: this.state.user.username
                    })(
                        <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名" />
                    )}
                </FormItem>
                <FormItem
                    label="邮箱"
                >
                    {getFieldDecorator('email', {
                        rules: [{
                            type: 'email', message: '邮箱格式不正确!',
                        }, {
                            required: true, message: '请输入邮箱!' 
                        }],
                        initialValue: this.state.user.email
                    })(
                        <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
                    )}
                </FormItem>
                <FormItem
                    label="性别"
                >
                    {getFieldDecorator('sex', {
                        rules: [{
                            required: true, message: '请选择性别!'
                        }], initialValue: this.state.user.sex
                    })(
                        <Select>
                            <Option value={1}>男</Option>
                            <Option value={0}>女</Option>
                        </Select>
                    )}
                </FormItem>
                <FormItem
                    label="地点"
                >
                    {getFieldDecorator('location', {
                        rules: [{
                            required: true, message: '请输入地点!'
                        }], initialValue: this.state.user.location
                    })(
                        <Input prefix={<Icon type="environment-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="地点" />
                    )}
                </FormItem>
                <FormItem
                    label="个人网站"
                >
                    {getFieldDecorator('website', {
                        rules: [{
                            required: true, message: '请输入网站!'
                        }], initialValue: this.state.user.website
                    })(
                        <Input prefix={<Icon type="global" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="个人网站" />
                    )}
                </FormItem>
                <FormItem
                    label="Github"
                >
                    {getFieldDecorator('github', {
                        rules: [{
                            required: true, message: '请输入Github!'
                        }], initialValue: this.state.user.github
                    })(
                        <Input prefix={<Icon type="github" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="github" />
                    )}
                </FormItem>
                <FormItem
                    label="个人简介"
                >
                    {getFieldDecorator('introduction', {
                        rules: [{
                            required: true, message: '请输入个人简介!'
                        }], initialValue: this.state.user.introduction
                    })(
                        <TextArea rows={4} />
                    )}
                </FormItem>
                <FormItem>
                    <div style={{textAlign: 'center'}}>
                        <Button type="primary" htmlType="submit">
                            更改
                        </Button>
                    </div>
                    
                </FormItem>
            </Form>
        );
    }
}

const WrapperSettingForm = Form.create()(SettingForm);
export default class Setting extends Component {
    state = {
        user: ''
    }
    componentWillMount = () => {
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
            <div className="Tab">
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, marginRight: 24, minHeight: 280 }}>
                        <Card
                            title={<h2><Icon style={{marginRight: 5}} type="setting" />信息编辑</h2>}
                        >
                            <WrapperSettingForm/>
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