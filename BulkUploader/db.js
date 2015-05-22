var mongoose = require('mongoose');

var config = require('./config');

mongoose.connect(config.dbURL);

var Schema = mongoose.Schema;

var URLSchema = new Schema({
	URL : { type:String, required:true, index:{ unique:true }}
});

module.exports = mongoose.model('URL', URLSchema);