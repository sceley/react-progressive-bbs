const bcrypt = require('bcrypt');
const saltRounds = 10;
const db = require('../model/db');
const redis = require('../model/redis');
const logger = require('../common/log').getLogger("app");
const sign = require('../common/sign').sign;

exports.logup = async (req, res) => {
    try {
        let body = req.body;
        if (!(body instanceof Object)) {
            return res.json({
                err: '1',
                msg: '不是json的上传数据'
            });
        }
        let pattern = /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
        if ((!body.Username) || (body.Username && (body.Username.length > 10 || body.Username.length < 2))) {
            return res.json({
                err: 1,
                msg: '用户名必须为2-10位字符'
            });
        }
        if ((!body.Password) || (body.Password && (body.Password.length > 16 || body.Password.length < 6))) {
            return res.json({
                err: 1,
                msg: '密码必须为6-16位字符'
            });
        }
        if ((!body.Email) || (body.Email && !pattern.test(body.Email))) {
            res.json({
                err: 1,
                msg: '邮箱格式不正确'
            });
        }
        if ((!body.Captcha) || (body.Captcha && body.Captcha.length !== 6)) {
            return res.json({
                err: 1,
                msg: '验证码必须为6位'
            });
        }
        let names_count = await new Promise((resolve, reject) => {
            let sql = 'select count(id) as count from User where Username=?';
            db.query(sql, [body.Username], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].count);
                }
            });
        });

        if (names_count > 0) {
            return res.json({
                err: 1,
                msg: '该用户名已经被使用'
            });
        }

        let emails_count = await new Promise((resolve, reject) => {
            let sql = 'select count(id) as count from User where Email=?';
            db.query(sql, [body.Email], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0].count);
                }
            })
        });
        if (emails_count > 0) {
            res.json({
                err: 1,
                msg: '该邮箱已经被注册'
            });
        }
        let Captcha = await new Promise((resolve, reject) => {
            redis.get(body.Email, (err, Captcha) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(Captcha);
                }
            });
        });
        if (body.Captcha !== Captcha) {
            return res.json({
                err: 1,
                msg: '验证码错误'
            });
        }
        let hash = await new Promise((resolve, reject) => {
            bcrypt.hash(body.Password, saltRounds, function (err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        body.Password = hash;
        await new Promise((resolve, reject) => {
            let sql = 'insert into User (Username, Password, Email) values (?, ?, ?)';
            db.query(sql, [body.Username, body.Password, body.Email], (err) => {
                if (err) {
                    reject(err);
                } else {
                    resolve();
                }
            });
        });
        res.json({
            err: 0,
        });
    } catch (e) {
        logger.error(`logup_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器错误'
        });
    }
};

exports.login = async (req, res) => {
    try {
        let body = req.body;
        if (!(body instanceof Object)) {
            return res.json({
                err: '1',
                msg: '不是json的上传数据'
            });
        }
        if (!body.Account) {
            return res.json({
                err: 1,
                msg: '帐号不能为空'
            });
        }
        if ((!body.Password) || (body.Password && (body.Password.length > 16 || body.Password.length < 6))) {
            return res.json({
                err: 1,
                msg: '密码长度必须为6-16个字符'
            });
        }
        let user = await new Promise((resolve, reject) => {
            let sql = 'select password, id from User where Username=? or Email=?';
            db.query(sql, [body.Account, body.Account], (err, users) => {
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
                msg: '该户名不存在'
            });
        }
        let corrected = await new Promise((resolve, reject) => {
            bcrypt.compare(body.Password, user.password, function (err, corrected) {
                if (err) {
                    reject(err);
                } else {
                    resolve(corrected);
                }
            });
        });
        if (corrected) {
            let token = await sign(user.id);
            return res.json({
                err: 0,
                token,
                msg: '登陆成功'
            });
        } else {
            return res.json({
                err: 1,
                msg: '密码错误'
            });
        }
    } catch (e) {
        logger.error(`login_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器错误'
        });
    }
};
exports.userInfo = async (req, res) => {
    try {
        let id = req.session.uid;
        let user = await new Promise((resolve, reject) => {
            let sql = 'select * from User where id=?';
            db.query(sql, [id], (err, users) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(users[0]);
                }
            });
        });
        delete user.password;
        res.json({
            err: 0,
            user
        });
    } catch (e) {
        logger.error(`userInfo_handle->${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};