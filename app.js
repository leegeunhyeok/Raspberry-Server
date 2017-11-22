/*--------------------------*
 * --- NodeJS WebServer --- *
 * ------------------------	*
 * -- Dev: Leegeunhyeok --- *
 * - Start day : 2017-11-02 *
 * -------------------------*
 * ---- Raspberry PI 3 ---- *
 *--------------------------*/
'use strict';
var express = require('express'),
	http = require('http');

var path = require('path'),
	serv_static = require('serve-static');

var cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
	session = require('express-session');

var database = require('./app/database'),
    route = require('./app/router'),
    socket = require('./app/socket'),
    upload = require('./app/upload'),
    logger = require('./app/logger');

var app = express();

/* App set */
app.set('port', 8080);
app.set('database', database);
app.set('logger', logger);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

/* Use middleware */
app.use('/js', serv_static(path.join(__dirname, 'js')));
app.use('/css', serv_static(path.join(__dirname, 'css')));
app.use('/image', serv_static(path.join(__dirname, 'image')));
app.use('/public', serv_static(path.join(__dirname, 'public')));
app.use('/files', serv_static(path.join(__dirname, 'files')));
app.use('/c3', serv_static(path.join(__dirname, 'js/c3')));
app.use('/d3', serv_static(path.join(__dirname, 'js/d3')));

app.use(cookieParser());
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({
	secret:'Raspberry@Web0509',
	resave: false,
	saveUninitialized: true
}));

/*--- Router Setting ---*/
var router = express.Router();
router.route('/process/login').post(route.process.login);
router.route('/process/logout').get(route.process.logout);
router.route('/process/idCheck').post(route.process.idcheck);
router.route('/process/addUser').post(route.process.adduser);
router.route('/process/change').post(route.process.change);
router.route('/process/delete').post(route.process.delete);
router.route('/process/upload').post(upload.array('file', 1), route.process.upload);
router.route('/process/removeFile').post(route.process.removefile);
router.route('/process/getStatistics').post(route.process.statistics);

router.route('/private/addAdmin').get(route.private.addadmin);

router.route('/').get(route.page.root);
router.route('/join').get(route.page.join);
router.route('/profile').get(route.page.profile);
router.route('/chat').get(route.page.chat);
router.route('/share').get(route.page.share);
router.route('/portfolio').get(route.page.portfolio);
router.route('/info').get(route.page.info);
router.route('/admin').get(route.page.admin);
app.use(router);

/* Create server */
http.createServer(app).listen(app.get('port'), function(){
    logger('Server starting..', 1);
	logger('Raspberry PI Server is running > port: ' + app.get('port'), 1);
    database.init(app);
    route.init(app);
    socket.init(this, app);
});
