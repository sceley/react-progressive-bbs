const config = require('../config');
const redis = require('../model/redis');
const db = require('../model/db');
const sendCaptcha = require('../common/email').sendCaptcha;
const logger = require('../common/log').getLogger('app');
exports.getCaptcha = async (req, res) => {
    try {
        const body = req.body;
        const pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if (!(body.email && pattern.test(body.email))) {
            return res.json({
                err: 1,
                msg: '邮箱格式不正确'
            });
        }
        const count = await new Promise((resolve, reject) => {
            const sql = 'select count(id) as count from User where email=?';
            db.query(sql, body.email, (err, result) => {
                if (err)
                    reject(err);
                else
                    resolve(result[0].count);
            });
        });
        if (count > 0) {
            return res.json({
                err: 1,
                msg: '该邮箱已经被注册'
            });
        }
        const captcha = String(Math.random()).slice(-6);
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
        const body = req.body;
        if (!body.username) {
            return res.json({
                err: 1,
                msg: '用户名不能为空'
            });
        }
        const captcha = String(Math.random()).slice(-6);
        const user = await new Promise((resolve, reject) => {
            const sql = 'select email from User where username=?';
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