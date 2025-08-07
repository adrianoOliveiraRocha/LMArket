module.exports.allOrders = function(req, res) {
  const Order = require('./../models/Order');
  Order.getAllOrders(req.session.user.id, function(error, orders) {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível recuperar os pedidos. " + error
      });
    } else {
      res.render('admin/orders.ejs', {
        orders, user: req.session.user,
        title: "Todos os Pedidos"
      });
    }
  });
}

module.exports.fulfilledOrders = function(req, res) {
  
  const Order = require('./../models/Order');
  Order.getFulfilledOrders(req.session.user.id, 
    function(error, orders) {
      if(error) {
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível recuperar os pedidos. " + error
        });
      } else {
        res.render('admin/orders.ejs', {
          orders, user: req.session.user, title: "Pedidos Encerrados"
        });
      }
    });
}

module.exports.noFulfilledOrders = function(req, res) {
  const Order = require('../models/Order');
  Order.getNoFulfilledOrders(req.session.user.id, (error, orders) => {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível recuperar os pedidos. " + error
      })
    } else {
      res.render('admin/orders.ejs', {
        orders, user: req.session.user, title: "Pedidos Encerrados"
      });
    }
  })
}

module.exports.orderDetails = function(req, res) {
  let orderId = req.query.orderId;

  const Order = require('./../models/Order');
  const OrderItem = require('./../models/OrderItem');
  // const Neighborhood = require('./../models/Neighborhood');
  const User = require('./../models/User');

  async function getOrder() {
    return new Promise(function(resolve, reject) {
      Order.getOrderInfo(orderId, function(error, result) {
        error ? reject(error) : resolve(result[0]);
      });
    });
  };

  async function getItems() {
    return new Promise(function(resolve, reject) {
      OrderItem.getByOrderId(orderId, (error, items) => {
        if(error) reject(error);
        else {
          resolve(items);
        }
      });
    });
  }

  async function getConfig() {
    console.log(req.session)
    return new Promise((resolve, reject) => {
      const Config = require('./../models/Config');
      Config.get(req.session.user.id, (error, config) => {
        if(error) reject(error);
        else {
          resolve(config);
        }
      })
    })
  }

  Promise.all([getOrder(), getItems(), getConfig()])
    .then(([order, items, config]) => {
      /*
      RowDataPacket {
        oi_id: 110,
        p_id: 5,
        name: 'Milho Verde em Conserva Quero Lata 200g',
        barcode: '4789852145652',
        description: ' Milho verde e salmoura (água e sal) e estabilizante cloreto de cálcio. ',
        price: 4.56,
        quantity: 1,
        subTotal: 4.56
      }

      */
      for(let item of items) {
        console.log(item);
      }
      res.render('admin/order-details.ejs', {order, items, config, Order});      
    })
    .catch(error => {
      console.log(error);
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível recuperar o pedido. " + error
      });
    });

}

module.exports.markAsFuldilled = function(req, res) {
  var id = req.query.id;
  const Order = require('./../models/Order');

  Order.markAsFuldilled(id, (error, result) => {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível realizar essa operação: " + error
      });
    } else {
      res.render('admin/message.ejs', {
        message: `O pedido ${id} foi marcado como atendido`
      });
    }
  })
}