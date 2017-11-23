$(function(){
    var resultName = $('#check-name');
    var resultAge = $('#check-age');
    var resultId = $('#check-id');
    var resultPwd = $('#check-pwd');
    var checkBtn = $('#id-check');
    var nameCheck = false, ageCheck = false, idCheck = false, passwordCheck = false;
    
    $('#back-btn').click(function(){
        location.href = "/"; 
    });
    
    $('#input-name').change(function(){
        var regExp = /^[가-힣a-zA-Z]{2,6}$/;
        var data = $(this).val();
        resultName.removeClass('text-success text-danger');
        
        if(data.match(regExp)){
            nameCheck = true;
            resultName.addClass('text-success');
            resultName.html('사용 가능합니다');
        } else {
            nameCheck = false;
            resultName.addClass('text-danger');
            resultName.html('사용할 수 없습니다');
        }
        checkAll();
    });
    
    $('#input-age').change(function(){
        var regExp = /^([0-9]|[1-9][0-9])$/;
        var data = $(this).val();
        resultAge.removeClass('text-success text-danger');
        
        if(data.match(regExp)){
            ageCheck = true;
            resultAge.addClass('text-success');
            resultAge.html('사용 가능합니다');
        } else {
            ageCheck = false;
            resultAge.addClass('text-danger');
            resultAge.html('사용할 수 없습니다');
        }
        checkAll();
    });
    
    $('#input-id').change(function(){
        var regExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i; 
        var data = $(this).val();
        idCheck = false;
        checkBtn.prop('disabled', true);
        resultId.removeClass('text-success text-danger');
        
        if(data.length == 0) {
            resultId.html('이메일을 입력해주세요');
            resultId.addClass('text-danger');
        } else {
            if(data.match(regExp)){
                checkBtn.prop('disabled', false);
                resultId.removeClass('text-success text-danger');
                resultId.html('중복확인을 해주세요');
            } else {
                resultId.html('이메일 형식을 확인해주세요');
                resultId.addClass('text-danger');
            }
        }
    });
    
    $('#input-password').change(function(){
        var regExp = /^[a-zA-Z0-9]{6,14}$/;
        var data = $('#input-password').val();
        
        if(data.match(regExp)){
            passwordCheck = true;
            resultPwd.removeClass('text-danger');
            resultPwd.addClass('text-success');
            resultPwd.html('사용 가능합니다');
        } else {
            passwordCheck = false;
            resultPwd.removeClass('text-success');
            resultPwd.addClass('text-danger');
            resultPwd.html('사용할 수 없습니다');
        }
        checkAll();
    });
    
    $('#id-check').click(function(){
        var id = $('#input-id').val();
        
        $.ajax({
            url: '/process/idCheck',
            type: 'POST',
            data: {'id' : id},
            dataType: 'JSON',
            success: function(data){
                if(data.result == true){
                    idCheck = true;
                    resultId.html('사용 가능한 이메일입니다');
                    resultId.removeClass('text-danger').addClass('text-success');
                    checkAll();
                } else {
                    idCheck = false;
                    resultId.html('이미 존재하는 이메일입니다');
                    resultId.removeClass('text-success').addClass('text-danger');
                }
            }, error: function(err){
                alert(err);
            }
        });
    });
    
    function checkAll(){
        if(nameCheck && ageCheck && idCheck && passwordCheck){
            $('#submit').prop('disabled', false);
            $('#submit').addClass('btn-primary');
        } else {
            $('#submit').prop('disabled', true);
            $('#submit').removeClass('btn-primary');
        }
    }
});




