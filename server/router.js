//package
const Router = require('express').Router;
const bodyparser = require('body-parser');
const multer = require('multer');
const passport = require('passport');

const router = Router();
const login = require('./controller/user').login;
const authGithub = require('./controller/user').authGithub;
const logup = require('./controller/user').logup;
const userInfo = require('./controller/user').userInfo;
const userInfoById = require('./controller/user').userInfoById;
const user = require('./controller/user').user;
const userInfoEdit = require('./controller/user').userInfoEdit;
const forgotPassword = require('./controller/user').forgotPassword;
const getCaptcha = require('./controller/captcha').getCaptcha;
const getCaptchaFromUsername = require('./controller/captcha').getCaptchaFromUsername;
const checkUsername = require('./controller/checkout').checkUsername;
const checkCaptcha = require('./controller/checkout').checkCaptcha;
const checkEmail = require('./controller/checkout').checkEmail;
const checkCaptchaFromUsername = require('./controller/checkout').checkCaptchaFromUsername;
const createTopic = require('./controller/topic').createTopic;
const getTopics = require('./controller/topic').getTopics;
const getTopic = require('./controller/topic').getTopic;
const deleteTopic = require('./controller/topic').deleteTopic;
const comment = require('./controller/topic').comment;
const deleteComment = require('./controller/topic').deleteComment;
const collect = require('./controller/topic').collect;
const notRepTopics = require('./controller/topic').notRepTopics;
const uploadImage = require('./controller/upload').uploadImage;
const searchUserOrTopic = require('./controller/search').searchUserOrTopic;

const auth_user_login = require('./middleware/oauth').auth_user_login;
const convert_to_user = require('./middleware/convert').convert_to_user;
const limitCreateTopic = require('./middleware/limit').limitCreateTopic;
const limitPerGetCaptcha = require('./middleware/limit').limitPerGetCaptcha;
const limitOneGetCaptcha = require('./middleware/limit').limitOneGetCaptcha;
const limitPerComment = require('./middleware/limit').limitPerComment;
//api

//github auth
router.get('/api/auth/github', passport.authenticate('github'));

router.get('/api/auth/github/callback/', passport.authenticate('github'), authGithub);


//get
router.get('/api/topics', getTopics);
router.get('/api/topic/:id', convert_to_user, getTopic);
router.get('/api/topic/:id/collect', auth_user_login, collect);
router.get('/api/topics/notreply', notRepTopics);
router.get('/api/user/info', auth_user_login, userInfo);
router.get('/api/user/:id/info', userInfoById);
router.get('/api/user/:id', user);
router.get('/api/search', searchUserOrTopic);

//delete
router.delete('/api/topic/:id', auth_user_login, deleteTopic);
router.delete('/api/topic/:tid/comment/:cid', auth_user_login, deleteComment);

//middleware
router.use(bodyparser.json());

//post
router.post('/api/login', login);
router.post('/api/logup', logup);
router.post('/api/upload/image', auth_user_login, multer().single('image'), uploadImage);
router.post('/api/user/info/edit', auth_user_login, userInfoEdit);
router.post('/api/user/forgotpassword', forgotPassword);
router.post('/api/getcaptcha', limitPerGetCaptcha, limitOneGetCaptcha, getCaptcha);
router.post('/api/getcaptcha/from/username', limitPerGetCaptcha, limitOneGetCaptcha, getCaptchaFromUsername);
router.post('/api/checkcaptcha/from/username', checkCaptchaFromUsername);
router.post('/api/checkusername', checkUsername);
router.post('/api/checkcaptcha', checkCaptcha);
router.post('/api/checkemail', checkEmail);
router.post('/api/topic/create', auth_user_login, limitCreateTopic, createTopic);
router.post('/api/topic/:id/comment', auth_user_login, limitPerComment, comment);

module.exports = router;