module.exports = (app) => {

  app.get('/admin', (req, res) => {
    require('../control/admin').admin(req, res);
  })

  app.get('/profile', (req, res) => {
    require('../control/admin').profile(req, res);
  })

  app.post('/update-profile', (req, res) => {
    require('../control/admin').updateProfile(req, res);
  })

  app.get('/all-orders', function(req, res) {
    require('./../control/admin').allOrders(req, res);
  })

  app.get('/fulfilled-orders', function(req, res) {
    require('./../control/admin').fulfilledOrders(req, res);
  })

  app.get('/no-fulfilled-orders', function(req, res) {
    require('./../control/admin').noFulfilledOrders(req, res);
  })

  app.get('/order-details', function(req, res) {
    require('./../control/admin').orderDetails(req, res);
  })

  app.get('/mark-as-fulfilled', function(req, res) {
    require('./../control/admin').markAsFuldilled(req, res);
  })

  app.get('/show-nofitications', function(req, res) {
    require('./../control/admin').showrNotification(req, res);
  })

  app.get('/message-details', function(req, res) {
    require('./../control/admin').messageDetails(req, res);
  })

  app.get('/change-status-message', (req, res) => {
    require('./../control/admin').changeStatusMessage(req, res);
  })

  app.get('/all-messges', (req, res) => {
    require('./../control/admin').allMessages(req, res);
  })

  app.get('/readed', (req, res) => {
    require('./../control/admin').readedMessages(req, res);
  })

  app.get('/no-readed', (req, res) => {
    require('./../control/admin').noReadedMessages(req, res);
  })

  app.get('/delete-message', (req, res) => {
    require('./../control/admin').deleteMessage(req, res);
  })

  app.get('/send-wapp-message', (req, res) => {
    require('./../control/admin').sendWAppMessage(req, res);
  })

  app.get('/show-users', (req, res) => {
    require('./../control/admin').showUsers(req, res);
  })

  app.get('/user-details', (req, res) => {
    require('./../control/admin').userDetails(req, res);
  })

  app.get('/admin-settings', function(req, res) {
    require('./../control/admin').settings(req, res);
  })

  app.get('/change-phone', function(req, res) {
    require('./../control/admin').changePhone(req, res);
  })

  app.get('/change-font-size', function(req, res) {
    require('./../control/admin').changeFontSize(req, res);
  })  

  app.get('/delete-readed-messages', function(req, res) {
    require('./../control/admin').deleteReadedMessages(req, res);
  });

  app.get('/new-deliveryman', function(req, res) {
    require('./../control/admin').newDeliveryman(req, res);
  });

  app.post('/new-deliveryman', function(req, res) {
    require('./../control/admin').newDeliveryman(req, res);
  });

  app.get('/all-deliveryman', function(req, res) {
    require('./../control/admin').allDeliverymanrs(req, res);
  });

  app.get('/edit-deliveryman', function(req, res) {
    require('./../control/admin').editDeliveryman(req, res);
  });

  app.post('/edit-deliveryman', function(req, res) {
    require('./../control/admin').editDeliveryman(req, res);
  });

  app.post('/send-to-deliveryman', function(req, res) {
    require('./../control/admin').sendToDeliveryman(req, res);
  });

  app.get('/delete-deliveryman', (req, res) => {
    require('./../control/admin').deleteDeliveryman(req, res);
  });

  app.post('/send-address', (req, res) => {
    require('./../control/admin').sendAddress(req, res);
  });

  app.post('/deliveryman-choosed', (req, res) => {
    require('./../control/admin').chooseDeliveryman(req, res);
  });

  app.get('/review-delivery', (req, res) => {
    require('./../control/admin').reviewDelivery(req, res);
  });

  app.get('/delete-delivery', (req, res) => {
    require('./../control/admin').deleteDelivery(req, res);;
  });

  app.get('/low-stoque', (req, res) => {
    require('./../control/admin').lowStoque(req, res);
  });

  app.get('/user-order-history', (req, res) => {
    require('./../control/admin').userOrderHistory(req, res);
  })

}
