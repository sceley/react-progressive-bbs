const log4js = require('log4js');
const config = require('../config');
const options = {
    appenders: {
        access: {
            type: "dateFile",
            filename: `${config.log.dirpath}/http.log`,
            pattern: "-yyyy-MM-dd",
        },
        app: {
            type: "file",
            filename: `${config.log.dirpath}/app.log`,
        }
    },
    categories: {
        default: { appenders: ["app"], level: "DEBUG" },
        http: { appenders: ['access'], level: "DEBUG" }
    }
};
log4js.configure(options);
module.exports = log4js;