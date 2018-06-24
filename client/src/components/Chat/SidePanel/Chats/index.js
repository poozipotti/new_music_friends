import React, { Component } from 'react';
const uuid = require('uuid')
class ChatsPanel extends Component {
  constructor(props){
	super(props);
	this.state = {
		selected:null
	}
  };
  render() {
    let ChatList = null;
    if(this.props.joinedChats.length >0){
        ChatList = this.props.joinedChats.map( (chat) =>{
			let selectedClass = "";
			if(this.state.selected && this.state.selected === chat._id){
				selectedClass = "selected";
			}
            if(chat != null){
                    return(<button
                            key={uuid.v4()}
                            value={chat._id}
							className = {selectedClass}
                            onClick={e => {this.setState({selected:e.target.value});this.props.setActiveChat(e.target.value)}}>
                            {chat.chatName}
                            </button>);
           }
        });
    }else{
		<p className="center-text"> no chats found </p>
	}
    return (
        <div className="chatsPanel">
           <h1>Chats</h1> 
          {ChatList} 
        </div>
    );
  };
}
export default ChatsPanel;
