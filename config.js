var fs   = require('fs');
var path = require('path');

var environment   = process.env.NODE_ENV   || 'development';

module.exports = function () {
    if (environment === 'development') {
        return {
        	httpPort: 8087,
			timeout: 120000,        
            logFileLocation: "/mnt/data/log/weatherserviceapi/weatherserviceapi_log_",
            logLevel: "debug"
        };
    } else if (environment === 'production') {
        return {
        	httpPort: 8087,
			timeout: 120000,        
            logFileLocation: "/mnt/data/log/weatherserviceapi/weatherserviceapi_log_",
            logLevel: "error"
        };
    }
};