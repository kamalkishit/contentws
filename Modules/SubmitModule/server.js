var express = require('express');
var bodyParser = require('body-parser');

var logger = require('./../../Common/Services/Logger');
var config = require('./../../Common/Config/config');
var dbSetupService = require('./../../Common/Services/DBSetupService');
var config = require('./../../Common/Config/config');
var urlInserterService = require('./app/services/URLInserterService');

var filename = 'server';

var app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', function(req, res) {

	logger.info(filename, 'GET /:');
	res.sendFile(__dirname + '/index.html');
});

app.post('/', function(req, res) {
	
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

app.listen(config.dbPort, function() {

	logger.info(filename, 'server started on port 8888');
});