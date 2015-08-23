'use strict';

var express = require('express');
var bodyParser = require('body-parser');

var logger = require('cws-logger');
var config = require('cws-config');
//var apiService = require('./app/services/APIService');
var dbsetupService = require('cws-dbsetup-service');
var databaseService = require('cws-database-service');
var loginService = require('cws-login-service');
var signupService = require('cws-signup-service');
var likeDislikeService = require('cws-likedislike-service');
var bookmarkService = require('cws-bookmark-service');
var userDataService = require('cws-userdata-service');
var Content = require('cws-models').getContentModel();

var contentService = require('./contentService');
var userService = require('./userService');

var filename = 'server';

var app = express();
app.use(express.static(config.imageDir));
app.use(express.static(__dirname));
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/public/images'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});



app.get('/content', function(req, res) {
	res.sendFile(__dirname + '/contents.html');
});

app.get('/paper', function(req, res) {
	contentService.getPaper()
		.then(function(success) {
			res.status(config.httpSuccess);
			res.send({ "contents": success });
		}, function(err) {
			res.status(config.httpFailure);
			res.send({ "error": err });
		});
});

app.post('/paper', function(req, res) {
	if (!req.body.contentIds) {
		res.status(config.httpFailure);
		res.send('error');
	}

	contentService.createPaper(req.body.contentIds);
})

app.get('/login', function(req, res) {
	res.sendFile(__dirname + '/login.html');
});

app.post('/login', function(req, res) {
	if (!req.body.emailId) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /login:' + 'emailId is missing');
		res.send({ 'error': 'emailId is missing' });
	}

	if (!req.body.password) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /login:' + 'password is missing');
		res.send('password is missing');
	}		

	userService.login(req.body.emailId, req.body.password)
		.then(function(success) {
			console.log(success)
			logger.info(filename, 'POST /login:' + 'user logged in successfully');
			res.status(config.httpSuccess);
			res.send({ success: success });
		}, function(err) {
			console.log(err);
			logger.error(filename, 'POST /login:' + err);
			res.status(config.httpFailure);
			res.send({ error: err });
		});
});

app.get('/search', function(req, res) {
	if (!req.query.searchStr) {
		res.status(config.httpFailure);
		logger.error(filename, 'GET /search:' + 'queryString is missing');
		res.send({ 'error': 'queryString is missing' });
	}

	contentService.search(req.query.searchStr)
		.then(function(contents) {
			console.log(contents);
		}, function(err) {
			console.log(err);
		});
/*
	databaseService.search(Content, req.query.searchStr)
		.then(function(results) {
			console.log(results);
		}, function(err) {
			console.log(err);
		});*/
});

app.get('/signup', function(req, res) {
	res.sendFile(__dirname + '/signup.html');
});

app.post('/signup', function(req, res) {
	if (!req.body.emailId) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /signup:' + 'emailId is missing');
		res.send('emailId is missing');
	}

	if (!req.body.password) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /signup:' + 'password is missing');
		res.send('password is missing');
	}		

	userService.signup(req.body.emailId, req.body.password)
		.then(function(success) {
			logger.info(filename, 'POST /signup:' + 'user registered successfully');
			res.status(config.httpSuccess);
			res.send({ success: success });
		}, function(err) {
			logger.error(filename, 'POST /signup:' + err);
			res.status(config.httpFailure);
			res.send({ error: err });
		});
});

app.get('/submit', function(req, res) {
	logger.info(filename, 'GET /:');
	res.sendFile(__dirname + '/public/submit.html');
});

app.post('/submit', function(req, res) {
	if (!req.body.contentURL) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /:' + 'contentURL is missing');
		res.send('contentURL is missing');
	}

	if (!req.body.category) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /:' + 'category is missing');
		res.send('category is missing');
	}		

	contentService.insertContent("kamal", req.body.contentURL, req.body.category)
		.then(function(success) {
			res.status(config.httpSuccess);
			res.json({ success: true });
		}, function(err) {
			res.status(config.httpFailure);
			res.json({ error: true });
		});
	/*urlInserterService.insertURL(req.body.contentURL, req.body.category)
		.then(function(success) {
			logger.info(filename, 'POST /:' + success);
			res.status(config.httpSuccess);
			res.json({success: true});
		}, function(err) {
			logger.error(filename, 'POST /:' + err);
			res.status(config.httpFailure);
			res.json({ error: true});
		});*/
});

app.get('/contents', function(req, res) {
	contentService.getContents(req.query.lastCreatedDate)
		.then(function(contents) {
			res.status(config.httpSuccess);
			res.send({ "contents": contents });
		}, function(err) {
			console.log(err)
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.get('/refreshcontents', function(req, res) {
	contentService.getContents(req.query.firstCreateDate)
		.then(function(contents) {
			res.status(config.httpSuccess);
			res.send({ "contents": contents });
		}, function(err) {
			console.log(err)
			res.status(config.httpFailure);
			res.send(err);
		});		
});

app.post('/like', function(req, res) {
	userService.likeContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			// code is written assuming even if contentService.likeContent fails, success is returned
			contentService.likeContent(req.body.userId, req.body.contentId);
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {
			console.log(err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/unlike', function(req, res) {
	userService.unlikeContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			// code is written assuming even if contentService.unlikeContent fails, success is returned
			contentService.unlikeContent(req.body.userId, req.body.contentId);
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/bookmark', function(req, res) {
	userService.bookmarkContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/unbookmark', function(req, res) {
	userService.unbookmarkContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.listen(config.dbPort, function() {
	logger.info(filename, 'server started on 8888 successfully');
});