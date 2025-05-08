const Category = {
  connect: require('./../../config/connect'),

  new(name, userId, callback) {
    let query = `insert into category (name, user) 
    values ('${name}', ${userId})`;
    console.log(query);
    this.connect.query(query, callback)
  },

  getAll(userId, callback) {
    let query = `select * from category where user = ${userId}`;
    this.connect.query(query, callback)
  },

  getById(categoryId, userId, callback) {
    let query = `select * from category where id = ${categoryId} and user = ${userId}`;
    this.connect.query(query, callback)
  },

  update(data, callback) {
    let query = `update category set name = '${data.name}' where id = ${data.id}`
    this.connect.query(query, callback)
  },

  delete(categoryId, callback) {
    /*
    DELIMITER //
    CREATE PROCEDURE delete_category_if_empty(IN categoryId INT)
    BEGIN
        DECLARE total_products INT;
        
        SELECT COUNT(*) INTO total_products FROM product WHERE category = categoryId;
        
        IF total_products = 0 THEN
            DELETE FROM category WHERE id = categoryId;
            SELECT 'Categoria deletada' AS result;
        ELSE
            SELECT 'Categoria não está vazia' AS result;
        END IF;
    END //
    DELIMITER ;

    -- Chamando o procedimento para a categoria 19
    CALL delete_category_if_empty(19);
    */
    let query = `select count(*) as n from product where category = ${categoryId};`
    this.connect.query(query, callback);
  }
  
}

module.exports = Category