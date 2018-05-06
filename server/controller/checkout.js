const db = require('../model/db');
const redis = require('../model/redis');
const logger = require('../common/log').getLogger('app');
exports.checkUsername = async (req, res) => {
    try {
        const body = req.body;
        if (!body.username) {
            return res.json({
                err: 1,
                msg: '用户名不能为空'
            });
        }
        const count = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from User where username=?';
            db.query(sql, [body.username], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].count);
                }
            });
        });
        if (count > 0) {
            res.json({
                err: 1,
                msg: '用户名已经被使用'
            });
        } else {
            res.json({
                err: 0,
                msg: '用户名没被使用'
            });
        }
    } catch (e) {
        logger.error(`checkUsername_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.checkCaptcha = async (req, res) => {
    try {
        const body = req.body;
        if (!body.email) {
            return res.json({
                err: 1,
                msg: '邮箱不能为空'
            });
        }
        if (!body.captcha) {
            return res.json({
                err: 1,
                msg: '验证码不能为空'
            });
        }
        const captcha = await new Promise((resolve, reject) => {
            redis.get(body.email, (err, captcha) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(captcha);
                }
            });
        });
        if (body.captcha === captcha) {
            res.json({
                err: 0,
                msg: '验证码正确'
            });
        } else {
            res.json({
                err: 1,
                msg: '验证码不正确'
            });
        }
    } catch (e) {
        logger.error(`checkCaptcha_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};
exports.checkCaptchaFromUsername = async (req, res) => {
    try {
        const body = req.body;
        if (!body.username) {
            return res.json({
                err: 1,
                msg: '用户名不能为空'
            });
        }
        if (!body.captcha) {
            return res.json({
                err: 1,
                msg: '验证码不能为空'
            });
        }
        const captcha = await new Promise((resolve, reject) => {
            redis.get(body.username, (err, captcha) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(captcha);
                }
            });
        });
        if (body.captcha === captcha) {
            res.json({
                err: 0,
                msg: '验证码正确'
            });
        } else {
            res.json({
                err: 1,
                msg: '验证码不正确'
            });
        }
    } catch (e) {
        logger.error(`checkCaptcha_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};

exports.checkEmail = async (req, res) => {
    try {
        const body = req.body;
        if (!body.email) {
            return res.json({
                err: 1,
                msg: '邮箱不能为空'
            });
        }
        const count = await new Promise((resolve, reject) => {
            const sql = 'select count(*) as count from User where email=?';
            db.query(sql, [body.email], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].count);
                }
            });
        });
        if (count > 0) {
            res.json({
                err: 1,
                msg: 'Email已经被注册'
            });
        } else {
            res.json({
                err: 0,
                msg: 'Email还没被注册'
            });
        }
    } catch (e) {
        logger.error(`checkEmail_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器错误'
        });
    }
};