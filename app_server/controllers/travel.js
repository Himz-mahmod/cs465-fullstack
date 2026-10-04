const tripsEndpoint = 'http://localhost:3000/api/trips';
const options = {
  method: 'GET',
  headers: {
    'Accept': 'application/json'
  }
};

/* GET travel view */
const travel = async function (req, res) {
  await fetch(tripsEndpoint, options)
    .then((response) => response.json())
    .then((json) => {
      let message = null;
      if (!(json instanceof Array)) {
        message = 'API lookup error';
        json = [];
      } else if (!json.length) {
        message = 'No trips exist in our database!';
      }
      res.render('travel', { title: 'Travlr Getaways', trips: json, message });
    })
    .catch((err) => res.status(500).send(err.message));
};

module.exports = {
  travel
};