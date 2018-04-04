const jwt = require('jsonwebtoken');
const config = require('../config');
exports.auth_user_login = async (req, res, next) => {
    try {
        let token = req.headers['x-access-token'];
        let session = await new Promise((resolve, reject) => {
            jwt.verify(token, config.jsonwebtoken.secret, function (err, decoded) {
                if (err) {
                    reject(err);
                } else {
                    resolve(decoded);
                }
            });
        });
        req.session = session;
        next();
    } catch (e) {
        res.json({
            err: 1,
            msg: '请登陆'
        });
    }
};