'use strict';
var os = require('./monitor');

exports.init = function(server, app){
    var userlist = {}; // Connected user list
    var io = require('socket.io').listen(server);
    var logger = app.get('logger');
    logger('Socket module ready', 1);
    
    /* Chat socket */
    io.sockets.on('connection', function(socket){
        socket.on('send', function(data){
            io.sockets.emit('update', socket.name, socket.id, data);
        }); 
        
        socket.on('adduser', function(info){
            var name = info.name;
            var id = info.id;      
            socket.name = name;
            socket.id = id;
            userlist[id] = name;
            io.sockets.emit('update', 'SERVER', 'SERVER_CONNECT', name + '(' + id + ') 님이 접속하였습니다.');
            io.sockets.emit('update-users', userlist);
            logger(name + '(' + id + ')' + ' has connected', 1);
        });
        
        // Admin page
        socket.on('request', function(){
            os.cpumem(function(data){
                io.sockets.emit('response', data);
            });
        });
        
        socket.on('disconnect', function(){
            var temp = userlist[socket.id];
            
            if(temp != undefined){ // Only chat(Not admin page)
                delete userlist[socket.id];
                io.sockets.emit('update-users', userlist);
                socket.broadcast.emit('update', 'SERVER', 'SERVER_DISCONNECT', 
                socket.name + '(' + socket.id + ') 님이 연결을 종료하였습니다.');
                logger(socket.name + '(' + socket.id + ')' + ' was disconnected', 1);
            }
        });
    });
}