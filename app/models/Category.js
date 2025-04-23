const Category = (function() {
  // atributes
  const connect = require('./../../config/connect');
  return {

    new(name, callback) {
      let query = `insert into category (name) values ('${name}')`;
      connect.query(query, callback)
    },

    getAll(userId, callback) {
      let query = `select * from category where user = ${userId}`;
      connect.query(query, callback)
    },

    getById(categoryId, userId, callback) {
      let query = `select * from category where id = ${categoryId} and user = ${userId}`;
      connect.query(query, callback)
    },

    update(data, callback) {
      let query = `update category set name = '${data.name}' where id = ${data.id}`
      connect.query(query, callback)
    },
    
  }
})()

module.exports = Category