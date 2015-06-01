var Q = require('q');

exports.search = function(schema, searchStr) {

	var deferred = Q.defer();

	if (!schema) {
		console.log('schema is null');
		deferred.reject(new Error('schema is null'));
		return deferred.promise;
	}

	if (!searchStr) {
		console.log('searchStr is null');
		deferred.reject(new Error('searchStr is null'));
		return deferred.promise;
	}

	schema.search({
		query_string : {
			query : searchStr
		}
	}, function(err, results) {
		if (err) {
			console.log(err)
			deferred.reject(new Error(err));
		} else {
			console.log(results);
			deferred.resolve(results);
		}
	});

	return deferred.promise;
};
