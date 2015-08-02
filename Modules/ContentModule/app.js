var dbsetup = require('cws-dbsetup-service');
var contentService = require('./contentService');

contentService.unlikeContent('abc', 'def')
	.then(function(success) {
		console.log('success');
	}, function(err) {
		console.log('failure');
	})