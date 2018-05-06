const db = require('../model/db');
const logger = require('../common/log').getLogger("app");
exports.searchUserOrTopic = async (req, res) => {
    try {
        const search = req.query.content;
        if (!search) {
            return res.json({
                err: 1,
                msg: '搜索内容不能为空'
            });
        }
        const user = await new Promise((resolve, reject) => {
            const sql = 'select id from User where username like ?';
            db.query(sql, [`%${search}%`], (err, users) => {
                if (err)
                    reject(err);
                else
                    resolve(users[0]);
            });
        });
        if (user) {
            return res.json({
                err: 0,
                field: 'user',
                result: user
            });
        }
        const topic = await new Promise((resolve, reject) => {
            const sql = 'select id from Topic where title like ? or body like ?';
            db.query(sql, [`%${search}%`, `%${search}%`], (err, topics) => {
                if (err)
                    reject(err);
                else
                    resolve(topics[0]);
            });
        });
        if (topic) {
            return res.json({
                err: 0,
                field: 'topic',
                result: topic
            });
        }
        res.json({
            err: 0,
            msg: '没有搜索到东西'
        });
    } catch (e) {
        logger(`searchUserOrTopic_handle:${e}`);
        res.json({
            err: 1,
            msg: '服务器出错了'
        });
    }
};