import React, { Component } from 'react';
const uuid = require("node-uuid");
const axios = require("axios");



class PlaylistPanel extends Component {
  constructor(props){
        super(props);
        this.savePlaylist = this.savePlaylist.bind(this);

        
  }
  async savePlaylist(){
		let response = null;
		try{
			response = await axios.get(`/users/${this.props.username}/chats/${this.props.chat._id}/savePlaylist`);
			this.props.resetMenu();
		}catch (e){
			console.log(e);
		}
  }
  render() {
	let songList = null;
	let playlistPanel = null;
	let savePlaylist = null;
	savePlaylist = <button onClick={this.savePlaylist}>Save Playlist</button>;
	if(this.props.chat.users.length >1){
		songList = this.props.chat.users.map( (user) =>{	
					return((user.song.name) ? (<p>{user.song.name} | <span className="artistName">{user.song.album.artists[0].name}</span></p>) : (<p>"waiting..."</p>));	
		});
	}
	playlistPanel = (
		<div className="songPanel">
			<h1>current playlist</h1>
			{songList}
			{savePlaylist}
		</div>
	)
	return (
		<div>
		{playlistPanel}
		</div>
	)
  }
};

export default PlaylistPanel;
