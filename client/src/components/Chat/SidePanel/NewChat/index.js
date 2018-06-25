import React, { Component } from 'react';
const axios = require("axios");
const uuid = require("node-uuid");



class NewChat extends Component {
  constructor(props){
        super(props);
        this.state = {
			users: [],
			selectedUsers: [],
			submittedUsers: false,
			chatName:""
        };

        
  }
  async componentDidMount(){
	let response = null
	try{
		response = await axios.get("/users/");
	}catch (e){
		console.log(e);
	}
	if(response.data.users){
		this.setState({users:response.data.users});	
	}
	
  }
  changechatNameText(chatNameText){
    this.setState({chatName:chatNameText});
  }
  deactivate(){
		this.setState({selectedUsers:[]});
  }
  selectUser(username){
	let temp = this.state.selectedUsers;
	let index = temp.findIndex((x) => {x == username});
	if(index != -1){
		temp[index] = "";
	}else{
		temp.push(username);
	}
	this.setState({selectedUsers:temp});
  }
    //renders the chat 
  render() {
	let userList = null;
	let userPanel = null;
	let selected = "";
		if(this.state.submittedUsers){
			userPanel = 
			(
				<div className="userPanel">
				<form onSubmit= { e => {e.preventDefault();this.props.addChat(this.state.selectedUsers.concat([this.props.username]),this.state.chatName);this.props.resetMenu();this.deactivate();}}>
					<input type="text" placeholder="chat name!" 
						   value={this.state.searchText} 
						   onChange={e => {
								e.preventDefault();
								this.changechatNameText(e.target.value)
							}}>
					</input>
					<button type="submit" className="submitButton">done</button>
				</form>
				</div>
			)
		}
		else if(this.state.users.length >=1){
			userList = this.state.users.map( (user) =>{
					if(this.props.username !== user.username){
						if(this.state.selectedUsers.includes(user.username)){
							selected = "selected"
						}else{
							selected = null;
						}
						return(<button
								key={uuid.v4()}
								value={user.username}
								onClick={e =>{this.selectUser(e.target.value)}}
								className = {selected}
								>
									{user.username}

								</button>);
					}
			});
		userPanel = (
			<div className="userPanel">
				<h1>start chat</h1>
				{userList}
				<button className="submitButton" onClick={e => {this.setState({submittedUsers:true})}}> done </button>
			</div>
		)
	   }

		
	return (
		<div>
		{userPanel}
		</div>
	)
  }
};

export default NewChat;
