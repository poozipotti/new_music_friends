import React, { Component } from 'react';
import PlaylistPanel from "./PlaylistPanel";
import NewChat from "./NewChat";
import Chats from "./Chats";
const axios = require("axios");
const uuid = require("node-uuid");



class SidePanel extends Component {
  constructor(props){
        super(props);
        this.state = {
			selectedItem: 1,
        };
        this.resetMenu = this.resetMenu.bind(this);
  }
  async componentDidMount(){
  }
  resetMenu(){
	this.setState({selectedItem:1});
  }
  render() {
	let menuItems= [
		<NewChat username={this.props.username} addChat={this.props.addChat} resetMenu={this.resetMenu}/>,
		<Chats joinedChats={this.props.joinedChats} setActiveChat={this.props.setActiveChat}/>
	];
	if(this.props.activeChat !== null){
		menuItems.push(<PlaylistPanel chat={this.props.joinedChats[this.props.activeChat]} username={this.props.username} submitSong={this.props.submitSong} resetMenu={this.resetMenu}/>);
	}else{
		menuItems.push(<p>No Chat Selected</p>);
	}
	return (
		<div className="sidePanel">
				<button onClick= {e => {this.setState({selectedItem:parseInt(e.target.value)})}} value={0}>new</button>
				<button  onClick= {e => {this.setState({selectedItem:parseInt(e.target.value)})}} value={1}>chats</button>
				<button  onClick= {e => {this.setState({selectedItem:parseInt(e.target.value)})}} value={2}>playlist</button>
				{menuItems[this.state.selectedItem]}
		</div>
	)
  }
};

export default SidePanel;
