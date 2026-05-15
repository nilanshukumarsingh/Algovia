const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT || 6379,
        tls: process.env.REDIS_HOST ? true : false,
    }
});

redisClient.on("error", (err) => {
    console.log("Redis Error:", err);
});
module.exports = redisClient;