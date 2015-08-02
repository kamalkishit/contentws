var kue = require('kue');

var logger = require('cws-logger');
var config = require('cws-config');
var urlInserterService = require('cws-url-inserter-service');

var filename = 'JobQueue';

var queue = kue.createQueue();

var delay = 0;

exports.addJob = function(jobName, userId, url, category) {

	delay += config.jobDelay;
	var job = queue.create(jobName, {
		userId: userId,
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

		urlInserterService.insertURL(job.data.userId, job.data.url, job.data.category)
			.then(function(success) {
				done();
			}, function(err) {
				return done(new Error('some error'));
			});
	});
};