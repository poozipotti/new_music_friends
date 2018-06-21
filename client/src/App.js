import React, { Component } from 'react';
import logo from './logo.png';
//import './App.css';
import './css/styles.min.css';
import Chat from "./components/Chat"; 
import Login from "./components/Login"; 
url: "https://accounts.spotify.com/authorize";
const queryString = require("querystring");
const client_id = 'cd2283f2006447a6a780c711890fed3c'; // Your client id
const axios = require("axios");

let spotifyClientParams={
				client_id: client_id,
				response_type: "code",
				redirect_uri: null,
				scope: "user-library-read playlist-modify-public user-top-read user-follow-read"
};
const url = "https://accounts.spotify.com/authorize/";
class App extends Component {
  constructor(props){
	super(props);
	this.state = {
		loggedIn: false,
		username: null
    };
	//don't forget to bind methods JSX is a total weirdo
	spotifyClientParams.redirect_uri = window.location.href;
	this.login = this.login.bind(this);
	this.logout = this.logout.bind(this);
	this.signup = this.signup.bind(this);
	this.setSessionCookie = this.setSessionCookie.bind(this);
	this.getSessionCookie = this.getSessionCookie.bind(this);
	this.deleteSessionCookie = this.deleteSessionCookie.bind(this);
  }
  async componentDidMount(){
		spotifyClientParams.redirect_uri = window.location.href;
		console.log("this is my url " + spotifyClientParams.redirect_uri);
		let sessionId = this.getSessionCookie();
		let user = null;
		let queries = queryString.parse((window.location.href.split("?").length == 2) ? window.location.href.split("?")[1] : "");
		if(sessionId){
			try{
				user = await axios.get(`/users/verify/`+encodeURI(sessionId));
				if(!user.data.error){
					console.log("got user from session" + JSON.stringify(user.data));
					this.setState({username:user.data.username,loggedIn:true});
				}else{
					console.log(user.data.error);
				}
			if(queries.code){
				//this means that the user has authenticated spotify
				console.log("spotify permissions granted");
				try{
					if(!spotifyClientParams.redirect_uri){
						console.log("no redirect uri!");
					}
					try{
						let spotifyResponse = await axios.post(`/users/verify/spotify`,{username:this.state.username,code:queries.code,redirectUri:spotifyClientParams.redirect_uri});
					}catch(e){
						console.log(e);
					}
					window.location.assign(spotifyClientParams.redirect_uri.substring(0,spotifyClientParams.redirect_uri.indexOf("?")));
				}catch(e){
					console.log(e);
				}
				
			}else{
				//this means that something has gone wrong quthenticating spotify
				console.log("no spotify data");
			}
			}catch(e){
				console.log("ERROR logging in from session chats");
				console.log(e)
			}
		}	
  }
  getSessionCookie(){
    var name = "session=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) === 0) {
            return c.substring(name.length, c.length);
        }
    }
  }
  setSessionCookie(sessionId){
	let d = new Date();
	let expireTime = 10; //in days
    d.setTime(d.getTime() + (expireTime*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = "session=" + sessionId + ";" + expires + ";path=/;";
  }
  deleteSessionCookie(){
	let d = new Date();
    var expires = "expires="+ d.toUTCString();
    document.cookie = "session=;" +  expires + ";path=/;";
  }
  async signup(_username,_password) {
	if(_username == null || _password == null){
		return;
	}
	console.log(`${_username} signed up`);
	let users= null
	try{
		users = await axios.post("/users/",{username:_username,password: _password});
		console.log(users.data);
	}catch (e){
		console.log(e);
	}
	if(!users.data.error){
		this.login(_username,_password);
	}
		
  }

  async login(_username,_password) {
	console.log(`${_username} logged in`);
	let users= null
	try{
		users = await axios.post("/users/verify",{username:_username,password: _password});
		console.log(users.data);
	}catch (e){
		console.log(e);
	}
	if(users.data.verified === true){
		this.setSessionCookie(users.data.sessionId);
		this.setState({username: _username});	
		this.setState({loggedIn: true});	
		let fullUrl=url+"?" + queryString.stringify(spotifyClientParams);
		console.log(fullUrl);
		window.location.assign(fullUrl);
	}
		
  }
  logout(){
	this.deleteSessionCookie();
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
