'use strict';
let _ = require('lodash');
let commandQueue = require('../command-queue');
commandQueue.registerCommandHandlers(require('../io'));
let LowLevelScript = require('../low-level-script');
let script = new LowLevelScript (
	[
		{clear:true},
		"You've entered a hallway.", {p:true},
		"\n",
		"The hallway door is just behind you.", {p:true},
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
		"\nYou went left, but there's nothing here.", {p:true},
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
		"\nYou went right, but you see nothing interesting.", {p:true},
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
			center: 3,
			left: 12,
			right: 18,
		},
	}
);
script.run().done();
