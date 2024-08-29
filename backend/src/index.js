const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const userRoutes = require('./routes/user');
const Grid = require('gridfs-stream');

dotenv.config();

const app = express();
const cors = require('cors');
app.use(cors());
let gfs;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('MongoDB connected');

        // Initialize GridFS after connection
        const conn = mongoose.connection;
        gfs = Grid(conn.db, mongoose.mongo);
        gfs.collection('fs'); // Use default collection prefix
    })
    .catch(err => console.log(err));

app.use(express.json());

// Use GridFS instance in routes
app.use((req, res, next) => {
    req.gfs = gfs;
    next();
});

// Signup routes
app.use('/api', userRoutes); // Adjust the base path as needed

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
