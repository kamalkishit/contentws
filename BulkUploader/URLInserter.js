var openGraphScraper = require('open-graph-scraper');
var sleep = require('sleep');
var models = require('./db/models');


console.log('i m here');
models.URL.find().where('isProcessed').equals(false).exec(function(err, dbResults) {
	if (err) {
		console.log(err);
	} else {
		console.log(dbResults);
		for (var i = 0; i < dbResults.length; i++) {
			console.log(dbResults[i].URL);

			openGraphScraper({ 'url':dbResults[i].URL }, function(err, data) {
				if (err) {
					console.log(err);
					console.log('ogs:failure');
				} else {
					console.log('ogs:success');

					//console.log(data.data);
					var title = data.data.ogTitle ? data.data.ogTitle : '';
					var imageUrl = data.data.ogImage.url ? data.data.ogImage.url : '';
					var description = data.data.ogImage.description ? data.data.ogDescription : '';

					console.log();
					var content = new models.Content({ contentURL:data.data.ogUrl, 
						ogTitle:title, ogImage:imageUrl, ogDescription:description, isProcessed:true
					});

					content.save(function(err) {
						if (err) {
							console.log(err);
							console.log('contentsave:failure2');
						} else {		
							console.log('contentsave:success2');
						}
					});
				}
			});

			sleep.sleep(5);
		}
	}
});


