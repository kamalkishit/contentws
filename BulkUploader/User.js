var mongoose = require('mongoose');
var Schema = mongoose.Schema;



var userSchema = new Schema({
	URL : { type:String, required:true }
});

mongoose.connect('mongodb://localhost/urls');

var User = mongoose.model('User', userSchema);

module.exports = User;