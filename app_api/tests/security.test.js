// Security tests for the Travlr API.
// Mongoose calls are replaced with in-memory mock data, so no database is needed.
// Run with: npm test
const { test, before, after } = require('node:test');
const assert = require('node:assert');
const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

process.env.JWT_SECRET = 'test-secret';

const User = require('../models/user');
const Trip = require('../models/travlr');
require('../config/passport');

// ---- mock data ----
const users = [];
const trips = [{ code: 'GALR210214', name: 'Gale Reef' }];

User.findOne = (filter) => ({ exec: async () => users.find((u) => u.email === filter.email) || null });
User.prototype.save = async function () { users.push(this); return this; };
Trip.find = () => ({ exec: async () => trips });
Trip.prototype.save = async function () { trips.push(this.toObject()); return this; };
Trip.findOneAndUpdate = (f, body) => ({ exec: async () => (trips.find((t) => t.code === f.code) ? { ...body } : null) });
Trip.findOneAndDelete = (f) => ({
  exec: async () => {
    const i = trips.findIndex((t) => t.code === f.code);
    return i === -1 ? null : trips.splice(i, 1)[0];
  }
});

// ---- test server ----
let server;
let base;
const newTrip = {
  code: 'NEWT270101', name: 'New Trip', length: '3 nights', start: '2027-01-01',
  resort: 'Test Resort', perPerson: '500.00', image: 'reef1.jpg', description: 'Test'
};

before(async () => {
  const app = express();
  app.use(express.json());
  app.use(passport.initialize());
  app.use('/api', require('../routes/index'));
  await new Promise((r) => { server = app.listen(0, r); });
  base = `http://localhost:${server.address().port}/api`;
});
after(() => server.close());

const call = (method, path, body, token) =>
  fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

let token;

// ---- register and login ----
test('register rejects missing fields', async () => {
  const r = await call('POST', '/register', { email: 'admin@travlr.com' });
  assert.strictEqual(r.status, 400);
});

test('register creates a user with a hashed password and returns a token', async () => {
  const r = await call('POST', '/register', { name: 'Admin', email: 'admin@travlr.com', password: 'Secret123' });
  assert.strictEqual(r.status, 200);
  const body = await r.json();
  assert.ok(body.token);
  assert.notStrictEqual(users[0].hash, 'Secret123');
  assert.ok(users[0].salt);
});

test('login rejects a wrong password', async () => {
  const r = await call('POST', '/login', { email: 'admin@travlr.com', password: 'wrong' });
  assert.strictEqual(r.status, 401);
});

test('login rejects an unknown email', async () => {
  const r = await call('POST', '/login', { email: 'nobody@travlr.com', password: 'Secret123' });
  assert.strictEqual(r.status, 401);
});

test('login rejects missing fields', async () => {
  const r = await call('POST', '/login', { email: 'admin@travlr.com' });
  assert.strictEqual(r.status, 400);
});

test('login with correct credentials returns a valid token', async () => {
  const r = await call('POST', '/login', { email: 'admin@travlr.com', password: 'Secret123' });
  assert.strictEqual(r.status, 200);
  token = (await r.json()).token;
  const payload = jwt.verify(token, process.env.JWT_SECRET);
  assert.strictEqual(payload.email, 'admin@travlr.com');
  assert.ok(payload.exp > Date.now() / 1000);
});

// ---- public endpoints stay open ----
test('GET /trips works without a token', async () => {
  const r = await call('GET', '/trips');
  assert.strictEqual(r.status, 200);
});

// ---- admin endpoints are blocked without a valid token ----
for (const [method, path, body] of [
  ['POST', '/trips', newTrip],
  ['PUT', '/trips/GALR210214', newTrip],
  ['DELETE', '/trips/GALR210214']
]) {
  test(`${method} ${path} is rejected without a token`, async () => {
    assert.strictEqual((await call(method, path, body)).status, 401);
  });

  test(`${method} ${path} is rejected with a forged token`, async () => {
    const forged = jwt.sign({ email: 'hacker@x.com' }, 'wrong-secret');
    assert.strictEqual((await call(method, path, body, forged)).status, 401);
  });

  test(`${method} ${path} is rejected with an expired token`, async () => {
    const expired = jwt.sign({ email: 'admin@travlr.com' }, process.env.JWT_SECRET, { expiresIn: -10 });
    assert.strictEqual((await call(method, path, body, expired)).status, 401);
  });
}

// ---- admin endpoints work with a valid token ----
test('POST /trips adds a trip with a valid token', async () => {
  const r = await call('POST', '/trips', newTrip, token);
  assert.strictEqual(r.status, 201);
  assert.ok(trips.some((t) => t.code === 'NEWT270101'));
});

test('PUT /trips/:code updates a trip with a valid token', async () => {
  const r = await call('PUT', '/trips/GALR210214', { ...newTrip, code: 'GALR210214', perPerson: '899.00' }, token);
  assert.strictEqual(r.status, 200);
});

test('DELETE /trips/:code deletes a trip with a valid token', async () => {
  const r = await call('DELETE', '/trips/GALR210214', null, token);
  assert.strictEqual(r.status, 200);
  assert.ok(!trips.some((t) => t.code === 'GALR210214'));
});
