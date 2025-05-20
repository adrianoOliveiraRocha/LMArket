const Order = {
  
  connect: require('./../../config/connect'),

  calculateTotal(items) {
    var total = 0;
    items.forEach(item => {
      total += parseFloat(item.subTotal);
    });
    return total;
  },

  createOrder(order, callback) {      
    var query = `
      insert into _order (user, total, money, creditcard, street, _number, neighborhood)
      values(${parseInt(order.user)}, ${parseFloat(order.total)}, 
      ${parseFloat(order.money)}, '${order.creditCard}', '${order.address.street}', 
      '${order.address._number}', 
      ${parseInt(order.address.neighborhood)})`;
    
    this.connect.query(query, callback);
  },

  getAllOrders(userId, callback) {
    let query = `select * from _order 
    where user = ${userId}
    order by id`;
    this.connect.query(query, callback);
  },

  getFulfilledOrders(userId, callback) {
    let query = `select * from _order 
    where status = 1 and user = ${userId}`;
    this.connect.query(query, callback);
  },

  getNoFulfilledOrders(userId, callback) {
    let query = `select * from _order 
    where status = 0 and user = ${userId};`;
    this.connect.query(query, callback);
  },

  getById(id, callback) {
    let query = `select _order._datetime, _order.money, _order.creditcard, 
    _order.total, _order.status, neighborhood.delivery_fee from _order, neighborhood 
    where _order.neighborhood = neighborhood.id and _order.id = ${id}`;
    this.connect.query(query, callback); 
  },

  getOrderInfo(userId, orderId, callback) {
    let query = `select _order.id, _order._datetime, _order.user, _order.total, 
    _order.money, _order.creditcard, _order.status, _order.street, _order._number, 
    neighborhood.name as neighborhood, _order.sendedToDelivery 
    from _order, neighborhood where _order.id = ${orderId} 
    and _order.neighborhood = neighborhood.id`;
    this.connect.query(query, callback); 
  },

  markAsFuldilled(id, callback) {
    var query = `update _order set status = 1 where id = ${id};
    delete from delivery where orderId=${id};`;
    this.connect.query(query, callback);
  },

  myOrders(userId, callback) {
    var query = `select * from _order where user = ${userId}`;
    this.connect.query(query, callback);
  },

  getMyFulfilledOrdersOrders(userId, callback) {
    var query = `select * from _order where user = ${userId} 
    and status = 1`;
    this.connect.query(query, callback);
  },

  getMyNoFulFilledOrders(userId, callback) {
    var query = `select * from _order where user = ${userId} 
    and status = 0`;
    this.connect.query(query, callback);
  },

  isItFulFilled(status) {
    if(status == 0) return 'no-fulfilled';
    else return 'fulfilled'; 
  },

  getOrderHistoty(userId, callback) {
    let query = `
      select _order.id, _order._datetime, _order.total 
      from  _order where user = ${userId};`;
    this.connect.query(query, callback);
  }
}

module.exports = Order;