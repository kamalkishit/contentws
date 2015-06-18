var mongoose = require('mongoose');
var mongoosastic = require('mongoosastic');

var config = require('..//Config/config');
var logger = require('./../services/Logger');

var filename = 'models';

exports.setupConnection = function() {

	mongoose.connect(config.dbURI, function(err) {

		if (err) {
			logger.error(filename, 'setupConnection:' + err);
		} else {
			logger.info(filename, 'setupConnection:' + 'connected successfully to database');
		}
	});
};

exports.setupModels = function() {

	var userSchema = new mongoose.Schema({
		userId: { type: String, required: true, unique: true},
		username: { type: String, required: true, unique: true },
		password: { type: String },
		isVerified : { type: Boolean, default: false }
	});

	var likeSchema = mongoose.Schema({
		userid: { type:String, required:true },
		contentid: { type:String, required: true }
	});

	var dislikeSchema = mongoose.Schema({
		userid: { type: String, required: true },
		contentid: { type: String, required: true }
	});

	var contentSchema = new mongoose.Schema({
		contentId: { type: String, required: true, unique: true },
		contentURL : { type:String, required:true, unique: true },	// URL of the content
		ogContentURL : { type:String },								// OpenGraph tag
		ogType : { type:String },									// OpenGraph tag
		ogTitle : { type:String, es_indexed: true },									// OpenGraph tag
		ogImageURL : { type:String, es_indexed: true },								// original image URL
		imageURL : { type:String },									// image URL on server
		imageWidth : { type:Number },
		imageHeight : { type:Number},
		imageType : { type:String },
		ogDescription : { type:String, es_indexed: true },							// OpenGraph tag
		ogSiteName : { type:String },								// OpenGraph tag
		category : { type:String },									// category of the content
		likes : { type:Number, default: 0 },
		dislikes : { type:Number, default: 0 },
		viewCount : { type:Number, default: 0 },
		isProcessed : { type:Boolean, default:false },				// set to true if you have scrapped the webpage
		isParsed : { type:Boolean, default:false },					// set to true if able to parse 'title', 'description' and 'image' url from the page
		isValid : { type:Boolean, default:true },					// set to false for soft delete from results
		createdAt : { type:Date, default:Date.now },	
		updatedAt : { type:Date, default:Date.now },
		isLiked: { type: Boolean, default: false},
		isDisliked: { type: Boolean, default: false}
	});

	contentSchema.plugin(mongoosastic);

	var Content = mongoose.model('ContentModel', contentSchema);
	var User = mongoose.model('UserModel', userSchema);
	var Like = mongoose.model('LikeModel', likeSchema);
	var Dislike = mongoose.model('DislikeModel', dislikeSchema);

	Content.createMapping(function(err, mapping) {

		if (err) {
			logger.error(filename, 'createMapping:' + err);
		} else {
			logger.info(filename, 'createMapping:' + mapping);
		}
	});
};

exports.getUserModel = function() {

	return mongoose.model('UserModel');
};

exports.getLikeModel = function() {

	return mongoose.model('LikeModel');
};

exports.getDislikeModel = function() {

	return mongoose.model('DislikeModel');
};

exports.getContentModel = function() {

	return mongoose.model('ContentModel');
};

