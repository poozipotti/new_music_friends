import React, { Component } from 'react';
const uuid = require('node-uuid');
const axios = require('axios');
class NewSong extends Component {
  constructor(props){
        super(props);
		//selected song is an index in songList
        this.state = {
			selectedSong: null,
			songList: [],
			searchText: "",
        };
        this.changeSearchText = this.changeSearchText.bind(this);
        this.selectSong = this.selectSong.bind(this);
        this.deactivate = this.deactivate.bind(this);
  };
  async search(){
		try{
			let response = await axios({method:"get",url:"/spotify/songs",params:{q:this.state.searchText}});
			this.setState({songList: response.data.tracks.items});	
		}catch (e){
			console.log(e);
		}
  }
  changeSearchText(searchText){

    this.setState({searchText:searchText});
  };
  selectSong(index){
	 console.log(index);
	 this.setState({selectedSong:index});
  }
  deactivate(){
	this.setState({selectedSong:null,songList:[],searchText:""});
  }
  render() {
	let songPanel = null;
	let songDisplayList = [];
		//setting up the songs
	if(this.state.songList.length >1){
		for(let i =0; i<this.state.songList.length;i++){
			let isSelected = "";	
			if(i == this.state.selectedSong){
				isSelected = "selected";
			}else{
				isSelected = "";
			}
			songDisplayList.push(
				<button
					key={uuid.v4()}
					value={i}
					onClick={e =>{this.selectSong(e.target.value)}}
					className = {"menuButton " + isSelected}
				>
					{this.state.songList[i].name} | <span className="artistName">{this.state.songList[i].album.artists[0].name}</span>
				</button>);
		}
	}else{
		songDisplayList = <p>could not find any songs that match search</p>
	}
	songPanel = (
		<div className="addSong">
		<h1>Add Song</h1>
		<form onSubmit= { e => {e.preventDefault();this.search()}}>
			<input type="text" placeholder="search!" 
				   value={this.state.searchText} 
				   onChange={e => {
						e.preventDefault();
						this.changeSearchText(e.target.value)
					}}>
			</input>
			<button type="submit" className="submitButton" id="searchButton">Search</button>
		</form>
			<div className="songList">
				{songDisplayList}
			</div>
			<button id="addSongButton" onClick= {e => {this.props.submitSong(this.state.songList[this.state.selectedSong]);this.deactivate()}}>Add Song</button>
		</div>);

    return (
		<div>
		{songPanel}
		</div>
    );
  };
}

export default NewSong;
