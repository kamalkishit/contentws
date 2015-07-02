'use strict'

var excelJsonService = require('./ExcelJSONService');
var config = require('./config');
var fs = require('fs');

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