'use strict';
var moment = require('moment'),
    fs = require('fs'),
    os = require('os');

var cycle = 30, //default: 30
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

/* Time format */
function timeStamp() {
    return moment().format('YYYY-MM-DD HH:mm:ss.SSS ZZ');
}

/* Logfile name format */
function logTimeStamp() {
    return moment().format('YYYY-MM-DD_HH-mm-ssZZ') + '.log';
}

/* Save log file */
function saveLogfile(){
    var name = './log/' + logTimeStamp(); // Dir and file name
    fs.writeFile(name, temp_log, 'utf8', function(err){
        temp_log = ''; // temp_log init
        
        if(err){
            log('Failed to save log', 4);
            log(err, 4);
            return;
        } 
        log('Log saved [' + name + ']', 1);
        log('Log count: ' + count, 1);
    });
}

/* Message, level, option(false: default, true: Don't save temp_log) */
function log(msg, lv, force){
    if(msg == undefined || msg == null) return;
    force == undefined ? false : true;
    
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
    if(count % cycle == 0 && !force) {
        saveLogfile(); // Log data save
    }
}

/* Change cycle */
exports.setLogCycle = function(num){
    log('Log Cycle changed' + count + '>' + num);
    count = num;
}

/* Get temp_log */
exports.getLog = function(){
    return temp_log;
}

/* Get log count */
exports.getLogCount = function(){
    return count;
}

/* Force save logfile */
exports.forceSave = function(){
    count = 0;
    log('Force save logfile', 1, true);
    log('Reset log count', 3, true);
    saveLogfile();
}

module.exports = log;
