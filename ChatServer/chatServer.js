const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const uuid =require('uuid');
const port = 8000;




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
http.listen(port,()=>{
    console.log('listening on port ' + port);
})
