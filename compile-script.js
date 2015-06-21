'use strict';
let fs = require('fs');
let _ = require('lodash');
let Q = require('q');
let peg = require('pegjs');
let errorWithMetadata = require('./util/error-with-metadata');
let LowLevelScript = require('./low-level-script');
let parse = peg.buildParser (
	fs.readFileSync (
		__dirname + '/script-grammar.pegjs', {
			encoding: 'utf8',
		}
	)
).parse;
module.exports = function(source) {
	let script = new LowLevelScript();
	let filterCount = 0;
	script.commands = parse(source).filter((command, i) => {
		let postFilterIndex = i - filterCount;
		if(typeof command !== 'object') {
			return true;
		}
		let commandName = Object.keys(command)[0];
		switch(commandName) {
			case 'label':
				script.labels[command.label] = postFilterIndex;
				++filterCount;
				return false;
			case 'choice':
				if(command.choice.objectLiteral) {
					command.choice.code = command.choice.objectLiteral;
				}
				command.choice = new Function (
					'return (' + command.choice.code + ');'
				)();
				if(Array.isArray(command.choice)) {
					command.choice.forEach(function(option) {
						option.fn = option.fn.bind(script);
					});
				}
				else {
					command.choice = _.mapValues(command.choice, function(fn) {
						return fn.bind(script);
					});
				}
				return true;
			default:
				return true;
		}
	});
	return script;
};
