$(function(){
    $('[data-toggle="popover"]').popover();
    
    $('#logout-btn').click(function(){
	    location.href = '/process/logout';
	});

    $('#join-btn').click(function(){
	    location.href = '/join';
    });
    
    $('#mypage-btn').click(function(){
        location.href = '/profile';
    });
    
    $('#monitor-btn').click(function(){
         location.href = '/admin';
    });
    
    $('form').submit(function(){
        var id = $('#input-id').val();
        var ps = $('#input-password').val();
        
        if(id == '' || ps == ''){
            alert('아이디와 비밀번호를 입력해 주세요');
        }
    });
    
    $('#chat-btn').click(function(){
        location.href = '/chat';
    });
    
    $('#file-btn').click(function(){
        location.href = '/share';
    });
    
    $('#portfolio-btn').click(function(){
        location.href = '/portfolio';
    });
    
    $('#info-btn').click(function(){
        location.href = '/info';
    });
});

