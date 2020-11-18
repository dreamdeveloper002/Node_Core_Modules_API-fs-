//@desc Primary file for the API

//Dependencies
const http = require('http'),
      url = require('url'),
      stringDecoder = require('string_decoder').StringDecoder,
      config = require('./config');


//The server should respond to all requests with a string
const server = http.createServer(function (req, res) {

//Get the URL and parse it
const parsedUrl = url.parse(req.url, true); 

//Get the path
const path = parsedUrl.pathname;
const trimmedPath = path.replace(/^\/+|\/+$/g,''); 

//Get the query string as an object
const queryStringObject = parsedUrl.query;

//Get the HTTP method
const method = req.method.toUpperCase();

//Get the headers as an object
const headers = req.headers;

//Get the payload if there's any 
const decoder = new stringDecoder('utf-8');

let buffer = '';

req.on('data', function(data) {
  buffer += decoder.write(data);
});

req.on('end', function () {
   buffer = decoder.end();

//handlers each request should go to, if one isn't found, use not found handler
const choosenHandler = typeof(router[trimmedPath]) !== 'undefined' ? router[trimmedPath] : handlers.notFound;

//Construct data object to send to the data
const data = {
  'trimmedPath' : trimmedPath,
  'queryStringObject' : queryStringObject,
  'method' : method,
  'headers' : headers,
  'payload' : buffer
};

//Route the request to the router specified in the router
choosenHandler(data, function (statusCode, payload) {
   //Use the status code called back by the handler, or the default to 200
  statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
   
  //Use the payload called back by the handler or default to an empty object
  payload = typeof(payload) == 'object' ? payload : {};

  // convert the payload to a string
  const payloadString = JSON.stringify(payload);

  //Return the response
  res.setHeader('Content-Type','application/json')
  res.writeHead(statusCode).end(payloadString);

  //Log the request path
console.log(`Returning this response : ${statusCode}, ${payloadString}`);

});

});

});


//Start the server
server.listen(config.port, function () {
    console.log(`The server is listening on port ${config.port} in ${config.envName} mode`);
})

//Define the handlers
const handlers = {};


//Sample handler
handlers.sample = function (data, callback) {
  
//Callback http status code, and a payload object;
  callback(406, {'nama': 'my name is sample handler'})
};

//Not found handler
handlers.notFound = function (data, callback) {
  callback(404);
} 



//Define a request router
const router = {
  'sample' : handlers.sample
};

