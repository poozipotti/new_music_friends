"use strict"
const MongoClient = require("mongodb").MongoClient;

const settings = {
    mongoConfig: {
        serverUrl: "mongodb://localhost:27017/",
        database: "chatdb"
    }
};

let fullMongoUrl = settings.mongoConfig.serverUrl + settings.mongoConfig.database;
let _connection = undefined

let connectDb = async () => {
  if (!_connection) {
    let client = await MongoClient.connect(fullMongoUrl);
	_connection  = client.db(settings.mongoConfig.database);	
  }

  return _connection;
};
module.exports = connectDb;
