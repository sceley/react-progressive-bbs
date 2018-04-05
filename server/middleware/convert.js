const jwt = require('jsonwebtoken');
const config = require('../config');
const logger = require('../common/log').getLogger("app");
exports.convert_to_user = async (req, res, next) => {
    try {
        let token = req.headers['x-access-token'];
        if (token) {
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
        }
        next();
    } catch (e) {
        logger.error(`middleware_convert_handle->${e}`);
        next();
    }
};