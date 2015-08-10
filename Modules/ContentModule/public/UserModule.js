var app = angular.module('UserModule', []);

app.factory('SignUpService', function($http) {
	var signupService = {};

	signupService.signup = function(emailId, password) {
		return $http.post('/signup', { emailId: emailId, password: password });
	};

	return signupService;
});

app.factory('LoginService', function($http) {
	var loginService = {};

	loginService.login = function(username, password) {

		return $http.post('/login', { emailId: emailId, password: password });
	};

	return loginService;
});

app.controller('signupController', function($scope, $http, SignUpService) {
	$scope.processing = false;

	$scope.signup = function() {
		$scope.processing = true;
		$scope.error = null;
		$scope.success = null;
		$http.post('/signup', { emailId: $scope.emailId, password: $scope.password })
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
		$http.post('/login', { emailId: $scope.emailId, password: $scope.password })
			.then(function(response) {
				$window.sessionStorage.setItem('userId', response.data.userId);
				$window.sessionStorage.setItem('token', response.data.token);
				$scope.success = response.data;
				console.log($scope.success)
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