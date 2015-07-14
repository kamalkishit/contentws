var excel = require('excel');

var logger = require('./../../../../Common/Services/Logger');

var filename = 'ExcelJsonService';

exports.excelToJson = function(excelFileName) {
	var promise = new Promise(function(resolve, reject) {
		if (!excelFileName) {
			logger.error(excelFileName, 'excelToJson:' + 'excelFileName is null');
			reject(new Error('filename is null'));	
		}

		excel(excelFileName, function(err, parsedData) {
			if (err) {
				logger.error(filename, 'excelToJson:' + 'not able to convert excel to json');
				reject(new Error(err));
			}

			resolve(convertToJSON(parsedData));
		});
	});

	return promise;
};

function convertToJSON(array) {
	if (!array) {
		return null;
	}

  	var firstRow = array[0].join();
  	var headers = firstRow.split(',');

  	var jsonData = [];
  	for ( var i = 1; i < array.length; i++ ) {

    	var row = array[i].join();
    	var rowData = row.split(',');

    	var data = {};
    	for (var x = 0; x < rowData.length; x++ ) {
      		data[headers[x]] = rowData[x];
    	}

    	jsonData.push(data);
  	}
  	
  	return jsonData;
};
