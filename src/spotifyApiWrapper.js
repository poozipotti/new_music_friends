const axios = require("axios");
const client_id = 'cd2283f2006447a6a780c711890fed3c'; // Your client id
const client_secret = '35836c5ed83f4232b1866fb665374f26'; // Your secret
let authorizationToken = null;
let baseUrl = "https://api.spotify.com" 
let exportedMethods = {
	async getAuthorization(){
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
				
	},
	async getSongsByKeyword(keyword){
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
			console.log("attempting to get response")
			try{
				response = await axios(axiosSettings);
			}catch (e){
				console.log("error");
				console.log(e);
			}
			console.log(response.data);
			return response.data;
		}else{
			console.log("please get the authorization token! no authorization found");
		}
	}
}
async function test(){
	try{
		await exportedMethods.getAuthorization();
	}catch (e){
		console.log(e)
	}
	try{
		await exportedMethods.getSongsByKeyword("ramshackle glory");
	}catch (e){
		console.log(e)
	}
}
module.exports = exportedMethods;
