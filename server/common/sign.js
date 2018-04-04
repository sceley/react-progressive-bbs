const jwt = require('jsonwebtoken');
const config = require('../config');
exports.sign = async (id) => {
    let options = {
        uid: id
    };
    if (config.jsonwebtoken.exp) {
        options.exp = exp;
    }
    let token = await new Promise((resolve, reject) => {
        jwt.sign(options, config.jsonwebtoken.secret, function (err, token) {
            if (err) {
                reject(err);
            } else {
                resolve(token);
            }
        });
    });
    return token;
};