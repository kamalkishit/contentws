var app = angular.module('ContentWS', ['infinite-scroll']);

app.controller('mainController', function($scope, $http, $sce) {

	$scope.title = 'This Beautiful Video Captures The Strength Of A Mother With Disabled Children';
	$scope.description = 'Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.';
	$scope.url = 'http://www.youtube.com/embed/6rjRtn-2DQQ?feature=oembed&wmode=opaque&showinfo=0&showsearch=0&rel=0';

	console.log($scope.url);

	$scope.items = {};

	$http.get('/api/contents')
		.success(function(data) {
			console.log(data);
			$scope.items = data;
		})
		.error(function(err) {
			console.log(err);
		});

	/*&$scope.getMore = function() {
		$http.get('/api/contents')
			.success(function(data) {
				for (var i = 0; i < 10; i++) {
					$scope.items.push(data[i]);
				}
			})
			.error(function(err) {
				console.log(err);
			});
	}*/
/*
	for (var i = 0; i < 10; i++) {
			var obj = {};
	obj.title = 'This Beautiful Video Captures The Strength Of A Mother With Disabled Children';
	obj.description = 'Get ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tears';
	obj.url = $sce.trustAsResourceUrl('http://www.storypick.com/wp-content/uploads/2015/05/badassmom6.jpg');
		obj.ind = i;
		$scope.items.push(obj);
	}*/
});

app.filter('trustUrl', function($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
});

app.controller('URLController', function($scope, $http, $window) {

	$scope.categories = ['Education', 'Governance', 'Health', 'Humanity', 'Inspire', 'Law/Justice', 'Police'];

	$scope.submitContentURL = function() {
		$http.post('/api/urls', { contentURL:$scope.contentURL, category:$scope.category })
			.then(function(response) {
				$window.alert('successfully submitted URL');
				$scope.contentURL = null;
			}, function(result) {
				$window.alert('not able to submit URL');
			});
	};
});

app.controller('contentController', function($scope, $http) {

	//console.log($scope.currentContent);
	$scope.contentURL = 'http://www.storypick.com/we-are-just-good-friends/';
	$http.get('/api/content/')
		.success(function(data) {
			console.log('success');
			console.log(data);
			$scope.content = data;
			console.log($scope.content);
		})
		.error(function(data) {
			console.log(data);
		});
});

app.controller('contentsController', function($scope, $http) {

	/*$scope.getContent = function(contentURL) {
		$http.get('/api/contents', {params:{ url:contentURL }})
			.success(function(data) {
				$scope.content = data;
			})
			.error(function(data) {
				console.log('Error:' +data);
			});
	};
*/
	$http.get('/api/contents')
		.success(function(data) {
			console.log(data);
			$scope.urls = data;
		})
		.error(function(data) {
			console.log('Error:' + data);
		});

	$scope.getMore = function() {
		console.log('i m here');
		$http.get('/api/contents')
			.success(function(data) {
				for (var i = 0; i < data.length; i++) {
					$scope.urls.push(data[i]);
				}
			})
			.error(function(data) {
				console.log('Error:' + err);
			});
	}	
});