const config = require('../config');
const redis = require('../model/redis');
const db = require('../model/db');
const sendCaptcha = require('../common/email').sendCaptcha;
const logger = require('../common/log').getLogger('app');
exports.getCaptcha = async (req, res) => {
    try {
        let body = req.body;
        let email_count = await new Promise((resolve, reject) => {
            let sql = 'select count(id) as count from User where email=?';
            db.query(sql, body.email, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result[0].count);
            });
        });
        if (email_count > 0) {
            return res.json({
                err: 1,
                field: 'email',
                msg: '该邮箱已经被注册'
            });
        }
        let captcha = String(Math.random()).slice(-6);
        let pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if ((!body.email) || (body.email && !pattern.test(body.email))) {
            res.json({
                err: 1,
                msg: '邮箱格式不正确'
            });
        }
        await sendCaptcha(body.email, captcha);
        await new Promise((resolve, reject) => {
            redis.set(body.email, captcha, 'EX', 60 * 10, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0
        });
    } catch (e) {
        logger.error(`getCaptcha_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器错误'
        });
    }
};
exports.getCaptchaFromUsername = async (req, res) => {
    try {
        let body = req.body;
        let captcha = String(Math.random()).slice(-6);
        let user = await new Promise((resolve, reject) => {
            let sql = 'select email from User where username=?';
            db.query(sql, [body.username], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        if (!user) {
            return res.json({
                err: 1,
                field: 'username',
                msg: '用户名不存在'
            });
        }
        await sendCaptcha(user.email, captcha);
        await new Promise((resolve, reject) => {
            redis.set(body.username, captcha, 'EX', 60 * 10, (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
            field: 'captcha',
            msg: '验证码已经发送'
        });
    } catch (e) {
        logger.error(`getCaptchaFromUsername_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器错误'
        });
    }
};