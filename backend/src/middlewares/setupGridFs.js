const { MongoClient, GridFSBucket } = require('mongodb');

const setupGridFS = async (req, res, next) => {
    try {
        const client = new MongoClient(process.env.MONGODB_URI);
        await client.connect();
        const db = client.db();
        req.gfs = new GridFSBucket(db);
        next();
    } catch (error) {
        console.error('Error setting up GridFS:', error);
        res.status(500).send('Internal Server Error');
    }
};

module.exports = setupGridFS;
