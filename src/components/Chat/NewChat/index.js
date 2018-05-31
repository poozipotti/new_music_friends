import React, { Component } from 'react';
const axios = require("axios");
const uuid = require("node-uuid");



class Chat extends Component {
  constructor(props){
        super(props);
        this.state = {
			clicked : false,
			users: [],
			selectedUsers: []
        };

        
  }
  async componentDidMount(){
	let response = null
	try{
		response = await axios.get("http://localhost:4000/users/");
	}catch (e){
		console.log(e);
	}
	if(response.data.users){
		this.setState({users:response.data.users});	
	}
	
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
	if(this.state.clicked){
		if(this.state.users.length >1){
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
		}
		userPanel = (
			<div className="userPanel">
				<h1>start chat</h1>
				{userList}
				<button> done </button>
			</div>
		)

		
	}
	return (
		<div>
		<button onClick={e => {this.setState({clicked: !this.state.clicked });}}>+</button>
		{userPanel}
		</div>
	)
  }
};

export default Chat;
