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
	script.commands = parse(source).map((command, i) => {
		if(typeof command !== 'object') {
			let commandObject = {};
			commandObject['@' + typeof command] = command;
			command = commandObject;
		}
		command.context = script;
		let commandName = Object.keys(command)[0];
		switch(commandName) {
			case 'label':
				script.labels[command.label] = i;
				break;
			case 'choice':
				if(command.choice.objectLiteral) {
					command.choice.code = command.choice.objectLiteral;
				}
				command.choice = new Function (
					'return (' + command.choice.code + ');'
				)();
				break;
		}
		return command;
	});
	return script;
};
