const mysql = require('mysql');
const config = require('../config');
const db = mysql.createConnection(config.db);
db.connect();
let table1 = `
			create table if not exists User(
			id int unsigned auto_increment, 
			githubId int unsigned,
			username varchar(20),
			password varchar(100),
			email varchar(50),
			avatar varchar(100),
			sex boolean default 1,
			website varchar(50),
			location varchar(20),
			introduction varchar(50) default '这家伙很懒，什么个性签名都没有留下',
			github varchar(20),
			createAt datetime,
			updateAt datetime,
			primary key(id))
            charset=utf8`;
let table2 = `
			create table if not exists Topic(
            id int unsigned auto_increment,
			author_id int unsigned,
            tab varchar(10),
			title varchar(50),
			body longtext,
			createAt datetime,
			comments_count int unsigned default 0,
			collects_count int unsigned default 0,
			visit_count int unsigned default 0,
			foreign key(author_id) references User(id),
			primary key(id))
            charset=utf8`;
let table3 = `
			create table if not exists Comment(
			id int unsigned auto_increment,
			tid int unsigned,
            author_id int unsigned,
			body longtext,
			createAt datetime,
			primary key(id),
			foreign key(author_id) references User(id),
            foreign key(tid) references Topic(id))
			charset=utf8`;
let table4 = `
			create table if not exists Collect(
            id int unsigned auto_increment,
			uid int unsigned,
			tid int unsigned,
            createAt datetime,
            primary key(id),
			foreign key(uid) references User(id),
			foreign key(tid) references Topic(id))
            charset=utf8`;
// let table5 = `
//             create table if not exists CLike(
//             id int unsigned auto_increment,
//             uid int unsigned,
//             tid int unsigned,
//             cid int unsigned,
//             primary key(id),
//             foreign key(uid) references User(id),
//             foreign key(tid) references Topic(id),
//             foreign key(cid) references Comment(id))
//             charset=utf8`;
db.query(table1);
db.query(table2);
db.query(table3);
db.query(table4);
// db.query(table5);

module.exports = db;