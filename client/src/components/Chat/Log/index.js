import React, { Component } from 'react';
import Submit from "./Submit";
const uuid = require('uuid')
class Log extends Component {

  constructor(props){
        super(props);
        this.state = {
			didAddSong: false,
        };

  }
  scrollToBottom(){
		let element = document.getElementById("logBox");
		if(element){
			element.scrollTop = element.scrollHeight - element.clientHeight;
		}
  }
  componentDidUpdate(){
		let element = document.getElementById("logBox");
		if(element){
			element.scrollTop = element.scrollHeight - element.clientHeight;
		}
  }
  render() {
		let myUser = this.props.chat.users.find(x => {return  x.username==this.props.username});
		let chatList = null;
		let submitButton = null;
		chatList = this.props.chat.messages.map(message => 
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
		submitButton = <Submit messages={this.props.messages} sendMessage={this.props.sendMessage}/>;
    return (
		<div className="row">
			<div className="col-12" id="logBox">
				{chatList}
			</div>
			<div className="col-12">
				{submitButton}
			</div>
		</div>
    );
  };
}

export default Log;
