-- https://lefred.be/content/mysql-8-0-and-wrong-dates/
-- set @@SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

mysqldump -u adriano -p453231 lMarket > lMarket.sql
-- Restoring from a Dump
mysql -u adriano -p453231 lMarket < mydatabase_backup.sql

ALTER TABLE banner
ADD COLUMN `user` INT DEFAULT NULL,
ADD CONSTRAINT b_user 
FOREIGN KEY (`user`) 
REFERENCES user(`id`)  
ON DELETE SET NULL
ON UPDATE CASCADE;
-- next => delete employee; delete message