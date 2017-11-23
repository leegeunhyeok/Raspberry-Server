var socket = io();
var ready = false;

var cpu = ['Cpu', 0];
var memory = ['Memory', 0];
var chart1, chart2;

var temp_cpu = 0;
var temp_memory = 0;

var color = ['#b8f9b3', '#fafe92', '#f9c28a', '#ff8c8c'];
var values = [40, 60, 80];

socket.on('connect', function(){
    setInterval(function(){
        socket.emit('request');
    }, 1000);
}); 
    
socket.on('response', function(data){
    if(ready) {
        cpu[1] = data.cpu;
        memory[1] = data.memory;
        load();
    }
});

function init(){
    chart1 = c3.generate({
        bindto: '#cpu',
        data: {
            columns: [
                ['Cpu', 0]
            ],
            type: 'gauge',
            labels: true
        },
        color: {
            pattern: color,
            threshold: {
                values: values
            } 
        },
        axis: {
            y: {
                label: 'Percent (%)',
                max: 100,
                min: 0,
                padding: {top:0, bottom:0}
            },
            x: {
                type: 'category',
                categories: ['Usage']
            }
        }
    });
    
    chart2 = c3.generate({
        bindto: '#memory',
        data: {
            columns: [
                ['Memory', 0]
            ],
            type: 'gauge',
            labels: true
        },
        color: {
            pattern: color,
            threshold: {
                values: values
            }   
        },
        axis: {
            y: {
                label: 'Percent (%)',
                max: 100,
                min: 0,
                padding: {top:0, bottom:0}
            },
            x: {
                type: 'category',
                categories: ['Usage']
            }
        }
    });
    ready = true;
}

function load(){
    chart1.load({
        columns: [
            cpu
        ]
    });
    
    chart2.load({
        columns: [
            memory
        ]
    })
}

$(function(){
    init();
    getLog();
    
    $('#main-btn').click(function(){
        location.href = '/'; 
    });
    
    $('#get-log').click(function(){
        getLog();
    });
    
    $('#force-save-log').click(function(){
        $.ajax({
            url: '/private/forceSave',
            type: 'POST',
            data: {},
            dataType: 'JSON',
            success: function(data){
                $('#log-area').html('');
                if(data){
                    alert('저장 성공!');
                } else {
                    alert('저장 실패');
                }
            }
        });
    });
    
    
    $('#rm-log').click(function(){
        $.ajax({
            url: '/private/removeLog',
            type: 'POST',
            data: {},
            dataType: 'JSON',
            success: function(data){
                if(data){
                    alert('삭제 됨');
                } else {
                    alert('삭제 실패');
                }
            }
        });
    });
});

function getLog(){
    $.ajax({
        url: '/private/getLog',
        type: 'POST',
        data: {},
        dataType: 'JSON',
        success: function(result){
            var data = result.data;
            if(data){
                $('#log-area').html(data.log);
                $('#cycle').html('Log Cycle [' + data.cycle + '] Lines');
            } else if(result === 0) {
                alert('로그가 없습니다');
            } else {
                $('#log-area').html('Failed to get log data');
            }
        }
    });
}