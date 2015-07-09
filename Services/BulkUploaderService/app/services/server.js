
var imageConversion = require('./ImageConversionService.js');

imageConversion.resizeImage('/Users/Kamal/Desktop/E1cjj6S_.jpg')
imageConversion.getImageSize('/Users/Kamal/Desktop/E1cjj6S_.jpg')
	.then(function(success) {
		console.log(success);
	}, function(err) {
		console.log(err);
	})
