const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

app.engine('hbs', exphbs.engine({
  extname: 'hbs',
  defaultLayout: 'main'
}));
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'app_server/views'));

app.use(express.static(path.join(__dirname, 'public')));

const routes = require('./app_server/routes/index');
app.use('/', routes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log('Server running at http://localhost:' + port);
});