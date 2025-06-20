module.exports = (app) => {
  
  app.get('/', (req, res) => {
    require('./../control/core.js').home(req, res);
  }),

  app.get('/about', (req, res) => {
    require('./../control/core.js').about(req, res);
  }),

  app.get('/delivery_fee', (req, res) => {
    require('./../control/core.js').deliveryFee(req, res);
  }),

  app.get('/contact', (req, res) => {
    require('./../control/core').contact(req, res);
  })

  app.get('/login-form', (req, res) => {
    require('./../control/core.js').loginForm(req, res);
  }),

  app.post('/user-verify', (req, res) => {
    require('./../control/core.js').userVerify(req, res);
  }),

  app.get('/product-datail', (req, res) => {
    require('./../control/core.js').productDetail(req, res);
  }),

  app.post('/show-cart', (req, res) => {
    require('./../control/core').showCart(req, res);
  }),

  app.post('/search-product', (req, res) => {
    require('./../control/core').searchProduct(req, res);
  }),

  app.post('/get-client-info', function(req, res) {
    require('./../control/core').getClientInfo(req, res);
  }),

  app.post('/order-login', function(req, res) {
    require('./../control/core').orderLogin(req, res);
  });

  app.post('/send-order', function(req, res) {
    require('./../control/core').sendOrder(req, res);
  })

  app.post('/send-message', function(req, res) {
    require('./../control/core').sendMessage(req, res);
  })

  app.get('/.well-known/assetlinks.json', function(req, res) {
    require('./../control/core').assetlinks(req, res);
  })

  app.get('/order-sended', (req, res) => {
    require('./../control/core').orderSended(req, res);
  })
  
}