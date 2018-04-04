const qn = require('qn');
const fs = require('fs');
const path = require('path');
const config = require('../config');

exports.cdnStore = async (buf) => {
    let client = qn.create(config.qn);
    let result = await new Promise((resolve, reject) => {
        client.upload(buf, function (err, result) {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
    return result;
};