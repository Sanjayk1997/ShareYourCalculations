var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var path = require('path');

users = [];
connections = [];

server.listen(process.env.PORT || 3000);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

io.sockets.on('connection', function(socket){
    connections.push(socket);

    //Disconnect
    socket.on('disconnect', function(data){
      if(!socket.username) return;
      users.splice(users.indexOf(socket.username),1);
      updateUsernames();
      connections.splice(connections.indexOf(socket), 1);
    });

    // Send Message
    socket.on('send', function(data){
      io.sockets.emit('new input', {msg: data});
    });

    //New users
    socket.on('new user',function(data, callback){
      callback(true);
      socket.username = data;
      users.push(socket.username);
      updateUsernames();
    });

    function updateUsernames(){
      io.sockets.emit('get users', users);
    }
});
