import React, { Component } from 'react';
import { Card, Input, Button, Form, Select, Icon, Modal, Upload, message, Layout } from 'antd';
import Editor from '../common/Editor';
import config from '../config';
const FormItem = Form.Item;
const Option = Select.Option;
const { Content, Sider } = Layout;
class CreateTopicForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let body = this.refs.editor.getValue();
                if(body) {
                    values.body = body;
                } else {
                    return;
                }
                fetch(`${config.server}/api/topic/create`, {
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
                        this.props.history.push('/');
                        message.info(json.msg);
                    }
                });
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="CreateTopicForm">
                <Layout>
                    <Content style={{ background: '#fff', padding: 24, marginRight: 24, minHeight: 280 }}>
                        <Card
                            title={<h2>发表文章</h2>}
                        >
                            <Form onSubmit={this.handleSubmit}>
                                <FormItem
                                    label="板块"
                                >
                                    {getFieldDecorator('tab', {
                                        rules: [{
                                            required: true, message: '请选择板块!',
                                        }],
                                    })(
                                        <Select>
                                            <Option value="tech">技术</Option>
                                            <Option value="life">生活</Option>
                                        </Select>
                                    )}
                                </FormItem>
                                <FormItem
                                    label="标题"
                                >
                                    {getFieldDecorator('title', {
                                        rules: [{
                                            required: true, message: '请输入标题!',
                                        }],
                                    })(
                                        <Input placeholder="标题" />
                                    )}
                                </FormItem>
                                <FormItem
                                    label={<span className="content-label">内容</span>}
                                >
                                    <Editor ref="editor" />
                                </FormItem>
                                <FormItem>
                                    <div style={{ textAlign: 'center' }}>
                                        <Button type="primary" htmlType="submit">
                                            发表
                                        </Button>
                                    </div>
                                </FormItem>
                            </Form>
                        </Card>
                    </Content>
                    <Sider width={250} style={{ background: '#f0f2f5' }}>
                        <Card
                            title={<h4>说明</h4>}
                        >
                            <ul className="statement">
                                <li>支持Markdown语法</li>
                                <li>点击图片图标可上传图片</li>
                            </ul>
                        </Card>
                    </Sider>
                </Layout>
            </div>
        );
    }
};
const CreateTopic = Form.create()(CreateTopicForm);
export default CreateTopic;