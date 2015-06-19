'use strict';
let _ = require('lodash');
let clear = require('clear');
let errorWithMetadata = require('./util/error-with-metadata');
let read = require('./src/cli-read');
let typeDelay = 50;
let storedTypeDelays = [];
let defaultInterlocutor = "????";
let interlocutor;
exports.clear = function() {
	clear();
	return 'done';
};
exports.ds = function() {
	storedTypeDelays.push(typeDelay);
	return 'done';
};
exports.dr = function() {
	let storedDelay = storedTypeDelays.pop();
	if(storedDelay) {
		typeDelay = storedDelay;
	}
	return 'done';
};
exports.d = function(delay) {
	typeDelay = delay;
	return 'done';
};
exports.id = function(amount) {
	typeDelay += amount;
	return 'done';
};
exports.dd = function(amount) {
	typeDelay -= amount;
	if(typeDelay < 0) {
		typeDelay = 0;
	}
	return 'done';
};
exports['@string'] = function(string) {
	this.typeIndex = this.typeIndex || 0;
	if(typeDelay < 10) {
		process.stdout.write(string.slice(this.typeIndex));
		return 'done';
	}
	if (
		this.typeIndex === 0
		|| (
			Date.now() - this.lastTypeTimestamp >= typeDelay
		)
	) {
		process.stdout.write(string[this.typeIndex++]);
		this.lastTypeTimestamp = Date.now();
	}
	if(this.typeIndex >= string.length) {
		return 'done';
	}
	else {
		return 'yield';
	}
};
exports.who = function(who) {
	interlocutor = who;
	return 'done';
};
exports.dh = function() {
	process.stdout.write (
		"  " + (interlocutor || defaultInterlocutor) + ": "
	);
	return 'done';
};
exports.di = function() {
	let whitespace = (
		(interlocutor || defaultInterlocutor).replace(/./g, " ")
	);
	process.stdout.write("  " + whitespace + "  ");
	return 'done';
};
exports.w = function(howLong) {
	if(!this.startTimestamp) {
		this.startTimestamp = Date.now();
	}
	if(Date.now() - this.startTimestamp > howLong) {
		return 'done';
	}
	else {
		return 'yield';
	}
};
exports.read = function(question, command) {
	if(this.done) {
		return 'done';
	}
	else
	if(this.waiting) {
		return 'yield';
	}
	this.waiting = true;
	if(typeof question !== 'string') {
		question = '> ';
	}
	let result = read(question);
	if(command.deferred) {
		command.deferred.resolve(result);
	}
	result.done((function() {
		this.done = true;
	}).bind(this));
	return 'yield';
};
exports.choice = function(options, command) {
	if(this.done) {
		return 'done';
	}
	else
	if(this.waiting) {
		return 'yield';
	}
	this.waiting = true;
	if(!Array.isArray(options)) {
		let optionsObject = options;
		options = [];
		_.each(optionsObject, function(fn, matcher) {
			options.push({ matcher, fn });
		});
	}
	if(!command.question && command.question !== '') {
		command.question = '> ';
	}
	read(command.question).then(function(value) {
		let result;
		if (
			!options.some(function(option) {
				if(option.default) {
					result = option.fn(value);
					return true;
				}
				if(typeof option.matcher === 'string') {
					if(value.trim().toLowerCase() === option.matcher.trim().toLowerCase()) {
						result = option.fn(value);
						return true;
					}
					else {
						return false;
					}
				}
				if(option.matcher instanceof RegExp) {
					let matchResults = option.matcher.exec(value);
					if(!matchResults) {
						return false;
					}
					result = option.fn.apply(option, matchResults);
					return true;
				}
				else {
					throw errorWithMetadata (
						new Error("Bad choice command option"), {
							command: command,
							option: option,
						}
					);
				}
			})
		) {
			console.log("?");
			return false;
		}
		return result;
	}).done((function(result) {
		if(result !== undefined && !result) {
			this.waiting = false;
		}
		else {
			this.done = true;
		}
	}).bind(this));
	return 'yield';
};
