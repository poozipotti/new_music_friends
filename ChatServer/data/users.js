const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const chats = mongoCollections.chats;
const uuid = require("node-uuid");
const bcrypt = require("bcrypt");
/* user is in the format
	{
		_id: uuid,
		username: the users chosen username,
		email: the users email
		password: password hash (hashed using bcrypt),
		chats: list of the users chats (theis field should only be changed by the addChat and removeChat functions,
		sessionID: if the user has logged in gives a session id
			
	}
*/
let exportedMethods = {
    async getAllUsers() {
        const userCollection = await users();
		let allUsers = null
		try{
			allUsers = await userCollection.find({}).toArray();
			console.log("got all users in data" + allUsers);
		}catch (e){
			console.log(e);
			return(allUsers);
		}
        return allUsers;
	},
    async getUserById(id) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ _id: id });
            if (!user) return { error: "User not found" };
            return user;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async getUserBySessionId(sessionId) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ sessionId: sessionId });
            if (!user) return { error: "User not found" };
            return user;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async getUserByUsername(username) {
        const userCollection = await users();
        try {
            let user = await userCollection.findOne({ username: username });
            return user;
        } catch (e) {
            console.log("there was an error");
            console.log(e);
        }
    },
    async addUser(username,email,password) {
        //need error checking here to make sure all fields are supplied and also need to check that their handle is unique
        let userCollection = await users();
        //here we check if the username(handle) supplied is unique if it's not, then there
        // will be an error returned and if it is then it goes ahead and adds the user
        let existingUser = await this.getUserByUsername(username.toLowerCase());
		let saltRounds = 10;
		let hashedPassword = await bcrypt.hash(password,saltRounds);
        if (existingUser) {
            return { error: "Username is not unique" };
        } else {
            let newUser = {
				_id: uuid.v4(),		
				username: username,
				email: email,
				password: hashedPassword,
				chats: [],
				sessionId: null
            };
            let addedUser = await userCollection.insertOne(newUser);
            return this.getUserById(addedUser.insertedId);
        }
    },
    async addChat(username,chatId){
        try{
            const userCollection = await users();
            let response = await userCollection.updateOne({username:username},{$push: {chats:chatId}});
			let updatedUser = await userCollection.findOne({username:username});
			if(updatedUser == null){
				throw "user not found!";
				return;
			}
        } catch (e) {
			throw e;
        }
    },
    async getChats(username){
		const userCollection = await users();
		const chatCollection = await chats();
		try{
			let user = await userCollection.findOne({username:username});
			let chats = []; 
			for(let i=0;i<user.chats.length;i++){
				try{
					chats.push(await chatCollection.findOne({_id:user.chats[i]}));
					//console.log(chats);
				}catch(e){
					console.log(e);
				}
			};
			return chats; 
		}catch (e) {
			console.log(e)
			return {error: e};
		}
    },
    async removeUser(id) {
        const userCollection = await users();
        let response = await chatCollection.removeOne({_id:id})
        try{
            if(response.deletedCount ==0){
                throw `could not find user with id of ${id}`;
            }
            return response;
        }catch (e){
            console.log("there was an error");
            console.log(e);
        }
    },
    async verifyUser(username,password){
		let data = null;		
		let sessionId = uuid.v4();
        const userCollection = await users();
		data = await userCollection.findOne({username:username});
		if(!data){
			return ({verified: false});
		}else{
			await userCollection.updateOne({username:username},{$set: {sessionId:sessionId}});
			let verified = await bcrypt.compare(password,data.password);	
			return ({verified: verified,sessionId:sessionId});
		}
	}
};

module.exports = exportedMethods;
