'use strict';
var mongoose = require('mongoose');
var logger;

var database, userSchema, userModel;
const url = 'mongodb://localhost:27017/rastro'

/* Database connect */
function connectDB() {
    logger('Connecting database..', 1);
    mongoose.Promise = global.Promise;
    mongoose.connect(url, {useMongoClient: true});
    database = mongoose.connection;
    
    database.on('error', function(){
        logger('Database connection error', 4); 
    });
    
    database.on('open', function(){
        logger('Database Connected [' + url + ']', 1);
        createUserSchema();
    });
    
    database.on('disconnection', function(){
        logger('Database was disconnected', 4);
        setTimeout(connectDB(), 5000);
    });
};

/* Create schema and model */
function createUserSchema() {
    userSchema = require('./user-schema').createSchema(mongoose);
    userModel = mongoose.model('users', userSchema);
    logger('User schema and model defined', 1);
}

/* Check user */
exports.authUser = function(id, password, callback){
    userModel.find({'id':id}, function(err, results){
        if(err) {
            callback(err, null);
            return;
        }
        
        if(results.length > 0){
            var user = new userModel({id:id});
            var auth = user.authenticate(password, results[0]._doc.salt, results[0]._doc.hashed_password);
            
            if(auth){
                callback(null, results);
            } else {
                callback(null, null);
            }
        } else {
            callback(null, null);
        }
    });
};

/* Check ID */
exports.checkId = function(id, callback){
    userModel.find({'id':id}, function(err, results){
        if(err) {
            callback(err, false);
            return;
        }
        results.length == 0 ? callback(null, true) : callback(null, false);
    });
}

/* Create new account */
exports.addUser = function(id, password, name, age, sex, permission, callback) {
    var newUser = new userModel({'id':id, 'password':password, 'name':name, 'age':age, 'sex':sex, 'permission':permission});
    newUser.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        
        logger('New user [' + id + ']', 1);
        callback(null, newUser);
    });
};

/* Change password */
exports.changePassword = function(id, password, callback) {
    userModel.findOne({'id':id}, function(err, user){
        if(err) {
            callback(false);
        } else {
            user.password = password;
            user.save(function(err){
                if(err) {
                    callback(false);
                } 
                callback(true);
            }); 
        }
    }); 
}

/* Delete user data */
exports.deleteAccount = function(id, callback) {
    userModel.remove({'id':id}, function(err){
        if(err) {
            callback(false);
        } else {
            callback(true);
        }
    });
}

/* Get user age, sex */
exports.getStatistics = function(callback) {
    userModel.find({}, {_id:0, id:0, password:0, hashed_password:0, salt:0, name:0, permission:0, register:0}, function(err, results){
        if(err) {
            callback(null);
            return;
        }
        callback(results);
    });
}

/* Warning: If you want use this module, you must call init() first. */
exports.init = function(app){
    logger = app.get('logger');
    connectDB();
}