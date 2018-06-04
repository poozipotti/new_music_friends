//this is a change to see if it works
const express = require("express");

const bodyParser = require("body-parser");

const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const configRoutes = require("./routes");
const port = 4000;
const path = require("path");

app.use(express.static(path.join(__dirname,"client","build")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
//middlewear to allow access to the api from our localhost
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

io.on('connection',(socket)=> {
    console.log('a user connected');
    socket.on('disconnect', () =>{
       console.log('user disconnected'); 
    });
    socket.on('chatMessage', message => {
        io.to(message.activeChat).emit('chatMessage',message);
        console.log("received message");
        console.log(message);
    });
    socket.on('songMessage', song => {
        io.to(song.chatId).emit('songMessage',song);
        console.log(`received new song change sending to ${song.chatId}`);
		
    });
    socket.on('login', username => {
		console.log(`${username} logged in`);
        socket.join(username);
    });
    socket.on('subscribe', channelId=> {
        console.log(`successful join on ${channelId}`)
        socket.join(channelId);
    });
    socket.on('startChat', chat => {
		console.log(`trying to start a chat with ${chat.users}`);
       chat.users.forEach( (user) => {
		  console.log(user.username);
          io.to(user.username).emit('subscribe',chat);
        });
    });
});

configRoutes(app);

app.listen(port, () => {
            console.log("connected to api sever listening on http://localhost:"+port);

});
