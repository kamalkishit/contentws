var app = angular.module('ContentWS', ['infinite-scroll']);

app.filter('trustUrl', function($sce) {
	return function(url) {
		return $sce.trustAsResourceUrl(url);
	};
});

app.controller('mainController', function($scope, $http, $sce) {

	$scope.items = {};
	$scope.offset = 0;
	$scope.limit = 10;

	$http.get('/api/contents', {params :{ offset:$scope.offset, limit:$scope.limit }})
		.success(function(data) {
			console.log(data);
			$scope.items = data;
			$scope.offset += $scope.limit;
		})
		.error(function(err) {
			console.log(err);
		});

	$scope.loadMore = function() {
		console.log('loadmore');
		$http.get('/api/contents', {params :{ offset:$scope.offset, limit:$scope.limit }})
			.success(function(data) {
				console.log(data);
				$scope.items = data;
				$scope.offset += 10;
			})
			.error(function(err) {
				console.log(err);
			});
	};

	$scope.search = function() {
		$http.get('/api/search', { params :{ searchStr:$scope.searchStr, offset:0, limit:10 }})
			.success(function(data) {
				$scope.results = data;
				console.log(data);
			})
			.error(function(data) {
				console.log('error:' + err);
			});
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
	}, {
		name : 'Inspirational'
	}];

	$scope.pageError = false;

	$scope.submitContentURL = function() {

		console.log($scope.selectedCategory);
		$http.post('/api/urls', { contentURL:$scope.contentURL, category:$scope.selectedCategory.name })
			.then(function(response) {
				$window.alert('successfully submitted URL');
				$scope.pageError = false;
			}, function(result) {
				$window.alert('not able to submit URL');
				$scope.pageError = true;
			});

		$scope.contentURL = null;
		$scope.selectedCategory = null;
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
	
	
	$scope.search = function() {
		$http.get('/api/search', { params :{ searchStr:$scope.searchStr, offset:$scope.offset, limit:$scope.limit }})
			.success(function(data) {
				$scope.results = data;
				offset += 10;
				console.log(data);
			})
			.error(function(data) {
				console.log('error:' + err);
			});
	};
	
});