// =========================================
// Environment Configurations
// =========================================
var config = require('./config')();

// =========================================
// Dependencies
// =========================================
var express = require("express");
var winston = require("winston");
winston.add(winston.transports.File, {"filename" : config.logFileLocation+ new Date().getTime() +".log", "level": config.logLevel,"timestamp":true})
var bodyParser     = require("body-parser");
var Utils = require("./js/Utils");

// =========================================
// Basic Authentication (uses Passport)
// =========================================
var passport = require('passport');
var BasicStrategy = require('passport-http').BasicStrategy;

passport.use(new BasicStrategy(

	function(username, password, done) {

		process.nextTick(function () {		  
		  Utils.findByUsername(username, function(err, user) {
		    if (err) { 
		    	return done(err); 
		    }
		    if (!user) { 
		    	return done(null, false); 
		    }
		    if (user.password != password) {
		    	return done(null, false); 
		    }
		    if(user.username == username && user.password == password){
		    	return done(null, user);
		    }
		    return done(null, false)
		  })
		});
	}
));

// =========================================
// HTTP 
// =========================================
var http  = require("http");
var app     = express();
var WORKER_PROCESS_ID = process.pid;
var serverHTTP = http.createServer(app).listen(config.httpPort, function() {
		winston.info("Secure Express Server Started");
});

serverHTTP.timeout = config.timeout;

// =========================================
// Body Parser and Passport initialization
// =========================================
app.use(bodyParser.json({limit: config.bodyParserLimit}));
app.use(bodyParser.urlencoded({limit: config.bodyParserLimit, extended: true}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());

// =========================================
// REST API Routes 
// =========================================
require("./routes/weather")(app, passport, winston, config);