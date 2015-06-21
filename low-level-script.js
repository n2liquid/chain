'use strict';
let Q = require('q');
let errorWithMetadata = require('./util/error-with-metadata');
let commandQueue = require('./command-queue');
exports = module.exports = function(commands, more) {
	more = more || {};
	this.commands = commands;
	this.labels = more.labels || [];
	this.rewind();
};
exports.prototype.rewind = function() {
	this.done = false;
	this.executionOffset = 0;
};
exports.prototype.run = function(startingLabel) {
	let script = this;
	if(this.running) {
		throw new Error (
			"The script is already running"
		);
	}
	if(startingLabel) {
		this.goTo(startingLabel);
	}
	return Q.async(function*() {
		script.running = true;
		while(!script.done) {
			let nextCommand = getNextCommand(script);
			if(nextCommand === undefined) {
				break;
			}
			yield executeCommand(script, nextCommand);
		}
		script.running = false;
	})();
};
function getNextCommand(script) {
	return script.commands[script.executionOffset];
}
function executeCommand(script, command) {
	let deferred = Q.defer();
	commandQueue.push(command, function() {
		if(script.jumping) {
			script.jumping = false;
		}
		else {
			++script.executionOffset;
		}
		deferred.resolve();
		return 'done';
	});
	return deferred.promise;
}
exports.prototype.goTo = function(labelName) {
	if(this.running) {
		this.jumping = true;
	}
	let label = this.labels[labelName];
	if(label === undefined) {
		throw errorWithMetadata (
			new Error (
				"Non-existent label '" + labelName + "'"
			), {
				labelName,
			}
		);
	}
	if(label > this.commands.length) {
		this.executionOffset = this.commands.length;
	}
	else {
		this.executionOffset = label;
	}
};
exports.prototype.exit = function() {
	this.done = true;
};
