module.exports = function(app) {
  app.get('/new-category', (req, res) => {
    require('./../control/category').new(req, res)
  })

  app.post('/new-category', (req, res) => {
    require('./../control/category').new(req, res)
  })

  app.get('/show-categories', (req, res) => {
    require('./../control/category').showAll(req, res)
  })

  app.get('/edit-category', (req, res) => {
    require('./../control/category').editCategory(req, res)
  })

  app.post('/edit-category', (req, res) => {
    require('./../control/category').editCategory(req, res)
  })

  app.get('/delete-category', (req, res) => {
    require('./../control/category').deleteCategory(req, res);
  })
}