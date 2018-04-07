import React, { Component } from 'react';
import CodeMirror from 'codemirror';
import { Button, Icon, Modal, Upload } from 'antd';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/markdown/markdown.js';
import 'codemirror/theme/shadowfox.css';
import config from '../config';
export default class Editor extends Component {
    state = {
        visible: false
    }
    componentDidMount = () => {
        this.editor = CodeMirror.fromTextArea(this.refs.editor, {
            lineNumbers: true,
            mode: 'markdown',
            theme: 'shadowfox'
        });
    }
    showModal = () => {
        this.setState({
            visible: true
        });
    }
    handleCancel = () => {
        this.setState({
            visible: false
        });
    }
    handleUpload = (e) => {
        let body = new FormData();
        body.append('image', e.file);
        fetch(`${config.server}/api/upload/image`, {
            method: 'POST',
            headers: {
                'x-access-token': localStorage.token
            },
            body: body
        }).then(res => {
            if (res.ok) {
                return res.json();
            }
        }).then(json => {
            if (json && !json.err) {
                this.setState({
                    visible: false
                });
                let data = this.getValue() + `![${e.file.name}](${json.url})`;
                this.setValue(data);
            }
        });
    }
    getValue = () => this.editor.getValue();
    setValue = (value) => this.editor.setValue(value);
    render () {
        return (
            <div className="Editor">
                <ul className="editor-tool-bar">
                    <li className="tool-item">
                        <a onClick={this.showModal}>
                            <Icon type="picture" />
                        </a>
                    </li>
                </ul>
                <textarea ref="editor" rows="10"></textarea>
                <Modal
                    title="图片上传"
                    visible={this.state.visible}
                    onCancel={this.handleCancel}
                    footer={null}
                    bodyStyle={{ textAlign: 'center' }}
                >
                    <Upload
                        accept="image/*"
                        customRequest={this.handleUpload}
                        showUploadList={false}
                    >
                        <Button>
                            <Icon type="upload" />上传图片
						</Button>
                    </Upload>
                </Modal>
            </div>
        );
    }
};    
/* <li className="tool-item">
    <a onClick={this.showLinkModal}>
        <Icon type="link" />
    </a>
</li> */