import React, { Component } from 'react';
import NewSong from "./NewSong";
import Log from "./Log";
import SidePanel from "./SidePanel";
import io from 'socket.io-client';
const axios = require("axios");

let socketUri =  null;

console.log("connectiong to socket at " + socketUri);

class Chat extends Component {

  constructor(props){
        super(props);
        this.state = {
            socket: io.connect(socketUri),
            joinedChats: [],
			activeChat: null,
			selectedSong: null,
			menuActive: true
        };
		socketUri = window.location.href;
        this.updateMessages = this.updateMessages.bind(this);
        this.sendMessage = this.sendMessage.bind(this);
		this.submitSong = this.submitSong.bind(this);
        this.updateUsers = this.updateUsers.bind(this);
        this.updateJoinedChats = this.updateJoinedChats.bind(this);
        this.addChat = this.addChat.bind(this);
        this.setActiveChat = this.setActiveChat.bind(this);
        this.activateMenu = this.activateMenu.bind(this);
        this.selectSong = this.selectSong.bind(this);
        
  }
  async componentDidMount(){
		socketUri = window.location.href;
		let allChats = null;
        try{
            allChats = await axios.get(`/users/${this.props.username}/chats`);
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
        this.state.socket.on("songMessage", (song) => {
			console.log("received song message \\\n\n\n\n\n\n\n");
            this.updateSongs(song);
        });
        //join a specific chat 
        this.state.socket.on("subscribe", chat => {
			console.log("got subscription request!");
			this.updateJoinedChats(chat);
            this.state.socket.emit("subscribe",chat._id);
        });
  }
    ///////////methods to send and update messages/////////////
   async sendMessage(message){
		let song = this.state.joinedChats[this.state.activeChat].users.find(user => {return user.username===this.props.username}).song;
		console.log(song);
		if(!song.name){
			console.log("error, no song name");
			return;
		}
        let data= {username:this.props.username,message:message,activeChat:this.state.joinedChats[this.state.activeChat]._id,song:song.name};
        this.state.socket.emit('chatMessage',data);
        try{    
           await axios.post(`/chats/${data.activeChat}/message`,data);
        }catch(e){
            console.log("error posting message to db" + e);
            console.log(e);
        }
  }
  async submitSong(song){
	song.username  = this.props.username;
	song.activeChat = this.state.activeChat;
	let chatId = this.state.joinedChats[this.state.activeChat]._id;
	song.activeChat = this.state.activeChat;
	song.chatId = chatId;
	this.state.socket.emit("songMessage",song);
	this.setState({activeSong:song});
	try{
		let response = await axios.post(`/chats/${chatId}/song/`,song)	
	   	//console.log(response);	
	}catch (e){
		console.log(e)
	}
  }
  async updateSongs(song){

	console.log(`trying to update with song ${song.name}`);
    let temp=this.state.joinedChats;
	console.log(`chatIndex = ${song.activeChat}`);
	
	let userIndex = temp[song.activeChat].users.findIndex(x => {return  x.username==song.username});
	console.log(`song usrname is recorded as ${song.username}`);
	console.log(`userIndex = ${userIndex} username= ${temp[song.activeChat].users[userIndex].username}`);
	temp[song.activeChat].users[userIndex].song = song;
    this.setState({joinedChats:temp});
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
  async updateJoinedChats(chat){
    let temp=this.state.joinedChats;
    temp.push(chat);;
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
  //also update the chat from the database
  setActiveChat(id){
            console.log("setting active chat!");
            let index = 0;
			let activeSong = null;
            for(let i=0;i<this.state.joinedChats.length;i++){
                if(this.state.joinedChats[i] !== null && this.state.joinedChats[i]._id === id){
                    index = i;
					break;
                }
            }
			
            for(let i=0;i<this.state.joinedChats[index].users.length;i++){
					if(this.state.joinedChats[index].users[i].username === this.props.username){
						activeSong = this.state.joinedChats[index].users[i].song;
						break;
					}	
			}
			
            console.log("set active chat to " + index);              
            console.log("active chat is " + JSON.stringify(this.state.joinedChats[index]));
            this.setState({activeChat:index,activeSong:activeSong});
  }
    //helper method which checks for a chat by id, and returns its index in this.state.activeChats
  getChatIndex(id){
            console.log("setting active chat!");
            let index = 0;
            for(let i=0;i<this.state.joinedChats.length;i++){
                if(this.state.joinedChats[i] !== null && this.state.joinedChats[i]._id === id){
                    index = i;
                }
            }
            return index;
  }
  async addChat(usernames,chatName){
        //format
        //{id,users,chatLog}
        try{    
            let response = await axios.post('/chats',{usernames:usernames, chatName:chatName});
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
  selectSong(song){
	this.setState({selectedSong:song});
  }
  activateMenu(){
	this.setState({menuActive:!this.state.menuActive});
  } 

    //renders the chat
  render() {
    let submit = null;
    let log= null;
	let sidePanel=null;
	sidePanel =	<SidePanel activeChat={this.state.activeChat} username={this.props.username} addChat={this.addChat} joinedChats={this.state.joinedChats} setActiveChat = {this.setActiveChat} submitSong={this.submitSong}/>
    if(this.state.activeChat !== null && this.state.joinedChats[this.state.activeChat] !== undefined){
		let addSong =<NewSong username={this.props.username} chat={this.state.joinedChats[this.state.activeChat]} selectSong={this.selectSong} submitSong={this.submitSong}/> ;
		let myUser = this.state.joinedChats[this.state.activeChat].users.find((user) => {return user.username === this.props.username});
	
		if(myUser && myUser.song){
			log = <Log chat={this.state.joinedChats[this.state.activeChat]} roomTitle={`selected Song: ${this.state.activeSong.name}`} username={this.props.username} messages={this.state.messages} sendMessage={this.sendMessage}/>
		}else{
			log = addSong;
		}
    }
    return (
        <div className="chatBox row">
            <div className="col-2">
				{sidePanel}
            </div>
            <div className="col-10">
				{log}
				{submit}
            </div>
        </div>
    );
  }
};

export default Chat;
