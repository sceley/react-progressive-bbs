const redis = require('../model/redis');
const moment = require('moment');
const config = require('../config');
const logger = require('../common/log').getLogger("app");
exports.limitCreateTopic = async (req, res, next) => {
    try {
        const uid = req.session.uid;
        const key = `create_topic-${uid}`;
        let count = await new Promise((resolve, reject) => {
            redis.get(key, (err, count) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
        if (!count) {
            count = 0;
        }
        if (count >= config.per_limit.topic) {
            return res.json({
                err: 1,
                msg: '你今日发帖的次数已经用完'
            });
        }
        await new Promise((resolve, reject) => {
            count++;
            redis.set(key, count, 'EX', 60 * 60 * 24, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        next();
    } catch (e) {
        logger.error(`limitCreateTopic_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.limitPerComment = async (req, res, next) => {
    try {
        const uid = req.session.uid;
        const key = `comment-${uid}`;
        let count = await new Promise((resolve, reject) => {
            redis.get(key, (err, count) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
        if (!count) {
            count = 0;
        }
        if (count >= config.per_limit.comment) {
            return res.json({
                err: 1,
                msg: '你今日评论的次数已经用完'
            });
        }
        await new Promise((resolve, reject) => {
            count++;
            redis.set(key, count, 'EX', 60 * 60 * 24, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        next();
    } catch (e) {
        logger.error(`limitPerComment${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    } 
};
exports.limitPerGetCaptcha = async (req, res, next) => {
    try {
        const ip = req.socket.remoteAddress;
        const key = ip;
        let count = await new Promise((resolve, reject) => {
            redis.get(key, (err, count) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(count);
                }
            });
        });
        if (!count) {
            count = 0;
        }
        if (count >= config.per_limit.captcha) {
            return res.json({
                err: 1,
                msg: '你今日获取验证码的次数已经用完'
            });
        }
        await new Promise((resolve, reject) => {
            count++;
            redis.set(key, count, 'EX', 60 * 60 * 24, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        next();
    } catch (e) {
        logger.error(`limitPerGetCaptcha_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.limitOneGetCaptcha = async (req, res, next) => {
    try {
        const ip = req.socket.remoteAddress;
        const key = `${moment().format('YYYY-MM-DD HH:mm')}-${ip}`;
        const value = await new Promise((resolve, reject) => {
            redis.get(key, (err, value) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(value);
                }
            });
        });
        if (value) {
            return res.json({
                err: 1,
                msg: '你的操作太频繁'
            });
        }
        await new Promise((resolve, reject) => {
            redis.set(key, 1, 'EX', 60, err => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        next();
    } catch (e) {
        logger.error(`limitOneGetCaptcha_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};