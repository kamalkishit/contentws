var dbSetupService = require('cws-dbsetup-service');

var jobQueue = require('./BulkUploaderService/app/services/JobQueue');
var excelJsonService = require('cws-exceljson-service');
var fs = require('fs');
var config = require('cws-config');
jobQueue.processJobs('abc')

fs.readFile(config.filenameDestination, function(err, data) {
    if (!err) {
        jsonData = JSON.parse(data);
		for (var i = 0; i < jsonData.length; i++) {
			jobQueue.addJob('abc', jsonData[i].url, jsonData[i].category);
		}
	}
});