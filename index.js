const express = require('express');
const exphbs = require('express-handlebars');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
const flash = require('express-flash');

const app = express();

// Banco de dados
const conn = require('./db/conn');

// Models
const Thought = require('./models/Thoughts');
const User = require('./models/User');

// Import routes
const thoughtsRoutes = require('./routes/thoughtsRoutes');
const authRoutes = require('./routes/authRouter');

// import controllers
const ThoughtsController = require('./controllers/ThoughtsController');

// Template engine
const hbs = exphbs.create({
  partialDir: ['views/partials'],
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

// Receber resposta da body
app.use(
  express.urlencoded({
    extended: true,
  }),
);
app.use(express.json());

// Session middleware
app.use(
  session({
    name: 'session',
    secret: 'nosso-secret',
    resave: false,
    saveUninitialized: false,
    store: new FileStore({
      logFn: function () {},
      path: require('path').join(require('os').tmpdir(), 'session'),
    }),
    cookie: {
      secure: false,
      maxAge: 360000,
      expires: new Date(Date.now() + 3600000),
      httpOnly: true,
    },
  }),
);

// flash message
app.use(flash());

// public path
app.use(express.static('public'));

// set session to res
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.session = req.session;
  }

  next();
});

// Rotas
app.use('/thoughts', thoughtsRoutes);
app.use('/', authRoutes);

// Para acessarmos todos os pensamentos mesmo na rota "/"
app.get('/', ThoughtsController.showThoughts);

conn
  // .sync({ force: true })
  .sync()
  .then(
    app.listen(3000, () => {
      console.log('Servidor rodando!');
      console.log('http://localhost:3000');
    }),
  )
  .catch((err) => console.log(err));
