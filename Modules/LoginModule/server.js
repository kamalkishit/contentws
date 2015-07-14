var express = require('express');
var bodyParser = require('body-parser');

var logger = require('./../../Common/Services/Logger');
var config = require('./../../Common/Config/config');
var dbSetupService = require('./../../Common/Services/DBSetupService');
var config = require('./../../Common/Config/config');

var loginService = require('./app/services/LoginService');
var signupService = require('./app/services/SignUpService');

var filename = 'server';

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {

	res.sendFile(__dirname + '/index.html');
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

app.listen(config.dbPort, function() {

	logger.info(filename, 'server started on 8888 successfully');
});
