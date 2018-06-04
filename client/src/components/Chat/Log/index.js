import React, { Component } from 'react';
import PlaylistPanel from "./PlaylistPanel";
import Submit from "./Submit";
const uuid = require('uuid')
class Log extends Component {

  constructor(props){
        super(props);
        this.state = {
			didAddSong: false,
        };
        this.checkComplete = this.checkComplete.bind(this);

  }
  checkComplete(){
	let songs= this.props.chat.users.filter(user => {return user.song.name != undefined});
	if(songs.length == this.props.chat.users.length){
		return true;
	}else{
		return false;
	}
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
		let complete = this.checkComplete();
		let myUser = this.props.chat.users.find(x => {return  x.username==this.props.username});
		let chatList = null;
		let submitButton = null;
		if(complete){
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
		}
		let buttons = <PlaylistPanel chat={this.props.chat} username={this.props.username} complete={complete} submitSong={this.props.submitSong}/>;
	 	if(myUser.uri ){
			 buttons = <iframe src={"https://open.spotify.com/embed?uri=" + myUser.uri + "&view=coverart"} width="322" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>;
		}
    return (
        <div>
        <h1>{this.props.roomTitle}</h1>
		<div className="row">
			<div className="col-12">
				{buttons}
			</div>
		</div>
		<div className="row">
			<div className="col-12" id="logBox">
				{chatList}
			</div>
		</div>
		<div className="row">
			<div className="col-12">
				{submitButton}
			</div>
		</div>
        </div>
    );
  };
}

export default Log;
