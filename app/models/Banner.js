const Banner = (function() {
  const connect = require('./../../config/connect');
  return {
    new(fileName, callback) {
      let query = `insert into banner (name) values ('${fileName}')`;
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