import React, { Component } from 'react';
const uuid = require('uuid')
class ChatsPanel extends Component {
  constructor(props){
        super(props);
  };
  render() {
    console.log("chats in the chatpanel component " + this.props.joinedChats); 
    let ChatList = null;
    if(this.props.joinedChats.length >0){
        ChatList = this.props.joinedChats.map( (chat) =>{
            if(chat != null){
                    console.log("this is a chat " + JSON.stringify(chat));
                    return(<button
                            key={uuid.v4()}
                            value={chat._id}
                            onClick={e => {this.props.setActiveChat(e.target.value)}}>
                            {chat.usernames.toString()}
                            </button>);
           }
        });
    }
    console.log("this is the ChatList" + ChatList);
    return (
        <div id="userBox">
           <h1>Chats</h1> 
          {ChatList} 
        </div>
    );
  };
}
export default ChatsPanel;
