module.exports = function (app, passport) {
    app.get(
        '/login',
        (req, res) => {
            if(req.isAuthenticated()) {
                res.redirect('/');
            } else {
                res.render('login.pug');
            }
    })

    app.get('/register', (req, res) => {
        res.render('register.pug')
    })

    app.post(
        '/register',
        passport.authenticate('signup', {failureRedirect: '/failsignup'}),
        (req, res) => {
            res.redirect('/');
        }
    )

    app.post(
        '/login', 
        passport.authenticate('login'), 
        (req, res) => {
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
