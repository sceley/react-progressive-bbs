import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Form, Input, Button, Icon } from 'antd';
const FormItem = Form.Item;
class LoginForm extends Component {
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="LoginForm">
                <Form onSubmit={this.handleSubmit} className="login-form">
                    <FormItem
                        label="账号"
                    >
                        {getFieldDecorator('userName', {
                            rules: [{ required: true, message: 'Please input your username!' }],
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名/邮箱" />
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
                    <FormItem>
                        <div>
                            <Link to="/forgotpassword" className="login-form-forgot">忘记密码</Link>
                        </div>
                        <div>
                            <Button type="primary" htmlType="submit">
                                登陆
                            </Button>
                        </div>
                        <Link to="/logup">现在注册!</Link>
                    </FormItem>
                </Form>
            </div>
        );
    }
};
const Login = Form.create()(LoginForm);
export default Login;