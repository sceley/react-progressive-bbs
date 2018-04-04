import React, { Component } from 'react';
import { Tabs } from 'antd';
import Tab from '../common/Tab';
const { TabPane } = Tabs;
export default class Container extends Component {
    render() {
        return (
            <div className="Container">
                <Tabs defaultActiveKey="1">
                    <TabPane tab="全部" key="1">
                        <Tab/>
                    </TabPane>
                    <TabPane tab="技术" key="2">
                        <Tab/>
                    </TabPane>
                    <TabPane tab="生活" key="3">
                        <Tab/>
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}