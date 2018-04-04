const db = require('../model/db');
const redis = require('../model/redis');
const logger = require('../common/log').getLogger('app');
exports.checkUsername = async (req, res) => {
    try {
        let body = req.body;
        let users = await new Promise((resolve, reject) => {
            let sql = 'select Username from User where Username=?';
            db.query(sql, [body.Username], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        });
        if (users.length > 0) {
            res.json({
                err: 1,
                msg: '该用户名已经被使用'
            });
        } else {
            res.json({
                err: 0,
                msg: '该用户名没被使用'
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
        let body = req.body;
        let Captcha = await new Promise((resolve, reject) => {
            redis.get(body.Email, (err, Captcha) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Captcha);
                }
            });
        });
        if (body.Captcha === Captcha) {
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
        let body = req.body;
        let users = await new Promise((resolve, reject) => {
            let sql = 'select * from User where Email=?';
            db.query(sql, [body.Email], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users);
                }
            });
        });
        if (users.length > 0) {
            res.json({
                err: 1,
                msg: '该Email已经被注册'
            });
        } else {
            res.json({
                err: 0,
                msg: '该Email还没被注册'
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