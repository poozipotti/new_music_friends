import React, { Component } from 'react';
import NewSong from "./NewSong";
const uuid = require("node-uuid");
const axios = require("axios");



class PlaylistPanel extends Component {
  constructor(props){
        super(props);
        this.state = {
			clicked : false,
        };
        this.savePlaylist = this.savePlaylist.bind(this);

        
  }
  async savePlaylist(){
		let response = null;
		try{
			response = await axios.get(`/users/${this.props.username}/chats/${this.props.chat._id}/savePlaylist`);
			this.setState({clicked:false});
		}catch (e){
			console.log(e);
		}
  }
  render() {
	let songList = null;
	let playlistPanel = null;
	let playlistButton = <button onClick={e => {this.setState({clicked : !this.state.clicked })}}>view playlist</button>;
	let newSongComponent = null;
	let myUser = this.props.chat.users.find((user) => {return user.username === this.props.username});
	let addSong = null;
	let savePlaylist = null;
	if(!myUser.song){
		addSong =<NewSong username={this.props.username} chat={this.props.chat} selectSong={this.props.selectSong} submitSong={this.props.submitSong}/> ;
	}else if(this.props.complete){
		savePlaylist = <button onClick={this.savePlaylist}>Save Playlist</button>;
	}
	if(this.state.clicked || !this.props.complete){
		if(this.props.chat.users.length >1){
			songList = this.props.chat.users.map( (user) =>{
						return(<p>
									{user.song.name ? user.song.name : "waiting..."}
								</p>);
			});
		}
		playlistPanel = (
			<div className="songPanel">
				<h1>current playlist</h1>
				{songList}
				{addSong}	
				{savePlaylist}
			</div>
		)

		
	}
	return (
		<div>
		{playlistButton}
		{playlistPanel}
		</div>
	)
  }
};

export default PlaylistPanel;
