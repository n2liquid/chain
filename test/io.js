'use strict';
let _ = require('lodash');
let commandQueue = require('../command-queue');
commandQueue.registerCommandHandlers(require('../io'));
commandQueue.push (
	"This is a test...", {w:1000},
	"",
	{d:100}, " Slower...", {p:1000},
	"\nPlease press Enter...", {p:true},
	{ds:true}, {d:10}, "\nTAKE THAT!", {p:1000},
	{dr:true}, "\nSlow speed restored...?", {p:1000},
	{d:200}, "\n. . .", {p:1000},
	{'no-skip':true}, {d:50}, "\nYou shouldn't be able to skip this...", {p:1000},
	{'allow-skip':true}, "\nBut this, you can...", {p:1000},
	"\n", {read:true}, {w:1000},
	{clear:true}, {w:1000},
	{d:100}, "\n", {who:"Judge"}, {dh:true}, "Hm...", {p:2000},
	{d:50}, "\n", {di:true}, "Seems legit!", {p:1000},
	"\n", {d:100}, {di:true}, "It seems you are...",
	{'no-skip':true}, {p:1000}, {d:0}, " NOT", {w:1000}, " GUILTY.", {p:1000},
	{'allow-skip':true}, {d:30}, "\n\n", {adp:true}, "I'm the judge...", {p:500},
	"\n\n", {who:"Phoenix"}, {adp:true}, "I'm Phoenix Wright...", {p:500},
	"\n", {adp:true}, "I'm always Wright...", {p:500},
	"\n"
);
