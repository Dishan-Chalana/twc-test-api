const jwt = require('jsonwebtoken');

const User = require('../models/User');

// Middleware for authenticating user
const auth = async (req, res, next) => {
    const authHeader = req.headers.authorization;

    // Check if authorization header is provided
    if (!authHeader) {
        return res.status(401).json({ error: "You are not authorized to access this resource." });
    } else {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded._id }).select("-password");

            if (!user) {
                return res.status(401).json({ error: "You are not authorized to access this resource." });
            }

            req.user = {
                userId: user._id // Include the user's ID in the request
              };

            
            req.token = token;
            next();
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = auth;