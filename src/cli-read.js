'use strict';
let EventEmitter = require('events').EventEmitter;
let emitter = new EventEmitter();
let Q = require('q');
let readline = require('readline');
let reading = false;
function resetStdin() {
	process.stdin.setRawMode(true);
	process.stdin.resume();
	process.stdin.setEncoding('utf8');
}
resetStdin();
exports = module.exports = function(question) {
	let deferred = Q.defer();
	let rli = readline.createInterface ({
		input: process.stdin,
		output: process.stdout,
	});
	reading = true;
	rli.question(question, function(answer) {
		rli.close();
		reading = false;
		resetStdin();
		deferred.resolve(answer);
	});
	return deferred.promise;
};
exports.emitWhileReading = true;
process.stdin.on('data', function(data) {
	if(data === '\x03') {
		process.stdout.write('\n');
		process.exit();
	}
	if(reading && !exports.emitWhileReading) {
		return;
	}
	data = data.replace('\x7f', '\b');
	emitter.emit('data', data, reading);
});
['on', 'once', 'removeListener'].forEach(function(method) {
	exports[method] = emitter[method].bind(emitter);
});
