'use strict'

const Config = {
  connect: require('./../../config/connect'),

  get(userId, callback) {
    let query = `select * from config where user = ${userId};`
    console.log(query);
    this.connect.query(query, callback);
  },
}

module.exports = Config;
