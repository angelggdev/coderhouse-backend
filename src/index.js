const express = require('express');
const { Router } = express;
const ProductDao = require('./dao/ProductDao');
const { Server: HttpServer } = require('http');
const { Server: IOServer } = require('socket.io');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { SESSION_URL } = require('../util');
const { auth, updateSession } = require('./middleware/middleware');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const Users = require('./models/users');
const bcrypt = require('bcrypt');

//declaracion de servidores
const app = express();
const httpServer = new HttpServer(app);
const io = new IOServer(httpServer);

//declaracion de otras variables
const PORT = process.env.PORT || 8080;
const productContainer = new ProductDao();
const router = Router();

//configuración del motor de plantillas
app.set('views', 'src/views');
app.set('view engine', 'pug');

//configuración del servidor
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const server = httpServer.listen(PORT, () => {
    console.log(`El servidor está corriendo en el puerto ${PORT}`);
});
server.on('error', (error) => {
    console.log('Hubo un error en el servidor' + error);
});

//configuración de sesión
app.use(cookieParser());
app.use(
    session({
        store: new MongoStore({
            mongoUrl: SESSION_URL,
            mongoOptions: {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            },
        }),
        secret: 'qwerty123',
        resave: false,
        saveUninitialized: false,
        cookie: {
            maxAge: 600000,
            secure: false,
            httpOnly: false,
        },
    })
);

//bcrypt encriptation
function createHash(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10), null);
}
function isPasswordValid(password, encryptedPassword) {
    return bcrypt.compareSync(password, encryptedPassword);
}

//passport
passport.use(
    'login',
    new LocalStrategy((username, password, done) => {
        Users.findOne({ username }, (err, user) => {
            if (err) return done(err);

            if (!user) {
                return done(null, false);
            }

            if (user && isPasswordValid(password, user.password))
                return done(null, user);
            return done(null, false);
        });
    })
);

passport.use(
    'signup',
    new LocalStrategy(
        { passReqToCallback: true },
        (req, username, password, done) => {
            Users.findOne({ username: username }, (err, user) => {
                if (err) {
                    return done(err);
                }

                if (user) {
                    return done(null, false);
                }

                const newUser = {
                    username,
                    password: createHash(password),
                };
                Users.create(newUser, (err, userWithId) => {
                    if (err) {
                        return done(err);
                    }
                    return done(null, userWithId);
                });
            });
        }
    )
);
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser((id, done) => {
    Users.findById(id, done);
});

//passport middleware
app.use(passport.initialize());
app.use(passport.session());

//routing
app.get('/', updateSession, async (req, res) => {
    const list = await productContainer.getAll();
    const showList = list.length > 0 ? true : false;
    const isLoggedIn = req.session.user ? true : false;
    const username = req.session.user;
    res.render('index.pug', {
        list: list,
        showList: showList,
        isLoggedIn: isLoggedIn,
        username: username,
    });
});

require('./routes/session')(app, passport);

require('./routes/products-test')(app, auth, updateSession);

require('./routes/products')(router, auth, updateSession);

require('./routes/process')(app);

//api configuration
app.use('/api/productos', router);

//Web sockets
require('./web-sockets/sockets')(io, PORT);