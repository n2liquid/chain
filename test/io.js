'use strict';
let _ = require('lodash');
let commandQueue = require('../command-queue');
let io = require('../io');
_.each(io, function(handler, name) {
	commandQueue.registerCommandHandler(name, handler);
});
commandQueue.enqueue (
	"This is a test...", {w:1000},
	{d:100}, " Slower...", {w:1000},
	{ds:true}, {d:10}, "\nTAKE THAT!", {w:1000},
	{dr:true}, "\nSlow speed restored...?", {w:1000},
	{d:200}, "\n. . .", {w:1000},
	"\n", {read:true}, {w:1000},
	{d:50}, "\nSeems legit!", {w:1000},
	{clear:true}, {w:1000},
	{d:0}, "NOT", {w:1000}, " GUILTY.", {w:1000},
	"\n"
);
