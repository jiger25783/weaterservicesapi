// =========================================
// Utility Functions
// =========================================
const DarkSky = require('dark-sky')
const darksky = new DarkSky(process.env.DARK_SKY) // Your API KEY will be an env variable.
const userName = process.env.USER_NAME || "admin"
const passWord = process.env.PASSWORD || "admin"
var q = require("q");
var moment = require('moment')

module.exports = {
  findByUsername: function (username, fn) {
    let user = {
      "username": userName,
      "password": passWord
    }
    return fn(null, user)
      

    return fn(null, null)
  },

  paramsMissing: function (f1, f2, f3, f4, f5, f6, f7, f8, f9, f10) {
    var missing = false

    for (var i = 0; i < arguments.length; i++) {
      if (arguments[i].trim() == '') {
        missing = true
      }
    }

    return missing
  },

  isNumeric: function (n) {
    return !isNaN(parseFloat(n)) && isFinite(n)
  },

  callDarkSky: function (locationObj, res, next) {
    console.log("Inside seddata locationObj", locationObj)
    var def = q.defer();
    try {
      var promises = []

      for (var i = 1; i <= 7; i++) {
        promises.push(darksky
                      .options({
                        "latitude": locationObj.latitude,
                        "longitude": locationObj.longitude,
                        time: moment().subtract(i, 'days'),
                        exclude: ['minutely', 'hourly', 'currently', 'flags']
                      })
                      .get())
      }
      
      q.all(promises).then(resArr=>{
        var forecast = {
                        "latitude": locationObj.latitude,
                        "longitude": locationObj.longitude,
                        "daily":[]
        }
        for (var i =0; i< resArr.length; i++) {
          forecast.daily.push(this.formatWithJSDate(resArr[i].daily.data[0]))
        }
        res.status(200).json(forecast)
        def.resolve(forecast);
      })
    } catch (err) {
      def.reject(err)
    }    
    return def.promise;
  },

  formatWithJSDate: function(dailyData){
    dailyData.date = moment(this.fromUnixDateToJSDate(dailyData.time)).format('LL')
    return dailyData;
  },

  fromUnixDateToJSDate: function (time) {
    if (! this.isNumber(time)) {
      throw new Error('Expected a number');
    }
    return new Date(time * 1000);
  },

  isNumber: function(value) {
    return typeof value === 'number' || Object.prototype.toString.call(value) === '[object Number]';
  }
}
