//package
const Router = require('express').Router;
const bodyparser = require('body-parser');
const multer = require('multer');

const router = Router();
const login = require('./controller/user').login;
const logup = require('./controller/user').logup;
const userInfo = require('./controller/user').userInfo;
const getCaptcha = require('./controller/captcha').getCaptcha;
const checkUsername = require('./controller/checkout').checkUsername;
const checkCaptcha = require('./controller/checkout').checkCaptcha;
const checkEmail = require('./controller/checkout').checkEmail;
const createTopic = require('./controller/topic').createTopic;
const getTopics = require('./controller/topic').getTopics;
const getTopic = require('./controller/topic').getTopic;
const comment = require('./controller/topic').comment;


const auth_user_login = require('./middleware/oauth').auth_user_login;
//api

//get
router.get('/api/topics', getTopics);
router.get('/api/topic/:id', getTopic);
router.get('/api/user/info', auth_user_login, userInfo);

//middleware
router.use(bodyparser.json());

//post
router.post('/api/login', login);
router.post('/api/logup', logup);
router.post('/api/getcaptcha', getCaptcha);
router.post('/api/checkusername', checkUsername);
router.post('/api/checkcaptcha', checkCaptcha);
router.post('/api/checkemail', checkEmail);
router.post('/api/topic/create', auth_user_login, createTopic);
router.post('/api/topic/:id/comment', auth_user_login, comment);

module.exports = router;