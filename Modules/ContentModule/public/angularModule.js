var app = angular.module('ContentModule', ['ngMaterial', 'infinite-scroll']);

app.config(function($mdThemingProvider) {
  $mdThemingProvider.theme('default')
    .primaryPalette('grey', {
    	default: '50'
    })
    .accentPalette('orange');
});

app.filter('trustUrl', function($sce) {
	
	return function(url) {
		
		return $sce.trustAsResourceUrl(url);
	};
});

app.factory('InsertService', function($http) {

	var insertService = {};

	insertService.insert = function(contentURL, category) {

		console.log(contentURL);
		console.log(category);
		return $http.post('/', { contentURL: contentURL, category: category });
	};

	return insertService;
});

app.factory('SignUpService', function($http) {

	var signupService = {};

	signupService.signup = function(username, password) {

		return $http.post('/signup', { username: username, password: password });
	};

	return signupService;
});

app.factory('LoginService', function($http) {

	var loginService = {};

	loginService.login = function(username, password) {

		return $http.post('/login', { username: username, password: password });
	};

	return loginService;
});

app.controller('signupController', function($scope, $http, SignUpService) {

	$scope.processing = false;

	$scope.signup = function() {

		$scope.processing = true;
		$scope.error = null;
		$scope.success = null;
		$http.post('/signup', { username: $scope.username, password: $scope.password })
			.then(function(response) {
				$scope.success = response.data;
				$scope.processing = false;
			}, function(err) {
				$scope.error = err;
				$scope.processing = false;
			});

		$scope.username = null;
		$scope.password = null;	
	};
});

app.controller('loginController', function($scope, $http, $location, $window, LoginService) {

	$scope.processing = false;

	$scope.login = function() {

		$scope.processing = true;
		$scope.error = null;
		$scope.success = null;
		$http.post('/login', { username: $scope.username, password: $scope.password })
			.then(function(response) {
				$window.sessionStorage.setItem('userId', response.data.userId);
				$window.sessionStorage.setItem('token', response.data.token);
				$scope.success = response.data;
				$scope.processing = false;
				$window.location.href = '/index2.html';
			}, function(err) {
				$scope.error = err;
				$scope.processing = false;
			});

		$scope.username = null;
		$scope.password = null;	
	};
});

app.factory('UserDataService', function($http) {

	var userDataService = {};
	var userData = {};
	var likes = {};
	var dislikes = {};
	var bookmarks = {};
	var isDone = false;

	userDataService.getUserData = function(userId) {

		$http.get('/userdata', { params: { userId: userId }})
			.then(function(userdata) {
				userData = userdata.data.userdata;
				console.log(userData);
				likes = userData.likes;
				dislikes = userData.dislikes;
				bookmarks = userData.bookmarks;
				isDone = true;
			}, function(err) {
				console.log(err);
			})
	};

	userDataService.completed = function() {
		return isDone;
	}

	userDataService.isLiked = function(contentId) {

		if (likes[contentId]) {
			return likes[contentId];
		} else {
			return false;
		}
	};

	userDataService.isDisliked = function(contentId) {

		if (dislikes[contentId]) {
			return dislikes[contentId];
		} else {
			return false;
		}
	};

	userDataService.isBookmarked = function(contentId) {

		if (bookmarks[contentId]) {
			return bookmarks[contentId];
		} else {
			return false;
		}
	};

	return userDataService;
})

app.factory('SearchService', function($http) {

	var searchService = {};

	searchService.search = function(searchStr) {

		console.log(searchStr)

		return $http.get('/search', {
			params: { searchStr: searchStr }
		});
	};

	return searchService;
});


app.factory('FindService', function($http) {

	var findService = {};

	findService.findAll = function(startIndex, limit) {

		return $http.get('/contents', {
			params: { startIndex: startIndex, limit: limit }
		});
	};

	return findService;
});

app.factory('BookmarkService', function($http, UserDataService) {

	var bookmarkService = {};

	bookmarkService.bookmark = function(userId, content) {

		if (content.isBookmarked) {
			content.isBookmarked = false;
			content.bookmarks -= 1;
			return $http.post('/unbookmark', {
				userId: userId,
				contentId: content.contentId
			});
		} else {
			content.isBookmarked = true;
			content.bookmarks += 1;

			return $http.post('/bookmark', {
				userId: userId,
				contentId: content.contentId
			});
		}
	};

	return bookmarkService;
});

app.factory('LikeDislikeService', function($http, UserDataService) {

	var likeDislikeService = {};

	likeDislikeService.like = function(userId, content) {

		if (content.isLiked) {
			content.isLiked = false;
			content.likes -= 1;
			// update local
			return $http.post('/unlike', {
				userId: userId,
				contentId: content.contentId
			});
		} else if (content.isDisliked) {
			content.isDisliked = false;
			content.dislikes -= 1;
			content.isLiked = true;
			content.likes += 1;
			return $http.post('/dislikeLike', {
				userId: userId,
				contentId: content.contentId
			});
		} else {
			content.isLiked = true;
			content.likes += 1;
			return $http.post('/like', {
				userId: userId,
				contentId: content.contentId
			});
		}
	};

	likeDislikeService.dislike = function(userId, content) {

		if (content.isDisliked) {
			content.isDisliked = false;
			content.dislikes -= 1;
			return $http.post('/dislike', {
				userId: userId,
				contentId: content.contentId
			});
		} else if (content.isLiked) {
			content.isLiked = false;
			content.likes -= 1;
			content.isDisliked = true;
			content.dislikes += 1;
			return $http.post('/likeDislike', {
				userId: userId,
				contentId: content.contentId
			});
		} else {
			content.isDisliked = true;
			content.dislikes += 1;
			return $http.post('/dislike', {
				userId: userId,
				contentId: content.contentId
			});
		}
	};	

	return likeDislikeService;
})

app.controller('searchController', function($scope, SearchService) {

	$scope.search = function() {
		
		console.log($scope.searchStr);
		SearchService.search($scope.searchStr)
			.then(function(success) {

			}, function(err) {

			});
	};	
});

app.controller('submitController', function($scope, InsertService) {

	$scope.categories = [];
	$scope.categories[0] = 'Education';
	$scope.categories[1] = 'Health';
	$scope.categories[2] = 'Humanity';
	$scope.categories[3] = 'Governance';

	$scope.processing = false;

	$scope.insert = function() {

		$scope.processing = true;
		$scope.success = null;
		$scope.error = null;

		InsertService.insert($scope.contentURL, $scope.selectedCategory)
			.then(function(success) {
				
				$scope.success = success.data;
				$scope.processing = false;
			}, function(err) {
				
				$scope.error = err;
				$scope.processing = false;
			});

		$scope.contentURL = null;
		$scope.selectedCategory = null;			
	};
});

app.controller('findController', function($scope, FindService) {

	$scope.startIndex = 0;
	$scope.limit = 10;

	FindService.findAll($scope.startIndex, $scope.limit)
		.then(function(records) {

			$scope.items = records.data.contents;
			$scope.startIndex += $scope.limit;
		}, function(err) {
	
		});

	$scope.findAll = function() {

		FindService.findAll($scope.startIndex, $scope.limit)
			.then(function(records) {

				$scope.items = records.data.contents;
				$scope.startIndex += limit;
			}, function(err) {

			});
	};
});

app.controller('contentController', 
	function($scope, $window, FindService, SearchService, LikeDislikeService, BookmarkService, UserDataService) {

	$scope.startIndex = 0;
	$scope.limit = 10;
	$scope.items = [];

	if ($window.sessionStorage.getItem('token') != null) {
		$scope.isLoggedIn = true;
		UserDataService.getUserData($window.sessionStorage.getItem('userId'));
	} else {
		$scope.isLoggedIn = false;
	}

	FindService.findAll($scope.startIndex, $scope.limit)
		.then(function(records) {

			var contents = records.data.contents;
			console.log(contents);

			if ($scope.isLoggedIn) {
				for (var i = 0; i < contents.length; i++) {
					contents[i].isLiked = UserDataService.isLiked(contents[i].contentId);
					contents[i].isDisliked = UserDataService.isDisliked(contents[i].contentId);
					contents[i].isBookmarked = UserDataService.isBookmarked(contents[i].contentId);
				}
			}
			
			$scope.items = contents;
			$scope.startIndex += $scope.limit;
		}, function(err) {

		});

	$scope.findAll = function() {

		FindService.findAll($scope.startIndex, $scope.limit)
			.then(function(records) {


				$scope.startIndex += $scope.limit;
			}, function(err) {
				

			});
	};

	$scope.loadMore = function() {

		FindService.findAll($scope.startIndex, $scope.limit)
			.then(function(records) {

				for (var i = 0; i < records.data.contents.length; i++) {
					$scope.items.push(records.data.contents[i]);
				}


				$scope.startIndex += $scope.limit;

			}, function(err) {

			});
	};

	$scope.search = function() {
		SearchService.search($scope.searchStr)
			.then(function(searchResults) {

				$scope.items = searchResults.data;
			}, function(err) {
				
				console.log(err)
			});
	};

	$scope.like = function(item) {
		LikeDislikeService.like($window.sessionStorage.getItem('userId'), item);
	};

	$scope.dislike = function(item) {
		LikeDislikeService.dislike($window.sessionStorage.getItem('userId'), item);
	};

	$scope.bookmark = function(item) {
		BookmarkService.bookmark($window.sessionStorage.getItem('userId'), item);
	}

	$scope.updateViewCount = function(item) {
		$http.post('/');
	}
});