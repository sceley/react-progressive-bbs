import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Container from './component/Container';
import './App.css';

class App extends Component {
	render() {
		return (
			<div className="App">
				<Router>
					<Route path="/" component={Container} />
				</Router>
			</div>
		);
	}
}

export default App;
