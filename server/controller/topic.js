const moment = require('moment');
const db = require('../model/db');
const redis = require('../model/redis');
const logger = require('../common/log').getLogger("app");
exports.createTopic = async (req, res) => {
    try {
        const body = req.body;
        const createAt = moment().format("YYYY-MM-DD HH:mm:ss");
        const uid = req.session.uid;
        if (!(body instanceof Object)) {
            return res.json({
                err: 1,
                msg: '不是json数据格式'
            });
        }
        await new Promise((resolve, reject) => {
            const sql = "insert into Topic(tab, title, body, author_id, createAt) values(?, ?, ?, ?, ?)";
            db.query(sql, [body.tab, body.title, body.body, uid, createAt], (err) => {
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
            let sql = `select title, tab, body, avatar, username, visit_count, comments_count,
                    collects_count, Topic.id, User.id as uid, Topic.createAt from Topic
                    left join User on Topic.author_id=User.id 
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
        let topics_count = await new Promise((resolve, reject) => {
            let sql = 'select count(id) as count from Topic';
            db.query(sql, (err, result) => {
                if (err)
                    reject(err);
                else 
                    resolve(result[0].count);
            });
        });
        res.json({
            err: 0,
            topics,
            topics_count
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
        let topics;
        topics = await new Promise((resolve, reject) => {
            redis.get('notRepTopics', (err, topics) => {
                if (err)
                    reject(err);
                else
                    resolve(topics);
            });
        });
        if (topics) {
            topics = JSON.parse(topics);
        } else {
            topics = await new Promise((resolve, reject) => {
                let sql = `select id, title from Topic where comments_count=? order by createAt desc limit ?`;
                db.query(sql, [0, 5], (err, topics) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(topics);
                    }
                });
            });
            await new Promise((resolve, reject) => {
                redis.set('notRepTopics', JSON.stringify(topics), 'EX', 60 * 1, err => {
                    if (err)
                        reject(err);
                    else
                        resolve();
                });
            });
        }
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
            let sql =  `select Topic.id, tab, User.username as author, title, body, Topic.createAt, 
                        User.id as uid, visit_count, collects_count, comments_count 
                        from Topic left join User 
                        on User.id=Topic.author_id
                        where Topic.id=?`;
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
            let sql = `select avatar, body, User.username as author, Comment.createAt, Comment.id, 
                        User.id as uid from Comment left join User 
                        on Comment.author_id=User.id
						where Comment.tid=?`;
            db.query(sql, [id], (err, comments) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(comments);
                }
            });
        });
        await new Promise((resolve, reject) => {
            let sql = `update Topic set visit_count=visit_count+1 where id=?`;
            db.query(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            topic,
            comments,
            collected,
            me_id: uid
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
        let createAt = moment().format("YYYY-MM-DD HH:mm:ss");
        await new Promise((resolve, reject) => {
            let sql = "insert into Comment(author_id, body, tid, createAt) values(?, ?, ?, ?)";
            db.query(sql, [uid, body.body, id, createAt], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            let sql = `update Topic set comments_count=comments_count+1 where id=?`;
            db.query(sql, [id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        let comment = await new Promise((resolve, reject) => {
            let sql = `select Comment.id, User.username as author, avatar, body, Comment.createAt 
            from Comment left join User on User.id=Comment.author_id
            where Comment.createAt=?`;
            db.query(sql, [createAt], (err, comments) => {
                if (err)
                    reject(err);
                else
                    resolve(comments[0]);
            }); 
        });
        res.json({
            err: 0,
            msg: '评论成功',
            comment
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
            await new Promise((resolve, reject) => {
                let sql = `update Topic set collects_count=collects_count-1 where id=?`;
                db.query(sql, [id], (err) => {
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
                let createAt = moment().format("YYYY-MM-DD HH:mm:ss");
                let sql = "insert into Collect(uid, tid, createAt) values(?, ?, ?)";
                db.query(sql, [uid, id, createAt], (err) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve();
                    }
                });
            });
            await new Promise((resolve, reject) => {
                let sql = `update Topic set collects_count=collects_count+1 where id=?`;
                db.query(sql, [id], (err) => {
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
};
exports.deleteTopic = async (req, res) => {
    try {
        let uid = req.session.uid;
        let id = req.params.id;
        let topic = await new Promise((resolve, reject) => {
            let sql = "select id from Topic where id=? and author_id=?";
            db.query(sql, [id, uid], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics[0]);
                }
            });
        });
        if (!topic) {
            return res.json({
                err: 1,
                msg: '这话题不是您的'
            });
        }
        await new Promise((resolve, reject) => {
            let sql = "delete from Collect where tid=?";
            db.query(sql, [topic.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            let sql = "delete from Comment where tid=?";
            db.query(sql, [topic.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        await new Promise((resolve, reject) => {
            let sql = "delete from Topic where id=?";
            db.query(sql, [topic.id], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '删除成功'
        });
    } catch (e) {
        logger.error(`deleteTopic_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.deleteComment = async (req, res) => {
    try {
        let uid = req.session.uid;
        let tid = req.params.tid;
        let cid = req.params.cid;
        let comment = await new Promise((resolve, reject) => {
            let sql = "select id from Comment where id=? and tid=? and author_id=?";
            db.query(sql, [cid, tid, uid], (err, comments) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(comments[0]);
                }
            });
        });
        if (!comment) {
            return res.json({
                err: 1,
                msg: '这评论不是您的'
            });
        }
        await new Promise((resolve, reject) => {
            let sql = "delete from Comment where id=? and tid=? and author_id=?";
            db.query(sql, [cid, tid, uid], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        const comments_count = await new Promise((resolve, reject) => {
            const sql = 'select comments_count from Topic where id=?';
            db.query(sql, [cid], (err, topics) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(topics[0].comments_count);
                }
            });
        });
        await new Promise((resolve, reject) => {
            let sql = `update Topic set comments_count=? where id=?`;
            db.query(sql, [comments_count, cid], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            msg: '删除成功'
        });
    } catch (e) {
        logger.error(`deleteComment_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};