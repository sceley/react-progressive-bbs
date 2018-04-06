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
            tab varchar(10),
			author varchar(10),
			title varchar(50),
			body longtext,
			createAt datetime,
			comment_count int unsigned,
			collect_count int unsigned,
			visit_count int unsigned,
			primary key(id))
            charset=utf8`;
let table3 = `
			create table if not exists Comment(
			id int unsigned auto_increment,
			tid int unsigned,
            author varchar(10),
            likeCount int unsigned default 0,
			mentioner varchar(10),
			body longtext,
			createAt datetime,
            primary key(id),
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