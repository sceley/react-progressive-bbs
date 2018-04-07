import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button, Icon, Row, Col, message } from 'antd';
import config from '../config';
const FormItem = Form.Item;
class LogupForm extends Component {
    state = {
        confirmDirty: false
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
                fetch(`${config.server}/api/logup`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(values)
                }).then(res => {
                    if (res.ok) {
                        return res.json();
                    }
                }).then(json => {
                    if (json && !json.err) {
                        message.info(json.msg);
                        this.props.history.push('/login');
                    } else {
                        message.error(json.msg);
                    }
                });
            }
        });
    }
    checkUsername = () => {
        const form = this.props.form;
        const value = form.getFieldValue("username");
        if (!(value && value.length <= 10 && value.length >= 2)) {
            form.setFields({ username: { errors: [new Error("用户名应为2-10个字符")] } });
        } else {
            fetch(`${config.server}/api/checkusername`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: value
                })
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
            }).then(json => {
                if (json && json.err) {
                    form.setFields({ username: { errors: [new Error(json.msg)] } });
                }
            });
        }
    }
    validateToNextPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && this.state.confirmDirty) {
            form.validateFields(['confirm'], { force: true });
        }
        if (!(value && value.length >= 6 && value.length <= 16)) {
            callback('密码应为6-16个字符');
        } else {
            callback();
        }
    }
    compareToFirstPassword = (rule, value, callback) => {
        const form = this.props.form;
        if (value && value !== form.getFieldValue('password')) {
            callback('两次输入的密码不一样!');
        } else {
            callback();
        }
    }
    handleConfirmBlur = (e) => {
        const value = e.target.value;
        this.setState({ confirmDirty: this.state.confirmDirty || !!value });
    }
    checkEmail = () => {
        const form = this.props.form;
        let email = form.getFieldValue('email');
        let pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!(email && pattern.test(email))) {
            form.setFields({ email: { errors: [new Error("邮箱格式不正确")] } });
            return;
        }
        fetch(`${config.server}/api/checkemail`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && json.err) {
                form.setFields({ email: { errors: [new Error(json.msg)] } });
            }
        });
    }
    getCaptcha = () => {
        const form = this.props.form;
        let email = form.getFieldValue('email');
        let pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!(email && pattern.test(email))) {
            form.setFields({ email: { errors: [new Error("邮箱格式不正确")] } });
            return;
        }
        fetch(`${config.server}/api/getcaptcha`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email
            })
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && json.err) {
                message.error(json.msg);
            }
        });
    }
    checkCaptcha = () => {
        const form = this.props.form;
        const captcha = form.getFieldValue("captcha");
        const email = form.getFieldValue("email");
        let pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!(email && pattern.test(email))) {
            form.setFields({ email: { errors: [new Error("邮箱格式不正确")] } });
            return;
        }
        if (!(captcha && captcha.length === 6)) {
            form.setFields({ captcha: { errors: [new Error("验证码应为6个字符")] } });
        } else {
            fetch(`${config.server}/api/checkcaptcha`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    email: email,
                    captcha: captcha
                })
            }).then(res => {
                if (res.ok) {
                    return res.json();
                }
            }).then(json => {
                if (json && json.err) {
                    form.setFields({ captcha: { errors: [new Error(json.msg)] } });
                }
            });
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="LogupForm">
                <Card
                    title={<h2>注册</h2>}
                >
                <Form style={{ maxWidth: 500, margin: '0 auto'}} onSubmit={this.handleSubmit} className="login-form">
                    <FormItem
                        label="用户名"
                    >
                        {getFieldDecorator('username', {
                            rules: [{ 
                                required: true, message: '请输入用户名!' 
                            }]
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="2-10位字符的用户名" onBlur={this.checkUsername} />
                        )}
                    </FormItem>
                    <FormItem
                        label="邮箱"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: '邮箱格式不正确!'
                            }, {
                                required: true, message: '请输入邮箱!'
                            }]
                        })(
                            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" onBlur={this.checkEmail} />
                        )}
                    </FormItem>
                    <FormItem
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{ 
                                required: true, message: '请输入密码!' 
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
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="确认密码" onBlur={this.handleConfirmBlur} />
                        )}
                    </FormItem>
                    <FormItem
                        label="邮箱验证码"
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ 
                                        required: true, message: '请输入验证码!' 
                                    }]
                                })(
                                    <Input prefix={<Icon type="code-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="6位字符的验证码" onBlur={this.checkCaptcha}/>
                                )}
                            </Col>
                            <Col span={12}>
                                <Button onClick={this.getCaptcha}>获取验证码</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <div style={{textAlign: 'center'}}>
                            <Button type="primary" htmlType="submit">
                                注册
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