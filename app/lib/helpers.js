//@desc Helpers for various tasks

// Dependencies
const crypto = require('crypto'),
      config = require('../config'),
      querystring = require(querystring),
      https = require(https);


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


//Create a string of random alphanumeric characters, of a given length

helpers.createRandomString = function(strLength) {
   strLength = typeof(strLength) === 'number' && strLength > 0 ? strLength : false;

   if(strLength) {
   //Define all the possible characters that could go into a string
   let possibleCharacters = 'abcdefghijklmnopqrstuvwxyz012365789';


   //Start the final string
   let str = '';

   for(i = 1; i <= strLength; i++) {
     //Get a random character from the possibleCharacters string
    let randomCharacter = possibleCharacters.charAt(Math.floor(Math.random() * possibleCharacters.length));

     //Append this character to the final string
     str+=randomCharacter;

     return str;
   }
   } else {
     return false;
   }

}

//Send an sms message via twilio
helpers.sendTwilioSms = function (phone,msg,callback) {
    //validate params
    phone = typeof(phone) == 'string' && phone.trim().length == 10  ? phone.trim() : false;
    msg = typeof(msg) == 'string' && msg.trim().length > 0 && msg.trim().length <= 1600  ? msg.trim() : false;

    if(phone && msg) {
        
        //Config the request payload send to twilio
        const payload = {
          'from' : config.twilio.fromPhone,
          'To' : '+1'+phone,
          'Body' : msg
        }

        //Stringify the payload
        const stringPayload = querystring.stringify(payload);

        //Configure the request details
        const requestDetails = {
          'protocol' : 'https:',
          'hostname' : 'api.twilio.com',
          'method' : 'POST',
          'path' : '/2010-04-01/Accounts/'+config.twilio.accountSid+'/Messages.json',
          'auth' : config.twilio.accountSid+':'+config.twilio.authToken,
          'headers' : {
            'Content-Type' : 'application/x-ww-form-urlencoded',
            'Content-Length' : Buffer.byteLength(stringPayload)
          }
        };

        //Instantiate the request object
        let req = https.request(requestDetails, function(res) {
            //Grap the status of the sent request
            let status = res.statusCode;

            //callback success if request went through
            if(status == 200 || status == 201) {
              callback(false)
            } else {
              callback('Status code returned was '+status);
            }
        });
       

        req.on('error',function(e) {
          callback(e)
        });
       
        //Add the payload
        req.write(stringPayload);

        //End the request
        req.end();

    } else {
      callback('Given parameters were missing or invalid')
    }
}

module.exports = helpers;