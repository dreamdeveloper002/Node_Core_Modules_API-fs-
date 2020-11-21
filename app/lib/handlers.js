
//@desc Request handlers


//Dependencies


//Define the handlers
const handlers = {};


//Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
} 

//ping handler
handlers.ping = function (data, callback) {
  
  //Callback http status code, and a payload object;
    callback(200);
};


// Export the module 
module.exports = handlers;
  