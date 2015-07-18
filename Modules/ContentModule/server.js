var express = require('express');
var bodyParser = require('body-parser');

var logger = require('cws-logger');
var config = require('cws-config');
var apiService = require('./app/services/APIService');
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

	res.sendFile(__dirname + '/index2.html');
});

app.get('/login', function(req, res) {

	res.sendFile(__dirname + '/public/login.html');
});

app.post('/login', function(req, res) {

	if (!req.body.username) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /login:' + 'username is missing');
		res.send({ 'error': 'username is missing' });
	}

	if (!req.body.password) {
		res.status(config.httpFailure);
		logger.error(filename, 'POST /login:' + 'password is missing');
		res.send('password is missing');
	}		

	loginService.login(req.body.username, req.body.password)
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

	databaseService.search(Content, req.query.searchStr)
		.then(function(results) {
			console.log(results);
		}, function(err) {
			console.log(err);
		});
})

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

	urlInserterService.insertURL(req.body.contentURL, req.body.category)
		.then(function(success) {
			logger.info(filename, 'POST /:' + success);
			res.status(config.httpSuccess);
			res.json({success: true});
		}, function(err) {
			logger.error(filename, 'POST /:' + err);
			res.status(config.httpFailure);
			res.json({ error: true});
		});
});

app.get('/contents', function(req, res) {

	apiService.find(req.query.startIndex, req.query.limit)
		.then(function(results) {

			logger.info(filename, 'GET /contents:' + 'SUCCESS');
			res.status(config.httpSuccess);
			/*userService.getLikesData('kamal')
				.then(function(keys) {
					console.log('i m here');
					console.log(keys);
				}); */
			//res.send("success");
			console.log(config.CONTENTS);
			res.send({ "contents": results });
		}, function(err) {

			logger.error(filename, 'GET /contents:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/like', function(req, res) {

	console.log(req.body.userId);
	likeDislikeService.like(req.body.userId, req.body.contentId)
		.then(function(contents) {

			logger.info(filename, 'POST /like:' + 'SUCCESS');

					for (var i = 0; i < contents.length; i++) {
						redisService.hget(req.body.userId + ':likes' , contents[i].contentId)
							.then(function(success) {

								console.log(success);
								contents[i].isLiked = success;
							});


						redisService.hget(req.body.userId + ':dislikes' , contents[i].contentId)
							.then(function(success) {

								contents[i].isDisliked = success;
							});				
					}			
			res.status(config.httpSuccess);
			res.send(contents);
		}, function(err) {

			logger.error(filename, 'POST /like:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/unlike', function(req, res) {

	likeDislikeService.unlike(req.body.userId, req.body.contentId)
		.then(function(success) {

			logger.info(filename, 'POST /unlike:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {

			logger.error(filename, 'POST /unlike:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/likeDislike', function(req, res) {

	likeDislikeService.likeDislike(req.body.userId, req.body.contentId)
		.then(function(success) {

			logger.info(filename, 'POST /likeDislike:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {

			logger.info(filename, 'POST /likeDislike:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/dislikeLike', function(req, res) {

	likeDislikeService.dislikeLike(req.body.userId, req.body.contentId)
		.then(function(success) {

			logger.info(filename, 'POST /dislikeLike:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {

			logger.info(filename, 'POST /dislikeLike:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/dislike', function(req, res) {

	likeDislikeService.dislike(req.body.userId, req.body.contentId)
		.then(function(success) {

			logger.info(filename, 'POST /dislike:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {

			logger.error(filename, 'POST /dislike:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/undislike', function(req, res) {

	likeDislikeService.undislike(req.body.userId, req.body.contentId)
		.then(function(success) {

			logger.info(filename, 'POST /undislike:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {

			logger.error(filename, 'POST /undislike:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/bookmark', function(req, res) {

	bookmarkService.bookmark(req.body.userId, req.body.contentId)
		.then(function(success) {

			logger.info(filename, 'POST /bookmark:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {

			logger.error(filename, 'POST /bookmark:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/unbookmark', function(req, res) {

	bookmarkService.unbookmark(req.body.userId, req.body.contentId)
		.then(function(success) {

			logger.info(filename, 'POST /unbookmark:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(success);
		}, function(err) {

			logger.error(filename, 'POST /unbookmark:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.get('/likes', function(req, res) {

	userDataService.likes(req.query.userId)
		.then(function(likes) {

			logger.info(filename, 'GET /likes:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send({ "likes": likes});
		}, function(err) {

			logger.error(filename, 'GET /likes:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.get('/dislikes', function(req, res) {

	userDataService.dislikes(req.query.userId)
		.then(function(dislikes) {

			logger.info(filename, 'GET /dislikes:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(dislikes);
		}, function(err) {

			logger.error(filename, 'GET /dislikes:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.get('/bookmarks', function(req, res) {

	userDataService.bookmarks(req.query.userId)
		.then(function(bookmarks) {

			logger.info(filename, 'GET /bookmarks:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send(dislikes);
		}, function(err) {

			logger.error(filename, 'GET /bookmarks:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.get('/userdata', function(req, res) {

	userDataService.getUserData(req.query.userId)
		.then(function(userdata) {

			logger.info(filename, 'GET /userdata:' + 'SUCCESS');
			res.status(config.httpSuccess);
			res.send({ "userdata": userdata });
		}, function(err) {

			logger.error(filename, 'GET /userdata:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.listen(config.dbPort, function() {

	logger.info(filename, 'server started on 8888 successfully');
});

