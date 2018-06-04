const express = require('express');
const router = express.Router();
const data = require("../data");
const spotifyData = data.spotify;
const queryString = require('querystring');
const mainUrl = "http://localhost:3000";
const client_id = 'cd2283f2006447a6a780c711890fed3c'; // Your client id
const client_secret = '35836c5ed83f4232b1866fb665374f26'; // Your secret
const redirect_uri = "http://localhost:3000";

router.get("/songs", async (req, res) => {
	let data = null;
	console.log(req.query);
	try{
		data = await spotifyData.getSongsByKeyword(req.query.q); 
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});
router.post("/user/authorize", async (req, res) => {
	let data = null;
	try{
		data = await spotifyData.getUserAuthorization();
		res.json(data.url);
	}catch (e){
		res.json({error: e})
		console.log(e);
	}
});
module.exports = router;
