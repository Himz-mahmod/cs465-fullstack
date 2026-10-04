const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

// Bring in the database (moved under app_api)
require('./app_api/models/db');

const app = express();

app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: false,
  partialsDir: path.join(__dirname, 'app_server/views/partials')
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server/views'));

app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./app_server/routes/index');
const apiRouter = require('./app_api/routes/index');

app.use('/', routes);
app.use('/api', apiRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});