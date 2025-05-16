module.exports.admin = (req, res) => {

  if(req.session.user) {

    const Order = require('./../models/Order');
    Order.getNoFulfilledOrders(function(error, orders) {
      if(error) {
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível recuperar os pedidos. " + error
        });
      } else {
        res.render('admin/index.ejs', {
          user: req.session.user, orders
        });
      }
    });
    
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
  res.render('admin/profile.ejs', {
    user: req.session.user
  })
}

module.exports.updateProfile = (req, res) => {
  var imageSended = req.files ? true : false
  let data = req.body;
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
        res.render('admin/message.ejs', {
          message: `Suas informações foram atualizadas com sucesso.
          Se você alterou a imagem de perfil, atualize a página para ver a
          nova imagem`
        })
      } else {
        throw new Error("A Sessão não foi atualizada")
      }
    })
    .catch(err => {
      console.error(err);
      let msg = "Houve um problema ao tentar atualizar suas informações: " + err; 
      res.end(msg);
    })

}

module.exports.allOrders = function(req, res) {
  const Order = require('./../models/Order');
  Order.getAllOrders(function(error, orders) {
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
  Order.getFulfilledOrdersOrders(function(error, orders) {
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
  const Order = require('./../models/Order');
  Order.getNoFulfilledOrders(function(error, orders) {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível recuperar os pedidos. " + error
      });
    } else {
      res.render('admin/orders.ejs', {
        orders, user: req.session.user, title: "Pedidos em Andamento"
      });
    }
  });
}

module.exports.orderDetails = function(req, res) {
  let orderId = req.query.orderId, userId = req.query.userId;

  //config
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json', 'utf8');
  config = JSON.parse(config);

  const Order = require('./../models/Order');
  const OrderItem = require('./../models/OrderItem');
  const Neighborhood = require('./../models/Neighborhood');
  const UserFactory = require('./../models/UserFactory');
  var userFactory = new UserFactory();

  async function getOrder() {
    return new Promise(function(resolve, reject) {
      Order.getOrerInfo(orderId, function(error, result) {
        error ? reject(error) : resolve(result[0]);
      });
    });
  };

  async function getUserInfos() {
    return new Promise(function(resolve, reject) {
      var user = userFactory.createUser(0);
      user.getUserInfos(userId, function(error, result) {
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

module.exports.showrNotification = function(req, res) {
  const Order = require('./../models/Order');
  const Message = require('./../models/Message');

  async function getNoFulfilledOrders() {
    return new Promise(function(resolve, reject) {
      Order.getNoFulfilledOrders(function(error, orders) {
        error ? reject(error) : resolve(orders);
      });
    });
  };

  async function getNoReadMesages() {
    return new Promise(function(resolve, reject) {
      Message.getNoReadMesages(function(error, messages) {
        error ? reject(error) : resolve(messages)
      });
    });
  };

  Promise.all([getNoFulfilledOrders(), getNoReadMesages()])
    .then(function([orders, messages]) {
      res.render('admin/include/show_notifications.ejs', {
        orders, messages
      });
    })
    .catch(error => {
      console.error(error);
      res.send(error);
    });
}

module.exports.messageDetails = (req, res) => {
  var id = req.query.id;
  const Message = require('./../models/Message');
  Message.getById(id, function(error, result) {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possícel recuperar a mensagem: " + error
      });
    } else {
      res.render('admin/message-details.ejs', {
        message: result[0]
      });
    }
  });
}

module.exports.changeStatusMessage = (req, res) => {

  var data = {
    id: req.query.id,
    status: req.query.status
  }

  const Message = require('./../models/Message');
  var message = '';
  Message.changeStatusMessage(data, function(error, result) {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível realizar a operação: " + error
      })
    } else {
      if(data.status == 1) {
        message = "A mensagem foi marcada como lida";
      } else {
        message = "A mensagem foi marcada como não lida"
      }
      res.render('admin/message.ejs', { message });
    }
  });

}

module.exports.allMessages = (req, res) => {
  const Message = require('./../models/Message');

  Message.getAll(function(error, messages) {
    if(error) {
      throw new Error(error);
    } else {
      res.render('admin/messages.ejs', {
        messages,
        user: req.session.user,
        title: "Todas as Mensagens"
      });
    }
  });

}

module.exports.readedMessages = function(req, res) {
  const Message = require('./../models/Message');

  Message.getReadedMessages(function(error, messages) {
    if(error) {
      throw new Error(error);
    } else {
      res.render('admin/messages.ejs', {
        messages,
        user: req.session.user,
        title: "Mesagens Lidas"
      });
    }
  });
}

module.exports.noReadedMessages = function(req, res) {
  const Message = require('./../models/Message');

  Message.noReadedMessages(function(error, messages) {
    if(error) {
      throw new Error(error);
    } else {
      res.render('admin/messages.ejs', {
        messages,
        user: req.session.user,
        title: "Mesagens Não Lidas"
      });
    }
  });
}

module.exports.deleteMessage = (req, res) => {
  var id = req.query.id;
  const Message = require('./../models/Message');
  Message.deleteMessage(id, function(error, result) {
    if(error) throw Error(error);
    else {
      res.render('admin/message.ejs', {
        message: "Mensagem deletada com sucesso"
      });
    };
  })
}

module.exports.sendWAppMessage = function(req, res) {
  var phone = '55' + req.query.clientPhone.replace('(', '').replace(')', '');
  var message = 'Olá ' + req.query.clientName;
  var wappLink = require('./../../utils/getWhatsappLink')(phone, message);
  res.redirect(wappLink);
}

module.exports.showUsers = function(req, res) {
  const UserFactory = require('./../models/UserFactory');
  var factory = new UserFactory()
  var user = factory.createUser(1);

  user.getAllUsers(function(error, users) {
    if(error) {
      res.render('admin/error', {
        errorMessage: "Não foi possivel recuperar as informações dos usuários: " + error
      });
    } else {
      res.render('admin/show-users.ejs', { user: req.session.user, users });
    }
  });
}

module.exports.userDetails = function(req, res) {
  var userId = req.query.userId;
  const UserFactory = require('./../models/UserFactory');
  var factory = new UserFactory()
  var user = factory.createUser(0);

  user.getUserInfos(userId, function(error, result) {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível recuperar as informações do usuário: " + error
      });
    } else {
      res.render('admin/user-details.ejs', {
        user: result[0],
        birthday: result[0].birthday ? result[0].birthday.toLocaleDateString() : null 
      });
    }
  });
}

module.exports.settings = (req, res) => {
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json', 'utf8');
  var config = JSON.parse(config);
  res.render('admin/settings.ejs', { config });
}

module.exports.changePhone = function(req, res) {
  var phone = req.query.phone;
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json', 'utf8');
  var config = JSON.parse(config);
  config.companyPhone = '55' + phone.replace('(', '').replace(')', '');
  config = JSON.stringify(config);
  fs.writeFileSync('app/public/json/config.json', config);

  res.render('admin/message.ejs', {
    message: "Telefone alterado com sucesso!"
  });
}

module.exports.changeFontSize = function(req, res) {
  var fontSize = req.query.fontSize;
  const fs = require('fs');
  var config = fs.readFileSync('app/public/json/config.json', 'utf8');
  var config = JSON.parse(config);
  config.fontSize = fontSize;
  config = JSON.stringify(config);
  fs.writeFileSync('app/public/json/config.json', config);

  res.render('admin/message.ejs', {
    message: "o tamanho da fonte foi alterado com sucesso!"
  });
}

module.exports.deleteReadedMessages = function(req, res) {
  const Message = require('./../models/Message');

  Message.deleteAllReadedMessages(function(error, result) {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível deletar as mensagens"
      });
    } else {
      res.render('admin/message.ejs', {
        message: "As mensagens lidas foram deletadas"
      })
    }
  });

}

module.exports.newDeliveryman = function(req, res) {
  
  if(req.method == 'GET') {
    res.render('admin/new-deliveryman.ejs');
  } else {
    var data = req.body;
    const UserFactory = require('./../models/UserFactory');
    var userFactory = new UserFactory();
    var Deliveryman = userFactory.createUser(2, data);
    Deliveryman.save((error, result) => {
      let errorMessage = "Não foi possível salvar o colaborador. ";
      if(error) {
        if(error.code === 'ER_DUP_ENTRY') {
          errorMessage += `
          Possíveis problemas:
          1 - email já cadastrado; 
          2 - Senha repetida`;
        } else { errorMessage =+ error.sqlMessage }
        
        res.render('admin/error.ejs',{errorMessage});
      } else {
        let message = "Colaborador salvo com sucesso";
        res.render('admin/message.ejs', {message});
      }
    });

  }

}

module.exports.allDeliverymanrs = function(req, res) {
  const UserFactory = require('./../models/UserFactory');
  var userFactory = new UserFactory();
  var Deliveryman = userFactory.createUser(2);
  
  Deliveryman.getAllDeliveryman((error, deliverymans) => {
    if(error) {
      let errorMessage = "Não foi possível recuperar as informações "
      +" dos colaboradores: " + error + " Por favor, entre em contato "
      +"com o desenvolvedor";
      res.json({errorMessage});
    } else {
      res.render('admin/all-deliveryman.ejs', 
      {deliverymans, user: req.session.user});
    }
  });

}

module.exports.editDeliveryman = function(req, res) {
  const UserFactory = require('./../models/UserFactory');
  var userFactory = new UserFactory();
  const Deliveryman = userFactory.createUser(2);

  if(req.method == 'GET') {
    var id = req.query.id;
    Deliveryman.getById(id, (error, result) => {
      if(error) {
        let errorMessage = "Não foi possível recuperar as informações do colaborador";
        res.render('admin/error.ejs', {errorMessage});
      } else {
        var deliveryman = result[0];
        res.render('admin/edit-deliveryman.ejs', { deliveryman });
      }
    });
  } else {

    const data = req.body;
    Deliveryman.edit(data, function(error, result) {
      if(error) {
        var errorMessage = "Não foi possível editar as informações do entregador: " + error;
        res.render('admin/error.ejs', { errorMessage });
      } else {
        var message = "Os dados do colaborador foram editados com sucesso";
        res.render('admin/message.ejs', { message });
      }
    });
    
  }

}

module.exports.sendToDeliveryman = function(req, res) {
  req.session.deliveryData = req.body;
  const UserFactory = require('./../models/UserFactory');
  var userFactory = new UserFactory();
  const Deliveryman = userFactory.createUser(2);
  Deliveryman.getAllDeliveryman((error, deliverymens) => {
    if(error) {
      var errorMessage = "Não foi possível recuperar os entregadores: " + error;
      res.render('admin/error.ejs', {errorMessage});
    } else {
      res.render('admin/choose-dm.ejs', {deliverymens});
    }
  });
}

module.exports.chooseDeliveryman = (req, res) => {
  if(Object.keys(req.body).length == 0) {
    var errorMessage = "Você não escolheu nenhum entregador";
    res.render('admin/error.ejs', {errorMessage});
  } else {
    req.session.deliveryData.user = req.body.deliverymanChoosed;
    const Delivery  = require('./../models/Delivery');
    Delivery.save(req.session.deliveryData, (error, result) => {
      if(error) {
        req.session.deliveryData = null;
        var errorMessage = "Não foi possível enviar a entrega: " + error;
        res.render('admin/error.ejs', {errorMessage});
      } else {
        req.session.deliveryData = null;
        var message = "A entrega foi enviada com sucesso";
        res.render('admin/message.ejs', {message});
      }
    });
  } 
}

module.exports.deleteDeliveryman = (req, res) => {
  var id = req.query.id;
  const UserFactory = require('./../models/UserFactory');
  let userFactory  = new UserFactory();
  const Deliveryman = userFactory.createUser(2);

  Deliveryman.delete(id, (error, result) => {
    if(error) {
      let errorMessage = "Não doi posspivel deletar o colaborador";
      res.render('admin/error.ejs', {errorMessage});
    } else {
      let message = "Colaborador deletado com sucesso!";
      res.render('admin/message.ejs', {message});
    }
  });
}

module.exports.reviewDelivery = (req, res) => {
  const Delivery = require('./../models/Delivery');
  Delivery.getDeliveryByOrder(req.query.orderId, (error, result) => {
    if(error) {
      var errorMessage = "Não foi possível recuperar a entrega: " + error;
      res.render('admin/error.ejs', {errorMessage});
    } else {
      res.render('admin/delivery-details.ejs', {
        delivery: result[0]
      });
    }
  });
}

module.exports.deleteDelivery = (req, res) => {
  const Delivery = require('./../models/Delivery');

  Delivery.cancel(req.query.deliveryId, req.query.orderId, (error, result) => {
    if(error) {
      var errorMessage = "Não foi possível cancelar a entrega: " + error;
      res.render('admin/error.ejs', {errorMessage});
    } else {
      var message = "Entrega cancelada com sucesso";
      res.render('admin/message.ejs', {message});
    }
  });
}

module.exports.lowStoque = function(req, res) {
  const Product = require('./../models/Product');
  Product.getLowStoque(req.session.user.id, function(error, products) {
    if(error) {
      let errorMessage = 'Não foi possível recuperar os produtos';
      res.render('admin/error.ejs', {errorMessage});
    } else {
      res.render('admin/low-stoque-products.ejs', {
        user: req.session.user,
        products
      })
    }
  });
}

module.exports.userOrderHistory = function (req, res) {
  const Order = require('./../models/Order');
  const UserFactory = require('./../models/UserFactory');
  const User = new UserFactory().createUser(0);
  let userId = req.query.userId;
  let userName = req.query.userName;
 
  const getOrderHistotyPromise = new Promise((resolve, reject) => {
    Order.getOrderHistoty(userId, (error, orderHistory) => {
      error ? reject(error) : resolve(orderHistory);
    });
  });

  getOrderHistotyPromise
    .then((orderHistory) => {
      res.render('admin/order-history.ejs', {
        user: {userId, userName},
        orders: orderHistory
      });
    })
    .catch((error) => {
      let errorMessage = 'Não foi possível recuperar o histórico de pedidos do usuário: ' + error;
      res.render('admin/error.ejs', {errorMessage});
    });
}
