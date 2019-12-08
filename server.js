const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwtSecret = require('./config/secrets').jwtSecret;
const jwt = require('jsonwebtoken');

const express = require('express');
const http = require('http');
const socketIO = require("socket.io");
const app = express();
const server = http.createServer(app);
const io = socketIO(server);

require('./socket')(io);

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

// Add routes
app.use('/api/users', require('./routes/api/users.js'));
app.use('/api/auth', require('./routes/api/auth.js'));

// Start Server
server.listen(8080, () => console.log('Server started on port 8080'));

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
        req.id = decode;
        next();
    } catch (err) {
        res.status(400).json({
            success: false,
            message: ['Token is invalid']
        });
    }
}