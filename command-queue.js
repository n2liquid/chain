'use strict';
let _ = require('lodash');
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
exports.registerCommandHandlers = function(handlers) {
	_.each(handlers, function(handler, name) {
		exports.registerCommandHandler(name, handler);
	});
};
exports.removeCommandHandler = function(name) {
	delete commandHandlers[name];
};
exports.removeCommandHandlers = function(handlers) {
	Object.keys(handlers).forEach(function(name) {
		exports.removeCommandHandler(name);
	});
};
exports.registerCommandHandler('@function', function(fn, command) {
	return fn.call(command.context, command);
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
		try {
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
			if(!commandHandler) {
				throw errorWithMetadata (
					new Error("Unknown command: " + commandName), {
						command,
					}
				);
			}
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
					throw errorWithMetadata (
						new Error (
							"Unexpected command handler result: '" + result + "'"
							+ " (command: '" + command + "')"
						), {
							command,
							commandHandler,
							queue,
						}
					);
					break;
			}
		}
		catch(error) {
			dispatchOrThrow(error);
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
