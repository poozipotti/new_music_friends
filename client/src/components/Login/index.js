import React, { Component } from 'react';

class Chat extends Component {
  constructor(props){
        super(props);
        this.state = {
			usernameText: "",
			passwordText: "",
			attemptedLogin: false,
			attemptedSignup: false,
			signupClicked: false
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
	let titleText = (this.state.signupClicked ? "Signup" : "Login");
	let errorMessage =(this.state.attemptedLogin || this.state.attemptedSignup) ? <p className="errorMessage">Something Went Wrong!</p> : null;
	let submitButton = 
		(<div>
			<button onClick = {e => {e.preventDefualt;this.setState({signupClicked:true})}}>Signup</button>
			<button type="submit" >Login</button>;	
		</div>);
	if(this.state.signupClicked){
		submitButton = 
		(<div>
			<button onClick={e => {this.props.signup(this.state.usernameText,this.state.passwordText);this.setState({attemptedSignup:true})}}>Done</button>
		</div>);
	}	
	return(
		<div id="loginBox" className="row justify-content-center">
			<div className="col-md-6 col-sm-12">
				<h1 className="text-center">New Music Friends</h1>
				<h2 className="text-center">{titleText}</h2>
				<form onSubmit= { e => {e.preventDefault();this.props.login(this.state.usernameText,this.state.passwordText);this.setState({attemptedLogin:true})}}>
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
					{errorMessage}
					{submitButton}
				</form>
			</div>
		</div>
	);
  }
};

export default Chat;
