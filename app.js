require('dotenv').config(); // Load JWT_SECRET from .env

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is missing. Copy .env.example to .env and set a secret.');
  process.exit(1);
}

const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const passport = require('passport');

// Bring in the database (moved under app_api)
require('./app_api/models/db');
require('./app_api/config/passport');

const app = express();

app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: false,
  partialsDir: path.join(__dirname, 'app_server/views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server/views'));

app.use(express.static(path.join(__dirname, 'public')));

// Read JSON request bodies (needed for Add and Edit trip)
app.use(express.json());
app.use(passport.initialize());

// Allow the Angular admin app (port 4200) to call the API
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:4200');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  next();
});

const routes = require('./app_server/routes/index');
const apiRouter = require('./app_api/routes/index');

app.use('/', routes);
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});