Kindly follow the queries to set up database.
CREATE DATABASE www;
use www;
CREATE TABLE users(id int AUTO_INCREMENT, username varchar(25), fullname varchar(25), password varchar(128),PRIMARY KEY=id);
CREATE TABLE followers(user_id int,follower_id int);
CREATE TABLE blogs(id int, status varchar(1000), HEADING varchar(50), username varchar(25), FOREIGN KEY= id);
