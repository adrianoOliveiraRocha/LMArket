const User = {
  connect: require("../../config/connect"),
  save(data, callback) {
    let sql = `insert into user 
    (name, email, cpf, birthday, pwd, type, phone, street, _number, neighborhood, complement)
    values('${data.name}', '${data.email}', 
    '${data.cpf}', '${data.birthday}', 
    '${data.pwd}', ${data.type}, '${data.phone}',
     '${data.street}', '${data._number}', '${data.neighborhood}', 
     '${data.complement}')`;
    this.connect.query(sql, callback);
  },

  verify(data, callback) {
    let query = `select * from user where email='${data.email}' and 
      pwd = '${data.pwd}'`;
    this.connect.query(query, callback);      
  }
}

module.exports = User;