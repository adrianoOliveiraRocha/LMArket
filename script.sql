

-- DELIMITER //
-- DROP PROCEDURE IF EXISTS delete_category_if_empty //
-- CREATE PROCEDURE delete_category_if_empty(IN categoryId INT)
-- BEGIN
--     DECLARE total_products INT;
    
--     SELECT COUNT(*) INTO total_products FROM product WHERE category = categoryId;
    
--     IF total_products = 0 THEN
--         DELETE FROM category WHERE id = categoryId;
--         SELECT 'Categoria deletada' AS result;
--     ELSE
--         SELECT 'Você precisa deletar todos os produtos dessa categoria antes de deletá-la' AS result;
--     END IF;
-- END //
-- DELIMITER ;

-- ALTER TABLE _order
-- ADD changeForHowMuch decimal(5,2)
-- default 0.0
-- after money;

ALTER TABLE _order DROP COLUMN money;

ALTER TABLE _order ADD COLUMN paymentMethod varchar(150) not null;
