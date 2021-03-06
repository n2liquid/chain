'use strict';
let commandQueue = require('../command-queue');
commandQueue.registerCommandHandlers(require('../io'));
commandQueue.push (
	{
		choice: [
			{
				matcher: /^1$/,
				fn: function() {
					console.log("You've entered 1.");
				},
			},
			{
				matcher: /^2$/,
				fn: function() {
					console.log("You've entered 2.");
				},
			},
			{
				matcher: /^(.+)$/,
				fn: function(value) {
					console.log("You've entered '" + value + "'.");
				},
			},
			{
				default: true,
				fn: function() {
					console.log("Defaulted!");
				},
			},
		],
	},
	"........ OK!\n\n",
	{
		choice: [
			{
				matcher: /^Valid$/i,
				fn: function() {
				},
			},
			{
				matcher: /^Almost valid$/i,
				fn: function() {
					console.log("Sorry, that's not valid enough.");
					return false;
				},
			},
		],
		question: "Enter a valid option> ",
	},
	"........ OK!\n\n"
);
