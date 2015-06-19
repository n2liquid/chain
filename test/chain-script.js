'use strict';
let fs = require('fs');
let _ = require('lodash');
let commandQueue = require('../command-queue');
let io = require('../io');
_.each(io, function(handler, name) {
	commandQueue.registerCommandHandler(name, handler);
});
let compile = require('../compile-script');
let script = compile (
	fs.readFileSync (
		__dirname + '/pw-ep1.chainscript', {
			encoding: 'utf8',
		}
	)
);
script.run().done();
