'use strict';
let commandQueue = require('../command-queue');
console.log("Should count to 7:");
commandQueue.enqueue(function() {
	console.log(1);
	return 'done';
}).then(function() {
	console.log(2);
});
commandQueue.enqueue(function(command) {
	if(command.count === undefined) {
		command.count = 0;
	}
	console.log(3 + '.' + command.count);
	++command.count;
	if(command.count >= 4) {
		return 'done';
	}
	else {
		return 'yield';
	}
}, function() {
	console.log(4);
	return 'done';
}).then(function() {
	console.log(5);
});
commandQueue.enqueue(function() {
	console.log(6);
	return 'done';
}).then(function() {
	console.log(7);
});
