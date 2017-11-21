var os = require('os');

function freemem(callback){
    callback(os.freemem() / (1024 * 1024));
}

function totalmem(callback){
    callback(os.totalmem() / (1024 * 1024));
}

function memUsage(){
    return ((1 - (os.freemem() / os.totalmem())) * 100).toFixed(2);
}

exports.freemem = freemem;
exports.totalmem = totalmem;

function totalGet(callback){
    var stat1 = getCPU(); 
    var idle1 = stat1.idle;
    var total1 = stat1.total;

    var mem = 0;
    var cpu = 0;
    
    setTimeout(function(){
        var stat2 = getCPU();
        var idle2 = stat2.idle;
        var total2 = stat2.total;
        
        var idle = idle2 - idle1;
        var total = total2 - total1;
        var per = idle / total;
        mem = memUsage();
        cpu = ((1 - per) * 100).toFixed(2);
        callback({cpu: cpu, memory: mem});
    }, 1000);
}

function getCPUUsage(){
    var stat1 = getCPU(); 
    var idle1 = stat1.idle;
    var total1 = stat1.total;
    
    setTimeout(function(){
        var stat2 = getCPU();
        var idle2 = stat2.idle;
        var total2 = stat2.total;
        
        var idle = idle2 - idle1;
        var total = total2 - total1;
        var per = idle / total;
        return ((1 - per) * 100).toFixed(2);
    }, 1000);
}

function getCPU(){
    var cpu = os.cpus();
    
    var user = 0;
    var nice = 0;
    var sys = 0;
    var idle = 0;
    var irq = 0;
    var total = 0;
    
    for(var c in cpu){
        user += cpu[c].times.user;
        nice += cpu[c].times.nice;
        sys += cpu[c].times.sys;
        irq += cpu[c].times.irq;
        idle += cpu[c].times.idle;
    }
    
    var total = user + nice + sys + idle + irq;
    return {'idle' : idle, 'total' : total};
}

exports.cpumem = function(callback){
    totalGet(callback);
}