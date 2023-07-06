const express = require('express');
const morgan = require('morgan');

const app = express();

// Local imports
const db = require('./config/db');
const connectDB = require('./config/db');

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

// Middleware
app.use(express.json()); 
app.use(morgan("tiny")); // Log HTTP requests



const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    try {
        await connectDB(); // Connect to the database
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});
