'use strict'
const Config = (function() {
  const connect = require('./../../config/connect');
  return {
    get(userId, callback) {
      let query = `select * from config where user = ${userId};`
      console.log(query);
      connect.query(query, callback);
    }
  }
})();

module.exports = Config;
