var shortId = require('shortid');

var logger = require('./Logger');
var filename = 'UniqueIdGenerator'

exports.getUniqueId = function() {

	var uniqueId = shortId.generate();
	logger.info(filename, 'getUniqueId:' + uniqueId);

	return uniqueId;
};

