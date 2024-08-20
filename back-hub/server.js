const express = require('express');
const session = require('express-session');
const passport = require('passport');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const bcrypt = require('bcryptjs');

const app = express();
const port = 9999;

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travel_hub_accounts'
});

db.connect((err) => {
    if (err) {
        console.error("No connection to database:", err);
    } else {
        console.log("Connected to database successfully");
    }
});

require('./passport')(passport, db);

app.use(express.static(path.join(__dirname, '..', 'front-hub')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
    secret: 'your secret key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 1000 * 60 * 15 }
}));
app.use(passport.initialize());
app.use(passport.session());

// the routes

app.get('/loginPage', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-hub', 'login', 'login.html'));
});

app.get('/registerPage', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-hub', 'register', 'register.html'));
});
app.get('/profile', (req, res) => {
    if (req.isAuthenticated()) {
        res.sendFile(path.join(__dirname, '..', 'front-hub', 'profile', 'profile.html'));
    } else {
        res.redirect('/loginPage');
    }
});



app.get('/profile/:id', (req, res) => {
    if (req.isAuthenticated()) {
        const userId = req.params.id;
        db.query('SELECT * FROM users WHERE id = ?', [userId], (err, results) => {
            if (err) {
                console.error("Error fetching user data:", err);
                return res.status(500).send("Internal Server Error");
            }
            if (results.length === 0) {
                return res.status(404).send("User not found");
            }
            const user = results[0];
            res.json(user); 
        });
    } else {
        res.redirect('/loginPage');
    }
});

app.post('/login', (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.redirect('/loginPage');
        }

        req.login(user, (err) => {
            if (err) {
                return next(err);
            }
            return res.redirect(`/profile/${user.id}`);
        });
    })(req, res, next);
});

app.post('/register', (req, res) => {
    const { email, password, firstName, lastName, phone, country } = req.body;

    if (!password) {
        return res.status(400).send("Password is required");
    }

    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error("Error hashing password:", err);
            return res.status(500).send("Internal Server Error");
        }

        db.query('INSERT INTO users (email, password, first_name, last_name, phone, country) VALUES (?, ?, ?, ?, ?, ?)', 
            [email, hashedPassword, firstName, lastName, phone, country], (err, results) => {
            if (err) {
                console.error("Error inserting into database:", err);
                return res.status(500).send("Internal Server Error");
            }

            // Fetch the newly created user ID
            const userId = results.insertId;
            return res.redirect(`/profile/${userId}`);
        });
    });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
