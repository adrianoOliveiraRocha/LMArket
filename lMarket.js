const express = require('express')
const bodyParser = require('body-parser')
const fileUpload = require('express-fileupload')
const session = require('express-session')
const MySQLStore = require('express-mysql-session')(session)
const cookieParser = require('cookie-parser')
// // const nocache = require('nocache');
const fs = require('fs')

const app = express()

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(cookieParser())
app.use(bodyParser.json())
app.use(express.static('./app/public'))
app.use(fileUpload());

app.set('view engine', 'ejs')
app.set('views', './app/views');

try {
  localEnv = fs.readFileSync('./config/localEnv.json')
  useLocalHost(JSON.parse(localEnv))
} catch (error) {
  console.log('using remote host')
  useRemoteHost()
}

//HOSTS
function useLocalHost(localEnv) {
  const http = require('http')
  const port = 8000;
  const httpServer = http.createServer(app);


  var options = {
    host: 'localhost',
    port: 3306,
    user: localEnv.dbInfo.user,
    password: localEnv.dbInfo.pwd,
    database: localEnv.dbInfo.dbName,
    createDatabaseTable: true,
    endConnectionOnClose: true,
    clearExpired: true,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    }
  }
  // console.log(session)
  const sessionStore = new MySQLStore(options);
  // console.log(sessionStore)
  app.use(session({
    cookieName: 'session',
    secret: 'weareprogrammers-frombrazil-thatisweareit',
    store: sessionStore,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: { secure: false },
    unset: 'keep',
  }))  
  
  require('./app/routs/core')(app);
  require('./app/routs/user')(app);
  require('./app/routs/admin')(app);
  require('./app/routs/category')(app);
  require('./app/routs/product')(app);
  require('./app/routs/neighborhood')(app);
  require('./app/routs/deliveryman')(app);

  httpServer.listen(port, () => {
    console.log('running on port in my localhost on port ' + port)
  }) 
}

function useRemoteHost() {
  const https = require('https');
  const port = 443;

  var options = {
    host: 'localhost',
    port: 3306,
    user: 'adriano',
    password: '453231',
    database: 'deliverynode',
    createDatabaseTable: true,
    endConnectionOnClose: true,
    clearExpired: true,
    schema: {
      tableName: 'sessions',
      columnNames: {
        session_id: 'session_id',
        expires: 'expires',
        data: 'data'
      }
    }
  }
  // console.log(session)
  const sessionStore = new MySQLStore(options);
  // console.log(sessionStore)
  app.use(session({
    cookieName: 'session',
    secret: 'weareprogrammers-frombrazil-thatisweareit',
    store: sessionStore,
    resave: true,
    rolling: true,
    saveUninitialized: true,
    cookie: { secure: false },
    unset: 'keep',
  }))  
  
  require('./app/routs/core')(app);
  require('./app/routs/user')(app);
  require('./app/routs/admin')(app);
  require('./app/routs/category')(app);
  require('./app/routs/product')(app);
  require('./app/routs/neighborhood')(app);
  require('./app/routs/deliveryman')(app);

  const fs = require('fs');
  const credentials = {
    key: fs.readFileSync('/etc/letsencrypt/live/webdelivery.app.br/privkey.pem', 'utf8'),
    cert: fs.readFileSync('/etc/letsencrypt/live/webdelivery.app.br/fullchain.pem', 'utf8')
  }

  const httpsServer = https.createServer(credentials, app);
  httpsServer.listen(port, () => {
      console.log('HTTPS Server running on port ' + port);
  });

  var http = require('http');
	http.createServer(function (req, res) {
		res.writeHead(301, {"Location": "https://" + req.headers['host'] + req.url });
		res.end();
  }).listen(80);
  
}






