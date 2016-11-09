/*
 * DB Configs
 * Author - Rajendra Mudale
 */
 
var mySQL = require("mysql");

// Create a connection to the db
var pool  = mySQL.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "wego"
});

var getConnection = function (cb) {
    pool.getConnection(function (err, connection) {
        if(err) throw err;
        
        //pass the error to the cb instead of throwing it
        if(err) {
          console.log('Error connecting to Db');
          return cb(err);
        }
        console.log('DB Connection established');
        cb(null, connection);
    });
};
module.exports = getConnection;