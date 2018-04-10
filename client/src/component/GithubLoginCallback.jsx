import React, { Component } from 'react';
export default class GithubLoginCallback extends Component {
    componentWillMount = () => {
        let token = this.props.location.search.slice(1).split('=')[1];
        localStorage.token = token;
        this.props.history.push('/');
    }
    render() {
        return (
            <div className="GithubLoginCallback">
            </div>
        );
    }
}