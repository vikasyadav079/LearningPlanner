var winston = require('winston');
const { combine, timestamp, label, prettyPrint } = winston.format;
require('winston-daily-rotate-file');


  var transport = new (winston.transports.DailyRotateFile)({
    filename: './app_api/logs/application-%DATE%.log',
    datePattern: 'YYYY-MM-DD-HH',
    zippedArchive: true,
    maxSize: '20m',
    maxFiles: '14d'
  });

  transport.on('rotate', function(oldFilename, newFilename) {
    // do something fun
  });

  const loggingLevel = {
      error: 0, 
      warn: 1, 
      info: 2, 
      verbose: 3, 
      debug: 4, 
      silly: 5 
}


  var loggerObj = winston.createLogger({
    level : 'info',
    format: winston.format.combine(
        timestamp(),
        winston.format.splat(),
        winston.format.simple()
    ),
    transports: [
      new winston.transports.Console(),
      transport
    ]
  });


module.exports = loggerObj;






 
