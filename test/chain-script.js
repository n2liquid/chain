'use strict';
let fs = require('fs');
let commandQueue = require('../command-queue');
commandQueue.registerCommandHandlers(require('../io'));
let compile = require('../compile-script');
let script = compile (
	fs.readFileSync (
		__dirname + '/pw-ep1.chainscript', {
			encoding: 'utf8',
		}
	)
);
script.run().done();
