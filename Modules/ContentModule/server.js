var express = require('express');
var bodyParser = require('body-parser');

var logger = require('./../../Common/Services/Logger');
var config = require('./../../Common/Config/config');
var apiService = require('./app/services/APIService');
var likeDislikeService = require('./app/services/LikeDislikeService');
var bookmarkService = require('./app/services/BookmarkService');
var userDataService = require('./../../Common/Services/UserDataService');

var filename = 'server';

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + './../SubmitModule/public/static/images'))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {

	res.sendFile(__dirname + '/index2.html');
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

	likeDislikeService.like(req.body.userId, req.body.contentId)
		.then(function(contents) {

			logger.info(filename, 'POST /like:' + 'SUCCESS');

					for (var i = 0; i < contents.length; i++) {
						redisService.hget('abc' + ':' + 'likes' , contents[i].contentId)
							.then(function(success) {

								console.log(success);
								contents[i].isLiked = success;
							});


						redisService.hget('abc' + ':' + 'dislikes' , contents[i].contentId)
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

app.listen(8888, function() {

	logger.info(filename, 'server started on 8888 successfully');
});

