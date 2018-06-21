const axios = require("axios");
const client_id = 'cd2283f2006447a6a780c711890fed3c'; // Your client id
const client_secret = '35836c5ed83f4232b1866fb665374f26'; // Your secret
const redirect_uri = "http://localhost:$000" || process.env.APP_URL;
const queryString = require("querystring");
let authorizationToken = null;
let baseUrl = "https://api.spotify.com" 

//TODO add logic for refresh tokens

async function getAuthorization(){
	let response = null;
	let axiosSettings = {
		method: 'post',
		url: "https://accounts.spotify.com/api/token",	
		params: {
			grant_type: "client_credentials"
		},
		headers: {
			 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
		}	
	}
	try{
		response = await axios(axiosSettings);
	}catch (e){
		console.log(e);
	}
	authorizationToken = response.data;
	console.log(response.data);
			
}
let exportedMethods = {
	async getAllData(code,redirectUri){
		console.log("\n\n\n\n\nredirect uri is : " + redirectUri);
		let response = null;
		let axiosSettings = {
			method: 'post',
			url: "https://accounts.spotify.com/api/token",	
			params:{
				grant_type: "authorization_code",
				code: code,
				redirect_uri: redirect_uri,
			},
			headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) }	
		}
		try{
			response = await axios(axiosSettings);
			let spotifyUser= await this.getUserInformation(response.data.access_token);
			response.data.code = code;
			return {authenticationData:response.data, spotifyId: spotifyUser.id};
		}catch (e){
			console.log("error in spotify request");
			console.log(e);
			return {error: e};
		}
	},
	async getUserInformation(userToken){
		//console.log(`the user token is ${userToken} in get user information method`);
		let spotifyId = null;
		let response = null
		let axiosSettings = {
			method: 'get',
			url: "https://api.spotify.com/v1/me",	
			headers: {
					"Authorization": "Bearer " + userToken
			}	
		}
		try{
			response = await axios(axiosSettings);

			console.log(`\n\n\n\n ${response.stauts} \n\n\n\n\n`);
			return await response.data;
		}catch(e){
			console.log(`\n\n\n\n ${response.stauts} \n\n\n\n\n`);
			return {error:e};
		}
	},
	async addPlaylistToUser(userAuthenticationData,userId,playlistName,songs){
		let spotifyId = null;
		let response = null;
		let playlistId = null;
		let userToken = userAuthenticationData.access_token;
		console.log(`received in spotify data songs ${songs}`);
		let axiosSettings = {
			method: 'post',
			url: `https://api.spotify.com/v1/users/${userId}/playlists`,	
			headers: {
					"Authorization": "Bearer " + userToken
			},	
			data: {
				"name" : playlistName,
			}
		}
		try{
			response = await axios(axiosSettings);
			playlistId = response.data.id;
		}catch(e){
			return {error:e,status:e.response.status};
		}
		axiosSettings = {
			method: 'post',
			url: `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,	
			headers: {
					"Authorization": "Bearer " + userToken
			},
			data: {
				uris: songs.map((x) => {return x.uri})
			}
		}
		try{
			await axios(axiosSettings);
			return response.data;
		}catch(e){
			console.log(e);
			return e.data;
		}

	},
	async getSongsByKeyword(keyword){
		if(!authorizationToken){
			await getAuthorization();
		}
		if(authorizationToken != null){
			let response = null;
			let axiosSettings = {
				method: 'get',
				url: baseUrl + "/v1/search",
				params: {
					q: keyword,
					type: "track",
				},
				headers: {
					"Authorization": "Bearer " + authorizationToken.access_token
				}	
			};
			//console.log("attempting to get response")
			try{
				response = await axios(axiosSettings);
			}catch (e){
				console.log("error");
				console.log(e);
			}
			//console.log(response.data);
			return response.data;
		}else{
			console.log("please get the authorization token! no authorization found");
		}
	},
	async refreshUserToken(userAuthenticationData){
		let refresh_token = userAuthenticationData.refresh_token;
		let axiosSettings = {
			method: 'post',
			url: "https://accounts.spotify.com/api/token",	
			params:{
				grant_type: "refresh_token",
				refresh_token: refresh_token,
			},
			headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) }	
		}
		try{
			let response = await axios(axiosSettings);
			return response.data;
		}catch (e){
			console.log("error in spotify refresh request");
			console.log(e);
			return {error: e};
		}
	}
}
module.exports = exportedMethods;
