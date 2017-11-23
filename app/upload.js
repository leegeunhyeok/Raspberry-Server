'use strict';
var multer = require('multer'),
    date = require('date-utils');

/* Save info */
var storage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './files/'); // dir
    }, 
    filename: function (req, file, callback) {
        var now = new Date();
        var format = now.toFormat('YYYYMMDD_HH24MISS');
        callback(null, format + '_' + file.originalname); // File name format
    }
});

var upload = multer({
    storage: storage, // Save info
    limits: {
        fileSize: 1024 * 1024 * 5 // Max size : 5MB
    }
}).single('file');

module.exports = upload;