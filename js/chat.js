var socket = io();
var name;
var id;

socket.on('connect', function(){
    name = $('#name').html();
    id = $('#id').html();
    socket.emit('adduser', {name: name, id: id}); 
});

socket.on('update', function(name, _id, data){
    if(id == _id) {
        $('#conversation').append('<div><div class="my-message">' + data + '</div></div><br><br><br>');
    } else if(_id == 'SERVER_CONNECT') {
        $('#conversation').append('<div><div class="connect-message margin text-center">' + data + '</div></div><br>');
    } else if(_id == 'SERVER_DISCONNECT') {
        $('#conversation').append('<div><div class="disconnect-message margin text-center">' + data + '</div></div><br>')
    } else {
        $('#conversation').append('<div><div class="name">' + name + '</div><div class="message">' + data + '</div></div><br>');
    }
    $('html, body').scrollTop(document.body.scrollHeight);
});

socket.on('update-users', function(list){
    $('#users').empty();
    $.each(list, function(key, val){
        $('#users').append('<li class="list-group-item">' + val + '<span class="badge">' + key + '</span></li>'); 
    });
});

$(function(){
    $('#back-btn').click(function(){
        location.href = '/'; 
    });
    
    $('#send-btn').click(function(){
        var msg = $('#text-area').val();
        if(msg == '') return;
        $('#text-area').val('');
        socket.emit('send', msg);
        $('#text-area').focus();
    });
    
    $('#text-area').keypress(function(event){
        if(event.which == 13){
            $('#send-btn').focus().click();
            $(this).focus();
        }
    });
});