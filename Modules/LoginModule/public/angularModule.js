var app = angular.module('LoginModule', ['ngMaterial']);

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
				$window.localStorage.setItem('userId', response.data.userId);
				$window.sessionStorage.setItem('token', response.data.token);
				var p = $window.sessionStorage.getItem('token');
				if (p == null) {
					console.log('success');
				} else {
					console.log(p)
				}
				$scope.success = response.data;
				$scope.processing = false;
				$window.location.href = '/contents';
			}, function(err) {
				$scope.error = err;
				$scope.processing = false;
			});

		$scope.username = null;
		$scope.password = null;	
	};
});

app.controller('logoutController', function($scope, $http, $location, $window, LoginService) {

	$scope.processing = false;

	$scope.logout = function() {

		$scope.processing = true;
		$scope.error = null;
		$scope.success = null;
		$http.post('/login', { username: $scope.username, password: $scope.password })
			.then(function(response) {
				$window.localStorage.setItem('userId', response.data.userId);
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