'use strict';
var crypto = require('crypto');

var Schema = {};

/* Create mongoose schema */
Schema.createSchema = function(mongoose) {
    var userSchema = mongoose.Schema({
        id: {type: String, required: true, unique: true},
        hashed_password: {type: String, required: true}, // Crypted password
        salt: {type: String, required: true},
        name: {type: String, required: true},
        age: {type: Number, required: true},
        sex: {type: Number, required: true}, // Man: 0, Woman: 1, Other: -1
        permission: {type: String, required: true},
        register: {type: Date, 'default' : Date.now}
    });
    
    userSchema.virtual('password').set(function(password){
        this._password = password;
        this.salt = this.makeSalt();
        this.hashed_password = this.encrypt(password);
    }).get(function() {
        return this._password;
    });
    
    userSchema.method('encrypt', function(plainText, inSalt){
        if(inSalt){
            return crypto.createHmac('sha256', inSalt).update(plainText).digest('hex');
        } else {
            return crypto.createHmac('sha256', this.salt).update(plainText).digest('hex');
        } 
    });
    
    userSchema.method('makeSalt', function(){
        return Math.round((new Date().valueOf() * Math.random())) + ''; 
    });
    
    userSchema.method('authenticate', function(plainText, inSalt, hashed_password){
        if(inSalt){
            return this.encrypt(plainText, inSalt) == hashed_password;
        } else {
            return this.encrypt(plainText) == this.hashed_password;
        }
    });
    
    userSchema.path('id').validate(function(id){
        return id.length; 
    }, 'No id data');
    
    userSchema.path('name').validate(function(name){
        return name.length; 
    }, 'No name data');
    
    return userSchema;
};

module.exports = Schema;
