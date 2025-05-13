module.exports.new = function(req, res) {

  if(req.method == 'GET') {
    const Category = require('./../models/Category')
    Category.getAll(req.session.user.id, (error, result) => {
      if(error) {
        res.render('admin/error.ejs', {
          errorMessage: "Não foi possível realizar essa operação. Por favor, "
          + "entre em contato com o desenvolvedor"
        })
      } else {
        res.render('admin/new-product.ejs', { categories: result })
      }
    })
  } else {

    let data = req.body
    data.imageName = null

    async function uploadImage() {
      return new Promise((resolve, reject) => {
        const ManageFile = require('./../../utils/ManageFile')
        let folder = 'admin/images/products'
        ManageFile.uploadFile(req.files['imageName'], folder, (error, imgn) => {
          if(error) {
            reject(error)
          } else {
            data.imageName = imgn;
            resolve(true)
          }
        })
      })
    }

    async function save() {
      let resultUpload = await uploadImage()
      return new Promise((resolve, reject) => {
        if(resultUpload) {
          data.user = req.session.user.id;
          const Product = require('./../models/Product')
          Product.save(data, (error, result) => {
            error ? reject(error) : resolve(result)
          })
        } else {
          reject('Upload has failed')
        }
      })
    }

    save()
      .then(result => {
        
        let message = "Produto salvo com sucesso!"
        res.render('admin/message.ejs', { message })
      })
      .catch(error => {
        res.json({error})
      })

  }

}

module.exports.showAll = function(req, res) {
  const Product = require('./../models/Product')

  Product.getAll(null, req.session.user.id, (error, products) => {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possivel recuperar os produtos. Por favor, "
        + "entre em contato com o desenvolvedor"
      })
    } else {
      res.render('admin/all-products.ejs', {
        products,
        user: req.session.user
      })
    }
  })
}

module.exports.editProduct = function(req, res) {
  if(req.method == 'GET') { // GET
    const Category = require('./../models/Category')
    const Product = require('./../models/Product')

    async function getCategories() {
      return new Promise((resolve, reject) => {
        Category.getAll(req.session.user.id, (error, categories) => {
          error ? reject(error) : resolve(categories)
        })
      })
    }

    async function getProduct() {
      const categories = await getCategories()
      return new Promise((resolve, reject) => {
        Product.getById(req.query.id, (error, result) => {
          if(error) {
            reject(error)
          } else {
            const product = result[0]
            resolve({ categories,  product})
          }
        })
      })
    }

    getProduct()
      .then(result => {
        res.render('admin/edit-product.ejs', {
          categories: result.categories,
          product: result.product
        })
      })
      .catch(error => {
        res.render('admin/error.ejs', {
          errorMessage: error
        })
      })

  } else { // POST
    var data = req.body
    const ManageFile = require('./../../utils/ManageFile')
    const Product = require('./../models/Product')

    let folder = 'admin/images/products'

    async function deleteOldImage() {
      return new Promise((resolve, reject) => {
        if(req.files) {
          ManageFile.deleteFile(folder, data.imageName, error => {
            if(error) reject(error)
            else resolve(true)
          })
        } else {
          resolve(false) // it doesn't have image to delete
        }
      })
    }

    async function updateImage() {
      let resultDeleteImage = await deleteOldImage();
      return new Promise((resolve, reject) => {
        if(resultDeleteImage) { // file has been sended and the old image has been deleted

          ManageFile.uploadFile(req.files['productImage'], folder, (error, imgn) => {
            if(error) {
              reject(error)
            } else {
              data.imageName = imgn;
              resolve(true)
            }

          })
        } else {
          resolve(false)
        }
      })
    }

    async function updateDB() {
      let result = await updateImage() // null or imageName
      return new Promise((resolve, reject) => {
        Product.update(data, (error, result) => {
          error ? reject(error) : resolve(result)
        })
      })
    }

    updateDB()
      .then(result => {
        res.render('admin/message.ejs', {
          message: "Produto atualizado com sucesso!"
        })
      })
      .catch(error => {
        res.json({error})
      })
  }

}

module.exports.deactivate = (req, res) => {
  const Product = require('./../models/Product')
  let id = req.query.id
  Product.deactivate(id, (error, result) => {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível desativar o produto"
      })
    } else {
      res.render('admin/message.ejs', {
        message: "O produto foi desativado"
      })
    }
  })
}

module.exports.activate = (req, res) => {
  const Product = require('./../models/Product')
  let id = req.query.id
  Product.activate(id, (error, result) => {
    if(error) {
      res.render('admin/error.ejs', {
        errorMessage: "Não foi possível ativar o produto"
      })
    } else {
      res.render('admin/message.ejs', {
        message: "O produto foi ativado"
      })
    }
  })
}

module.exports.searchResult = function(req, res) {
  var infoSearch = req.query.infoSearch;
  if(infoSearch == '') {
    res.render('admin/error.ejs', {
      errorMessage: "Você precisa enviar o ID ou o código de barras do produto"
    });
  } else {
    res.json({infoSearch});
  }  
}