import React, { Component } from 'react';
import logo from './logo.png';
//import './App.css';
import './css/styles.min.css';
import Chat from "./components/Chat"; 
import Login from "./components/Login"; 
const axios = require('axios');
class App extends Component {
  constructor(props){
	super(props);
	this.state = {
		loggedIn: false,
		username: null
    };
	//don't forget to bind methods JSX is a total weirdo
	this.login = this.login.bind(this);
	this.logout = this.logout.bind(this);
	this.signup = this.signup.bind(this);
  }
  async signup(_username,_password) {
	if(_username == null || _password == null){
		return;
	}
	console.log(`${_username} signed up`);
	let users= null
	try{
		users = await axios.post("http://localhost:4000/users/",{username:_username,password: _password});
		console.log(users.data);
	}catch (e){
		console.log(e);
	}
	if(!users.data.error){
		this.setState({username: _username});	
		this.setState({loggedIn: true});	
	}
		
  }

  async login(_username,_password) {
	console.log(`${_username} logged in`);
	let users= null
	try{
		users = await axios.post("http://localhost:4000/users/login",{username:_username,password: _password});
		console.log(users.data);
	}catch (e){
		console.log(e);
	}
	if(users.data.verified == true){
		this.setState({username: _username});	
		this.setState({loggedIn: true});	
	}
		
  }
  logout(){
	this.setState({username: null});	
	this.setState({loggedIn: false});	
	console.log("logged out!");
  }
  render() {
	let body = null;
	let usernameDisplay = null;	
	if(this.state.username){
		usernameDisplay = (
			<div>
				<button onClick = {e => {this.logout()}}>logout</button>
			</div>
		);
	}
	if(this.state.loggedIn){
		body=<Chat username={this.state.username}/>;
	}else{
		body=<Login login={this.login} signup={this.signup}/>;
	}
    return (
		<div className="App">
			<div className="row mainHeader" style={{height:200}}>
				<div className="col-12">	
				  <img src={logo} className="img-fluid mx-auto d-block" alt="logo" style={{height:80}}/>
				</div>
				<div className="col-12">	
				  <h1 className="text-center">~~New Music Friends~~</h1>
				</div>
			</div>  
			{usernameDisplay}
			{body}
		</div>
    );
  }
}

export default App;
