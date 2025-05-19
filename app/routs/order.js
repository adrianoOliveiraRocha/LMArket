module.exports = (app) => {
  app.get('/all-orders', function(req, res) {
    require('./../control/order').allOrders(req, res);
  })

  app.get('/fulfilled-orders', function(req, res) {
    require('./../control/order').fulfilledOrders(req, res);
  })

  app.get('/no-fulfilled-orders', function(req, res) {
    require('./../control/order').noFulfilledOrders(req, res);
  })

  app.get('/order-details', function(req, res) {
    require('./../control/order').orderDetails(req, res);
  })

  app.get('/mark-as-fulfilled', function(req, res) {
    require('./../control/order').markAsFuldilled(req, res);
  })
}