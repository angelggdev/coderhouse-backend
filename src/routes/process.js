const { fork } = require('child_process');

module.exports = function(app) {
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
            projectDir
        })
    })

    app.get('/api/randoms', (req, res) => {
        const controller = new AbortController();
        const { signal } = controller;
        const child = fork('./src/random/random.js', [req.query.params || 100000000], { signal });
        child.on('error', (err) => {
            console.log(err)
        });
        child.send('start');
        child.on('message', (data) => {
            res.send(data)
        })
    })
}