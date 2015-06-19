var express = require('express');
var bodyParser = require('body-parser');

var logger = require('./../../Common/Services/Logger');
var config = require('./../../Common/Config/config');
var apiService = require('./app/services/APIService');
var likeDislikeService = require('./app/services/LikeDislikeService');

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
			res.send(results);
		}, function(err) {

			logger.error(filename, 'GET /contents:' + err);
			res.status(config.httpFailure);
			res.send(err);
		});
});

app.post('/like', function(req, res) {

	likeDislikeService.like('abc', req.body.contentId)
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

	likeDislikeService.unlike('abc', req.body.contentId)
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

app.post('/dislike', function(req, res) {

	likeDislikeService.dislike('abc', req.body.contentId)
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

	likeDislikeService.undislike('abc', req.body.contentId)
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

app.listen(8888, function() {

	logger.info(filename, 'server started on 8888 successfully');
});

