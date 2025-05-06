const Category = {
  connect: require('./../../config/connect'),

  new(name, userId, callback) {
    let query = `insert into category (name, user) 
    values ('${name}', ${userId})`;
    console.log(query);
    this.connect.query(query, callback)
  },

  getAll(userId, callback) {
    let query = `select * from category where user = ${userId}`;
    this.connect.query(query, callback)
  },

  getById(categoryId, userId, callback) {
    let query = `select * from category where id = ${categoryId} and user = ${userId}`;
    this.connect.query(query, callback)
  },

  update(data, callback) {
    let query = `update category set name = '${data.name}' where id = ${data.id}`
    this.connect.query(query, callback)
  },
  
}

module.exports = Category