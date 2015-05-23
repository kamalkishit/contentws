// handle : in failure write to failure.txt, in success
// append to success.txt, overwrite input.txt with failure.txt

var fs = require('fs');
var sleep = require('sleep');

var models = require('./db/models');

var readableStream = fs.createReadStream('input.txt');
var data = '';

readableStream.on('data', function(chunk) {
	data += chunk;
});

var failureCount = 0;
var successCount = 0;

readableStream.on('end', function() {
	var lines = data.split('\n');

	for (var i = 0; i < lines.length; i++) {
		if (lines[i]) {
			url = new models.URL({ URL : lines[i] });

			url.save(function(err) {
				if (err) {
					console.log('failure');
					console.log(err);
					failureCount++;
				} else {
					console.log('success');
					successCount++;
				}
			});

			sleep.sleep(1);
		}
	}

	console.log('Success count:', successCount);
	console.log('Failure count:', failureCount);
});
