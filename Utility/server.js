var fs = require('./fileService');

var result = fs('./temp1.txt', './temp2.txt', function(result) {
	if (result) {
		console.log('success');
	} else {
		console.log('failure');
	}
});

var arr = [];
var p = 'abc';
for ( var i = 0; i < 10; i++ ) {
	var str = '{ url : ' + p + ' }';
	arr[i] = str;
}

console.log(arr);

