'use strict';
let _ = require('lodash');
let commandQueue = require('../command-queue');
let io = require('../io');
_.each(io, function(handler, name) {
	commandQueue.registerCommandHandler(name, handler);
});
let Script = require('../script');
let script = new Script (
	[
		{clear:true},
		"You've entered a hallway.",
		"\n",
		"The hallway door is just behind you.",
		"\n",
		"\n - Go left",
		"\n - Go right",
		"\n - Quit",
		"\n\n",
		{
			choice: [
				{
					matcher: /^Go left$/i,
					fn: function() {
						script.goTo('left');
					},
				},
				{
					matcher: /^Go right$/i,
					fn: function() {
						script.goTo('right');
					},
				},
				{
					matcher: /^Quit$/i,
					fn: function() {
						script.exit();
					},
				},
			]
		},
		"\nYou went left, but there's nothing here.",
		"\n",
		"\n - Go back",
		"\n\n",
		{
			choice: [
				{
					matcher: /^Go back$/i,
					fn: function() {
						script.goTo('center');
					},
				},
			],
		},
		"\nYou went right, but you see nothing interesting.",
		"\n",
		"\n - Go back",
		"\n\n",
		{
			choice: [
				{
					matcher: /^Go back$/i,
					fn: function() {
						script.goTo('center');
					},
				},
			],
		},
	], {
		labels: {
			center: 2,
			left: 10,
			right: 15,
		},
	}
);
script.run().done();
