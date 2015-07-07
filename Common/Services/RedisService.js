var redis = require('redis');

var logger = require('./Logger');

var filename = 'RedisService';

var client = redis.createClient();

client.on('error', function(err) {

	logger.info(filename, 'some error:' + err);
});

exports.hset = function(hashKey, key, value) {

	client.hset(hashKey, key, value);
};

exports.hdel = function(hashKey, key) {

	client.hdel(hashKey, key);
};

exports.hget = function(hashKey, key) {

	var promise = new Promise(function(resolve, reject) {

		client.hget(hashKey, key, function(err, result) {

			if (err) {
				logger.error(filename, 'hget:' + hashKey + ':' + key + ',' + err);
				reject(new Error(err));
			} else {
				logger.info(filename, 'hget:' + hashKey + ':' + key + ',' + result);
				resolve(result);
			}
		});
	});

	return promise;
};

exports.hkeys = function(hashKey) {

	var promise = new Promise(function(resolve, reject) {

		client.hkeys(hashKey, function(err, keys) {

			if (err) {
				logger.error(filename, 'hkeys:' + hashKey + ',' + err);
				reject(new Error(err));
			} else {
				logger.info(filename, 'hkeys:' + hashKey + ',', keys);
				resolve(keys);
			}
		});
	});

	return promise;
};

exports.hgetall = function(hashKey) {

	var promise = new Promise(function(resolve, reject) {
		client.hgetall(hashKey, function(err, result) {
			if (err) {
				reject(new Error(err));
			} else {
				if (result == null) {
					result = {}; // making json compatible
				}
				resolve(result);
			}
		});
	});

	return promise;
};