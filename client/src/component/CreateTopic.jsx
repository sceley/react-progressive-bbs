import React, { Component } from 'react';
import { Input, Button, Form, Select, Icon, Modal, Upload } from 'antd';
import Editor from '../common/Editor';
const FormItem = Form.Item;
const Option = Select.Option;
class CreateTopicForm extends Component {
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                let body = this.editor.getValue();
                values.body = body;
                console.log('Received values of form: ', values);
            }
        });
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="CreateTopicForm">
                <Form onSubmit={this.handleSubmit}>
                    <FormItem
                        label="板块"
                    >
                        {getFieldDecorator('Tab', {
                            rules: [{
                                required: true, message: 'Please input your password!',
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
                        {getFieldDecorator('Title', {
                            rules: [{
                                required: true, message: 'Please input your E-mail!',
                            }],
                        })(
                            <Input placeholder="标题" />
                        )}
                    </FormItem>
                    <FormItem
                        label={<span className="content-label">内容</span>}
                    >
                        <Editor ref="editor"/>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" htmlType="submit">
                            发表
                        </Button>
                    </FormItem>
                </Form>
            </div>
        );
    }
};
const CreateTopic = Form.create()(CreateTopicForm);
export default CreateTopic;