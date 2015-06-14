'use strict';
module.exports = function(error, metadata) {
	error.metadata = metadata;
	return error;
};
