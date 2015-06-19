var dbSetupService = require('./../Common/Services/DBSetupService');

var jobQueue = require('./BulkUploaderService/app/services/JobQueue');
var excelJsonService = require('./BulkUploaderService/app/services/ExcelJSONService');

jobQueue.processJobs('abc')

excelJsonService.excelToJson(__dirname + '/input.xlsx')
	.then(function(jsonData) {

		for (var i = 0; i < jsonData.length; i++) {
			jobQueue.addJob('abc', jsonData[i].url, jsonData[i].category);
		}

	}, function(err) {

		console.log(err);
	});