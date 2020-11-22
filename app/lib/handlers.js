
//@desc Request handlers


//Dependencies


//Define the handlers
const handlers = {};

//Users
handlers.users = function (data, callback) {
  const acceptableMethods = ['POST', 'PUT', 'DELETE', 'GET' ];
   if(acceptableMethods.indexOf(data.method).toLowerCase() > -1 ) {
       handlers._users[data.method](data, callback);
   } else {

      callback(405);
   }
  
}

// @desc Container for the users submethods
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
  const tosAgreement = typeof(data.payload.toLowerCase) == 'boolean' && data.payload.tosAgreement == true ? true : false;
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

console.log(handlers._users)
console.log(handlers)

// Export the module 
module.exports = handlers;
  