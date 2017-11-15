var resultPwd = $('#check-text');
var sameCheck = $('#same-text');
var c1 = false;
var c2 = false;

$(function(){ 
    $('#first').change(function(){
        var regExp = /^[a-zA-Z0-9]{6,14}$/;
        var data = $(this).val();
        
        if(data.match(regExp)){
            resultPwd.removeClass('text-danger');
            resultPwd.addClass('text-success');
            resultPwd.html('사용 가능합니다');
            c1 = true;
        } else {
            resultPwd.removeClass('text-success');
            resultPwd.addClass('text-danger');
            resultPwd.html('사용할 수 없습니다');
            c1 = false;
        }
        check();
    });
    
    $('#second').change(function(){
        check();
    });
    
    $('#main-btn').click(function(){
        location.href = '/'; 
    });
});

function check(){
    var data = $('#second').val();
    if(data == $('#first').val()){
        sameCheck.removeClass('text-danger');
        sameCheck.addClass('text-success');
        sameCheck.html('일치합니다');
        c2 = true;
    } else {
        sameCheck.removeClass('text-success');
        sameCheck.addClass('text-danger');
        sameCheck.html('일치하지 않습니다');
        c2 = false;
    }
    
    if(c1 && c2){
        $('#change-btn').prop('disabled', false);
    } else {
        $('#change-btn').prop('disabled', true);
    }
}