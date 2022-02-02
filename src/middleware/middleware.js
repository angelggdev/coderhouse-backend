//middleware para actualización de sesión
function updateSession(req, res, next) {
    req.session._garbage = Date();
    req.session.touch();
    next();
}

//middleware de autenticación
function auth(req, res, next) {
    if(req.session.user){
        return next()
    }
    return res.redirect('/');
}

module.exports = {
    updateSession,
    auth
}