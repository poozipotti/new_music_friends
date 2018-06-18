"use strict"
const MongoClient = require("mongodb").MongoClient;
const localPort = "mongodb://localhost:27017/" ;
let dbName = "chatdb" 
if(process.env.MONGODB_URI){
 dbName = process.env.MONGODB_URI.slice.substring(process.env.MONGODB_URI.lastIndexOf("/")+1,pocess.env.MONGODB_URI.length-1);
}
console.log("database name is" +  dbName);

const settings = {
    mongoConfig: {
        serverUrl: localPort,
        database: dbName
    }
};

let fullMongoUrl = process.env.MONGODB_URI || settings.mongoConfig.serverUrl + settings.mongoConfig.database;
console.log(`the mongo URL is ${fullMongoUrl}`)
let _connection = undefined
let connectDb = async () => {
  if (!_connection) {
    let client = await MongoClient.connect(fullMongoUrl);
	_connection  = client.db(settings.mongoConfig.database);	
  }

  return _connection;
};
module.exports = connectDb;
