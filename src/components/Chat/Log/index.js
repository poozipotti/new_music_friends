import React, { Component } from 'react';
import NewSong from "../NewSong";
import PlaylistPanel from "../PlaylistPanel";
const uuid = require('uuid')
class Log extends Component {

  constructor(props){
        super(props);
        this.state = {
			uri : null,
			didAddSong: false
        };

  }

  async componentDidMount(){
	let myUser = this.props.chat.users.find(x => {return  x.username==this.props.username});
	
	console.log("MY USER IS " + myUser);
	 if(myUser.uri){
		this.setState({uri : myUser.uri});
	}
	if(myUser.song){
		this.setState({didAddSong:true});	
	}
  }
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
		let buttons = <PlaylistPanel chat={this.props.chat} username={this.props.username}/>;
		if(!this.state.didAddSong){
			buttons = 
				<div>
					<NewSong username={this.props.username} chat={this.props.chat} selectSong={this.props.selectSong}/>:
					<PlaylistPanel chat={this.props.chat} username={this.props.username}/>:
				</div>
		}
	 	if(this.state.uri){
			 buttons = <iframe src={"https://open.spotify.com/embed?uri=" + this.state.uri + "&view=coverart"} width="322" height="80" frameborder="0" allowtransparency="true" allow="encrypted-media"></iframe>;
		}		
    return (
        <div id="logBox">
        <h1>{this.props.roomTitle}</h1>
		{buttons}
        {chatList}
        </div>
    );
  };
}

export default Log;
