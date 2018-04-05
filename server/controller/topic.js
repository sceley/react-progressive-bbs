const moment = require('moment');
const db = require('../model/db');
const logger = require('../common/log').getLogger("app");
exports.createTopic = async (req, res) => {
    try {
        let body = req.body;
        let createAt = moment().format("YYYY-MM-DD HH:MM");
        let uid = req.session.uid;
        if (!(body instanceof Object)) {
            return res.json({
                err: 1,
                msg: '不是json数据格式'
            });
        }
        let author = await new Promise((resolve, reject) => {
            let sql = 'select username from User where id=?';
            db.query(sql, [uid], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].username);
                }
            })
        });
        await new Promise((resolve, reject) => {
            let sql = "insert into Topic(tab, title, body, author, createAt) values(?, ?, ?, ?, ?)";
            db.query(sql, [body.tab, body.title, body.body, author, createAt], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '发表成功'
        });
    } catch (e) {
        logger.error(`createTopic_handle->${e}`);
        res.json({
            err: 0,
            msg: '服务器出错了'
        });
    }
};

exports.getTopics = async (req, res) => {
    try {
        let tab = req.query.tab;
        let page = req.query.page;
        if (!page)
            page = 1;
        if (!tab)
            tab = '%';
        let topics = await new Promise((resolve, reject) => {
            let sql = `select title, tab, body, avatar, author, 
                    Topic.id, User.id as uid, Topic.CreateAt from Topic
                    left join User on Topic.author=User.username 
                    where tab like ?
                    order by Topic.createAt desc limit ?, ?`;
            db.query(sql, [tab, 10 * (page - 1), 10], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics);
                }
            });
        });
        res.json({
            err: 0,
            topics
        });
    } catch (e) {
        logger.error(`getTopics_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.notRepTopics = async (req, res) => {
    try {
        let topics = await new Promise((resolve, reject) => {
            let sql = `select id, title from Topic order by createAt desc limit ?`;
            db.query(sql, [5], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics);
                }
            });
        });
        res.json({
            err: 0,
            topics
        });
    } catch (e) {
        logger.error(`notRepTopics_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.getTopic = async (req, res) => {
    try {
        let id = req.params.id;
        let uid;
        if (req.session)
            uid = req.session.uid;
        else
            uid = '';
        let topic = await new Promise((resolve, reject) => {
            let sql =  `select Topic.id, tab, author, title, body, Topic.createAt, User.id as uid 
            from Topic left join User on User.username=Topic.author where Topic.id=?`;
            db.query(sql, [id], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics[0]);
                }
            });
        });
        let collected = await new Promise((resolve, reject) => {
            let sql = 'select id from Collect where uid=? and tid=?';
            db.query(sql, [uid, id], (err, collects) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(collects.length);
                }
            });
        });
        let comments = await new Promise((resolve, reject) => {
            let sql = `select likeCount, avatar, body, author, mentioner,
                        Comment.createAt, Comment.id, CLike.id as lid from Comment 
                        left join CLike 
						on CLike.cid=Comment.id and CLike.tid=Comment.tid and CLike.uid=?
                        left join User 
                        on Comment.author=User.username
						where Comment.tid=?`;
            db.query(sql, [uid, id], (err, comments) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(comments);
                }
            });
        });
        res.json({
            err: 0,
            topic,
            comments,
            collected
        });
    } catch (e) {
        logger.error(`getTopic_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.comment = async (req, res) => {
    try {
        let id = req.params.id;
        let body = req.body;
        let uid = req.session.uid;
        let createAt = moment().format("YYYY-MM-DD HH:MM");
        let author = await new Promise((resolve, reject) => {
            let sql = 'select Username from User where id=?';
            db.query(sql, [uid], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].Username);
                }
            })
        });
        await new Promise((resolve, reject) => {
            let sql = "insert into Comment(author, body, tid, createAt) values(?, ?, ?, ?)";
            db.query(sql, [author, body.body, id, createAt], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '评论成功'
        });
    } catch (e) {
        logger.error(`comment_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.collect = async (req, res) => {
    try {
        let id = req.params.id;
        let uid = req.session.uid;
        let collected = await new Promise((resolve, reject) => {
            let sql = "select id from Collect where uid=? and tid=?";
            db.query(sql, [uid, id], (err, collects) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(collects.length);
                }
            });
        });
        if (collected) {
            await new Promise((resolve, reject) => {
                let sql = "delete from Collect where uid=? and tid=?";
                db.query(sql, [uid, id], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            res.json({
                err: 0,
                msg: '取消收藏'
            });
        } else {
            await new Promise((resolve, reject) => {
                let createAt = moment().format("YYYY-MM-DD HH:MM");
                let sql = "insert into Collect(uid, tid, createAt) values(?, ?, ?)";
                db.query(sql, [uid, id, createAt], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            res.json({
                err: 0,
                msg: '收藏'
            });
        }
    } catch (e) {
        logger.error(`collect_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
}