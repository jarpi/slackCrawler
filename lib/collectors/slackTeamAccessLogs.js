var WebClient = require('@slack/client').WebClient;

const collectData = (token) => {
    return new Promise((resolve, reject) => {
        var web = new WebClient(token);
        return web.team.accessLogs((err, res) => {
            if (err) return reject(err)
            resolve(res);
        });
    })
}

module.exports = collectData

