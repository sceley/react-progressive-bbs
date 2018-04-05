const express = require('express');
const path = require('path');
const http = require('http');
const log4js = require('./common/log');
const config = require('./config');
const router = require('./router');
const app = express();
const server = http.createServer(app);
passport.serializeUser(function (profile, done) {
    done(null, profile);
});
passport.use(new GitHubStrategy(config.github, function (accessToken, refreshToken, profile, cb) {
    cb(null, profile);
}));
app.use(log4js.connectLogger(log4js.getLogger("http"), { level: 'auto' }));
app.use(passport.initialize());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Content-Length, x-access-token');
    res.header('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE');
    next();
});
app.use(router);
server.listen(config.server.port, () => {
    console.log(`server run at ://localhost:${config.server.port}`);
});