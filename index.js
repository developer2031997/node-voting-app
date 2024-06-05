const express = require('express');
const connectMongoDB = require("./coonection");
require('dotenv').config();
const fs = require('fs');

const PORT = process.env.PORT;
const MONGO_DB_URL = process.env.MONGO_DB_URL;

const app = express();
const bodyParser = require('body-parser');
app.use(bodyParser.json());

connectMongoDB(MONGO_DB_URL);

// Authentication middleware for logging requests
const logRequest = (req, res, next) => {
    const logmessage = `\n[${new Date().toLocaleString()}] Request Made to :  ${req.method} ${req.originalUrl}`;
    console.log(logmessage);
    fs.appendFile('request_logs.txt', logmessage, (err) => {
        if (err) {
            console.error('Error writing to file:', err);
        }
    });
    next(); // Move on to the next phase
};
// Apply logging middleware to all routes
app.use(logRequest);

const userRouter = require("./routes/userRoutes");
const candidateRoutes = require("./routes/candidateRoutes");

app.use('/user' , userRouter);
app.use('/candidate' , candidateRoutes);


// Start the server
app.listen(PORT, () => {
    console.log(`Server started at port: ${PORT}`);
});