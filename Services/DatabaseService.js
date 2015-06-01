var mongoose = require('mongoose');
var Q = require('q');

exports.save = function(document) {

	var deferred = Q.defer();

	if (!document) {
		//console.log('document is null');
		deferred.reject(new Error('document is null'));
		return deferred.promise;
	}

	document.save(function(err) {
		if (err) {
			console.log(err);
			deferred.reject(new Error(err));
		} else {
			//console.log('success');
			deferred.resolve('inserted successfully');
		}
	});

	return deferred.promise;
};

exports.find = function(model, startIndex, limit) {

	var deferred = Q.defer();

	if (!model) {
		//console.log('model is null');
		deferred.reject(new Error('model is null'));
		return deferred.promise;
	}

	if (!startIndex && !limit) {
		model.find(function(err, documents) {
			if (err) {
				//console.log(err);
				deferred.reject(new Error(err));
			} else {
				//console.log(documents.length);
				deferred.resolve(documents);
			}
		});
	} else {
		model.find().skip(startIndex).limit(limit).exec(function(err, documents) {
			if (err) {
				//console.log(err);
				deferred.reject(new Error(err));
			} else {
				//console.log(documents.length);
				deferred.resolve(documents);
			}
		});
	}

	return deferred.promise;
} 