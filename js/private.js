$(function(){
    $('#id-check').click(function(){
        var id = $('#input-id').val();
        
        $.ajax({
            url: '/process/idCheck',
            type: 'POST',
            data: {'id' : id},
            dataType: 'html',
            success: function(data){
                data = JSON.parse(data);
                if(data.result == true){
                    alert('사용가능');
                } else {
                    alert('사용 불가능');
                }
            }
        });
    });
});