const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const expressSession = require('express-session');

const app = express();
const port = 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/issueTracker', { useNewUrlParser: true, useUnifiedTopology: true });

// Define User Schema
const User = mongoose.model('User', {
  username: String,
  password: String,
  role: String,
});

// Configure passport for authentication
passport.use(new LocalStrategy(
  (username, password, done) => {
    User.findOne({ username, password }, (err, user) => {
      if (err) return done(err);
      if (!user) return done(null, false, { message: 'Incorrect username or password.' });
      return done(null, user);
    });
  }
));

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Configure Express
app.use(express.urlencoded({ extended: true }));
app.use(expressSession({ secret: 'your-secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect('/login');
};

// Routes
app.get('/', (req, res) => {
  res.send('Welcome to the Issue Tracker');
});

app.get('/login', (req, res) => {
  res.send('Login Page');
});

app.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), (req, res) => {
  res.redirect('/dashboard');
});

app.get('/dashboard', isAuthenticated, (req, res) => {
  res.send(`Dashboard - Welcome ${req.user.username}`);
});

app.get('/logout', (req, res) => {
  req.logout();
  res.redirect('/');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
