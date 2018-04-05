import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button, Icon, Row, Col } from 'antd';
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
                console.log('Received values of form: ', values);
            }
        });
    }
    checkUsername = (rule, value, callback) => {
        if (value && (value.length > 10 || value.length < 4)) {
            callback("长度错误：用户名应为4-10个字符");
        } else {
            fetch(`${config.server}/checkusername`, {
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
                    callback(json.msg);
                } else {
                    callback();
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
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="LogupForm">
                <Card
                    title={<h2>忘记密码</h2>}
                >
                <Form style={{maxWidth: 500, margin: '0 auto'}} onSubmit={this.handleSubmit} className="login-form">
                    <FormItem
                        label="用户名"
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: '请输入确认密码!' }]
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="2-10位字符的用户名" />
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
                                <Button>获取验证码</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem
                        label="新密码"
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