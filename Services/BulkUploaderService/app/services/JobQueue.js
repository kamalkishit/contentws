var kue = require('kue');

var logger = require('./../../../../Common/Services/Logger');
var config = require('./../../../../Common/Config/config');
var urlInserterService = require('./../../../../Modules/SubmitModule/app/services/URLInserterService');

var filename = 'JobQueue';

var queue = kue.createQueue();

var delay = 0;

exports.addJob = function(jobName, url, category) {

	delay += config.jobDelay;
	var job = queue.create(jobName, {
		url: url,
		category: category
	}).delay(delay);

	job
		.on('complete', function() {

			logger.info(filename, 'addJob:' + job.id + ' completed successfully');
		})
		.on('failed', function() {

			logger.error(filename, 'addJob:' + job.id + ' failed');
		});

	job.save();	
}

exports.processJobs = function(jobName) {

	queue.process(jobName, function(job, done) {

		urlInserterService.insertURL(job.data.url, job.data.category)
			.then(function(success) {
				done();
			}, function(err) {
				return done(new Error('some error'));
			});
	});
};