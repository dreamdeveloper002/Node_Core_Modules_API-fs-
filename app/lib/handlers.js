
//@desc Request handlers


//Dependencies
const _data = require('./data'),
      helpers = require('./helpers');

//Define the handlers
const handlers = {};

//Users
handlers.users = function (data, callback) {

  handlers._users.post(data, callback);

  // const acceptableMethods = ['post','get','delete','put'];
  
  //  if(!acceptableMethods.indexOf(data.method) > -1 ) {
  //      handlers._users[data.method](data, callback);
  //  } else {

  //     callback(405, { 'error': 'an error occured'});
  //  }
  
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
                    'password' : hashedPassword,
                    'tosAgreement' : true
                  };

                    //store the user
                  _data.create('users', phone,userObject,function(err, data) {
                    if (!err) {
                        callback(200)
                    } else {
                      console.log(err)
                      callback(500, {'Error' : 'Couldn\'t create the new user'});
                    }
                 })

                } else {
                  callback(500, {'Error' : 'problem hashing the user\'s password'});
                }
                  
             } else { 
               //User already exists
               callback(400, {'Error': 'A user with that phone number already exists'})
             }
         });

  }  else {
     
    callback(400, {'Error': 'missing required fields'})

  }
};

//@desc Users - GET
handlers._users.get = function (data, callback ) {
  
};


//@desc Users - PUT
handlers._users.put = function (data, callback ) {
  
};

//@desc Users - DELETE
handlers._users.delete = function (data, callback ) {
  
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


console.log(handlers)
// Export the module 
module.exports = handlers;
  