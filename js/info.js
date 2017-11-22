var users;
var age = ['연령대', 0, 0, 0, 0, 0, 0];
var sex = [{'Man':0}, {'Woman':0}, {'Other':0}];

function init(){
    $.ajax({
        url: '/process/getStatistics',
        type: 'POST',
        dataType: 'json',
        success: function(data){
            if(data.result == null){
                console.log('Data load failed');
            } else {
                users = data.result;
                for(let temp in users){
                    user = users[temp];
                    if(user.age > 0 && user.age < 20){ // 1~19, 10대
                        age[1]++;
                    } else if(user.age >= 20 && user.age < 30) { // 20~29, 20대
                        age[2]++;
                    } else if(user.age >= 30 && user.age < 40) { // 30~39, 30대
                        age[3]++;
                    } else if(user.age >= 40 && user.age < 50) { // 40~49, 40대
                        age[4]++;
                    } else if(user.age >= 50 && user.age < 60) { // 50~59, 50대
                        age[5]++;
                    } else { // 60대 이후
                        age[6]++;
                    }
                    
                    if(user.sex == 0){ // 남성
                        sex[0].Man++;
                    } else if(user.sex == 1) { // 여성
                        sex[1].Woman++;
                    } else { // 기타
                        sex[2].Other++;
                    }
                }
                
                var chart1 = c3.generate({
                    bindto: '#age',
                    data: {
                        columns: [
                            age
                        ],
                        labels: true,
                        type: 'spline',
                        colors: {
                            연령대: '#5cc85c'
                        }
                    },
                    axis: {
                        x: {
                            type: 'category',
                            categories: ['10대', '20대', '30대', '40대', '50대', '60대 이상']
                        },
                        y: {
                            tick: {
                                format: function(d){
                                    return d + '명';
                                }
                            },
                            padding: {bottom:0}
                        }
                    }
                });

                var chart2 = c3.generate({
                    bindto: '#sex',
                    data: {
                        json: sex,
                        keys: {
                            value: ['Man', 'Woman', 'Other']  
                        },
                        labels: true,
                        type:'donut',
                        colors: {
                            Man: '#1f7399',
                            Woman: '#cc6675',
                            Other: '#f9c240'
                        }
                    }
                });
            }
        }
    });
}

$(function(){
    init();
    
    $('#main-btn').click(function(){
        location.href = '/'; 
    });
});