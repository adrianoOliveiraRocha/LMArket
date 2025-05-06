module.exports.new = (req, res) => {
  if(req.method == 'GET') res.render('admin/new-category.ejs');
  else {
    let name = req.body.name
    const Category = require('../models/Category');
    Category.new(name, req.session.user.id, (error, result) => {
      if(error) {
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível salvar a categoria. "
          +"Por favor, entre em contato com o desenvolvedor"
        })
      } else {
        res.render('admin/message.ejs', {
          message: "Categoria salva com sucesso"
        })
      }
    })
    
  }
}

module.exports.showAll = (req, res) => {
  const Category = require('./../models/Category');
  Category.getAll(req.session.user.id, (error, result) => {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível recuperar as categorias. "
        +"Por favor, entre em contato com o desenvolvedor"
      })
    } else {
      res.render('admin/all-categories.ejs', { 
        user: req.session.user,
        categories: result 
      })
    }
  })  
}

module.exports.editCategory = (req, res) => {
  const Category = require('./../models/Category');
  if(req.method == 'GET') {  
    let id = req.query.id
    Category.getById(id, req.session.user.id, (error, result) => {
      if(error) {
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível recuperar as categorias. "
          +"Por favor, entre em contato com o desenvolvedor"
        })
      } else {
        res.render('admin/edit-category.ejs', {
          category: result[0]
        })
      }
    })

  } else {
    let data = req.body
    Category.update(data, (error, result) => {
      if(error) {
        console.error(error)
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível atualizar o nome da categoria. "
          +"Por favor, entre em contato com o desenvolvedor"
        })
      } else {
        res.render('admin/message.ejs', {
          message: "O nome da categoria foi atualizado"
        })
      }
    })    
  }
  
}

module.exports.deleteCategory = (req, res) => {
  res.render('admin/error.ejs', {
    errorMessage: `Caaaalma! Temos que testar antes de deletar querido`
  })
}