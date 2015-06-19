'use strict';
let fs = require('fs');
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
	script.commands = parse(source).filter((command, i) => {
		let postFilterIndex = i - Object.keys(script.labels).length;
		if(typeof command !== 'object') {
			return true;
		}
		let commandName = Object.keys(command)[0];
		switch(commandName) {
			case 'label':
				script.labels[command.label] = postFilterIndex;
				return false;
			case 'choice':
				command.choice = new Function (
					'return [' + command.choice.code + '];'
				)();
				command.choice.forEach(function(option) {
					option.fn = option.fn.bind(script);
				});
				return true;
			default:
				return true;
		}
	});
	return script;
};
