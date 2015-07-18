'use strict'
var fs = require('fs');
var excelJsonService = require('cws-exceljson-service');
var config = require('cws-config');


excelJsonService.excelToJson(config.filenameSource)
	.then(function(jsonData) {
		
		console.log(jsonData)
		fs.writeFile(config.filenameDestination, JSON.stringify(jsonData), function(err) {
			if (err) {
				console.log('error in writing to file');
			}
		});
	}, function(err) {

		console.log(err);
	});