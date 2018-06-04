"use strict"
const MongoClient = require("mongodb").MongoClient;
const herokuMongo = 'mongodb://heroku_wcrk0q1l:dcvendbmcf8emrgfdrt66014cf@ds247690.mlab.com:47690/heroku_wcrk0q1l";
const localPort = "mongodb://localhost:27017/";


const settings = {
    mongoConfig: {
        serverUrl: herokuMongo,
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
