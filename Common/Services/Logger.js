var winston = require('winston');
var colors = require('colors');

var logger = new (winston.Logger)({
	transports: [
		new (winston.transports.File)({ filename: 'logger.log', level: 'debug' })
	]
});


var logger = new winston.Logger;

exports.debug = function(filename, logMessage) {

	console.log(colors.blue(filename + ':: ' + logMessage));
};

exports.info = function(filename, logMessage) {

	console.log(colors.green(filename + ':: ' + logMessage));
};

exports.error = function(filename, logMessage) {

	console.log(colors.red(filename + ':: ' + logMessage));
};
