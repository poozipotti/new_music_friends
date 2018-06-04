const express = require('express');
const router = express.Router();
const data = require("../data");
const userData = data.users;
const chatData = data.chats;

router.get("/", async (req, res) => {
	let data = null;
	try{
		data = {users: await userData.getAllUsers()}; 
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});
router.post("/verify",async (req, res) => {
	let data = null;
	let user = req.body;
	try{
		data = await userData.verifyUser(user.username,user.password); 
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});
router.post("/verify/spotify",async (req, res) => {
	let data = null;
	let spotifyData = req.body;
	try{
		data = await userData.addSpotifyData(spotifyData.username,spotifyData.code,spotifyData.redirectUri); 
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});
router.get("/verify/:sessionId",async (req, res) => {
	let data = null;
	let user = req.body;
	try{
		data = await userData.getUserBySessionId(req.params.sessionId); 
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});
router.post("/", async (req, res) => {
	userInfo = req.body;	
	let data = null;		
	if(!userInfo.email){
		userInfo.email = null;
	}
	if(!userInfo.username || !userInfo.password){
		console.log("error need a username and a password");
		res.json({error: "need username and password"});	
		return;
	}
	try{
		data = await userData.addUser(userInfo.username,userInfo.email,userInfo.password);
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});
router.get("/:username",async  (req, res) => {
	let data = null;
	try{
		data = await userData.getUserByUsername(req.params.username); 
		if(data === null){
			data = {error: "user not found"};
		}
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});

router.delete("/:id", async (req, res) => {
	let data = null;
	try {
		data =await  userData.getUserById(req.params.id)
		if(data.error){
			res.status(404).json({ error: "user not found" });
			return
		}

		try{
			data = await userData.removeUser(req.params.id)
			
		}catch (e){
			console.log(e);
			data = {error: e};
		}
	}catch (e) {
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});

//chat specific routes
router.get("/:username/chats",async (req, res) => {
	let data = null;
	try{
		data = await userData.getChats(req.params.username);
	}catch (e) {
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});
//TODO decide if this should be a get or a post request for good practice
router.get("/:username/chats/:chatId/savePlaylist",async (req, res) => {
	let data = null;
	try{
		data = await userData.savePlaylistToSpotify(req.params.username,req.params.chatId);
	}catch (e){
		console.log(e);
		data = {error: e};
	}
	res.json(data);
});

module.exports = router;
