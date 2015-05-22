var fs = require('fs');

var mergeFiles = function(file1, file2, callback) {
	fs.readFile(file1, function(err, fileData) {
		if (err) {
			callback(false);
		} else {
			fs.appendFile(file2, fileData, function(err) {
				if (err) {
					callback(false);
				} else {
					fs.truncate(file1, 0, function() {
						callback(true);	
					});
				}
			});
		}
	});
};

module.exports = mergeFiles;