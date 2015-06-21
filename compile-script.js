'use strict';
let fs = require('fs');
let _ = require('lodash');
let Q = require('q');
let peg = require('pegjs');
let errorWithMetadata = require('./util/error-with-metadata');
let LowLevelScript = require('./low-level-script');
let commandMappers = {};
let parse = peg.buildParser (
	fs.readFileSync (
		__dirname + '/script-grammar.pegjs', {
			encoding: 'utf8',
		}
	)
).parse;
module.exports = function(source) {
	let script = new LowLevelScript();
	script.commands = parse(source).map((command, i) => {
		if(typeof command !== 'object') {
			let commandObject = {};
			commandObject['@' + typeof command] = command;
			command = commandObject;
		}
		command.context = script;
		let commandName = Object.keys(command)[0];
		let commandMapper = commandMappers[commandName];
		if(commandMapper) {
			command = commandMapper(command, i);
		}
		return command;
	});
	return script;
};
commandMappers.label = function(command, commandOffset) {
	command.context.labels[command.label] = commandOffset;
	return command;
};
commandMappers.js = function(command) {
	let fn = new Function(command.js.code);
	let fnCommand = {
		'@function': (function() {
			fn.call(this);
			return 'done';
		}),
	};
	delete command.js;
	return _.merge(fnCommand, command);
};
commandMappers.choice = function(command) {
	if(command.choice.objectLiteral) {
		command.choice.code = command.choice.objectLiteral;
	}
	command.choice = new Function (
		'return (' + command.choice.code + ');'
	)();
	return command;
};
