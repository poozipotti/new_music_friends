import React, { Component } from 'react';
const uuid = require('uuid')
class ChatsPanel extends Component {
  constructor(props){
        super(props);
  };
  render() {
    let ChatList = null;
    if(this.props.joinedChats.length >0){
        ChatList = this.props.joinedChats.map( (chat) =>{
            if(chat != null){
                    return(<button
                            key={uuid.v4()}
                            value={chat._id}
                            onClick={e => {this.props.setActiveChat(e.target.value)}}>
                            {chat.usernames.toString()}
                            </button>);
           }
        });
    }
    return (
        <div id="userBox">
           <h1>Chats</h1> 
          {ChatList} 
        </div>
    );
  };
}
export default ChatsPanel;
