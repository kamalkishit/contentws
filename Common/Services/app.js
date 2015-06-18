var rs = require('./RedisService');

rs.hset('abc', 'def', 'ghi');

rs.hget('abc', 'desdgf')
	.then(function(success) {
		console.log(success)
	}, function(err) {
		console.log(err)
	})