var express = require('express');
var bodyParser = require('body-parser');

var logger = require('cws-logger');
var config = require('cws-config');
var apiService = require('./app/services/APIService');
//var dbsetupService = require('cws-dbsetup-service');
var contentService = require('./contentService');
var databaseService = require('cws-database-service');
var loginService = require('cws-login-service');
var signupService = require('cws-signup-service');
var likeDislikeService = require('cws-likedislike-service');
var bookmarkService = require('cws-bookmark-service');
var userDataService = require('cws-userdata-service');
var Content = require('cws-models').getContentModel();

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

app.get('/login', function(req, res) {
	res.sendFile(__dirname + '/public/login.html');
});

app.get('/content', function(req, res) {
	res.sendFile(__dirname + '/contents.html');
});

app.get('/paper', function(req, res) {
	res.sendFile(__dirname + '/create_paper.html');
});

app.post('/paper', function(req, res) {
	if (!req.body.contentIds) {
		res.status(config.httpFailure);
		res.send('error');
	}

	contentService.createPaper(req.body.contentIds);
})

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

	loginService.login(req.body.emailId, req.body.password)
		.then(function(success) {
			logger.info(filename, 'POST /login:' + 'user logged in successfully');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {
			logger.error(filename, 'POST /login:' + err);
			res.status(config.httpFailure);
			res.send(err);
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
	res.sendFile(__dirname + '/public/signup.html');
});

app.post('/signup', function(req, res) {
	if (!req.body.username) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /signup:' + 'username is missing');
		res.send('username is missing');
	}

	if (!req.body.password) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /signup:' + 'password is missing');
		res.send('password is missing');
	}		

	signupService.signup(req.body.username, req.body.password)
		.then(function(success) {
			logger.info(filename, 'POST /signup:' + 'user registered successfully');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {
			logger.error(filename, 'POST /signup:' + err);
			res.status(config.httpFailure);
			res.send(err);
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

	contentService.insertContent(req.body.contentOwnerId, req.body.contentURL, req.body.category)
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
		})
	/*if (req.query.lastCreatedDate) {
		console.log(req.query.lastCreatedDate)
		apiService.findLastCreated(req.query.lastCreatedDate, req.query.startIndex, req.query.limit)
			.then(function(results) {
				res.status(config.httpSuccess);
				res.send({ "contents": results });
			}, function(err) {
				res.status(config.httpFailure);
				res.send(err);
			})
	} else {
		apiService.find(req.query.startIndex, req.query.limit)
			.then(function(results) {
				logger.info(filename, 'GET /contents:' + 'SUCCESS');
				res.status(config.httpSuccess);
				console.log(config.CONTENTS);
				res.send({ "contents": results });
			}, function(err) {
				logger.error(filename, 'GET /contents:' + err);
				res.status(config.httpFailure);
				res.send(err);
			});
	}*/
});

app.post('/like', function(req, res) {
	contentService.likeContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			return userService.likeContent(req.body.userId, req.body.contentId);
		}, function(err) {
			res.status(httpFailure);
			res.send(err);
		})

		.then(function(success) {
			res.status(httpSuccess);
			res.send('success');
		}, function(err) {
			res.status(httpFailure);
			res.send('error');
		});
});

app.post('/unlike', function(req, res) {
	contentService.unlikeContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			return userService.unlikeContent(req.body.userId, req.body.contentId);
		}, function(err) {
			res.status(httpFailure);
			res.send(err);
		})

		.then(function(success) {
			res.status(httpSuccess);
			res.send('success');
		}, function(err) {
			res.status(httpFailure);
			res.send('error');
		});
});


app.post('/bookmark', function(req, res) {
	contentService.bookmarkContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			return userService.bookmarkContent(req.body.userId, req.body.contentId);
		}, function(err) {
			res.status(httpFailure);
			res.send(err);
		})

		.then(function(success) {
			res.status(httpSuccess);
			res.send('success');
		}, function(err) {
			res.status(httpFailure);
			res.send('error');
		});
});

app.post('/unbookmark', function(req, res) {
	contentService.unbookmarkContent(req.body.userId, req.body.contentId)
		.then(function(success) {
			return userService.unbookmarkContent(req.body.userId, req.body.contentId);
		}, function(err) {
			res.status(httpFailure);
			res.send(err);
		})

		.then(function(success) {
			res.status(httpSuccess);
			res.send('success');
		}, function(err) {
			res.status(httpFailure);
			res.send('error');
		});
});

app.listen(config.dbPort, function() {
	logger.info(filename, 'server started on 8888 successfully');
});