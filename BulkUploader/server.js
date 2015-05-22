// handle : in failure write to failure.txt, in success
// append to success.txt, overwrite input.txt with failure.txt

var fs = require('fs');
var sleep = require('sleep');

var URL = require('./db/URLSchema');

var readableStream = fs.createReadStream('input2.txt');
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
			url = new URL({ URL : lines[i] });

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

/*
var fs = require('fs');
var readline = require('readline');
var Q = require('q');

var URL = require('./db/URLSchema');

var readStream = fs.createReadStream('input.txt');
var errWriteStream = fs.createWriteStream('err.txt');
var successWriteStream = fs.createWriteStream('success.txt');

Q.nfcall(fs.readFile, 'input.txt', 'utf-8')
	.then(function(data) {
		console.log('success2');
		//console.log('File has been read:', data);
	})
	.fail(function(err) {
		console.log('Error received:', err);
	})
	.done();

var rl = readline.createInterface({
	input : readStream,
	output : process.stdout
});

rl.on('line', function(line) {
	url = new URL({ URL : line });

	url.save(function(err) {
		if (err) {
			console.log(err);
		} else {
			console.log('success');
		}
	});
});*/