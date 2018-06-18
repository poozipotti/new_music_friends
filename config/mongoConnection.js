"use strict"
const MongoClient = require("mongodb").MongoClient;
const mongoose = require('mongoose')
const localPort = "mongodb://localhost:27017/";


const settings = {
    mongoConfig: {
        serverUrl: localPort,
        database: "chatdb"
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
