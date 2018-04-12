import React, { Component } from 'react';

class Chat extends Component {
  constructor(props){
        super(props);
        this.state = {
			usernameText: "",
			passwordText: ""
        };

        
  }
  componentDidMount(){
  }
  changeUsernameText(usernameText){
    this.setState({usernameText});
  };
  changePasswordText(passwordText){
    this.setState({passwordText});
  };
  render() {
	return(
		<div className="row loginContainer justify-content-center">
			<div id="loginBox" className="col-3">
				<h1 className="text-center text-light" style={{ margin: 30 }}>Login</h1>
				<form onSubmit= { e => {e.preventDefault();this.props.login(this.state.usernameText,this.state.passwordText)}}>
					<input type="text" placeholder="username" 
						   value={this.state.usernameText} 
						   onChange={e => {
								e.preventDefault();
								this.changeUsernameText(e.target.value)
							}}>
					</input>
					<input type="password" placeholder="password" 
						   value={this.state.passwordText} 
						   onChange={e => {
								e.preventDefault();
								this.changePasswordText(e.target.value)
							}}>
					</input>
					<button type="submit" style={{margin: 10}}>Login</button>
				</form>
					<button style={{margin: 10}} onClick={e => {this.props.signup(this.state.usernameText,this.state.passwordText)}}>Signup</button>
			</div>
		</div>
	);
  }
};

export default Chat;
