const travelController = {
  index: (req, res) => {
    res.render('index');
  },
  travel: (req, res) => {
    res.render('travel');
  }
};

module.exports = travelController;