const mongoCollections = require("../config/mongoCollections");
const chats = mongoCollections.chats;
const users = mongoCollections.users;
async function clearChats(){
	console.log("clearing db,..")
	userCollection = await users()
	await userCollection.remove({});
	chatCollection = await chats()
	await chatCollection.remove({});
	console.log("...finsihed clearing db")
}
clearChats();
