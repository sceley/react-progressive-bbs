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
        if ((!body.username) || (body.username && (body.username.length > 10 || body.username.length < 2))) {
            return res.json({
                err: 1,
                msg: '用户名必须为2-10位字符'
            });
        }
        if ((!body.password) || (body.password && (body.password.length > 16 || body.password.length < 6))) {
            return res.json({
                err: 1,
                msg: '密码必须为6-16位字符'
            });
        }
        if ((!body.email) || (body.email && !pattern.test(body.email))) {
            res.json({
                err: 1,
                msg: '邮箱格式不正确'
            });
        }
        if ((!body.captcha) || (body.captcha && body.captcha.length !== 6)) {
            return res.json({
                err: 1,
                msg: '验证码必须为6位'
            });
        }
        let names_count = await new Promise((resolve, reject) => {
            let sql = 'select count(id) as count from User where username=?';
            db.query(sql, [body.username], (err, users) => {
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
            let sql = 'select count(id) as count from User where email=?';
            db.query(sql, [body.email], (err, users) => {
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
        let captcha = await new Promise((resolve, reject) => {
            redis.get(body.email, (err, captcha) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(captcha);
                }
            });
        });
        if (body.captcha !== captcha) {
            return res.json({
                err: 1,
                msg: '验证码错误'
            });
        }
        let hash = await new Promise((resolve, reject) => {
            bcrypt.hash(body.password, saltRounds, function (err, hash) {
                if (err) {
                    reject(err);
                } else {
                    resolve(hash);
                }
            });
        });
        body.password = hash;
        await new Promise((resolve, reject) => {
            let sql = 'insert into User (username, password, email) values (?, ?, ?)';
            db.query(sql, [body.username, body.password, body.email], (err) => {
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
        if (!body.account) {
            return res.json({
                err: 1,
                msg: '帐号不能为空'
            });
        }
        if ((!body.password) || (body.password && (body.password.length > 16 || body.password.length < 6))) {
            return res.json({
                err: 1,
                msg: '密码长度必须为6-16个字符'
            });
        }
        let user = await new Promise((resolve, reject) => {
            let sql = 'select password, id from User where username=? or email=?';
            db.query(sql, [body.account, body.account], (err, users) => {
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
            bcrypt.compare(body.password, user.password, function (err, corrected) {
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