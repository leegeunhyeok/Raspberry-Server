$(function(){
    $('.del-btn').click(function(){
        var filename = $(this).attr('name');
        $.ajax({
            url: '/process/removeFile',
            type: 'POST',
            data: {'filename' : filename},
            dataType: 'json',
            success: function(data){
                if(data.result == true){
                    alert('파일을 삭제하였습니다');
                } else {
                    alert('파일을 삭제하지 못했습니다');
                }
                location.href = '/share';
            }
        });
    });
});