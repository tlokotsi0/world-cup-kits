import express from 'express';
import { initDb } from './db/connect.js';
import routes from './routes/index.js';
import bodyParser from 'body-parser';
import passport from 'passport';
import session from 'express-session';
import { Strategy } from 'passport-github2';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

app
  .use(bodyParser.json())
  .use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
    }),
  )
  .use(passport.initialize())
  .use(passport.session())
  .use(cors({ methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'] }))
  .use(cors({ origin: '*' }))
  .use('/', routes);

passport.use(
  new Strategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    function (accessToken, refreshToken, profile, done) {
      return done(null, profile);
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

async function start() {
  try {
    await initDb();
    app.listen(port, () => {
      console.log(`Server connected to DB and listening on port ${port}`);
    });
  } catch (err) {
    console.error('Failed to connect to the database', err);
  }
}

start();
