var express = require('express');

var app = express();

app.use(express.static(__dirname));

app.get('/', function(req, res) {
	res.sendFile(__dirname + '/index.html');
});

app.get('/contents', function(req, res) {
	console.log('inside get');

	var contents = {};
	for (var i=0; i < 50; i++) {
		contents[i].title = 'This Beautiful Video Captures The Strength Of A Mother With Disabled Children';
		contents[i].description = 'Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.';
		contents[i].url = '';
	}

	res.json(contents);
});

app.listen(9090);
