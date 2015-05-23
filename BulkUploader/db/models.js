var mongoose = require('mongoose');

var dbURI = 'mongodb://localhost/contentDB';
mongoose.connect(dbURI);

var contentSchema = new mongoose.Schema({
	contentURL : { type:String, required:true, unique:true },	// URL of the content
	ogContentURL : { type:String },								// OpenGraph tag
	ogType : { type:String },									// OpenGraph tag
	ogTitle : { type:String },									// OpenGraph tag
	ogImage : { type:String },									// OpenGraph tag
	ogDescription : { type:String },							// OpenGraph tag
	ogSiteName : { type:String },								// OpenGraph tag
	category : { type:String },									// category of the content
	isProcessed : { type:Boolean, default:false },				// set to true if you have scrapped the webpage
	isParsed : { type:Boolean, default:false },					// set to true if able to parse 'title', 'description' and 'image' url from the page
	isValid : { type:Boolean, default:true },					// set to false for soft delete from results
	createdAt : { type:Date, default:Date.now },	
	updatedAt : { type:Date, default:Date.now }
});

var ContentModel = mongoose.model('ContentModel', contentSchema);

var URLSchema = new mongoose.Schema({
	URL : { type:String, required:true, unique:true },
	isProcessed : { type:Boolean, default:false }
});

var URLModel = mongoose.model('URLModel', URLSchema);

module.exports = {
	Content : ContentModel,
	URL : URLModel
};