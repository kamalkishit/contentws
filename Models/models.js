var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var dbURI = 'mongodb://localhost/contentDB';
mongoose.connect(dbURI);

var contentSchema = new mongoose.Schema({
	contentURL : { type:String, required:true, unique:true },	// URL of the content
	ogContentURL : { type:String },								// OpenGraph tag
	ogType : { type:String },									// OpenGraph tag
	ogTitle : { type:String },									// OpenGraph tag
	ogImageURL : { type:String },								// original image URL
	imageURL : { type:String },									// image URL on server
	imageWidth : { type:Number },
	imageHeight : { type:Number},
	imageType : { type:String },
	ogDescription : { type:String },							// OpenGraph tag
	ogSiteName : { type:String },								// OpenGraph tag
	category : { type:String },									// category of the content
	likes : { type:Number },
	dislikes : { type:Number },
	viewCount : { type:Number },
	isProcessed : { type:Boolean, default:false },				// set to true if you have scrapped the webpage
	isParsed : { type:Boolean, default:false },					// set to true if able to parse 'title', 'description' and 'image' url from the page
	isValid : { type:Boolean, default:true },					// set to false for soft delete from results
	createdAt : { type:Date, default:Date.now },	
	updatedAt : { type:Date, default:Date.now }
});

contentSchema.plugin(mongoosastic);

var ContentModel = mongoose.model('ContentModel', contentSchema);

ContentModel.createMapping(function(err, mapping) {
	if (err) {
		console.log(err);
	} else {
		console.log(mapping);
	}
});

module.exports = {
	Content : ContentModel
};
