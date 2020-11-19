//@desc Primary file for the API

//Dependencies
const http = require('http'),
      https = require('https'),
      url = require('url'),
      stringDecoder = require('string_decoder').StringDecoder,
      fs = require('fs'),
      config = require('./config');


//Instantiating the HTTP server
const httpServer = http.createServer(function (req, res) {
    unifiedServer(req,res);
});

//Start the server
httpServer.listen(config.httpPort, function () {
  console.log(`The server is listening on port ${config.httpPort} in ${config.envName} mode`);
});


//Instantiating the HTTPS server
const httpsServerOptions = {
  'key' : fs.readFileSync('./https/key.pem'),
  'cert' : fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions, function (req, res) {
  unifiedServer(req,res);
});

//Start the server
httpsServer.listen(config.httpsPort, function () {
    console.log(`The server is listening on port ${config.httpsPort} in ${config.envName} mode`);
})

//All the server logic for both the http and https server
const unifiedServer = function (req,res) {
  
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
};


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
  

//Define a request router
const router = {
  'ping' : handlers.ping
};

