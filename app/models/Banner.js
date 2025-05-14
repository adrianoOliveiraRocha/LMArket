const Banner = (function() {
  const connect = require('./../../config/connect');
  return {
    new(fileName, userId, callback) {
      let query = `insert into banner (name, user) 
      values ('${fileName}', ${userId})`;
      connect.query(query, callback);
    },

    getAll(userId, callback) {
      let query = `select * from banner where user = ${userId}`;
      connect.query(query, callback);
    },

    delete(id, callback) {
      let query = `delete from banner where id = ${id}`;
      connect.query(query, callback);
    }
  }
})();

module.exports = Banner;