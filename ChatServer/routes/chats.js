const express = require('express');
const router = express.Router();
const data = require("../data");
const chatData = data.chats;
//TODO make this less barebones, everything that is needed for the chat to function is here tho
//add new message
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
router.post("/:chatId/message", async (req, res) => {
    let message = req.body;
    console.log("tried to put a message in chat " + req.params.chatId );
    if (!message) {
        res.status(400).json({ error: "You must provide chat data to create a chat" });
        return;
    }
    try{
        let newChat =await chatData.addMessage(req.params.chatId,message);
        console.log("new message added! " + JSON.stringify(newChat));
        res.json(newChat);
    }catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
//add a new chat
router.post("/", async (req, res) => {
    let chat = req.body;
    if (!chat || !chat.usernames) {
        res.status(400).json({ error: "You must provide chat data to create a chat" });
        return;
    }
	let usernames = chat.usernames;
	console.log("usernames are" + usernames);
    try{
        let newChat =await chatData.addChat(usernames);
        res.status(200).json(newChat);
    }catch(e){
        console.log(e);
		res.json({error:e});
    }
});
module.exports = router;
