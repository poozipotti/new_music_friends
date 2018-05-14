import React, { Component } from 'react';
import NewSong from "../NewSong";
import PlaylistPanel from "../PlaylistPanel";
const uuid = require('uuid')
class Log extends Component {
  render() {
       let chatList = this.props.chat.messages.map(message => 
        {
             if(message.username === this.props.username){
                return(<div className="message own-message" key={uuid.v4()}>
                    <p>{message.song}</p>
                    <p>{message.message}</p>
                </div>)
            }else{
                return(<div  className="message other-message" key={uuid.v4()}>
                    <p>{message.song}</p>
                    <p>{message.message}</p>
                </div>)
            }
        });
        console.log("\n\n\n\nTHE chat list\n" + chatList);
    return (
        <div id="logBox">
        <h1>{this.props.roomTitle}</h1>
	    <NewSong username={this.props.username} chat={this.props.chat} selectSong={this.props.selectSong}/>:
	    <PlaylistPanel chat={this.props.chat} />:
        {chatList}
        </div>
    );
  };
}

export default Log;
