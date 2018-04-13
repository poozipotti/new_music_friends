import React, { Component } from 'react';
import Submit from "./Submit";
import Log from "./Log";
import NewChat from "./NewChat";
import Chats from "./Chats";
import io from 'socket.io-client';
const axios = require("axios");


class Chat extends Component {
  constructor(props){
        super(props);
        this.state = {
            socket: io.connect('http://localhost:8000'),
            joinedChats: [],
			activeChat: null
        };

        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.addChat = this.addChat.bind(this);
        this.setActiveChat = this.setActiveChat.bind(this);
        
  }
  async componentDidMount(){
		let allChats = null;
        try{
            allChats = await axios.get(`http://localhost:4000/users/${this.props.username}/chats`);
            this.setState({joinedChats:allChats.data});
			for(let i=0;i<allChats.data.length;i++){
				this.state.socket.emit("subscribe",allChats.data[i]._id);
			}
        }catch(e){
            console.log("ERROR getting chats");
            console.log(e)
        }
		
        //lets the chat server know that the user has logged in 
        this.state.socket.emit("login",this.props.username);
        //receive a chat message, update messages
        this.state.socket.on("chatMessage", (message) => {
            this.updateMessages(message);
        });
        //join a specific chat 
        this.state.socket.on("subscribe", chat => {
            this.setActiveChat(chat._id);
            this.state.socket.emit("subscribe",chat._id);
        });
  }
    ///////////methods to send and update messages/////////////
   async sendMessage(message){
        let data= {username:this.props.username,message:message,activeChat:this.state.joinedChats[this.state.activeChat]._id};
        this.state.socket.emit('chatMessage',data);
        try{    
           await axios.post(`http://localhost:4000/chats/${data.activeChat}/message`,data);
        }catch(e){
            console.log("error posting message to db" + e);
            console.log(e);
        }
  }

  async updateMessages(message){
    let temp=this.state.joinedChats;
    let chatIndex = this.getChatIndex(message.activeChat);
    console.log("added message to chat" + message.activeChat);
    console.log("chat log" + temp[chatIndex]);
    temp[chatIndex].messages.push(message);;
    console.log("chat log after add" + temp[chatIndex]);
    console.log(temp);

    this.setState({joinedChats:temp});
  }
   /// methods to update the users that have logged in////
  updateUsers(uid){
    if(this.state.users.includes(uid)){
        return;
    }
    let temp=this.state.users.concat([uid]);
    this.setState({users:temp});
  }
  setActiveChat(id){
            console.log("setting active chat!");
            let index = 0;
            for(let i=0;i<this.state.joinedChats.length;i++){
                if(this.state.joinedChats[i] !== null && this.state.joinedChats[i]._id == id){
                    index = i;
                }
            }
            console.log("set active chat to " + index);              
            console.log("active chat is " + JSON.stringify(this.state.joinedChats[index]));
            this.setState({activeChat:index});
  }
    //helper method which checks for a chat by id, and returns its index in this.state.activeChats
  getChatIndex(id){
            console.log("setting active chat!");
            let index = 0;
            for(let i=0;i<this.state.joinedChats.length;i++){
                if(this.state.joinedChats[i] !== null && this.state.joinedChats[i]._id == id){
                    index = i;
                }
            }
            return index;
  }
  async addChat(usernames){
        //format
        //{id,users,chatLog}
        try{    
            let response = await axios.post('http://localhost:4000/chats',{usernames:usernames});
            if(!response.data.error){
				this.state.socket.emit("startChat",response.data);
                let temp = this.state.joinedChats;
                temp = temp.concat([response.data]);
                this.setState({joinedChats:temp});
            }else{
                console.log(response.data.error);
            }
        }catch(e){
            console.log(e);
        }
  }

    //renders the chat 
  render() {
    let submit = null;
    let log= null;
    if(this.state.activeChat != null && this.state.joinedChats[this.state.activeChat] != undefined){
        log=<Log chatLog={this.state.joinedChats[this.state.activeChat].messages} roomTitle="chat" username={this.props.username}/>
        submit= <Submit messages={this.state.messages} sendMessage={this.sendMessage}/>;
    }
    return (
        <div className="chatBox row">
            <div className="col-3">
				<NewChat username={this.props.username} addChat={this.addChat}/>	
				<Chats joinedChats={this.state.joinedChats} setActiveChat={this.setActiveChat} />
            </div>
            <div className="col-9">
            {log}
            {submit}
            </div>
        </div>
    );
  }
};

export default Chat;
