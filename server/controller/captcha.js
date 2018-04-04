const config = require('../config');
const redis = require('../model/redis');
const sendCaptcha = require('../common/email').sendCaptcha;
const logger = require('../common/log').getLogger('app');
exports.getCaptcha = async (req, res) => {
    try {
        let body = req.body;
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