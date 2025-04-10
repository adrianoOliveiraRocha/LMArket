var mysql = require('mysql');

var host, user, password, database;

let dbInfo;
try {
  dbInfo = require('./localEnv').dbInfo;
} catch (error) {
  console.log(error.CODE)
}
if(dbInfo != undefined) {
  host = 'localhost';
  user = dbInfo.user;
  password = dbInfo.pwd;
  database = dbInfo.dbName;
} else {
  host = 'localhost';
  user = 'adriano';
  password = '453231';
  database = 'deliverynode';
}
// console.log(connect)
var connect = function() {
  return mysql.createConnection({
    connectionLimit: 1000,
    host: host,
    user: user,
    password: password,
    database: database,
    multipleStatements: true,
  });
}

module.exports = connect();