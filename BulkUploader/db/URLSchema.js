var mongoose = require('mongoose');

var connection = mongoose.createConnection('mongodb://localhost/urls');

Schema = new mongoose.Schema({
	URL : { type:String },
	isProcessed : { type:Boolean, default:false }
});

var URL = connection.model('URL', Schema);

module.exports = URL;