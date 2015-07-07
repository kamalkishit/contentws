var app = angular.module('ContentModule', ['ngMaterial', 'infinite-scroll']);

app.filter('trustUrl', function($sce) {
	
	return function(url) {
		
		return $sce.trustAsResourceUrl(url);
	};
});

app.factory('SearchService', function($http) {

	var searchService = {};

	searchService.search = function(searchStr) {

		return $http.get('/api/search', {
			params: { searchStr: searchStr }
		});
	};

	return searchService;
});


app.factory('FindService', function($http) {

	var findService = {};

	findService.findAll = function(startIndex, limit) {

		console.log(startIndex);

		return $http.get('/contents', {
			params: { startIndex: startIndex, limit: limit }
		});
	};

	return findService;
});

app.factory('LikeDislikeService', function($http) {

	var likeDislikeService = {};

	likeDislikeService.like = function(userId, contentId) {

		console.log(contentId);

		return $http.post('/like', {
			userId: userId,
			contentId: contentId
		});
	};

	likeDislikeService.unlike = function(userId, contentId) {

		console.log(contentId);

		return $http.post('/unlike', {
			userId: userId,
			contentId: contentId
		});
	};	

	likeDislikeService.dislike = function(contentId) {

		return $http.post('/dislike', {
			contentId: contentId
		});
	};

	likeDislikeService.undislike = function(contentId) {

		return $http.post('/undislike', {
			contentId: contentId
		});
	};	

	return likeDislikeService;
})

app.controller('searchController', function($scope, SearchService) {

	$scope.search = function() {
		
		console.log($scope.searchStr);
		SearchService.search($scope.searchStr)
			.then(function(success) {
				
				console.log(success);
			}, function(err) {
				
				console.log(err)
			});
	};	
});

app.controller('findController', function($scope, FindService) {

	$scope.startIndex = 0;
	$scope.limit = 10;

	FindService.findAll($scope.startIndex, $scope.limit)
		.then(function(records) {
			
			console.log(records);
			console.log(records.status)
			$scope.items = records.data.contents;
			$scope.startIndex += $scope.limit;
		}, function(err) {
			
			console.log(err);
		});

	$scope.findAll = function() {

		FindService.findAll($scope.startIndex, $scope.limit)
			.then(function(records) {
				
				console.log(records);
				$scope.items = records.data.contents;
				$scope.startIndex += limit;
			}, function(err) {
				
				console.log(err);
			});
	};
});

app.controller('contentController', function($scope, $window, FindService, SearchService, LikeDislikeService) {

	$scope.startIndex = 0;
	$scope.limit = 50;
	$scope.items = [];

	if ($window.sessionStorage.getItem('token') != null) {
		$scope.isLoggedIn = true;
	} else {
		$scope.isLoggedIn = false;
	}

	FindService.findAll($scope.startIndex, $scope.limit)
		.then(function(records) {
			
			console.log(records);
			console.log(records.status);
			for (var i = 0; i < records.data.contents.length; i++) {
					records.data.contents[i].isLiked = false;
					records.data.contents[i].isDisliked = false;
					records.data.contents[i].isBookmarked = false;
				}
			$scope.items = records.data.contents;
			$scope.startIndex += $scope.limit;
		}, function(err) {
			
			console.log(err);
		});

	$scope.findAll = function() {

		FindService.findAll($scope.startIndex, $scope.limit)
			.then(function(records) {

				console.log(records);
				//$scope.items = records.data.contents;

				for (var i = 0; i < records.data.contents.length; i++) {
					records.data.contents[i].isLiked = false;
					records.data.contents[i].isDisliked = false;
					records.data.contents[i].isBookmarked = false;
				}
				//$scope.items = records.data.contents;
				console.log(records.data.contents);
				$scope.startIndex += $scope.limit;
			}, function(err) {
				
				console.log(err);
			});
	};

	$scope.loadMore = function() {

		FindService.findAll($scope.startIndex, $scope.limit)
			.then(function(records) {

				console.log('orig length:' + $scope.items.length);
				console.log('new reords length:' + records.length);
				for (var i = 0; i < records.data.length; i++) {
					$scope.items.push(records.data[i]);
				}

				$scope.startIndex += $scope.limit;
				console.log($scope.items.length);
				console.log($scope.items);
			}, function(err) {

				console.log(err);
			});
	};

	$scope.search = function() {
		console.log($scope.searchStr);
		SearchService.search($scope.searchStr)
			.then(function(searchResults) {
				
				console.log(searchResults.data);
				$scope.items = searchResults.data;
			}, function(err) {
				
				console.log(err)
			});
	};

	$scope.like = function(item) {

		if (item.isLiked) {
			LikeDislikeService.unlike('kamal', item.contentId)
				.then(function(success)  {

					console.log('unliked successfully');
					item.isLiked = !item.isLiked;
				}, function(err) {

					console.log(err);
				});			
		} else {
			LikeDislikeService.like('kamal', item.contentId)
				.then(function(success)  {

					console.log('liked successfully');
					item.isLiked = !item.isLiked;
				}, function(err) {

					console.log(err);
				});
		}
	};

	$scope.dislike = function(item) {

		if (item.isDisliked) {
			LikeDislikeService.undislike(item.contentId)
				.then(function(success)  {

					console.log('undisliked successfully');
					item.isDisliked = !item.isDisliked;
				}, function(err) {

					console.log(err);
				});
		} else {
			LikeDislikeService.dislike(item.contentId)
				.then(function(success)  {

					console.log('disliked successfully');
					item.isDisliked = !item.isDisliked;
				}, function(err) {

					console.log(err);
				});
		}
	};
});