const Order = require('./../models/Order');

function userVerify(req, res) {
  
  let data = req.body;
  const user = require('./../models/User');
  
  user.verify(data, ((error, result) => {  
    if (error) {
      res.render('core/error.ejs', {
        errorMessage: error
      })
    } else { 
      try {
        req.session.user = result[0];
       if(req.session.user.type == 1) {
          res.redirect('/admin');
        } else if(req.session.user.type == 2) {
          res.redirect('/user');
        }
        
      } catch (error) { // user not found
        res.render('core/error.ejs', {
          errorMessage: "Usuário não encontrado"
        })
      }
    }

  }))
}

module.exports.login = function(req, res) {
  if(req.session.user) {
    if(req.session.user.type == 1) {
      res.redirect('/admin');
    } else if(req.session.user.type == 0) {
      res.redirect('/user'); 
    } else if(req.session.user.type == 2) {
      res.redirect('/deliveryman'); 
    }
  } else {    
    let message = req.session.message;
    req.session.message = null;
    if(req.method == 'GET') {
      let type = req.query.type;
      const fs = require('fs');
      // this is the LMarket config. Not the user config
      var config = fs.readFileSync('app/public/json/config.json');
      let logoName = JSON.parse(config).logoName;
      let companyPhone = JSON.parse(config).companyPhone;
      res.render('core/login.ejs', { 
        message, 
        companyPhone, 
        user: null,
        type
       });
    } else {
      userVerify(req, res);
    }
  }

}

module.exports.register = function(req, res) {
  if(req.method == 'GET') {
    const Neighborhood = require('../models/Neighborhood');
    Neighborhood.getActives(function(error, neighborhoods) {
      if(error) {
        res.render('core/error.ejs', {
          errorMessage: "Não foi possível recuperar os bairros"
        });
      } else {
        let type = req.query.type;
        const fs = require('fs')
        var config = fs.readFileSync('app/public/json/config.json')
        let companyPhone = JSON.parse(config).companyPhone;
        res.render('core/register.ejs', {
          neighborhoods, companyPhone, user: null, type
        });
      }
    });
  } else { // POST
    let data = req.body;
    const User = require('../models/User');
    User.save(data, function(error) {
      if(error) {
        res.render('core/error.ejs', {
          errorMessage: error
        });
      } else {
        req.session.message = "Registrado com sucesso! Agora, você pode se logar "
        + "no sistema usando seu email e senha";
        res.redirect('/login');
      }
    });    
  }
    
}

module.exports.user = (req, res) => {
  
  var message = null;
  if (req.session.message) {
    message = req.session.message; 
    req.session.message = null;
  }     
    
  if(req.session.user) {
    res.redirect('/my-no-fulfilled-orders');
    // res.render('user/index.ejs', {
    //   user: req.session.user, message
    // })
  } else {
    res.render('core/error.ejs', {
      errorMessage: "Você não tem permissão para acessar essa página"
    })
  }  

}

module.exports.logout = (req, res) => {
  req.session.destroy()
  res.redirect('/')
}

module.exports.profile = (req ,res) => {
  const Neighborhood = require('./../models/Neighborhood');
  
  Neighborhood.getActives(function(error, neighborhoods) {
    if(error) {
      res.render('user/error.ejs', {
        errorMessage: error
      });
    } else {
      let birthday = null;
      if (req.session.user.birthday 
          && req.session.user.birthday.split('-')[0] !== '1111') {
        let birthdayArr = req.session.user.birthday.split('T');
        birthdayArr = birthdayArr[0].split('-');
        birthday = birthdayArr[2] + '/' + birthdayArr[1] + '/' + birthdayArr[0]; 
      }

      res.render('user/profile.ejs', {
        user: req.session.user, birthday, neighborhoods
      });
    }
  });
  
}

module.exports.updateProfile = (req, res) => {
  var imageSended = req.files ? true : false
  let data = req.body
  data.id = req.session.user.id
  const UserFactory = require('../models/UserFactory')
  const factory = new UserFactory()
  const user = factory.createUser(1)

  var ManageFile, folder;
  if(imageSended) {
    ManageFile = require('../../utils/ManageFile')
    folder = 'admin/images/user'
  } 

  async function deleteOldimage() {
    return new Promise((resolve, reject) => {
      if(imageSended) {        
        ManageFile.deleteFile(folder, req.session.user.imageName, error => {
          error ? reject(error) : resolve(true)
        })
      } else {
        resolve(false)
      }
    })    
  }

  async function uploadNewImage() {
    let responseUpload = await deleteOldimage()
    return new Promise((resolve, reject) => {
      if(responseUpload) {
        ManageFile.uploadFile(req.files['profileImage'], folder, (error, fileName) => {
          error ? reject(error) : resolve(fileName)
        })
      } else {
        resolve(null)
      }
    })
  }

  async function updateDataBase() {
    data.imageName = await uploadNewImage()
    return new Promise((resolve, reject) => {
      user.updateProfile(data, (err, result) => {
        if(err) {
          reject(err)
        } else {
          resolve(true)               
        }
      })
    })    
  }

  async function updateSession() {
    const response = await updateDataBase()
    return new Promise((resolve, reject) => {
      if(response) {
        user.getUser(req.session.user.id, (err, result) => {
          if(err) reject(err)
          else {
            req.session.user = result[0]
            resolve(true)
          }
        })
      }
    })    
  }

  updateSession()
    .then((result) => {
      if(result) {
        res.render('user/message.ejs', {
          message: `Suas informações foram atualizadas com sucesso. 
          Se você alterou a imagem de perfil, atualize a página para ver a 
          nova imagem`
        });
      } else {
        throw new Error("A Sessão não foi atualizada")
      }      
    })
    .catch(err => {
      res.end(`
          <div class="alert alert-danger alert-dismissible">
            <button type="button" class="close" data-dismiss="alert">&times;</button>
            Houve um problema ao tentar atualizar suas informações: ${err}</div>
        `);
    });  

}

module.exports.myFuFilledOrders = function(req, res) {
  var userId = req.session.user.id;
  const Order = require('./../models/Order');

  Order.getMyFulfilledOrdersOrders(userId, function(error, result) {
    if(error) throw new Error(error);
    else res.render('user/orders.ejs', { 
      orders: result, user: req.session.user,
      isItFulFilled: Order.isItFulFilled,
      title: "Pedidos Encerrados"
    });
  });

}

module.exports.myOrders = function(req, res) {
  var userId = req.session.user.id;
  console.log(userId);
  const Order = require('./../models/Order');

  Order.myOrders(userId, function(error, result) {
    if(error) throw new Error(error);
    else res.render('user/orders.ejs', { 
      orders: result, 
      user: req.session.user,
      isItFulFilled: Order.isItFulFilled, title: "Meus Pedidos"
    });
  });
  
}

module.exports.myNoFulFilledOrders = function(req, res) {
  var userId = req.session.user.id;
  const Order = require('./../models/Order');

  Order.getMyNoFulFilledOrders(userId, function(error, result) {
    if(error) throw new Error(error);
    else res.render('user/orders.ejs', { 
      orders: result, 
      user: req.session.user,
      isItFulFilled: Order.isItFulFilled,
      title: "Pedidos em Andamento" 
    });
  });
  
}

module.exports.myOrderDetails = function(req, res) {
  var id = req.query.id;
  const Order = require('./../models/Order');

  Order.getById(id, function(error, result) {
    if(error) {
      res.render('user/error.ejs', {
        errorMessage: "Não foi possível recuperar o pedido: " + error
      })
    } else {
      res.render('user/order-details.ejs', {
        order: result[0],
        isItFulFilled: Order.isItFulFilled 
      })
    }
  });

}

module.exports.userWhatsAppMessage = function(req, res) {
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json', 'utf8');
  var config = JSON.parse(config);
  var number = config.companyPhone;
  var message = '';
  
  let wappLink = require('./../../utils/getWhatsappLink')(number, message);
  res.redirect(wappLink);
}
