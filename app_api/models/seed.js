require('dotenv').config();
// Bring in the DB connection and the Trip schema
const Mongoose = require('./db');
const Trip = require('./travlr');
const User = require('./user');

// Default admin account for logging in to the admin SPA.
// Override with ADMIN_EMAIL / ADMIN_PASSWORD in .env.
const adminEmail = process.env.ADMIN_EMAIL || 'admin@travlr.com';
const adminPassword = process.env.ADMIN_PASSWORD || 'Travlr2026!';

// Read seed data from json file
var fs = require('fs');
var trips = JSON.parse(fs.readFileSync('./data/trips.json','utf8'));

// delete any existing records, then insert seed data
const seedDB = async () => {
  await Trip.deleteMany({});
  await Trip.insertMany(trips);

  await User.deleteMany({});
  const admin = new User({ name: 'Travlr Admin', email: adminEmail });
  admin.setPassword(adminPassword);
  await admin.save();
  console.log(`Seeded ${trips.length} trips and admin user ${adminEmail}`);
};

// Close the MongoDB connection and exit
seedDB().then(async () => {
  await Mongoose.connection.close();
  process.exit(0);
});