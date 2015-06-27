'use strict';
let _ = require('lodash');
let commandQueue = require('../command-queue');
commandQueue.registerCommandHandlers(require('../io'));
commandQueue.push (
	"This is a test...", {w:1000},
	"",
	{d:100}, " Slower...", {w:1000},
	{ds:true}, {d:10}, "\nTAKE THAT!", {w:1000},
	{dr:true}, "\nSlow speed restored...?", {w:1000},
	{d:200}, "\n. . .", {w:1000},
	"\n", {read:true}, {w:1000},
	{clear:true}, {w:1000},
	{d:100}, "\n", {who:"Judge"}, {dh:true}, "Hm...", {w:2000},
	{d:50}, "\n", {di:true}, "Seems legit!", {w:1000},
	"\n", {d:100}, {di:true}, "It seems you are...", {w:2000},
	{d:0}, " NOT", {w:1000}, " GUILTY.", {w:1000},
	{d:30}, "\n\n", {adp:true}, "I'm the judge...", {w:500},
	"\n\n", {who:"Phoenix"}, {adp:true}, "I'm Phoenix Wright...", {w:500},
	"\n", {adp:true}, "I'm always Wright...", {w:500},
	"\n"
);
