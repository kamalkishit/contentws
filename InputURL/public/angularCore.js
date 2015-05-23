var app = angular.module('ContentWS', []);

app.controller('mainController', function($scope, $http, $sce) {

	$scope.title = 'This Beautiful Video Captures The Strength Of A Mother With Disabled Children';
	$scope.description = 'Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.';
	$scope.url = 'http://www.youtube.com/embed/6rjRtn-2DQQ?feature=oembed&wmode=opaque&showinfo=0&showsearch=0&rel=0';

	console.log($scope.url);

	$scope.items = {};
	$scope.offset = 0;
	$scope.limit = 10;

	$http.get('/api/contents', {params :{ offset:$scope.offset, limit:$scope.limit }})
		.success(function(data) {
			console.log(data);
			$scope.items = data;
			$scope.offset += 10;
		})
		.error(function(err) {
			console.log(err);
		});
});

app.filter('trustUrl', function($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
});

app.controller('URLController', function($scope, $http, $window) {

	$scope.categories = [{
		name : 'Education'
	}, {
		name : 'Governance'
	}, {
		name : 'Health'
	}, {
		name : 'Humanity'
	}];

	$scope.verifyURL = function() {
		console.log('i m here');
		$.ajax({
			type : 'HEAD',
			url : $scope.contentURL,
			success : function() {
				console.log('success');
				$scope.isURLValid = true;
			},
			error : function() {
				console.log('failure');
				$scope.isURLValid = false;
			}
		});
	};
	$scope.submitContentURL = function() {
		console.log($scope.selectedCategory);
		$http.post('/api/urls', { contentURL:$scope.contentURL, category:$scope.selectedCategory.name })
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
	console.log('i m here');
	$http.get('/api/content/', {params :{ offset:$scope.offset, limit:$scope.limit }})
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

	$scope.offset = 0;
	$scope.limit = 10;

	$http.get('/api/contents', {params :{ offset:$scope.offset, limit:$scope.limit }})
		.success(function(data) {
			console.log(data.length);
			$scope.urls = data;
			offset += 10;
		})
		.error(function(data) {
			console.log('Error:' + data);
		});

	$scope.getMore = function() {
		console.log('i m here');
		$http.get('/api/contents', {params :{ offset:$scope.offset, limit:$scope.limit }})
			.success(function(data) {
				for (var i = 0; i < data.length; i++) {
					$scope.urls.push(data[i]);
				}

				$scope.offset += 10;
			})
			.error(function(data) {
				console.log('Error:' + err);
			});
	}	
});

app.controller('searchController', function($scope, $http){

	$scope.offset = 0;
	$scope.limit = 10;
	
	$http.get('/api/search', { params :{ searchStr:$scope.searchStr, offset:$scope.offset, limit:$scope.limit }})
		.success(function(data) {
			$scope.results = data;
			offset += 10;
			console.log(data);
		})
		.error(function(data) {
			console.log('error:' + err);
		});
	
});