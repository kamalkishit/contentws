var dbSetupService = require('./../Common/Services/DBSetupService');

var jobQueue = require('./BulkUploaderService/app/services/JobQueue');
var excelJsonService = require('./BulkUploaderService/app/services/ExcelJSONService');
var fs = require('fs');
jobQueue.processJobs('abc')

fs.readFile(__dirname + '/input.txt', function(err, data) {
    if (!err) {
        jsonData = JSON.parse(data);
		for (var i = 0; i < jsonData.length; i++) {
			jobQueue.addJob('abc', jsonData[i].url, jsonData[i].category);
		}
	}
});