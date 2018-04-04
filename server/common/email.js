const nodemailer = require('nodemailer');
const config = require('../config');
let transporter = nodemailer.createTransport(config.email);
const html = (body) => 
    `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        ${body}
    </body>
    </html>
    `;
exports.sendCaptcha = async (email, captcha) => {
    let mailOptions = {
        from: 'Sceley的个人论坛<sceley520@126.com>', // sender address
        to: email, // list of receivers
        subject: 'Sceley的个人论坛验证码', // Subject line
        html: html(`感谢您能踏足我的个人论坛，验证码为：<a>${captcha}</a>，I hope you have a good time，在我的论坛里畅所欲言，希望你能喜欢我的个人论坛，如果你对我这个论坛有更好的建议，欢迎致信：1538306377@qq.com，我将不胜感激。`) // html body
    };
    await new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (err, info) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};