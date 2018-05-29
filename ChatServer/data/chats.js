const mongoCollections = require("../config/mongoCollections");
const chats = mongoCollections.chats;
const users = mongoCollections.users;
const uuid = require("node-uuid");
const userData = require("./users");

/*format is 
	{
		_id: uuid,
		usernames: usernames in the chat(list),
		messages: messages in the chat(list) 
	}
*/
let exportedMethods = {
    async getAllChats() {
        const chatCollection = await chats();
        const allChats = await chatCollection.find({}).toArray();
        return allChats;
    },
    async getChatById(id) {
        const chatCollection = await chats();
        try {
            let chat = await chatCollection.findOne({ _id: id });
            return chat;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addChat(usernames){
        let newchat = {
			_id: uuid.v4(),
			users: [],
			messages: []
		}; 
		const chatCollection = await chats();
		const userCollection = await users();
		let usersFound = await userCollection.find({username: {$in :usernames}}).toArray();
		if(usersFound.length !== usernames.length){
			throw "Error: could not find all users!"
			return;
		}
		try{
			for(let i=0;i<usernames.length;i++){
				try{
					await userData.addChat(usernames[i],newchat._id);
				}catch (e){
					throw e;
					break;	
				}
			}
		}catch (e){
			console.log(e);
			return {error: e};
		}
		newchat.users = usernames.map( username => {
			return {username:username,song:""};
		});
		let response = await chatCollection.insertOne(newchat);
		return chatCollection.findOne({_id:newchat._id}); 
    },
    async replaceChat(id,chat){
        try{
            const chatCollection = await chats();
            let response = await chatCollection.updateOne({_id:id},chat);
            return response; 
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addMessage(id,message){
        try{
            const chatCollection = await chats();
            let response = await chatCollection.updateOne({_id:id},{$push: {messages:message}});
			let updatedChat = await chatCollection.findOne({_id:id});
            return updatedChat; 
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addUser(chatId,username){
        try{
            const chatCollection = await chats();
			await userData.addChat(newchat.users[i].username,newchat._id);
            let response = await chatCollection.updateOne({_id:id},{$push: {users: {username:username,song:null,uri:null} } });
            return response; 
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addSong(chatId,username,song){
        try{
            const chatCollection = await chats();
            let response = await chatCollection.updateOne({_id:chatId,"users.username":username},{$set: {"users.$.song":song} });
			let updatedChat = await chatCollection.findOne({_id:chatId});
            return updatedChat; 
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
	async getSongs(chatId){
		const chatCollection = await chats();
		let chat = await chatCollection.findOne({ _id: id });
		let response = {songs: []};
		if(!chat){
			throw "could not find chat with that id!"
			return;
		}
		for(let i =0; i<chat.users.length; i++){
			if(chat.users[i].song){
				response.songs.push(chat.users[i].song);
			}
		}
		return response;
	},
    async removeChat(id) {
        const chatCollection = await chats();
        let response =null
        try{ 
			response = await chatCollection.removeOne({_id:id})
            if(response.deletedCount ==0){
                throw `could not find user with id of ${id}`;
            }
            return response;
        }catch (e){
            console.log("there was an error");
            console.log(e);
        }
    }
};

module.exports = exportedMethods;
