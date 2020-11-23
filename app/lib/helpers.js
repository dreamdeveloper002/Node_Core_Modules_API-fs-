//@desc Helpers for various tasks

// Dependencies
const crypto = require('crypto'),
      config = require('../config');


// Container for all the helpers
const helpers = {};


// Create a SHA256 hash
helpers.hash  = function (str) {
   if(typeof(str) == 'string' && str.length > 0) {
       const hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
       return hash;
   } else {
      return false;
   }
};



//Parse a JSON to an object in all cases, without throwing
helpers.parseJsonToObject = function (str) {
  try {
    const obj = JSON.parse(str);
    return obj;
    
  } catch (e) {
    
    return {}
  } 
}

module.exports = helpers;