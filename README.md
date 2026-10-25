# Travlr Getaways: CS 465 full stack web application

Tanvir Mahmod Bhuiyan
CS 465 Full Stack Development I, Southern New Hampshire University

## About the project

Travlr Getaways is a MEAN stack (MongoDB, Express, Angular, Node.js) application with two sides that share one database:

- **Customer site.** A server-rendered Express website using Handlebars templates (`app_server`). Customers browse trips on pages such as `/travel`.
- **REST API.** Express routes under `/api` (`app_api`) return trip data as JSON. Both front ends use it.
- **Admin SPA.** An Angular single-page application (`app_admin`) where staff log in and add, edit, and delete trips.

### Folder structure

```
travlr/
├── app.js        Express server (port 3000) for the public site and the API
├── app_server/   Customer site: routes, controllers, Handlebars views and partials
├── app_api/      REST API: routes, controllers, Mongoose models, Passport config, tests
├── app_admin/    Angular admin SPA (port 4200)
├── data/         trips.json seed data
├── postman/      Postman collection for the API
└── public/       Static CSS and images
```

### API endpoints

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

### Security features

- `app_api/models/user.js`: passwords are stored as a salted PBKDF2 (SHA-512) hash, never in plain text. `generateJWT()` signs a token with `JWT_SECRET`.
- `app_api/config/passport.js`: Passport local strategy that checks email and password.
- `app_api/controllers/authentication.js`: register and login.
- `app_api/routes/index.js`: `authenticateJWT` (express-jwt) protects POST, PUT, and DELETE. A missing, forged, or expired token returns 401.
- Angular admin:
  - `services/authentication.ts` stores the token in localStorage and checks its expiry.
  - `login/` is the login form. `navbar/` shows Log in, or the admin name and Log out.
  - `utils/jwt-interceptor.ts` adds the Bearer token to API calls.
  - `utils/auth-guard.ts` blocks the add and edit pages until the admin logs in.
  - `services/history.ts` returns the admin to the last page they visited after login.
  - Add, Edit, and Delete buttons only appear after login.

### Running locally

Start MongoDB on `127.0.0.1:27017`. Copy `.env.example` to `.env` in the project root and set a long random `JWT_SECRET`. Then:

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

The seed script creates an admin login: `admin@travlr.com` / `Travlr2026!`. Log in at http://localhost:4200/login.

### Tests

- Back end: `npm test` runs 19 security tests with mock data, so no database is needed.
- Front end: `cd app_admin` then `npm test -- --watch=false`.
- Postman: import `postman/travlr-api.postman_collection.json` and run it in order.

## Module Eight journal

### Architecture

**Frontend types.** I built three kinds of frontend in this project. The first was static HTML pages from the original template. Every trip was typed into the markup by hand, so changing one trip meant editing the page itself. The second was Express with Handlebars. The server reads trip data, fills a template with a `{{#each trips}}` loop, and sends finished HTML to the browser. Shared pieces like the header and footer became partials, so they are written once. Each click still loads a new page from the server. The third was the Angular SPA. The browser loads the application once, and after that JavaScript in the browser requests JSON from the API and redraws only the part of the page that changed. Handlebars fits the customer side because pages load fast, need little client-side JavaScript, and are easy for search engines to read. The SPA fits the admin side because staff move between the trip list, the add form, and the edit form many times in one session, and reloading the whole page each time would be slow.

**Why MongoDB.** MongoDB stores data as JSON-like documents. A trip is already a JSON object in JavaScript, in the API response, and in the Angular `Trip` model, so storing it as a document means no translation layer between tables and objects. Mongoose gave the documents a schema with required fields and indexes on `code` and `name`, so I kept validation without the rigid structure of a relational database. The schema can also grow. If Travlr later adds cruise, hotel, or flight details to a trip, as the class diagram in my design document shows, new fields can be added without a migration. The same database also holds the `users` collection for admin accounts. MongoDB is the "M" in the MEAN stack the client required, so the whole stack runs on JavaScript.

### Functionality

**JSON compared to JavaScript.** JavaScript is a programming language. It has variables, functions, logic, and objects that live in memory while a program runs. JSON is a text format for data only. It borrows JavaScript object syntax but has no functions or comments, and keys must be in double quotes. Because it is plain text, any language can read and write it. In this project JSON is the format every layer agrees on. MongoDB stores trips as BSON documents, the Express controllers send them with `res.json()`, the Handlebars travel controller and the Angular `TripData` service both receive that JSON over HTTP, and the Angular forms send JSON back in the body of POST and PUT requests. Login works the same way: the SPA posts an email and password as JSON and gets back `{ "token": "..." }`. The frontend and backend only need to agree on the shape of the data, not on each other's code.

**Refactoring.** The project was refactored at almost every module:

- The static `travel.html` page became `travel.hbs`. One loop now renders any number of trips, and the header and footer became partials shared across pages.
- Trip data moved from hard-coded HTML to `data/trips.json`, then into MongoDB through `seed.js` and the Mongoose model. The data source changed without changing the view.
- The travel controller first read `trips.json` from disk. I changed it to call `/api/trips` with `fetch`, so the customer site and the admin SPA read from the same endpoint and cannot drift apart. The database code also moved from `app_server/models` to `app_api/models` so the API owns it.
- In Angular, the trip display moved out of the listing page into a `trip-card` component that the listing repeats for each trip. All HTTP calls went into one `TripData` service instead of being written inside each component.
- For security, one JWT interceptor attaches the token to every outgoing request, and one route guard protects the add and edit pages. Without them, each component and each request would need its own token code.

Reusable UI components save time because a component like `trip-card` or `navbar` is written and tested once and then used everywhere it is needed. A fix or style change in one file shows up across the app. Components keep each file small and focused, which makes the code easier to read and test, and they give the interface a consistent look.

### Testing

**Methods and endpoints.** HTTP methods tell the server what action to take. GET reads data, POST creates a record, PUT updates one, and DELETE removes one. Endpoints are the URLs that accept those methods, such as `/api/trips` and `/api/trips/:tripCode`. The same URL can do different things depending on the method. GET on `/api/trips` lists trips, while POST on the same URL adds one.

I tested each endpoint in Postman before connecting it to a frontend. For GET I checked for a 200 status and the full JSON array, and for `/api/trips/GALR210214` I checked that only Gale Reef came back. For POST and PUT I sent JSON bodies, checked for 201 and 200, and confirmed the change in MongoDB Compass. Then I tested the same flows through the Angular SPA and watched the requests and responses in the browser developer tools network tab.

**Security.** Security added a layer to testing. Once POST, PUT, and DELETE were protected by express-jwt, a request without a token returned 401 Unauthorized. That was correct, but every write test now needed a valid token first. My Postman collection runs in order: it registers a user, logs in, saves the token to a variable, and then calls each admin endpoint with and without the token. I also wrote 19 automated tests with Node's built-in test runner (`npm test`). They replace the Mongoose calls with mock data, so they run without a database. They check that register rejects missing fields, that the password is stored as a hash and not as plain text, that login rejects a wrong password or unknown email, and that POST, PUT, and DELETE reject a missing token, a token signed with the wrong secret, and an expired token, then succeed with a valid one. On the Angular side, the specs cover the authentication service, login form, navbar, interceptor, route guard, and that Add, Edit, and Delete only show when logged in. The JWT secret lives in `.env`, which is in `.gitignore`, so it never reaches the repository. Each security layer is another place a request can fail, so I tested one layer at a time: the endpoint alone, then the endpoint with authentication, then the full path through the SPA.

### Reflection

I am finishing my BS in Computer Science, and my work experience so far is in systems administration, where I support Linux servers and cloud monitoring. This course gave me the other side of that picture: how the applications on those servers are built and how their data moves.

Before this course I had worked with parts of web development but had never built one application through every layer. Now I have built a full stack app from static pages to a secured SPA, and I can explain each step. The skills I gained:

- Building REST APIs with Express and Node.js, including routing, controllers, and status codes.
- Modeling data in MongoDB with Mongoose schemas, seeding a database, and checking it in Compass.
- Building an Angular SPA with components, services, routing, and forms.
- Adding authentication with salted password hashing, Passport, JWTs, protected routes, a route guard, and an HTTP interceptor.
- Testing APIs in Postman and with automated tests, including authenticated requests and expected failures.
- Working in Git with a branch per module and documenting the design in a software design document with component, sequence, and class diagrams.

The security work fits where I want to go. I am aiming for roles in security and systems administration, and I now understand how authentication is enforced in an application, which tokens and secrets need protecting, and why a request gets rejected. That makes me a stronger candidate for roles between development and operations, because I can read and debug the application stack instead of treating it as a black box. This repository is evidence of that work for employers.

## AI usage acknowledgment

Generative AI (Claude, Anthropic) was used to help draft and edit this README from my own project code, course submissions, and software design document. Earlier modules also used Claude for debugging support, as noted in each module submission. All code and final content were reviewed by me.

Anthropic. (2026). *Claude* (Opus 5.5) [Large language model]. https://claude.ai
