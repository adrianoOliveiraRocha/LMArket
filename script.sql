-- https://lefred.be/content/mysql-8-0-and-wrong-dates/
-- set @@SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

mysqldump -u adriano -p453231 lMarket > lMarket.sql
-- Restoring from a Dump
mysql -u adriano -p453231 lMarket < mydatabase_backup.sql

crete table order_item (
    id INT NOT NULL AUTO_INCREMENT,
    order INT NOT NULL,
    product INT NOT NULL,
    quantity INT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subTotal DECIMAL(10, 2) NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (order) REFERENCES orders(id),
    FOREIGN KEY (product) REFERENCES products(id)
);