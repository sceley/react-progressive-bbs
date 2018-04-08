import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button, Icon, Row, Col, message } from 'antd';
import config from '../config';
const FormItem = Form.Item;
class LogupForm extends Component {
    state = {
        confirmDirty: false,
        seconds: 60,
        visible: true
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                fetch(`${config.server}/api/user/forgotpassword`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then(res => {
                    if (res.ok)
                        return res.json();
                }).then(json => {
                    if (json && !json.err){
                        this.props.history.push('/');
                    } else if (json && json.err)  {
                        message.error(json.msg);
                    }
                });
            }
        });
    }
    checkUsername = () => {
        const form = this.props.form;
        const username = form.getFieldValue('username');
        if (!(username && username.length >= 2 && username.length <= 20)) {
            form.setFields({ username: { errors: [new Error("请输入用户名")] } });
            return;
        } else {
            fetch(`${config.server}/checkusername`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
            });
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        if (value && (value.length < 6 || value.length > 16)) {
            callback('密码应为6-16个字符');
        } else {
            callback();
        }
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('输入的两次密码不一样!');
        } else {
            callback();
        }
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    handleTimer() {
        let timer = setInterval(() => {
            let seconds = this.state.seconds - 1;
            if (seconds <= 0) {
                clearInterval(timer);
                this.setState({
                    seconds: 60,
                    visible: true
                });
            } else {
                this.setState({
                    seconds: seconds,
                    visible: false
                });
            }
        }, 1000);
    }
    getCaptcha = async () => {
        const form = this.props.form;
        const res = await this.checkUsername();
        const username = form.getFieldValue('username');
        if (res && !res.err) {
            fetch(`${config.server}/api/getcaptcha/from/username`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username
                })
            }).then(res => {
                if (res.ok)
                    return res.json();
            }).then(json => {
                if (json && !json.err) {
                    this.handleTimer();
                    console.log(json.msg);
                } else if (json && json.err) {
                    message.error(json.msg);
                }
            });
        } else if (res && res.err) {
            message.error(res.msg);
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="LogupForm">
                <Card
                    title={<h2>忘记密码</h2>}
                >
                <Form style={{maxWidth: 500, margin: '0 auto'}} onSubmit={this.handleSubmit}>
                    <FormItem
                        label="用户名"
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入用户名!' }]
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="2-20位字符的用户名" />
                        )}
                    </FormItem>
                    <FormItem
                        label="邮箱验证码"
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: '请输入验证码!' }]
                                })(
                                    <Input prefix={<Icon type="code-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="6位字符的验证码" />
                                )}
                            </Col>
                            <Col span={12}>
                                {
                                    this.state.visible ?
                                        <Button onClick={this.getCaptcha}>获取验证码</Button>
                                        :
                                        <Button disabled onClick={this.getCaptcha}>{this.state.seconds}</Button>
                                }
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        label="新密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{
                                required: true, message: '请输入新密码!'
                            }, {
                                validator: this.validateToNextPassword
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="6-16位字符的密码" />
                        )}
                    </FormItem>
                    <FormItem
                        label="确认密码"
                    >
                        {getFieldDecorator('confirm', {
                            rules: [{
                                required: true, message: '请输入确认密码!'
                            }, {
                                validator: this.compareToFirstPassword
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" onBlur={this.handleConfirmBlur} placeholder="确认密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <div style={{textAlign: 'center'}}>
                            <Button type="primary" htmlType="submit">
                                找回密码
                            </Button>
                        </div>
                        <Link to="/login">登陆!</Link>
                    </FormItem>
                </Form>
                </Card>
            </div>
        );
    }
};
const Logup = Form.create()(LogupForm);
export default Logup;