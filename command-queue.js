'use strict';
let Q = require('q');
let errorWithMetadata = require('./util/error-with-metadata');
let commandHandlers = {};
let errorHandler;
let interval;
let queue = [];
exports.setErrorHandler = function(handler) {
	errorHandler = handler;
};
exports.registerCommandHandler = function(name, handler) {
	commandHandlers[name] = handler;
};
exports.removeCommandHandler = function(name) {
	delete commandHandlers[name];
};
exports.registerCommandHandler('@function', function(fn, command) {
	return fn(command);
});
exports.push = function() {
	let commands = [].slice.call(arguments);
	[].push.apply(queue, commands);
	startIntervalIfNotActive();
};
function startIntervalIfNotActive() {
	if(interval) {
		return;
	}
	let commandState = {};
	interval = setInterval(function() {
		if(queue.length === 0) {
			clearInterval(interval);
			interval = null;
			return;
		}
		let command = queue[0];
		if(typeof command !== 'object') {
			let commandObject = {};
			commandObject['@' + typeof command] = command;
			queue[0] = command = commandObject;
		}
		let commandName = Object.keys(command)[0];
		let mainCommandValue = command[commandName];
		let commandHandler = commandHandlers[commandName];
		let result = commandHandler.call (
			commandState,
			mainCommandValue,
			command
		);
		switch(result) {
			case 'yield':
				break;
			case 'done':
				commandState = {};
				queue.shift();
				break;
			default:
				commandState = {};
				dispatchOrThrow (
					errorWithMetadata (
						new Error (
							"Unexpected command handler result: '" + result + "'"
							+ " (command: '" + command + "')"
						), {
							command,
							commandHandler,
							queue,
						}
					)
				);
				break;
		}
	}, 0);
}
function dispatchOrThrow(error) {
	if(errorHandler) {
		errorHandler(error);
	}
	else {
		throw error;
	}
}
