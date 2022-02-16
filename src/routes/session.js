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
        passport.authenticate('signup', {failureRedirect: '/register-error'}),
        (req, res) => {
            res.redirect('/');
        }
    )

    app.get('/register-error', (req, res) => {
        res.render('register-error')
    })

    app.post(
        '/login', 
        passport.authenticate('login', {failureRedirect: '/login-error'}), 
        (req, res) => {
        const username = req.body.username;
        req.session.user = username;
        res.redirect('/');
    });

    app.get('/login-error', (req, res) => {
        res.render('login-error')
    })
    
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
