import React, { Component } from 'react';
const axios = require("axios");
const uuid = require("node-uuid");



class PlaylistPanel extends Component {
  constructor(props){
        super(props);
        this.state = {
			clicked : false,
        };

        
  }

  render() {
	let songList = null;
	let playlistPanel = null;
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
			</div>
		)

		
	}
	return (
		<div>
		<button onClick={e => {this.setState({clicked: !this.state.clicked });}}>view playlist</button>
		{playlistPanel}
		</div>
	)
  }
};

export default PlaylistPanel;
