'use strict';
let Q = require('q');
let readline = require('readline');
module.exports = function(question) {
	let deferred = Q.defer();
	let rli = readline.createInterface ({
		input: process.stdin,
		output: process.stdout,
	});
	rli.question(question, function(answer) {
		rli.close();
		deferred.resolve(answer);
	});
	return deferred.promise;
};
