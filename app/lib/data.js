//@desc Library for storing ad editing data

//Dependencies
const fs = require("fs"),
  helpers = require('./helpers');
  path = require("path");

//@desc Container for the module(to be exported)
const lib = {};

//@desc Base directory of the data folder
lib.baseDir = path.join(__dirname,'/../.data/');

//Write data to a file
lib.create = function (dir, file, data, callback) {
   
  //Open the file for writing
  fs.open(lib.baseDir+dir+"/"+file+".json", "wx", function (
    err,
    fileDescriptor
  ) {
    if (!err & fileDescriptor) {
      
      //Convert data to string
      const stringData = JSON.stringify(data);

      //Write to file and close it
      fs.writeFile(fileDescriptor, stringData, function (err) {
        if (!err) {
          fs.close(fileDescriptor, function (err) {
            if (!err) {
              callback(false);
            } else {
              callback("Error closing new file");
            }
          });
        } else {
          callback("Error writing to new file");
        }
      });
    } else {
      callback("Could not create new file, it may already exist");
    }
  });
};


//@desc Read data from a file
lib.read = function (dir, file, callback) {
  fs.readFile(lib.baseDir + dir + "/" + file + ".json", "utf8", function (err,data) {
    if(!err & data) {
      const parsedData = helpers.parseJsonToObject(data)
      callback(false, parsedData)
    } else {
      callback(err, data);
    }
  });
};


//@desc Update data from a file
lib.update = function (dir, file, data, callback) {
 
  //Open the file for writing
  fs.open(lib.baseDir + dir + "/" + file + ".json", "r+", function (
    err,
    fileDescriptor
  ) {
    if (!err & fileDescriptor) {
      
      //Convert data to string
      const stringData = JSON.stringify(data);

      //Truncate the file
      fs.truncate(fileDescriptor, function (err) {
        if (!err) {
          
          //Write to file and close it
          fs.writeFile(fileDescriptor, stringData, function (err) {
            if (!err) {
              fs.close(fileDescriptor, function (err) {
                if (!err) {
                  callback(false);
                } else {
                  callback("Error closing new file");
                }
              });
            } else {
              callback("Error writing to new file");
            }
          });
        } else {
          callback("Error truncating file");
        }
      });
    } else {
      callback(
        "Could not make changes to this file, the file might not exist yet"
      );
    }
  });
};


//@desc Delete a file
lib.delete = function(dir,file,callback) {
  
  //Unlink the file
  fs.unlink(lib.baseDir + dir + "/" + file + ".json",function(err) {
      if(!err) {
           callback(false)
      } else {
          callback('Error deleting the file')
      }
  })
}


//Export the module
module.exports = lib;
