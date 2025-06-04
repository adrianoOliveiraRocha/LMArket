
const Neighborhood = {

  connect: require('./../../config/connect'),
  
  save(name, deliveryFee, userId, callback) {
    let query = `insert into neighborhood(name, delivery_fee, user) 
    values('${name}', '${parseFloat(deliveryFee.replace(',', '.'))}', ${userId})`;
    this.connect.query(query, callback)
  },

  showAll(callback) {
    let query = 'select * from neighborhood where activated = 1';
    this.connect.query(query, callback)
  },

  orderChoose(userId, callback) {
    let query = `select id, name, delivery_fee from neighborhood 
    where activated = 1 and user = ${userId}`;    
    this.connect.query(query, callback)
  },

  getById(id, callback) {
    let query = `select * from neighborhood where id = ${id}`
    this.connect.query(query, callback)
  },

  edit(data, callback) {
    let query = `update neighborhood set name = '${data.name}', delivery_fee = '${parseFloat(data.deliveryFee.replace(',', '.').replace('R$', ''))}'
    where id = ${data.id}`;
    console.log(query);
    this.connect.query(query, callback)
  },

  deactivate(id, callback) {
    let query = `update neighborhood set activated = 0 where id = ${id}`
    this.connect.query(query, callback)
  },

  activate(id, callback) {
    let query = `update neighborhood set activated = 1 where id = ${id}`
    this.connect.query(query, callback)
  },

  getActives(callback) {
    let query = `select * from neighborhood where activated = 1`;
    this.connect.query(query, callback);
  },

  getUserNeighborhood(idNeighborhood, callback) {
    let query = `select name from neighborhood where id = ${idNeighborhood}`;
    this.connect.query(query, callback);
  }
  
}

module.exports = Neighborhood
