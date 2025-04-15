module.exports.home = (req, res) => {
  if(req.query.code) {
    marketHome(req, res);
  } else {
    res.render('core/lp/index.ejs');
  }
}

function marketHome(req, res) {
  const userId = req.query.code;
  let categoryId = null, pageNumber = 1;
  
  if(req.query.categoryId) categoryId = req.query.categoryId;
  if(req.query.page) pageNumber  = req.query.page;

  const Pagination = require('./../../utils/Pagination');
  const pagination = new Pagination();

  const fs = require('fs')
  var config = fs.readFileSync('app/public/json/config.json');
  let logoName = JSON.parse(config).logoName
  let companyPhone = JSON.parse(config).companyPhone;

  const Category = require('./../models/Category');
  const Product = require('./../models/Product');

  async function getTotalOfProducts() {
    return new Promise((resolve, reject) => {
      Product.getTotalOfProducts(categoryId, (error, result) => {
        error ? reject('error in getTotalOfProducts') : resolve(result[0].totalOfProducts);
      })
    })
  }

  async function getCurrentCategory() {
    return new Promise((resolve, reject) => {
      if(!categoryId) {
        resolve({name: "Todas as Categorias"});
      } else {
        Category.getById(categoryId, (error, result) => {
          error ? reject('error in getById') : resolve(result[0]);
        })
      }
    })
  }

  async function getCategpries() {
    return new Promise((resolve, reject) => {
      const Category = require('./../models/Category')
      Category.getAll((error, categories) => {
        error ? reject('error in getAll') : resolve(categories)
      })
    })
  }

  async function getPage() { //page
    return new Promise((resolve, reject) => {
      Product.getPage(pageNumber, pagination, categoryId, (error, page) => {
        error ? reject('error in getPage') : resolve(page)
      })
    })
  }

  async function getBanners() {
    const Banner = require('./../models/Banner');
    return new Promise((resolve, reject) => {
      Banner.getAll(function(error, banners) {
        error ? reject(error) : resolve(banners);
      });

    });
  }

  Promise.all([getCurrentCategory(), getCategpries(), getPage(),
    getTotalOfProducts(), getBanners()])
    .then(([currentCategory, categories, page, totalOfProducts, banners]) => {
      res.render('core/index.ejs', {
        logoName, companyPhone, categories, page, currentCategory, categoryId,
         pagination, page, totalOfProducts, pageNumber, user: req.session.user,
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
  let id = req.query.id
  const fs = require('fs')
  var config = fs.readFileSync('app/public/json/config.json')
  let companyPhone = JSON.parse(config).companyPhone
  const Product = require('./../models/Product');

  Product.getById(id, (error, result) => {
    if(error) {
      res.render('core/error.ejs', {
        errorMessage: "Não foi possível recuperar o produto"
      });
    } else {
      res.render('core/product.ejs', {
        product: result[0],
        companyPhone,
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
  var user = null;
  var loged = false;
  if(req.session.user) {
    loged = true;
    user = req.session.user;
  }

  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json');
  let companyPhone = JSON.parse(config).companyPhone;
  res.render('core/get-client-info.ejs',
  { companyPhone, user, loged });

}

module.exports.orderLogin = function(req, res) {
  var data = req.body;

  async function userVerify() {
    const UserFactory = require('./../models/UserFactory');
    const factory = new UserFactory();
    var user = factory.createUser(0);
    return new Promise((resolve, reject) => {
      user.verify(data, (error, result) => {
        if(error) {
          reject(error);
        } else {
          Object.keys(result).length > 0
          ? resolve(result[0])
          : reject("Usuário não encontrado");
        }
      });
    });
  }

  async function getNeihborhood() {
    const Neighborhood = require('./../models/Neighborhood');
    return new Promise(function(resolve, reject) {
      Neighborhood.getActives(function(error, neighborhoods) {
        error ? reject(error) : resolve(neighborhoods);
      })
    });
  }

  Promise.all([userVerify(), getNeihborhood()])
    .then(function([user, neighborhoods]) {
      req.session.user = user;
      res.render('core/send-order.ejs', {user, neighborhoods});
    })
    .catch(function(error) {
      res.send(`
      <div class="alert alert-danger">${error}</div>
      <a class="btn btn-warning" href="/">
      Voltar
      </a>
      </button>
      `);
    });

}

module.exports.sendOrder = function(req, res) {
  var deliveryInfo = req.body;

  var address = {};
  if(!deliveryInfo.useMyAddress) {
    address.useMyAddress = true;
    address.street = deliveryInfo.street,
    address._number = deliveryInfo._number;
    address.neighborhood = deliveryInfo.neighborhood;
    address.complement = deliveryInfo.complement;
  } else {
    address.useMyAddress = false;
    address.street = req.session.user.street,
    address._number = req.session.user._number;
    address.neighborhood = req.session.user.neighborhood;
    address.complement = req.session.user.complement;
  }
  const Order = require('./../models/Order');
  const Product = require('./../models/Product');

  var items = Product.getProductsCart(req.session.car);

  var order = {
    user: req.session.user.id,
    total: Order.calculateTotal(items),
    money: typeof deliveryInfo.money == 'undefined' ? 0.0 : deliveryInfo.money,
    creditCard: deliveryInfo.creditCard,
    address: address
  };

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
