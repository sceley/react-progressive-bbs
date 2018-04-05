import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Form, Input, Button, Icon, message } from 'antd';
import config from '../config';
const FormItem = Form.Item;
class LoginForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFieldsAndScroll((err, values) => {
            if (!err) {
               fetch(`${config.server}/api/login`, {
                   method: 'POST',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(values)
               }).then(res => {
                   if (res.ok)
                        return res.json();
               }).then(json => {
                   if (json && !json.err) {
                        localStorage.token = json.token;
                        this.props.history.push('/');
                   } else {
                       message.error(json.msg);
                   }
               });
            }
        });
    }
    checkPassword = (rule, value, callback) => {
        if (!(value && value.length >= 6 && value.length <= 16)) {
            callback('密码应为6-16位字符');
        } else {
            callback();
        }
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="LoginForm">
                <Card
                    title={<h2>登陆</h2>}
                >
                <Form style={{maxWidth: 500, margin: '0 auto'}} onSubmit={this.handleSubmit} className="login-form">
                    <FormItem
                        label="账号"
                    >
                        {getFieldDecorator('account', {
                            rules: [{ 
                                required: true, message: '请输入账号!' 
                            }]
                        })(
                            <Input prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="用户名/邮箱" />
                        )}
                    </FormItem>
                    <FormItem
                        label="密码"
                    >
                        {getFieldDecorator('password', {
                            rules: [{ 
                                required: true, message: '请输入密码!' 
                            }, {
                                validator: this.checkPassword
                            }],
                        })(
                            <Input prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} type="password" placeholder="6-16位字符的密码" />
                        )}
                    </FormItem>
                    <FormItem>
                        <div>
                                <Link to="/forgotpassword" className="login-form-forgot">忘记密码</Link>
                        </div>
                        <div style={{textAlign: 'center'}}>
                            <Button type="primary" htmlType="submit">
                                登陆
                            </Button>
                        </div>
                        <div style={{fontSize: 16}}>
                            其他登陆：
                            <a href={`${config.server}/api/auth/github`}><Icon type="github" /></a>
                        </div>
                        <div>
                            <Link to="/logup">现在注册!</Link>
                        </div>     
                    </FormItem>
                </Form>
                </Card>
            </div>
        );
    }
};
const Login = Form.create()(LoginForm);
export default Login;