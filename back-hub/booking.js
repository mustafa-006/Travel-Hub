const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'travel_hub_booking_form'
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

app.use(express.static(path.join(__dirname, '..', 'front-hub')));

app.get('/payment', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-hub', 'payment.html'));
});

app.get("/", (req, res) => {
    res.send("running ")
});

app.post('/book', (req, res) => {
    const { bookingNumber, email, phone, message } = req.body;

    // Validate the input
    if (!bookingNumber || !email || !phone || !message) {
        return res.status(400).json({ error: 'Please fill out all fields!' });
    }
    if (!/^\d+$/.test(bookingNumber) || bookingNumber < 1 || bookingNumber > 9) {
        return res.status(400).json({ error: 'Booking number must be a digit between 1 and 9.' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address.' });
    }
    if (!/^\d+$/.test(phone)) {
        return res.status(400).json({ error: 'Phone number must contain only digits.' });
    }

    const query = 'INSERT INTO bookingtable (booking_number, email, phone, message) VALUES (?, ?, ?, ?)';
    db.query(query, [bookingNumber, email, phone, message], (err, results) => {
        if (err) {
            console.error('Error inserting data:', err);
            return res.status(500).send('Error booking message.');
        }
        res.status(200).json({ message: 'Booking successful!' });
    });
});

// book page
app.get('/bookingPage', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'front-hub', 'services', 'ser.html'));
});

app.listen(port, () => {
    console.log(`Server is running at port ${port}`);
});
