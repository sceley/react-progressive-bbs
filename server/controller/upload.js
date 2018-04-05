const cdnStore = require('../common/store').cdnStore;
const logger = require('../common/log').getLogger("app");
exports.uploadImage = async (req, res) => {
    try {
        let json = await cdnStore(req.file.buffer);
        res.json({
            err: 0,
            url: json.url,
            msg: '上传成功'
        });
    } catch (e) {
        logger.error(`uploadImage_handle->${e}`);
        res.json({
            err: 1,
            msg: "服务器错误"
        });
    }
};