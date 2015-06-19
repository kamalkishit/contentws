'use strict';

var logger = require('./Logger');

var filename = 'DatabaseService';

// async
exports.save = function(document) {

	return new Promise(function(resolve, reject) {

		if (!document) {
			logger.error(filename, 'save:' + 'document is null');
			reject(new Error('document is null'));
		}

		document.save(function(err) {

			if (err) {
				logger.error(filename, 'save:' + err);
				reject(new Error(err));
			} else {
				logger.info(filename, 'save:' + 'inserted successfully');
				resolve('inserted successfully');
			}
		});
	});

	return promise;
};

// async
 exports.find = function(model, startIndex, limit) {

 	var promise = new Promise(function(resolve, reject) {

 		if (!model) {
 			logger.error(filename, 'find:' + 'model is null');
 			reject(new Error('model is null'));
 		}

		if (!startIndex && !limit) {
			model.find(function(err, documents) {
				if (err) {
					logger.error(filename, err);
					reject(new Error(err));
				} else {
					logger.info(filename, documents);
					resolve(documents);
				}
			});
		} else {
			model.find().skip(startIndex).limit(limit).exec(function(err, documents) {
				if (err) {
					logger.error(filename, err);
					reject(new Error(err));
				} else {
					logger.info(filename, documents);
					resolve(documents);
				}
			});
		}
	});

	return promise;
};

// async
exports.findOne = function(model, options) {

	var promise = new Promise(function(resolve, reject) {

		if (!model) {
			logger.error(filename, 'findOne:' + 'model is null');
			reject(new Error('model is null'));
		}

		if (!options) {
			reject(new Error('options is null'));
		}

		model.findOne(options, function(err, result) {
			if (err) {
				logger.error(filename, err);
				reject(new Error(err));
			} else if (!result) {
				logger.error(filename, 'no results found');
				reject(new Error('no results found'));
			} else {
				logger.info(filename, result);
				resolve(result);
			}
		});		
	});

	return promise;
};

// async
exports.findOneAndUpdate = function(model, conditions, update) {

	var promise = new Promise(function(resolve, reject) {

		if (!model) {
			logger.error(filename, 'findOneAndUpdate:' + 'model is null');
			reject('model is null');
		}

		if (!conditions) {
			logger.error(filename, 'findOneAndUpdate' + 'conditions is null');
			reject('conditions is null');
		}

		if (!update) {
			logger.error(filename, 'findOneAndUpdate' + 'update is null');
			reject('update is null');
		}

		model.findOneAndUpdate(conditions, update, function(err, result) {

			if (err) {
				logger.error(filename, 'findOneAndUpdate:' + err);
				reject(new Error(err));
			} else {
				logger.info(filename, 'findOneAndUpdate:' + 'udpated successfully');
				resolve('updated successfully');
			}
		});
	});

	return promise;
};