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
  console.log("fulfilledOrders")
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
  let orderId = req.query.orderId, userId = req.query.userId;

  //config
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json', 'utf8');
  config = JSON.parse(config);

  const Order = require('./../models/Order');
  const OrderItem = require('./../models/OrderItem');
  // const Neighborhood = require('./../models/Neighborhood');
  const User = require('./../models/User');

  async function getOrder() {
    return new Promise(function(resolve, reject) {
      Order.getOrderInfo(req.session.user.id, orderId, function(error, result) {
        error ? reject(error) : resolve(result[0]);
      });
    });
  };

  async function getUserInfos() {
    return new Promise(function(resolve, reject) {
      User.getUserInfos(userId, function(error, result) {
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

  Promise.all([getOrder(), getUserInfos(), getItems()])
    .then(([order, client, items]) => {
      res.render('admin/order-details.ejs', {
        order, client, items, config
      });
    })
    .catch(error => {
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