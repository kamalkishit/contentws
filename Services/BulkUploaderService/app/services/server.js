

var dbSetupService = require('./../../../../Common/Services/DBSetupService');
var jobQueue = require('./JobQueue');

jobQueue.addJob('abc', 'http://google.com', 'edu')
jobQueue.processJobs('abc');