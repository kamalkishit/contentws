var express = require('express');
var bodyParser = require('body-parser');
var fs = require('fs');
var openGraphScraper = require('open-graph-scraper');
var morgan = require('morgan');
var ContentModel = require('./db');

var app = express();
app.use(morgan('dev'));

app.use(express.static(__dirname));
app.use(bodyParser.urlencoded({ 'extended':'true' }));
app.use(bodyParser.json());
app.use(bodyParser.json({ type:'application/vnd.api+json' }));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

// return content submit page
app.get('/submit', function(req, res) {
	res.sendFile(__dirname + '/submitContentURL.html');
});

// return contents page
app.get('/contents', function(req, res) {
	res.sendFile(__dirname + '/contents.html');
});

// submit content URL
app.post('/api/urls', function(req, res) {

	fs.appendFile('URL.txt', req.body.contentURL + '\n', function(err) {
		if (err) {
			console.log('write error');
		} else {
			console.log('write success');
		}
	});

	// parsing URLs metadata using opengraph algorithm
	openGraphScraper({ 'url':req.body.contentURL }, function(err, output) {
		if (err) {
			console.log('URL not parsed successfully');
			console.log(err);

			var content = new ContentModel({ contentURL:req.body.contentURL});

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
		} else {
			console.log(output);
			console.log('URL parsed successfully');

			var title = output.data.ogTitle ? output.data.ogTitle : '';
			var imageUrl = output.data.ogImage.url ? output.data.ogImage.url : '';
			var description = output.data.ogImage.description ? output.data.ogDescription : '';

			var content = new ContentModel({ contentURL:req.body.contentURL, 
				ogTitle:title, ogImage:imageUrl, ogDescription:description, isProcessed:true
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

	ContentModel.find(function(err, contents) {
		if (err) {
			console.log('inside error:' + err);
			res.send(err);
		}

		res.json(contents);
	});
});

app.listen(9090);
console.log('Server started at port:9090');
