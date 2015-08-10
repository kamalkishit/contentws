'use strict'

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
			jobQueue.addJob('abc', 'kamal', jsonData[i].url, jsonData[i].category);
			//jobQueue.addJob('abc', 'kamal', 'http://thelogicalindian.com/news/azim-premji-gives-half-of-his-stake-in-wipro-for-charity/',
				//'education');
		}
	}
});