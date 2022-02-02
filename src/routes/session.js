module.exports = function (app) {
    app.post('/login', (req, res) => {
        const username = req.body.username;
        req.session.user = username;
        res.redirect('/');
    });
    
    app.post('/logout', (req, res) => {
        const username = req.session.user;
        req.session.destroy(err => {
            if (err) {
                res.send({status: 'Logout Error', body: err});
            } else {
                res.render('logout.pug', {username: username});
            }
        })
    });
};
