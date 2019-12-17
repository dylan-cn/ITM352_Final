const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwtSecret = require('./config/secrets').jwtSecret;
const jwt = require('jsonwebtoken');
const fileUpload = require('express-fileupload');
const path = require('path');

const app = express();

// api keys
const keys = require('./config/secrets');
const db = keys.mongoDb;

// connect to MongoDB database
mongoose
    .connect(db, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    })
    .then(() => console.log('MongoDB successfully connected'))
    .catch(err => console.log('MongoDB not connected: ' + err));

// body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(fileUpload());
app.use(express.static('public'));
// Serve the static files from the React app
app.use(express.static(path.join(__dirname, '/build')));

// Add routes
app.use('/api/users', auth, require('./routes/api/users.js'));
app.use('/api/auth', require('./routes/api/auth.js'));
app.use('/api/product', auth, require('./routes/api/product'));
app.use('/api/products', require('./routes/api/products'));
app.use('/api/upload', auth, require('./routes/api/upload'));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'/build/index.html'));
});
// Start Server
app.listen(8080, () => console.log('Server started on port 8080'));

// Authorization middleware
function auth(req, res, next) {
    // Gets token from x-auth-token
    const token = req.header('x-auth-token');

    // Check token exists
    if (!token) {
        return res.status(401).json({
            success: false,
            messages: ['Authorization denied']
        });
    }

    try {
        // Verify jwt
        const decode = jwt.verify(token, jwtSecret);

        // Add user from jwt
        req.id = decode.id;
        req.role = decode.role;
        req.workingDirectory = __dirname;
        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: ['Token is invalid']
        });
    }
}