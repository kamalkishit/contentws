var app = angular.module('SubmitModule', []);

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

	$scope.processing = false;

	$scope.insert = function() {

		$scope.processing = true;
		console.log('printing');
		console.log($scope.contentURL);

		InsertService.insert($scope.contentURL, $scope.selectedCategory.name)
			.then(function(success) {
				
				console.log(success.status);
				console.log(success.data);
			}, function(err) {
				
				console.log(err);
			});

		$scope.processing = false;
		$scope.contentURL = null;
		$scope.selectedCategory = null;	
	};
});