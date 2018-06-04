const express = require('express');
const router = express.Router();
const data = require("../data");
const chatData = data.chats;
//TODO make this less barebones, everything that is needed for the chat to function is here tho
router.get("/", async (req, res) => {
	let data = null
    try{
	   data = await chatData.getAllChats(); 
    }catch (e){
        console.log(e);
        data = ({error: e});
    }
	res.json(data);
});
//add new message
router.post("/:chatId/message", async (req, res) => {
    let message = req.body;
    console.log("tried to put a message in chat " + req.params.chatId );
    if (!message) {
        res.status(400).json({ error: "You must provide chat data to create a chat" });
        return;
    }
    try{
        let newChat =await chatData.addMessage(req.params.chatId,message);
        res.json(newChat);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
//add a new chat
router.post("/", async (req, res) => {
    let chat = req.body;
    if (!chat || !chat.usernames || !chat.chatName) {
        res.status(400).json({ error: "You must provide chat data to create a chat" });
        return;
    }
    try{
        let newChat =await chatData.addChat(chat.usernames,chat.chatName);
        res.status(200).json(newChat);
    }catch(e){
        console.log(e);
		res.json({error:e});
    }
});
//add new song
router.post("/:chatId/song/", async (req, res) => {
    let song = req.body;
    //console.log("tried to put a song in chat " + req.params.chatId );
    if (!song)  {
        res.status(400).json({ error: "You must provide song data to create a chat" });
        return;
    }
	if(!song.username){
        res.status(400).json({ error: "You must provide a username field in the song object" });
		return;
	}
    try{
        let newChat =await chatData.addSong(req.params.chatId,song.username,song);
        //console.log("new song added! " + JSON.stringify(song));
        res.json(newChat);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
module.exports = router;
