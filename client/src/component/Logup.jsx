import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Icon, Row, Col } from 'antd';
const FormItem = Form.Item;
class LogupForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="LogupForm">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem
                        label="用户名"
                    >
                        {getFieldDecorator('username', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="2-10位字符的用户名" />
                        )}
                    </FormItem>
                    <FormItem
                        label="邮箱"
                    >
                        {getFieldDecorator('email', {
                            rules: [{
                                type: 'email', message: 'The input is not valid E-mail!',
                            }, {
                                required: true, message: 'Please input your E-mail!',
                            }],
                        })(
                            <Input prefix={<Icon type="mail" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="邮箱" />
                        )}
                    </FormItem>
                    <FormItem
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{ required: true, message: 'Please input your Password!' }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="6-16位字符的密码" />
                        )}
                    </FormItem>
                    <FormItem
                        label="邮箱验证码"
                    >
                        <Row gutter={8}>
                            <Col span={12}>
                                {getFieldDecorator('captcha', {
                                    rules: [{ required: true, message: 'Please input the captcha you got!' }],
                                })(
                                    <Input prefix={<Icon type="code-o" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="6位字符的验证码" />
                                )}
                            </Col>
                            <Col span={12}>
                                <Button>获取验证码</Button>
                            </Col>
                        </Row>
                    </FormItem>
                    <FormItem>
                        <div>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                注册
                            </Button>
                        </div>
                        
                        <Link to="/login">登陆!</Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
};
const Logup = Form.create()(LogupForm);
export default Logup;