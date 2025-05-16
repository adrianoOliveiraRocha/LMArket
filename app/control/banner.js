
module.exports.banners = function(req, res) {
  const Banner = require('./../models/Banner');

  Banner.getAll(req.session.user.id, function(error, banners) {
    if (error) {
      let errorMessage = `Não foi possível recuperar os banners. Erro: ${error}`;
      res.render('admin/error.ejs', { errorMessage });
    } else {
      res.render('admin/banners.ejs', {
        user: req.session.user, banners
      });
    }
  });
  
}

module.exports.newBanner = function(req, res) {

  if(req.method == 'GET') res.render('admin/new-banner.ejs');
  else {
    let banner = req.files.banner;
    var ManageFile = require('../../utils/ManageFile');
    var folder = 'admin/images/banners';

    async function uploadBanner() {
      return new Promise((resolve, reject) => {
        ManageFile.uploadFile(banner, folder, (error, fileName) => {
          error ? reject(error) : resolve(fileName)
        });
      });      
    }

    async function saveOnDatabase() {
      let fileName = await uploadBanner();
      const Banner = require('./../models/Banner');
      
      return new Promise((resolve, reject) => {
        Banner.new(fileName, req.session.user.id, (error, result) => {
          error ? reject(error) : resolve(true);
        });
      }); 
    }

    saveOnDatabase()
      .then(fileName => {
        let message = `O banner foi salvo com sucesso!`;
        res.render('admin/message.ejs', { message });
      })
      .catch(error => {
        let errorMessage = `Não foi possível salvar o banner. Erro: ${error}`;
        res.render('admin/error.ejs', { errorMessage });
      });
  }

}

module.exports.deleteBanner = (req, res) => {
  var id = req.query.id;
  var name = req.query.name;
  
  async function deleteFile() {
    var ManageFile = require('../../utils/ManageFile');
    folder = 'admin/images/banners';
    return new Promise((resolve, reject) => {
      ManageFile.deleteFile(folder, name, function(error) {
        error ? reject(error) : resolve(true);
      });
    });
    
  }

  async function deleteOnDataBse() {
    let response = await deleteFile();
    return new Promise((resolve, reject) => {
      if(response) {
        const Banner = require('./../models/Banner');
        Banner.delete(id, function(error, result) {
          error ? reject(error) : resolve(true);
        });
      } else {
        reject('Não foi possível deletar o banner');
      }      
    })
  }

  deleteOnDataBse()
    .then(result => {
      let message = 'Banner deletado com sucesso!';
      res.render('admin/message', { message });
    })
    .catch(error => {
      var errorMessage = 'Não foi possível deletar o banner. Erro: ' + error;
      res.render('admin/error.ejs', { errorMessage });
    });
  
}