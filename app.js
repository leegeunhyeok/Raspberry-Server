/*--------------------------*
 * --- NodeJS WebServer --- *
 * ------------------------	*
 * -- Dev: Leegeunhyeok --- *
 * - Start day : 2017-11-02 *
 * -------------------------*
 * ---- Raspberry PI 3 ---- *
 *--------------------------*/

var express = require('express'),
	http = require('http');

var path = require('path'),
	fs = require('fs'),
	static = require('serve-static'),
	bodyParser = require('body-parser');

var cookieParser = require('cookie-parser'),
	session = require('express-session'),
    crypto = require('crypto');

var mongoose = require('mongoose');

var chat = require('./app/chat.js');

var app = express();
var server;

app.set('port', 8080);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

app.use('/js', static(path.join(__dirname, 'js')));
app.use('/css', static(path.join(__dirname, 'css')));
app.use('/image', static(path.join(__dirname, 'image')));
app.use('/public', static(path.join(__dirname, 'public')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
	secret:'Raspberry@Web0509',
	resave: false,
	saveUninitialized: true
}));

var database, userSchema, userModel;

/* Database connect */
function connectDB() {
    var databaseUrl = 'mongodb://localhost:27017/rastro';
    
    console.log('Connecting database..');
    mongoose.Promise = global.Promise;
    mongoose.connect(databaseUrl, {useMongoClient: true});
    database = mongoose.connection;
    
    database.on('error', function(){
        console.log('Database connection error'); 
    });
    
    database.on('open', function(){
        console.log('Database Connected (' + databaseUrl + ')');
        createUserSchema();
    });
    
    database.on('disconnection', function(){
        console.log('Database was disconnected\nReconnecting.. (Wait 5 sec)'); 
        setInterval(connectDB, 5 * 1000); // 5 sec after
    });
};

function createUserSchema() {
    userSchema = require('./app/user-schema').createSchema(mongoose);
    userModel = mongoose.model('users', userSchema);
}

/* Check user */
var authUser = function(db, id, password, callback){
    userModel.find({'id':id}, function(err, results){
        if(err) {
            console.log(err);
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
var checkId = function(db, id, callback){
    userModel.find({'id':id}, function(err, results){
        if(err) {
            callback(err, false);
            return;
        }
        results.length == 0 ? callback(null, true) : callback(null, false);
    })
}

/* Create new account */
var addUser = function(db, id, password, name, permission, callback) {
    var newUser = new userModel({"id":id, "name":name, "password":password, "permission":permission});
    newUser.save(function(err){
        if(err){
            callback(err, null);
            return;
        }
        
        console.log('New user: [Name: %s / ID: %s]', name, id);
        callback(null, newUser);
    });
};


/*--- Router Setting ---*/
var router = express.Router();

/* Home */
router.route('/').get(function(req, res){
	var sess = req.session.user;
	var userName = sess != null ? sess.name : null;
	res.render('index', {name: userName});
});

/* Login */
router.route('/process/login').post(function(req, res){
    var id = req.body.id;
    var password = req.body.password;
    
    if(id == '' || password == '') {
        res.redirect('/');
    } else if(database) {
        authUser(database, id, password, function(err, docs){
            if(err) {
                throw err;
            }
            
            if(docs) {
                var id = docs[0].id;
                var name = docs[0].name;
                console.log('Hello, [%s]', name);
                req.session.user = {
                    id: id,
                    name: name,
                    authorized: true
                };
                res.redirect('/');
            } else {
                res.send("<script>alert('일치하는 사용자가 없습니다');location.href = '/';</script>");
            }
        });     
    }
});

/* Logout */
router.route('/process/logout').get(function(req, res){
	if(req.session.user){
		req.session.destroy();
	}
	res.redirect('/');
});

/* Create New account */
router.route('/join').get(function(req, res){
	if(req.session.user){
		res.redirect('/');
	} else {
		fs.readFile('public/join.html', function(err, data){
            res.writeHead(200, {'Content-Type':'text/html'});
            if(err){
                res.write('<h1>서버에 문제가 발생하였습니다.</h1><br><h4>나중에 다시 시도해주세요</h4>');
            } else {
                res.write(data);
            }
            res.end();
        });
	}
});

/* ID Check */
router.route('/process/idCheck').post(function(req, res){
    var id = req.body.id;
     
    if(database) {
        checkId(database, id, function(err, possible){
            if(err) {
                throw err;
            }
            
            res.send({result: possible});
        });
    }
});

/* Add User */
router.route('/process/addUser').post(function(req, res){
    var id = req.body.id;
    var ps = req.body.password;
    var name = req.body.name;
    var permission = req.body.permission;
	
    if(id == '' || ps == '' || name == ''){
        res.send("<script>alert('빈칸을 모두 입력해주세요.');location.href='/join'</script>");
    }
    
    if(database){
        addUser(database, id, ps, name, permission, function(err, result){
            if(err) {
                throw err;
            } else {
                res.render('success', {name: name, id: id});
            }
        }); 
    }
});

router.route('/profile').get(function(req, res){
    if(req.session.user){
        //res.redirect('/public/profile.html'); ejs 
    } else {
        res.redirect('/');
    }
});

router.route('/chat').get(function(req, res){
    var sess = req.session.user;
    var userData = sess != null ? {name: sess.name, id: sess.id} : null;
    
	if(sess){
        res.render('chat', userData);
	} else {
		res.send("<script>alert('로그인 후 다시 시도해주세요');location.href='/'</script>");
	}
});

app.use(router);

server = http.createServer(app).listen(app.get('port'), function(){
	console.log('Raspberry PI Server starting at [%d] port', app.get('port'));
    connectDB();
    chat(server);
});
