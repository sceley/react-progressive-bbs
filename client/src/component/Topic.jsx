import React, { Component } from 'react';
import { List, Avatar, Card } from 'antd';
import Editor from '../common/Editor';
export default class Topic extends Component {
    state = {
        topics: []
    }
    componentWillMount = () => {
        console.log();
    }
    render() {
        return (
            <div className="Tab">
                <Card
                    title={this.props.match.params.id}>
                    
                </Card>
                <Editor/>
            </div>
        );
    }
};