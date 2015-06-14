'use strict';
let clear = require('clear');
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
};
exports.dd = function(amount) {
	typeDelay -= amount;
	if(typeDelay < 0) {
		typeDelay = 0;
	}
};
exports['@string'] = function(string, command) {
	command.typeIndex = command.typeIndex || 0;
	if(typeDelay < 10) {
		process.stdout.write(string.slice(command.typeIndex));
		return 'done';
	}
	if (
		command.typeIndex === 0
		|| (
			Date.now() - command.lastTypeTimestamp >= typeDelay
		)
	) {
		process.stdout.write(string[command.typeIndex++]);
		command.lastTypeTimestamp = Date.now();
	}
	if(command.typeIndex >= string.length) {
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
exports.w = function(howLong, command) {
	if(!command.startTimestamp) {
		command.startTimestamp = Date.now();
	}
	if(Date.now() - command.startTimestamp > howLong) {
		return 'done';
	}
	else {
		return 'yield';
	}
};
exports.read = function(question, command) {
	if(command.done) {
		return 'done';
	}
	else
	if(command.waiting) {
		return 'yield';
	}
	command.waiting = true;
	if(typeof question !== 'string') {
		question = '> ';
	}
	let result = read(question);
	if(command.deferred) {
		result = command.deferred.resolve(result);
	}
	result.done(function() {
		command.done = true;
	});
	return 'yield';
};
