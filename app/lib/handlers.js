
//@desc Request handlers


//Dependencies
const _data = require('./data'),
      helpers = require('./helpers');
      

//Define the handlers 
const handlers = {};


//Users
handlers.users = function (data, callback) {
   
  //handlers._users.post(data, callback);

  const acceptableMethods = ['post','get','delete','put'];
  
   if(acceptableMethods.indexOf(data.method) > -1 ) {
       handlers._users[data.method](data, callback);
   } else {

      callback(405, { 'error':'an error occurred'});
   }
  
}


// @desc Container for the users subMethods
handlers._users = {};
 
//@desc Users - POST
// Required data: firstName, LastName, Phone, Password, tosAgreement
// Optional data: None
handlers._users.post = function (data, callback ) {

  //Check that all required fields are filled out
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
  const tosAgreement = typeof(data.payload.tosAgreement) == 'boolean' && data.payload.tosAgreement == true ? true : false;
 
  if(firstName && lastName && phone && password && tosAgreement) {
        
         //Make sure that the user doesn't already exist
         _data.read('users', phone, function (err, data) {
             if(err) {
                  // Hash the password
                  const hashedPassword = helpers.hash(password);

                 
                if(hashedPassword) {

                   //Create the user object
                   const userObject = {
                    'firstName' : firstName,
                    'lastName' : lastName,
                    'phone' : phone,
                    'hashedPassword' : hashedPassword,
                    'tosAgreement' : true
                  };

                    //store the user
                  _data.create('users', phone,userObject,function(err) {
                    if (!err) {
                        callback(200)
                    } else {
                      console.log(err)
                      callback(500, {'Error':'Couldn\'t create the new user'});
                    }
                 }); 

                } else {
                  callback(500, {'Error':'problem hashing the user\'s password'});
                }
                  
             } else { 
               //User already exists
               callback(400, {'Error':'A user with that phone number already exists'})
             }
         });

  }  else {
    
    //Missing required field
    callback(400, {'Error':'missing required fields'})

  }
};



//@desc Users - GET
//Required data: phone
//Optional data: none
//@TODO only let an authenticated user access their object, don't let them access anyone else
handlers._users.get = function (data, callback ) {
  
  //Check that the phone number is valid
  const phone = typeof(data.queryStringObject.phone) == 'string' && data.queryStringObject.phone.trim().length == 10 ? data.queryStringObject.phone.trim() : false;
  if(phone) {
    
    //Lookup the user
    _data.read('user', phone, function (err, data) {
        if(!err & data ) {
          
          //Remove the hashed password from the object before returning it to the requester
          delete data.hashedPassword;
          callback(200, data);
        } else {
          callback(404);
        }
    });
  } else {
     callback(400, {'Error':'Missing required field'});
  }
};



//@desc Users - PUT
//Required data: phone
//Optional data: none
//@TODO only let an authenticated user update their object, don't let them access anyone else
handlers._users.put = function (data, callback ) {
  //Check for the required field
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  //Check for optional fields
  const firstName = typeof(data.payload.firstName) == 'string' && data.payload.firstName.trim().length > 0 ? data.payload.firstName.trim() : false;
  const lastName = typeof(data.payload.lastName) == 'string' && data.payload.lastName.trim().length > 0 ? data.payload.lastName.trim() : false;
  const password = typeof(data.payload.password) == 'string' && data.payload.password.trim().length > 0 ? data.payload.password.trim() : false;
 
  //check if the phone is valid
  if(phone) {

    //Error if nothing is sent to update
    if(firstName || lastName || password) {
       // Lookup the user
       _data.read('users', phone, function (err, userData) {
           if(!err && userData) {
             //Update the fields necessary
             if(firstName) {
               userData.firstName = firstName;
             };

             if(lastName) {
               userData.lastName = lastName;
             };

             if(password) {
               userData.hashedPassword = helpers.hash(password);
             };

             //Store the new updates
             _data.update('users', phone, userData, function(err) {
                if(!err) {
                  callback(200);
                } else {
                  console.log(err);
                  callback(500, {'Error':'Could not update the user'});
                }
             });

           } else {
               callback(400, {'Error':'The specified user does not exist'});
           }
       });
    } else {
            callback(400, {'Error':'Missing fields to update'});
    }

  } else {

      //Missing required field
    callback(400, {'Error': 'missing required fields'})

  }
};


//@desc Users - DELETE
//Required data: phone
//Optional data: none
//@TODO only let an authenticated user delete their object, don't let them access anyone else
handlers._users.delete = function (data, callback ) {
  //Check for the required field
  const phone = typeof(data.payload.phone) == 'string' && data.payload.phone.trim().length == 10 ? data.payload.phone.trim() : false;

  if(phone) {
    
    //Lookup the user
    _data.read('user', phone, function (err, data) {
        if(!err & data ) {
          
        _data.delete('users', phone, function (err) {
          if(!err) {
            callback(200);
          } else {
             callback(500,{'Error':'Couldn\'t delete specified user'} )
          }
          
        });
          callback(200, data);
        } else {
          callback(400, {'Error':'Couldn\'t find specified user'});
        }
    });
  } else {
     callback(400, {'Error':'Missing required field'});
  }

}


//@desc Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
} 


//@desc ping handler
handlers.ping = function (data, callback) {
  
  //Callback http status code, and a payload object;
    callback(200);
};



// Export the module 
module.exports = handlers;
  