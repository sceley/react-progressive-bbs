import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Card, Avatar, Icon } from 'antd';
export default class Profile extends Component {
    render() {
        return (
            <div className="Profile">
                <Card
                    title="个人信息"
                    bodyStyle={{textAlign: 'center'}}
                >
                    <ul className="profile-list">
                        <li>
                            <Link to={`/user/${this.props.user.id}`}>
                                <Avatar size="large" src={this.props.user.avatar} />
                            </Link>
                        </li>
                        <li><em>{this.props.user.username}</em></li>
                        <li>
                            <em>
                                {
                                    this.props.user.sex ? <Icon type="man" /> : <Icon type="woman" />
                                }
                            </em>
                        </li>
                        <li><em><Icon type="mail" />{this.props.user.email}</em></li>
                        <li><em>{this.props.user.introduction}</em></li>
                        <li>
                            <em style={{marginRight: 5}}><a href={this.props.user.website}><Icon type="global" /></a></em>
                            <em><a href={`https://github.com/${this.props.user.github}`}><Icon type="github" /></a></em>
                        </li>
                        <li><em><Icon type="environment-o" />{this.props.user.location}</em></li>
                    </ul>
                </Card>
            </div>
        );
    }
}