module.exports = {
    log: {
        dirpath: './log',//日志路径
    },
    server: {
        port: 8080//服务器监听端口
    },
    db: {
        host: 'localhost',
        user: 'root',
        password: '16051223',//数据库密码
        database: 'bbs'
    },
    redis: {
        password: '16051223'//redis密码，在redis服务设置了密码后才需要
    },
    email: {//email接入信息
        host: 'smtp.126.com',
        port: 465,
        secure: true,
        auth: {
            user: "***",
            pass: "***"
        }
    },
    qn: {//七牛接入信息
        accessKey: '***',
        secretKey: '***',
        bucket: '***',
        origin: '***'
    },
    github: {//github接入信息
        clientID: '***',
        clientSecret: '***',
        callbackURL: "***"
    },
    jsonwebtoken: {
        secret: 'sceley_club'
    },
    github_client: {
        callbackURL: "http://localhost:3000/github/login/callback"
    },
    per_limit: {
        topic: 5,
        captcha: 5,
        comment: 5
    }
}