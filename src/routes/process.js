const { fork } = require('child_process');
const { redirect } = require('express/lib/response');

module.exports = function (app) {
    app.get('/info', (req, res) => {
        const args = process.argv;
        const os = process.platform;
        const nodeVersion = process.version;
        const rss = process.memoryUsage().rss;
        const execPath = process.execPath;
        const pid = process.pid;
        const projectDir = process.cwd();
        res.render('info', {
            args,
            os,
            nodeVersion,
            rss,
            execPath,
            pid,
            projectDir,
        });
    });

    app.get('/api/randoms', (req, res) => {
        const count = {};
        const num = req.query?.cant || 100000000;
        for (let i = 0; i < num; i++) {
            let number = Math.random();
            number = Math.ceil(number * 1000);
            count[number] = count[number] ? count[number] + 1 : 1;
        }
        res.end(JSON.stringify(count));
    });
};
