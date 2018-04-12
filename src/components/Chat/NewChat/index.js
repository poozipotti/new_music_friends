import React, { Component } from 'react';
const axios = require("axios");
const uuid = require("node-uuid");



class Chat extends Component {
  constructor(props){
        super(props);
        this.state = {
			clicked : false,
			users: []
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
  async addChat(chat){
        //format
        //{id,users,chatLog}
        try{    
            let response = axios.post('http://localhost:4000/chat',chat);
            if(!response.data.error){
                console.log("adding chat: " + JSON.stringify(chat));
                let temp = this.state.joinedChats;
                temp = temp.concat([chat]);
                console.log(`added chat ${chat._id} in the object ${JSON.stringify(temp)}`);
                this.setState({joinedChats:temp});
            }else{
                console.log("there was an error, chat already exists");
            }
        }catch(e){
            console.log(e);
        }
  }

    //renders the chat 
  render() {
	let userList = null;
	let userPanel = null;
	if(this.state.clicked){
		if(this.state.users.length >1){
			userList = this.state.users.map( (user) =>{
					if(this.props.username !== user.username){
						return(<button
								key={uuid.v4()}
								value={user.username}
								onClick={e =>{this.setState({clicked:false});this.props.addChat([this.props.username,e.target.value])}}
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
