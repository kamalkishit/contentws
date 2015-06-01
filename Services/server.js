var urlInserterService = require('./URLInserterService');

urlInserterService.insertURL('http://www.storypick.com/artist-clicks-his-girlfriend/', 'abc')
	.then(function(success) {
		console.log(success);
	}, function(err) {
		console.log(err);
	})