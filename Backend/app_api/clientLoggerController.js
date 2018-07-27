var loggerObj = require('./logger');

var clientErrorLogger = function ( req, res) {
	loggerObj.info('****Client Error start****');
	loggerObj.error(req.body.ClientError);
	loggerObj.info('****Client Error End****');
}


module.exports.clientErrorLogger = clientErrorLogger;