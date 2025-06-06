
module.exports.home = (req, res) => {
  if(req.session.code) {
    marketHome(req, res);
  } else if(req.query.code) {
    req.session.code = req.query.code; 
    marketHome(req, res);
  } else {
    res.render('core/lp/index.ejs');
  }
}

function marketHome(req, res) {
  let categoryId = null, pageNumber = 1;
  // at fisrt dont worry
  if(req.query.categoryId) categoryId = req.query.categoryId;
  if(req.query.page) pageNumber  = req.query.page;

  const Pagination = require('./../../utils/Pagination');
  const pagination = new Pagination();
  const Category = require('./../models/Category');
  const Product = require('./../models/Product');
  const Config = require('./../models/Config');

  async function getConfig() {    
    return new Promise((resolve, reject) => {
      if(!req.session.config) {
        Config.get(req.session.code, (error, result) => {
          if(error) {
            reject('error in getConfig');
          } else {
            req.session.config = result[0];
            resolve(req.session.config);
          }
        })
      } else {
        resolve(req.session.config);
      }
    })
  }

  async function getTotalOfProducts() {
    return new Promise((resolve, reject) => {
      Product.getTotalOfProducts(categoryId, 
        req.session.code, 
        (error, result) => {
        error ? reject('error in getTotalOfProducts') : resolve(result[0].totalOfProducts);
      })
    })
  }

  async function getCurrentCategory() {
    return new Promise((resolve, reject) => {
      if(!categoryId) {
        resolve({name: "Todas as Categorias"});
      } else {
        Category.getById(categoryId, 
          req.session.code, 
          (error, result) => {
          error ? reject('error in getById') : resolve(result[0]);
        })
      }
    })
  }

  async function getCategories() {
    return new Promise((resolve, reject) => {
      const Category = require('./../models/Category')
      Category.getAll(
        req.session.code, 
        (error, categories) => {
        error ? reject('error in getAll') : resolve(categories)
      })
    })
  }

  async function getPage() { //page
    return new Promise((resolve, reject) => {
      Product.getPage(pageNumber, pagination, 
        categoryId, req.session.code, 
        (error, page) => {
        error ? reject('error in getPage') : resolve(page)
      })
    })
  }

  async function getBanners() {
    const Banner = require('./../models/Banner');
    return new Promise((resolve, reject) => {
      Banner.getAll(
        req.session.code, 
        function(error, banners) {
        error ? reject(error) : resolve(banners);
      });

    });
  }

  async function getUser() {
    return new Promise((resolve, reject) => {
      if(req.session.user) resolve(req.session.user);
      else {
        const User = require('./../models/User');
        User.getUser(
          req.session.code, 
          (error, user) => {
            if(error) reject(error);
            else {
              resolve(user);
            }
        })
      }
    })
  }

  Promise.all([getCurrentCategory(), getCategories(), getPage(),
    getTotalOfProducts(), getBanners(), getConfig(), getUser()])
    .then(([currentCategory, categories, page, totalOfProducts, 
      banners, config, user]) => {
      res.render('core/index.ejs', {
        logoName: config.logoName, companyPhone: config.conpanyPhone, categories, page, currentCategory, categoryId,
         pagination, page, totalOfProducts, pageNumber, user,
         banners
       })
    })
    .catch((error) => {
      res.render('core/error.ejs', {
        errorMessage: error
      })
    });
}

module.exports.about = (req, res) => {
  const fs = require('fs')
  var config = fs.readFileSync('app/public/json/config.json')
  let logoName = JSON.parse(config).logoName
  let companyPhone = JSON.parse(config).companyPhone;
  res.render('core/about.ejs', {
    user: req.session.user,
    logoName,
    companyPhone
  });
}

module.exports.deliveryFee = (req, res) => {
  const fs = require('fs')
  var config = fs.readFileSync('app/public/json/config.json')
  let logoName = JSON.parse(config).logoName
  let companyPhone = JSON.parse(config).companyPhone;
  const Neighborhood = require('./../models/Neighborhood');

  Neighborhood.showAll(function(error, result) {
    if (error) {
      res.render('core/error.ejs', {
        errorMessage: "Não foi possível recuperar os bairros: "  + error
      });
    } else {
      res.render('core/delivery-fee.ejs', {
        user: req.session.user,
        logoName, companyPhone,
        neighborhoods: result
      });
    }
  });
}

module.exports.contact = function(req, res) {
  if(req.method == 'GET') {
    const fs = require('fs')
    var config = fs.readFileSync('app/public/json/config.json')
    let companyPhone = JSON.parse(config).companyPhone
    res.render('core/contact.ejs', { companyPhone, user: req.session.user })
  }
}

module.exports.userVerify = (req, res) => {
  let data = req.body
  const UserFactory = require('./../models/UserFactory')
  const factory = new UserFactory()
  const admin = factory.createUser(1)

  admin.verify(data, ((err, result) => {
    if (err) {
      res.render('core/error.ejs', {
        errorMessage: "Tivemos um problema. Por favor, "
        +"contate o desenvolvedor via Whatsapp em (85)9-99473839. Agradecemos sua compreensão"
      })
    } else {

      try {
        if(result[0].admin == 1) {
          req.session.user = result[0]
          res.redirect('/admin')
        } else {
          res.send("omg")
        }
      } catch (error) { // user not found
        res.render('core/error.ejs', {
          errorMessage: "Usuário não encontrado: " + error
        })
      }
    }

  }))

}

module.exports.productDetail = function(req, res) {
  let id = req.query.id; // product id
  const Product = require('./../models/Product');

  Product.getById(id, (error, result) => {
    if(error) {
      res.render('core/error.ejs', {
        errorMessage: "Não foi possível recuperar o produto"
      });
    } else {
      res.render('core/product.ejs', {
        product: result[0],
        companyPhone: req.session.config.companyPhone,
        user: req.session.user
      })
    }
  });
}

module.exports.showCart = (req, res) => {
  var data = req.body;
  var products = require('./../models/Product').getProductsCart(data);
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json');
  let companyPhone = JSON.parse(config).companyPhone;
  res.render('core/shoping-cart.ejs',
  { products, companyPhone, user: req.session.user });
}

module.exports.searchProduct = function(req, res) {
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json');
  let companyPhone = JSON.parse(config).companyPhone;
  const Product = require('./../models/Product');

  Product.searchProduct(req.body.productName, function(error, result) {
    if(error) {
      res.render('core/error.ejs', {
        errorMessage: "Não foi possível realizar a pesquisa",
      })
    } else {
      res.render('core/search-product.ejs',
        { companyPhone,  products: result, user: req.session.user });
    }
  });

}

module.exports.getClientInfo = function(req, res) {
  req.session.car = req.body;
  const Neighborhood = require('./../models/Neighborhood');
  Neighborhood.orderChoose(req.session.code, (error, neighborhoods) => {
    if(error) {
      let errorMessage = error.sqlMessage + "Por favor! "
        + "entre em contato com o desenvolvedor";
      res.render('core/error.ejs', { errorMessage });
    } else {
      res.render('core/get-client-info.ejs', {neighborhoods});
    }
  })
  
}

module.exports.sendOrder = function(req, res) {
  /*
  received object:
  Order: {
    clientName: 'Adriano Oliveira',
    street: 'RUA PROJETADA 2',
    number: '110',
    referencePoint: '',
    phone: '85999473839',
    neighborhood: '1-Meireles-13.55',
    paymentMethod: 'money',
    changeForHowMuch: '100'
  }
  */
  let deliveryInfo = req.body;
  console.log(deliveryInfo);
  
  const Order = require('./../models/Order');
  const Product = require('./../models/Product');

  var items = Product.getProductsCart(req.session.car);
    
  let order = {
    user: req.session.code, // owrn of market
    clientName: deliveryInfo.clientName,
    clientPhone: deliveryInfo.clientPhone,
    street: deliveryInfo.street,
    _number: deliveryInfo.number,
    referencePoint: deliveryInfo.referencePoint,
    paymentMethod: deliveryInfo.paymentMethod,  
    changeForHowMuch: deliveryInfo.changeForHowMuch
  };

  if(order.paymentMethod == 'money') {
    order.changeForHowMuch = deliveryInfo.changeForHowMuch;
  }
  // Attention, yuo need alter the database table _order
  order = Order.resolveNBH(order);
  res.json({items, order});
  
  /*
  async function createOrder() {
    return new Promise(function(resolve, reject) {
      Order.createOrder(order, function(error, result) {
        error ? reject(error) : resolve(result.insertId);
      });
    });
  };

  async function createItems() {
    const OrderItem = require('../models/OrderItem');
    var orderId = await createOrder();
    return new Promise(function(resolve, reject) {
      OrderItem.insertItems(orderId, items, function(error, result) {
        error ? reject(error) : resolve(result);
      })
    })
  }

  createItems()
    .then(function(result) {
      req.session.message = "Seu pedido foi enviado com sucesso";
      res.redirect('/user');
    })
  .catch(function(error) {
    res.render('core/error.ejs', {
      errorMessage: "Não foi possível enviar seu pedido. "
      + "Erro: " + error
    });
  })
  */
}

module.exports.sendMessage = function(req, res) {
  var data = req.body;
  const Message = require('./../models/Message');

  Message.sendMessage(data, function(error, result) {
    if(error) {
      res.render('core/error.ejs', {
        errorMessage: "Não foi possível enviar a mensagem: "
        +"${error}"
      });
    } else {
      res.render('core/message.ejs', {
        message: "Mensagem foi enviada. Sua opinião é muito importante "
        +"para nós. Obrigado!"
      });
    }
  });
}

module.exports.assetlinks = function(req, res) {
  var path = process.env.PWD + '/app/public/.well-known/assetlinks.json';
	res.sendFile(path);
}
