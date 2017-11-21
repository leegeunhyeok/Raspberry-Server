var socket = io();
var ready = false;

var cpu = ['Cpu', 0];
var memory = ['Memory', 0];
var chart;

var temp_cpu = 0;
var temp_memory = 0;

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
    chart = c3.generate({
        bindto: '#status',
        data: {
            columns: [
                ['Cpu', 0], 
                ['Memory', 0]
            ],
            type: 'bar',
            labels: true
        },
        axis: {
            y: {
                label: 'Percent (%)',
                max: 100,
                min: 0,
                padding: {top:0, bottom:0}
            },
            y2: {
                show: true
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
    chart.load({
        columns: [
            cpu, memory
        ]
    });
}

$(function(){
    init();
    
    $('#main-btn').click(function(){
        location.href = '/'; 
    });
});