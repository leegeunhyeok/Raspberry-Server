'use strict';
var fs = require('fs');
var db, logger;

/*-----  Process route  -----*/
// Login
function login (req, res){
    var id = req.body.id;
    var password = req.body.password;
    
    if(id == '' || password == '') {
        res.redirect('/');
    } else if(db) {
        db.authUser(id, password, function(err, docs){
            if(err) {
                logger(err, 4);
                return;
            }
            
            if(docs) {
                var id = docs[0].id;
                var name = docs[0].name;
                var age = docs[0].age;
                var permission = docs[0].permission;
                
                if(permission == 'admin'){
                    logger('Administrator login [' + id + ']', 1);
                } else {
                    logger('Login succeed [' + id + ']', 1);
                }
                
                req.session.user = {
                    id: id,
                    name: name,
                    age: age,
                    permission: permission, 
                    authorized: true
                };
                res.redirect('/');
            } else {
                res.send("<script>alert('일치하는 사용자가 없습니다');location.href = '/';</script>");
            }
        });     
    }
};

// Logout
function logout(req, res){
	if(req.session.user){
		req.session.destroy();
	}
	res.redirect('/');
};

// ID duplication check
function idcheck(req, res){
    var id = req.body.id;
     
    if(db) {
        db.checkId(id, function(err, possible){
            if(err) {
                logger(err, 4);
            }
            res.send({result: possible});
        });
    }
};

// Create new user
function adduser(req, res){
    var id = req.body.id;
    var ps = req.body.password;
    var name = req.body.name;
    var age = req.body.age;
    var sex = req.body.sex;
    var permission = req.body.permission;
	
    if(id == '' || ps == '' || name == '' || age == '' || sex == ''){
        res.send("<script>alert('빈칸을 모두 입력해주세요');location.href='/join'</script>");
    }
    
    if(db){
        db.addUser(id, ps, name, age, sex, permission, function(err, result){
            if(err) {
                logger(err, 4);
                res.send("<script>alert('회원가입에 실패하였습니다. 다시 시도해주세요');location.href='/join'</script>");
            } else {
                res.render('success', {name: name, id: id});
            }
        }); 
    }
};

// Password change
function change(req, res){
    var ps1 = req.body.password1;
    var ps2 = req.body.password2;
    var id = req.body.id;
	
    if(ps1 != ps2){
        res.send("<script>alert('입력한 비밀번호가 일치하지 않습니다');location.href='/profile'</script>");
    }
    
    if(db){
        db.changePassword(id, ps1, function(result){
            if(result){
                res.send("<script>alert('비밀번호가 변경되었습니다');location.href='/'</script>");
            } else {
                res.send("<script>alert('비밀번호 변경 실패');location.href='/'</script>");
            }
        }); 
    }
};

// Delete user
function deluser(req, res){
    var id = req.body.id;
    if(db){
        db.deleteAccount(id, function(result){
            if(result){
                req.session.destroy();
                res.send("<script>alert('정상적으로 탈퇴되었습니다');location.href='/'</script>");
            } else {
                res.send("<script>alert('탈퇴 도중 문제가 발생하였습니다');location.href='/'</script>");
            }
        }); 
    }
};

// File upload
function upload(req, res){
    var file = req.file;
    if(file){   
        logger(file.filename + ' uploaded by ' + req.session.user.id, 1);
        res.send("<script>alert('업로드가 완료되었습니다');location.href='/share'</script>");
    } else {
        res.send("<script>alert('업로드 실패');location.href='/share'</script>");
    }
};

// File remove
function removefile(req, res){
    var target = './files/' + req.body.filename;
    logger('Removing file.. target: ' + target, 1);
    fs.unlink(target, function(err){
        if(err) {
            logger('Can not remove this file', 4);
            logger(err);
            res.send({result: false});
        } else {
            logger(target + ' was removed', 1);
            res.send({result: true});
        }
    });
}

function statistics(req, res){
    db.getStatistics(function(data){
        if(data){
            res.send({result: data});
        } else {
            res.send({result: null});
        }
    });
}

exports.process = {
    login: login,
    logout: logout,
    idcheck: idcheck,
    adduser: adduser,
    change: change,
    delete: deluser,
    upload: upload,
    removefile: removefile,
    statistics: statistics
} 


/*-----  Private route  -----*/
// Add new admin
function addadmin(req, res){
    sendHtml('public/private.html', req, res);
};

// Get temp log
function getlog(req, res){
    var logdata = logger('g');
    if(logdata.count <= 0){
        res.send({data: 0});
        return;
    }
        
    if(logdata){
        res.send({data: logdata});
    } else {
        res.send({data: null});   
    }
}

// Force save logfile
function forcesave(req, res){
    logger('f');
    res.send({data: 1});
}

// rm all log files
function removelog(req, res){
    logger('r');
    res.send({data: 1});
}

exports.private = {
    addadmin: addadmin,
    getlog: getlog,
    forcesave: forcesave,
    removelog: removelog
}


/*-----  Page route  -----*/
// Main
function root(req, res){
	var sess = req.session.user;
    if(sess){
        var userName = sess != null ? sess.name : null;
        var permission = sess.permission == 'admin' ? true : false;
    }
	res.render('index', {name: userName, permission: permission});
};

// Join
function join(req, res){
	if(req.session.user){
		res.redirect('/');
	} else {
        sendHtml('public/join.html', req, res);
	}
};

// Profile
function profile(req, res){
    var sess = req.session.user;
    
    if(sess){ 
	    var userName = sess.name;
        var id = sess.id;
        var age = sess.age;
	    res.render('profile', {name: userName, age: age, id: id});
    } else {
        res.redirect('/');
    }
};

// Chat
function chat(req, res){
    var sess = req.session.user;
	if(sess) {
        var userData = sess != undefined ? {name: sess.name, id: sess.id} : undefined;
        res.render('chat', userData);
	} else {
		res.send("<script>alert('로그인 후 다시 시도해주세요');location.href='/'</script>");
	}
};

// File share
function share(req, res){
    var sess = req.session.user;
    if(sess){
        var userName = sess.name;
        var permission = sess.permission;
    }
    
    var dir = './files';
    fs.readdir(dir, function(err, list){ 
        if(err) {
            logger(err, 4);
        } 
        res.render('share', {name: userName, permission: permission, files: list});
    });
};

// Poerfolio
function portfolio(req, res){
    sendHtml('public/portfolio.html', req, res);
};

// Web page info
function info(req, res){
    sendHtml('public/info.html', req, res);
};

// Admin page
function admin(req, res){
    var sess = req.session.user;
    if(sess == undefined) {
        logger('No session', 3);
        res.redirect('/');
        return;
    }
    
    var permission = sess.permission; 
    if(permission == 'admin'){
        sendHtml('public/admin.html', req, res);
    } else {
        logger('Admin page access denied', 3);
        res.send("<script>alert('액세스가 거부되었습니다');location.href='/'</script>");
    }
};

function sendHtml(dir, req, res){
    fs.readFile(dir, function(err, data){
        if(err){
            logger(err, 4);
            res.send("<script>alert('서버에 문제가 발생하였습니다');location.href='/'</script>");
        } else {
            res.writeHead(200, {'Content-Type':'text/html'});
            res.write(data);
        }
        res.end();
    });
}

exports.page = {
    root: root,
    join: join,
    profile: profile,
    chat: chat,
    share: share,
    portfolio: portfolio,
    info: info,
    admin: admin
}

/* Warning: If you want use this module, you must call init() first. */
exports.init = function(app){
    db = app.get('database');
    logger = app.get('logger');
    logger('Router initialization complete', 1);
}