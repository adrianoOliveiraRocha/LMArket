module.exports = (app) => {
  
  app.get('/all-banners', function(req, res) {
    require('./../control/banner').banners(req, res);
  })
  
  app.get('/new-banner', function(req, res) {
    require('./../control/banner').newBanner(req, res);
  })
  
  app.post('/new-banner', function(req, res) {
    require('./../control/banner').newBanner(req, res);
  })
  
  app.get('/delete-banner', function(req, res) {
    require('./../control/banner').deleteBanner(req, res);
  });
  
}