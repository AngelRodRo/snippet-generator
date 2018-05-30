
module.exports = (() => {
    const env = process.env.NODE_ENV;

    const config = {
        host : ""
    }

    switch (env) {
        case "development":
            config.host = "http://localhost:3000";
            break
        default:
            config.host = "http://167.99.86.216:3000";
            break
    }
    return config;
})()