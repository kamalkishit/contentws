var app = angular.module('SubmitModule', ['ngMaterial']);

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