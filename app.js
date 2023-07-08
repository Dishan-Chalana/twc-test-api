const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

const auth = require("./middlewares/auth");

const app = express();


// Local imports
const db = require('./config/db');
const connectDB = require('./config/db');
const authRouter = require('./routes/auth');

// Parse JSON request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// Middleware
// Enable CORS
app.use(express.json());
app.use(morgan("common")); // Log HTTP requests
app.use(cors());  

// Routes
app.use('/api', authRouter);
app.get('/protected', auth, (req, res) => {
    return res.status(200).json({ ...req.user._doc })
});






const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
    try {
        await connectDB(); // Connect to the database
        console.log(`Server is running on port ${PORT}`);
    } catch (error) {
        console.log(error);
    }
});
