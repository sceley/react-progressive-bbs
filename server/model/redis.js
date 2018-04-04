const redis = require('redis');
const config = require('../config');
const client = redis.createClient(config.redis);
module.exports = client;