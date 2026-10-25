# Travlr Getaways (CS 465)

Full stack MEAN application for Travlr Getaways. Module 6 adds the Angular admin SPA. Module 7 adds admin login with JSON Web Tokens.

## Structure

- `app.js`: Express server (port 3000) for the public site and the REST API
- `app_server`: public website (Handlebars views)
- `app_api`: REST API, Mongoose model, seed script
- `app_admin`: Angular admin SPA (port 4200)

## REST API

| Method | Endpoint | Action | Token required |
|---|---|---|---|
| POST | `/api/register` | Create an admin user, returns a JWT | No |
| POST | `/api/login` | Log in, returns a JWT | No |
| GET | `/api/trips` | List all trips | No |
| GET | `/api/trips/:tripCode` | Get one trip | No |
| POST | `/api/trips` | Add a trip | Yes |
| PUT | `/api/trips/:tripCode` | Update a trip | Yes |
| DELETE | `/api/trips/:tripCode` | Delete a trip | Yes |

Send the token as `Authorization: Bearer <token>`. Tokens expire after one hour.

## Security

- `app_api/models/user.js`: user schema. Passwords are stored as a salted PBKDF2 (SHA-512) hash, never in plain text. `generateJWT()` signs a token with `JWT_SECRET`.
- `app_api/config/passport.js`: Passport local strategy that checks email and password.
- `app_api/controllers/authentication.js`: register and login.
- `app_api/routes/index.js`: `authenticateJWT` (express-jwt) protects POST, PUT and DELETE and puts the verified token claims on `req.payload`. A missing, forged or expired token returns 401.
- Angular admin (`app_admin`):
  - `services/authentication.ts` stores the token in localStorage and checks its expiry
  - `login/` is the HTML login form
  - `navbar/` shows Log in or the admin name and Log out
  - `utils/jwt-interceptor.ts` adds the Bearer token to API calls
  - `utils/auth-guard.ts` blocks the add and edit pages until the admin logs in
  - `services/history.ts` records visited pages (NavigationEnd events) so login returns the admin to the last page that is not `/login` or `/register`
  - Add Trip, Edit Trip and Delete Trip buttons only appear after login

## Run

Start MongoDB on `127.0.0.1:27017`. Create a `.env` file in the project root (copy `.env.example`) with a long random `JWT_SECRET`, then:

```
npm install
node app_api/models/seed.js   # loads sample trips and the admin user
npm start                     # http://localhost:3000
```

In a second terminal:

```
cd app_admin
npm install
npm start                     # http://localhost:4200
```

The seed script creates this admin login:

- Email: `admin@travlr.com`
- Password: `Travlr2026!`

You can also create another admin with Postman (request 1 in the collection below) or:

```
curl -X POST http://localhost:3000/api/register -H "Content-Type: application/json" -d "{\"name\":\"Admin\",\"email\":\"admin@travlr.com\",\"password\":\"Secret123\"}"
```

Then log in at http://localhost:4200/login.

## Tests

Back end (no database needed, uses mock data):

```
npm test
```

Covers register, login with right and wrong credentials, and checks that POST, PUT and DELETE reject requests with no token, a forged token and an expired token, and succeed with a valid token.

Front end:

```
cd app_admin
npm test -- --watch=false
```

Uses the mock trips in `app_admin/src/app/data/trips.ts` and fake tokens. Covers the authentication service, login form, navbar, interceptor, route guard, navigation history, and that Add, Edit and Delete only show when logged in.

Postman: import `postman/travlr-api.postman_collection.json` and run it in order. It registers, logs in, saves the token, and tests each admin endpoint with and without the token.
