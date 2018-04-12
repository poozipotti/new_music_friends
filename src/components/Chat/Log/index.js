import React, { Component } from 'react';
const uuid = require('uuid')
class Log extends Component {
  render() {
       let chatList = this.props.chatLog.map(message => 
        {
             if(message.username === this.props.username){
                return(<div className="message own-message" key={uuid.v4()}>
                    <p>{message.username}</p>
                    <p>{message.message}</p>
                </div>)
            }else{
                return(<div  className="message other-message" key={uuid.v4()}>
                    <p>{message.username}</p>
                    <p>{message.message}</p>
                </div>)
            }
        });
        console.log("\n\n\n\nTHE chat list\n" + chatList);
    return (
        <div id="logBox">
        <h1>{this.props.roomTitle}</h1>
        {chatList}
        </div>
    );
  };
}

export default Log;
