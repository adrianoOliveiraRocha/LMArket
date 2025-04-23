-- https://lefred.be/content/mysql-8-0-and-wrong-dates/
-- set @@SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

mysqldump -u adriano -p453231 lMarket > lMarket.sql
-- Restoring from a Dump
mysql -u adriano -p453231 lMarket < mydatabase_backup.sql

create table config (
    id INT NOT NULL AUTO_INCREMENT,
    user INT NOT NULL,
    logoName varchar(200) NULL,
    companyPhone varchar(200) NULL,
    fontSize tinyint(10) default 12,
    PRIMARY KEY (id),
    FOREIGN KEY (user) REFERENCES user(id)
);

insert into config (
    user, 
    logoName, 
    companyPhone, 
    fontSize) 
    values (1, 
    'logo.png', '5585999473839', 8);