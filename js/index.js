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
    
    $('#blog-btn').click(function(){
        location.href = '/blog';
    });
    
    $('#file-btn').click(function(){
        location.href = '/files';
    });
    
    $('#portfolio-btn').click(function(){
        location.href = '/portfolio';
    });
});

