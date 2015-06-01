var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/contentDB');

var URLSchema = new mongoose.Schema({
	URL : String,
	isProcessed : { type:Boolean, default:false }
});

URLModel = mongoose.model('URLModel', URLSchema);

module.exports = {
	URL : URLModel
};