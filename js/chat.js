var socket = io();

socket.on('connect', function(){
    var name = $('#name').html();
    var id = $('#id').html();
    console.log(name + ' / ' + id);
    socket.emit('adduser', {name: name, id: id}); 
});

socket.on('update', function(name, data){
    $('#conversation').append('<div><div class="name">' + name + '</div><div class="message">' + data + '</div></div><br>');
});

socket.on('update-users', function(list){
    $('#users').empty();
    $.each(list, function(key, val){
        $('#users').append('<li class="list-group-item">' + val + '<span class="badge">' + key + '</span></li>'); 
    });
});

$(function(){
    $('#send-btn').click(function(){
        var msg = $('#text-area').val();
        $('#text-area').val('');
        socket.emit('send', msg);
    });
    
    $('#text-area').keypress(function(event){
        if(event.which == 13){
            $(this).blur();
            $('#send-btn').focus().click();
        }
    })
});