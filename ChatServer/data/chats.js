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
			usernames: usernames,
			messages: []
		}; 
		const chatCollection = await chats();
		const userCollection = await users();
		let usersFound =await  userCollection.find({username : {$in : newchat.usernames}}).toArray();
		usersFound = usersFound.length;	
		console.log(`found ${usersFound}/${newchat.usernames.length} users`);
		if(usersFound != newchat.usernames.length){
			throw "some users not found";
			return;
		}	
		try{
			for(let i=0;i<newchat.usernames.length;i++){
				try{
					await userData.addChat(newchat.usernames[i],newchat._id);
				}catch (e){
					throw e;
					break;	
				}
			}
		}catch (e){
			console.log(e);
			return {error: e};
		}
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
			await userData.addChat(newchat.usernames[i],newchat._id);
            let response = await chatCollection.updateOne({_id:id},{$push: {users:username}});
            return response; 
            
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
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
