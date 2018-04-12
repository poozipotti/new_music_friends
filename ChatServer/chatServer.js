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
    socket.on('login', username => {
        socket.join(username);
        io.emit("login",username);
    });
    socket.on('subscribe', channelId=> {
        console.log(`successful join on ${channelId}`)
        socket.join(channelId);
    });
    socket.on('startChat', users => {
       let chatId = uuid.v4()
       users.forEach( (user) => {
          console.log(`subscribing ${user} to ${chatId}`);
          io.to(user).emit('subscribe',{_id:chatId,users:users,chatLog:[]});
        });
    });
});
http.listen(port,()=>{
    console.log('listening on port ' + port);
})
