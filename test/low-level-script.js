'use strict';
let _ = require('lodash');
let commandQueue = require('../command-queue');
commandQueue.registerCommandHandlers(require('../io'));
let LowLevelScript = require('../low-level-script');
let script = new LowLevelScript (
	[
		{clear:true},
		"You've entered a hallway.",
		"\n",
		"The hallway door is just behind you.",
		"\n",
		"\n - Go left",
		"\n - Go right",
		"\n - Leave / Quit",
		"\n\n",
		{
			choice: [
				{
					matcher: "Go left",
					fn: function() {
						script.goTo('left');
					},
				},
				{
					matcher: "Go right",
					fn: function() {
						script.goTo('right');
					},
				},
				{
					matcher: /^leave|quit$/i,
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
					matcher: "Go back",
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
					matcher: "Go back",
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
