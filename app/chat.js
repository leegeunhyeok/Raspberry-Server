module.exports = function(server){
    var userlist = {};
    var io = require('socket.io').listen(server);
    
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
            console.log(name + '(' + id + ')' + ' has connected');
        });
        
        socket.on('disconnect', function(){
            delete userlist[socket.id];
            io.sockets.emit('update-users', userlist);
            socket.broadcast.emit('update', 'SERVER', 'SERVER_DISCONNECT', 
            socket.name + '(' + socket.id + ') 님이 연결을 종료하였습니다.');
            console.log(socket.name + '(' + socket.id + ')' + ' was disconnected');
        })
    });
}