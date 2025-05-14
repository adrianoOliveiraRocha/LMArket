module.exports.new = function(req, res) {
  if(req.method == 'GET') {
    res.render('admin/new-neighborhood.ejs');
  } else {
    const Neighborhood = require('./../models/Neighborhood');
    let name = req.body.name;
    let deliveryFee = req.body.deliveryFee;
    Neighborhood.save(name, deliveryFee, req.session.user.id, (error, result) => {
      if(error) {
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível salvar o bairro: " + error
        })
      } else {
        res.render('admin/message.ejs', {
          message: "Bairro salvo com sucesso!"
        })
      }
    })
  }
}

module.exports.show = (req, res) => {
  const Neighborhood = require('./../models/Neighborhood')
  Neighborhood.showAll((error, neighborhoods) => {
    if(error) {
      console.error(error)
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível recuperar os bairros"
      });
    } else {
      res.render('admin/all-neighborhoods.ejs', {
        user: req.session.user,
        neighborhoods
      })
    }
  })
}

module.exports.edit = (req, res) => {
  if(req.method == 'GET') {
    let id = req.query.id
    const Neighborhood = require('./../models/Neighborhood')
    Neighborhood.getById(id, (error, result) => {
      if(error) {
        res.render('admin/message.ejs', {
          errorMessage: "Não foi possível recuperar o bairro"
        })
      } else {
        res.render('admin/edit-neighborhood.ejs', {
          neighborhood: result[0]
        })
      }
    })

  } else {
    const Neighborhood = require('./../models/Neighborhood')
    let data = req.body
    Neighborhood.edit(data, (error, result) => {
      if(error) {
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível editar o bairro: " + error
        })
      } else {
        res.render('admin/message.ejs', {
          message: "Bairro editado com sucesso"
        })
      }
    })
  }

}

module.exports.deactivate = (req, res) => {
  const Neighborhood = require('./../models/Neighborhood')
  Neighborhood.deactivate(req.query.id, (error, result) => {
    if(error) {
      console.error(error);
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível desativar o bairro"
      })
    } else {
      res.render('admin/message.ejs', {
        message: "Bairro desativado com sucesso"
      })
    }
  })
}

module.exports.activate = (req, res) => {
  const Neighborhood = require('./../models/Neighborhood')
  Neighborhood.activate(req.query.id, (error, result) => {
    if(error) {
      console.error(error);
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível ativar o bairro"
      })
    } else {
      res.render('admin/message.ejs', {
        message: "Bairro ativado com sucesso"
      })
    }
  })
}
