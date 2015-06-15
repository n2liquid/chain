'use strict';
let commandQueue = require('../command-queue');
console.log("Should count to 4:");
commandQueue.push(function() {
	console.log(1);
	return 'done';
});
commandQueue.push(function(command) {
	if(command.count === undefined) {
		command.count = 0;
	}
	console.log(2 + '.' + command.count);
	++command.count;
	if(command.count >= 4) {
		return 'done';
	}
	else {
		return 'yield';
	}
}, function() {
	console.log(3);
	return 'done';
});
commandQueue.push(function() {
	console.log(4);
	return 'done';
});
