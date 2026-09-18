var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json', 'utf8'));

console.log('Loaded trips:', trips);

/* GET travel view */
const travel = (req, res) => {
  console.log('Rendering travel with trips:', trips);
  res.render('travel', { title: 'Travlr Getaways', trips });
};

module.exports = {
  travel
};