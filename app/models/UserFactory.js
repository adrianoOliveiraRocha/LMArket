function Admin() {
  this.getAllUsers = function(callback) {
    let query = 'select id, name, email from user where type=0';
    const connect = require('./../../config/connect');
    connect.query(query, callback);
  }

  this.save = function(callback) {
    // MySQL date format => "AAAA-MM-DD"
    let birthdayArr = this.data.birthday.split('/');
    const birthday = `${birthdayArr[2]}-${birthdayArr[1]}-${birthdayArr[0]}`;

    let query = `insert into user 
    (name, email, cpf, birthday, pwd, type, phone, street, _number, neighborhood, complement)
    values('${this.data.name}', '${this.data.email}', 
    '${this.data.cpf}', '${birthday}', 
    '${this.data.pwd}', ${type}, '${this.data.phone}',
     '${this.data.street}', '${this.data._number}', '${this.data.neighborhood}', 
     '${this.data.complement}')`;
    
    connect.query(query, callback);
  }
}

function User(data) {
  const connect = require('./../../config/connect');
  this.data = data;

  this.save = function(callback) {
    // MySQL date format => "AAAA-MM-DD"
    let birthdayArr = this.data.birthday.split('/');
    const birthday = `${birthdayArr[2]}-${birthdayArr[1]}-${birthdayArr[0]}`;

    let query = `insert into user 
    (name, email, cpf, birthday, pwd, type, phone, street, _number, neighborhood, complement)
    values('${this.data.name}', '${this.data.email}', 
    '${this.data.cpf}', '${birthday}', 
    '${this.data.pwd}', ${type}, '${this.data.phone}',
     '${this.data.street}', '${this.data._number}', '${this.data.neighborhood}', 
     '${this.data.complement}')`;
    
    connect.query(query, callback);
  }

  this.verify = function(data, callback) {
    let query = `select * from user where email='${data.email}' and 
      pwd = '${data.pwd}'`;
    connect.query(query, callback);      
  };

  this.getUserInfos = function(id, callback) {
    const query = `select user.id, user.name, user.email, user.cpf, user.birthday, user.phone, user.pwd, 
    user.street, user._number, user.complement, neighborhood.name as neighborhood, 
    neighborhood.delivery_fee as delivery_fee from user, neighborhood  
    where user.id = ${id} and user.neighborhood = neighborhood.id`;
    connect.query(query, callback); 
  };

  this.getUser = function (userId, callback) {
    let query = 'select * from user where id = ' + userId;
    connect.query(query, callback);
  }

}

function Deliveryman(data) {
  this.data = data;

  this.save = function(callback) {
    let query = `insert into user 
    (name, cpf, email, pwd, type, phone)
    values('${this.data.name}', '${this.data.cpf}', '${this.data.email}', '${this.data.pwd}',
     2, '${this.data.phone}')`;
    const connect = require('./../../config/connect');
    connect.query(query, callback);
  },

  this.getAllDeliveryman = (callback) => {
    let query = 'select * from user where type = 2';
    const connect = require('./../../config/connect');
    connect.query(query, callback);
  },

  this.edit = (data, callback) => {
    let query = `update user set name='${data.name}', email='${data.email}', 
    pwd='${data.pwd}', cpf='${data.cpf}', phone='${data.phone}',  
    street='${data.street}', _number='${data._number}' 
    where id = ${data.id}`;
    const connect = require('./../../config/connect');
    connect.query(query, callback);
  },

  this.delete = (id, callback) => {
    let query = `delete from user where id = ${id}`;
    const connect = require('./../../config/connect');
    connect.query(query, callback);
  }
}


function UserFactory() {
  this.createUser = function(type, data=null) {
    let user;

    if(type === 0) { // Client
      user = new User(data);
    } else if(type === 1) { // Admin. Business owner
      user = new Admin();
      if(data) user.save(data); // creatin a new bussiness owner
    } else if(type === 2) { // Deliveryman
      user = new Deliveryman(data);
    }
    // error: Admin doesn´t has getUser
    user.getUser = function(id, callback) {
      const connect = require('./../../config/connect')
      let query = `select * from user
      where id = ${id}`
      connect.query(query, callback);
    }

    user.updateProfile = function(data, callback) {
       
      let id = data.id; data.name = data.name.trim();

      if(data.birthday) { // admin hasn't birthday
        if (data.birthday.length > 0) { // birthday was sended
          let arrBirthday = data.birthday.split('/');
          data.birthday = arrBirthday[2] + '-' + arrBirthday[1] + '-' + arrBirthday[0];
        }        
      }

      let keys = Object.keys(data);
      let sqlKeys = (() => {
        let temp = ['name', 'email', 'pwd'];
        if (keys.includes('cpf')) {
          temp.push('cpf');
        }
        if (keys.includes('birthday') && data.birthday.length > 0) {
          temp.push('birthday');
        }
        if (keys.includes('phone')) {
          temp.push('phone');
        } 
        if (keys.includes('type')) {
          temp.push('type');
        }
        if (keys.includes('imageName') && data.imageName !== null) {
          temp.push('imageName');
        }
        if (keys.includes('street')) {
          temp.push('street');
        }
        if (keys.includes('_number')) {
          temp.push('_number');
        }
        if (keys.includes('neighborhood')) {
          temp.push('neighborhood');
        }
        if (keys.includes('complement')) {
          temp.push('complement')
        }
        return temp;
      })();
      
      let sql = 'update user ';
      for (let i = 0; i < sqlKeys.length; i++) {
        if (i === 0) sql += 'set ';
        else if (i !== 0 && i < sqlKeys.length) sql += ', ';

        let arrStringData = ['name', 'cpf', 'birthday', 'email', 
        'phone', 'pwd', 'imageName', 'imageLogo', 'street', 'complement'];
        if (arrStringData.includes(sqlKeys[i])) {
          sql += `${sqlKeys[i]} = '${data[sqlKeys[i]]}'`;
        } else {
          sql += `${sqlKeys[i]} = ${data[sqlKeys[i]]}`;
        }          

        if (i === sqlKeys.length - 1) sql += ' where id = ' + id;
      }

      const connect = require('./../../config/connect');
      connect.query(sql, callback);

    }

    user.getById = (id, callback) => {
      let query = 'select * from user where id = ' + id;
      const connect = require('./../../config/connect');
      connect.query(query, callback);
    }

    return user;
  }
}

module.exports = UserFactory;