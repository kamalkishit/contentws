var myApp = angular.module('myApp', []);

myApp.controller('myController', function($scope, $http, $sce) {

	$scope.title = 'This Beautiful Video Captures The Strength Of A Mother With Disabled Children';
	$scope.description = 'Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.Get ready for some serious tears.';
	$scope.url = 'http://www.youtube.com/embed/6rjRtn-2DQQ?feature=oembed&wmode=opaque&showinfo=0&showsearch=0&rel=0';

	console.log($scope.url);

	$scope.items = [];

	for (var i = 0; i < 10; i++) {
			var obj = {};
	obj.title = 'This Beautiful Video Captures The Strength Of A Mother With Disabled Children';
	obj.description = 'Get ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tearsGet ready for some serious tears.Get ready for some serious tears';
	obj.url = $sce.trustAsResourceUrl('http://www.storypick.com/wp-content/uploads/2015/05/badassmom6.jpg');
		obj.ind = i;
		$scope.items.push(obj);
	}
});