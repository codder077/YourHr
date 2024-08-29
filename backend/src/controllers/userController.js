const { MongoClient, GridFSBucket } = require('mongodb');
const fs = require('fs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const formidable = require('formidable');

require('dotenv').config(); 

const signupUser = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            // Extract single values from fields
            const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
            const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;

            // Handle file upload
            const file = files.resume[0];
            const filePath = file.filepath;

            if (!filePath) {
                return res.status(400).json({ error: 'Invalid file path' });
            }

            // Connect to MongoDB
            const client = new MongoClient(process.env.MONGODB_URI);
            await client.connect();
            const db = client.db();
            const bucket = new GridFSBucket(db);

            const uploadStream = bucket.openUploadStream(file.originalFilename, {
                contentType: file.mimetype,
            });

            const readStream = fs.createReadStream(filePath);
            readStream.pipe(uploadStream);

            uploadStream.on('finish', async () => {
                const fileId = uploadStream.id;  // Get the file ID from the uploadStream
                if (!fileId) {
                    console.error('Failed to retrieve file ID after upload.');
                    return res.status(500).json({ error: 'File upload failed' });
                }

                const user = await User.create({
                    name,
                    email,
                    password,
                    resume: fileId, // Store GridFS file ID
                });

                const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

                res.status(201).json({
                    userId: user._id,
                    token,
                    name: user.name,
                    email: user.email,
                });

                await client.close();
            });

            uploadStream.on('error', async (error) => {
                console.error('Error during file upload:', error);
                res.status(500).send('File upload failed');
                await client.close();
            });

        } catch (error) {
            console.error('Error during signup:', error);
            res.status(500).send('Internal Server Error');
        }
    });
};

const getUserProfile = async (req, res) => {
    // console.log(`Fetching profile for userId: ${req.params.userId}`); // Log the userId
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);

        if (!user) {
            console.log('User not found:', userId); // Log if user is not found
            return res.status(404).json({ message: 'User not found' });
        }
        // console.log("user:" , user);

        const gfs = req.gfs; // Access GridFS instance from req
        const resumeFile = await gfs.files.findOne({ _id: user.resume });

        if (!resumeFile) {
            // console.log('Resume file not found for user:', userId); // Log if resume file is not found
            return res.status(404).json({ message: 'Resume file not found' });
        }

        res.status(200).json({ user, resumeFile });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
};

const updateUserProfile = async (req, res) => {
    const form = new formidable.IncomingForm();

    form.parse(req, async (err, fields, files) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).send('Internal Server Error');
        }

        try {
            const { userId } = req.params;

            // Find the user by ID
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            // Convert fields to strings to avoid type casting errors
            const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
            const email = Array.isArray(fields.email) ? fields.email[0] : fields.email;
            const password = Array.isArray(fields.password) ? fields.password[0] : fields.password;

            // Update the user's details
            user.name = name || user.name;
            user.email = email || user.email;

            if (password) {
                user.password = password; // Password will be hashed by the `pre('save')` hook
            }

            // Handle resume file upload if a new file is provided
            if (files.resume) {
                const file = files.resume[0];
                const filePath = file.filepath;

                if (!filePath) {
                    return res.status(400).json({ error: 'Invalid file path' });
                }

                // Connect to MongoDB
                const client = new MongoClient(process.env.MONGODB_URI);
                await client.connect();
                const db = client.db();
                const bucket = new GridFSBucket(db);

                // Delete the old resume file from GridFS if it exists
                if (user.resume) {
                    await bucket.delete(user.resume);
                }

                // Upload the new resume file
                const uploadStream = bucket.openUploadStream(file.originalFilename, {
                    contentType: file.mimetype,
                });

                const readStream = fs.createReadStream(filePath);
                readStream.pipe(uploadStream);

                uploadStream.on('finish', async () => {
                    // Store the new file ID in the user's record
                    user.resume = uploadStream.id;

                    // Save the updated user data
                    await user.save();
                    res.status(200).json({ message: 'Profile updated successfully' });

                    await client.close();
                });

                uploadStream.on('error', async (error) => {
                    console.error('Error during file upload:', error);
                    res.status(500).send('File upload failed');
                    await client.close();
                });
            } else {
                // If no resume file is uploaded, just save the user details
                await user.save();
                res.status(200).json({ message: 'Profile updated successfully' });
            }

        } catch (error) {
            console.error('Error updating profile:', error);
            res.status(500).send('Internal Server Error');
        }
    });
};

module.exports = { signupUser, getUserProfile, updateUserProfile };


