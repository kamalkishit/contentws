var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var openGraphScraper = require('open-graph-scraper');
var morgan = require('morgan');

var models = require('./app/models/models');

var app = express();

app.use(morgan('dev'));
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json' }));

// get home page
app.get('/', function(req, res) {
	res.sendFile(__dirname + '/public/index.html');
});

// get submit page
app.get('/submit', function(req, res) {
	res.sendFile(__dirname + '/public/submitContentURL.html');
});

// get contents page
app.get('/contents', function(req, res) {
	res.sendFile(__dirname + '/public/contents.html');
});

// post content URL by user
app.post('/api/urls', function(req, res) {

	console.log(req.body.contentURL);
	console.log(req.body.category);

	// parsing URLs metadata using opengraph algorithm
	openGraphScraper({ 'url':req.body.contentURL }, function(err, scrapedData) {
		if (err) {
			console.log('URL not parsed successfully');
			console.log(err);

			res.status(400);
			res.send(err);
		} else {
			console.log(scrapedData);
			console.log('URL parsed successfully');

			if (scrapedData.data) {
				var title = scrapedData.data.ogTitle ? scrapedData.data.ogTitle : '';				
				var description = scrapedData.data.ogDescription ? scrapedData.data.ogDescription : '';
				var imageUrl = '';

				if (scrapedData.data.ogImage) {
				 	imageUrl = scrapedData.data.ogImage.url ? scrapedData.data.ogImage.url : '';
				}
			}

			var content = new models.Content({ contentURL:req.body.contentURL, 
				ogTitle:title, ogImage:imageUrl, ogDescription:description, isProcessed:true, category:req.body.category
			});

			content.save(function(err) {
				if (err) {
					console.log('Error inserting content URL');
					console.log(err);
					res.status(400);
					res.send(err);
				} else {				
					console.log('Successfully inserted URL:' + req.body.contentURL );
					res.json(content);
				}
			});
		}
	});
});

// get all the submitted contents
app.get('/api/contents', function(req, res) {
	console.log('i m here');
	console.log(req.query.limit);
	console.log(req.query.offset);
	models.Content.find().skip(req.query.offset).limit(req.query.limit).exec(function(err, contents) {
		if (err) {
			console.log('inside error:' + err);
			res.send(err);
		}

		console.log(contents.length);
		res.json(contents);
	});
});

app.get('/api/search', function(req, res) {
	console.log('inside search');
	models.Content.search({ query : 'abc' }, function(err, contents) {
		if (err) {
			console.log('inside error:' + err);
			res.send(err);
		}

		//console.log(contents.length);
		res.json(contents);
	});
});

app.listen(9090);
console.log('Server started at port:9090');
