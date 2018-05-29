import React, { Component } from 'react';
const axios = require("axios");
const uuid = require("node-uuid");



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
			response = await axios.get(`http://localhost:4000/users/${this.props.username}/chats/${this.props.chat._id}/savePlaylist`);
			console.log(response.data.data.uri);
			this.setState({clicked:false, uri:response.data.data.uri});
		}catch (e){
			console.log(e);
		}
  }
  render() {
	let songList = null;
	let playlistPanel = null;
	let playlistButton = <button onClick={e => {this.setState({clicked : !this.state.clicked });}}>view playlist</button>;
	if(this.state.clicked){
		if(this.props.chat.users.length >1){
			songList = this.props.chat.users.map( (user) =>{
						return(<p
								>
									{user.song.name}
								</p>);
			});
		}
		playlistPanel = (
			<div className="songPanel">
				<h1>current playlist</h1>
				{songList}
				<button onClick={this.savePlaylist}>Save Playlist</button>
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
