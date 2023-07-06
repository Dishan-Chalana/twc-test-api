const mongoose = require('mongoose')

// MongoDB connection URI
const dbUri = 'mongodb+srv://admin:1234@cluster0.xslakjt.mongodb.net/twc-test-db?retryWrites=true&w=majority'

mongoose.set('strictQuery', false)

const connectDB = async () => {
    return mongoose.connect(dbUri)
        .then(() => console.log('MongoDB Connected'))
        .catch(err => console.log(err));
};
module.exports = connectDB;