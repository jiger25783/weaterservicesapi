// =========================================
// Routing
// =========================================
var Utils = require("../js/Utils");


// =========================================
// Application GET, POST, etc Routes
// =========================================
module.exports = function (app, passport, winston, config) {

	// ============================================================
	// Generic Catch-All for PUT / DELETE / PATCH
	// ============================================================
	app.put("/weatherapi/*", passport.authenticate('basic', { session: false }), function(req, res, next){
		res.send([{"error":"PUT has been disabled."}]);
	});
	app.delete("/weatherapi/*", passport.authenticate('basic', { session: false }), function(req, res, next){
		res.send([{"error":"DELETE has been disabled."}]);
	});
	app.patch("/weatherapi/*", passport.authenticate('basic', { session: false }), function(req, res, next){
		res.send([{"error":"PATCH has been disabled."}]);
	});
	app.post("/weatherapi/*", passport.authenticate('basic', { session: false }), function(req, res, next){
		res.send([{"error":"POST has been disabled."}]);
	});

	// *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=
	// "Weather Service" ENDPOINTS
	// *=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=*=

	// ============================================================
	// getLastWeekWeatherInfo service
	// ============================================================
	app.get("/weatherapi/v1/getLastWeekWeatherInfo/:location", passport.authenticate('basic', { session: false }), function(req, res, next){
		getLastWeekWeatherInfo(req, res, next);
	});
	
	function getLastWeekWeatherInfo(req, res, next) {
		var location = typeof req.params.location === 'undefined' ? "" : req.params.location;
		
		if ( Utils.paramsMissing(location) ) {
			res.send([{"error":"invalid request."}]);
		} else {
			let where = require('node-where');
		  	where.is(location, function(err, result) {
		  		if (result) {
				    console.log('Lat: ' + result.get('lat'));
				    console.log('Lng: ' + result.get('lng'));
				}
				let latitude = result.get('lat')
				let longitude = result.get('lng')
				let locationObj = {
					"latitude": latitude,
					"longitude": longitude
				}
				Utils.callDarkSky(locationObj, res, next)
					.catch(err => {
						console.log(`error in senddata: ${err}`)
						next(err)
					});
		  	})
		}
	}
};
