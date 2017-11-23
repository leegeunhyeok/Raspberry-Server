'use strict';
var moment = require('moment'),
    fs = require('fs'),
    os = require('os');

var cycle = 50, //default: 50
    count = 0,
    temp_log = '';

/* Array index */
const type = 0,
      color = 1;

/* Log level */
const level = {
    0: ['[debug]', '\x1b[37m'], // White 0
    1: ['[info]', '\x1b[32m'], // Green 1 
    2: ['[notice]', '\x1b[36m'], // Cyan 2
    3: ['[warning]', '\x1b[33m'], // Yellow 3
    4: ['[error]', '\x1b[31m'], // Red 4
    5: ['[danger]', '\x1b[31m'] // Red 5
}

/* Log file dir */
const dir = './log/';

/* Time format */
function timeStamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

/* Logfile name format */
function logTimeStamp() {
    return moment().format('YYYY-MM-DD_HH-mm-ssZZ') + '.log';
}

/* Save log file */
function saveLogfile(force){
    var name = dir + logTimeStamp(); // Dir and file name
    fs.writeFile(name, temp_log, 'utf8', function(err){
        temp_log = ''; // temp_log init
        
        if(err){
            log('Failed to save log', 4);
            log(err, 4);
            return;
        } 
        
        var msg = 'Log saved [' + name + ']';
        msg = force ? msg + ' -force' : msg; 
        
        log(msg, 1);
        log('Log count: ' + (count+1), 1);
    });
}

/* Remove all log file */
function removeAllLog(){
    fs.readdir(dir, function(err, files){
        if(err) {
            log(err, 4);
        } else {
            for(var f in files){
                fs.unlink(dir + files[f], function(err){
                    if(err) {
                        log(err, 4);
                    } 
                });
            }
        }
    });
}

/* Message, level, MSG OPTION:(f: force save, c: clear count, g: get logdata, s: set sycle, r: remove all logfile) */
function log(msg, lv){
    if(msg == undefined || msg == null) return;
    
    if(msg == 'f') {
        count = 0;
        saveLogfile(true);
        return;
    } else if(msg == 'c') {
        count = 0;
        return;
    } else if(msg == 'g') {
        return {log:temp_log, count: count, cycle: cycle};
    } else if(msg == 's') {
        cycle = (lv != undefined && lv >= 10) ? 10 : lv;
        return;
    } else if(msg == 'r') {
        removeAllLog();
        return;
    }

    var temp = level[lv];
    var time = timeStamp();
    count++;
    
    if(temp == undefined){
        temp = level[0]; // If undefined(default) - debug
        console.log(time, temp[color], temp[type], '\x1b[0m', msg);
    } else {
        console.log(time, temp[color], temp[type], '\x1b[0m', msg);
    }
    
    temp_log += time + ' ' + temp[type] + ' ' + msg + os.EOL; // Save log data
    if(count % cycle == 0) {
        saveLogfile(false); // Log data save
    }
}

module.exports = log;
