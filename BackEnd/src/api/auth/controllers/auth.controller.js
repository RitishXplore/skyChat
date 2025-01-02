import { User } from '../models/auth.model.js';
import bcrypt from 'bcrypt';
import { generateToken, verifyToken } from '../../../common/utils/tokenGeneration.js';
import sendEmail from '../../../common/utils/utils.sendEmail.js';
import dotenv from 'dotenv';

dotenv.config();

// User Registration
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already in use.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const verificationToken = generateToken({ email }, '1d');
        const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

        const newUser = await User.create({
            username,
            email,
            password: hashedPassword,
            verificationToken,
        });

        await sendEmail({
            to: email,
            subject: 'Email Verification',
            html: `<p>Please verify your email by clicking <a href="${verificationUrl}">here</a></p>`,
        });

        res.status(201).json({ message: 'User registered successfully. Check your email for verification.' });
    } catch (error) {
        console.error('Registration Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// User Login
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ message: 'Please verify your email before logging in.' });
        }

        const token = generateToken({ userId: user._id });
        res.status(200).json({ message: 'Login successful.', token ,userId: user._id });
    } catch (error) {
        console.error('Login Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

export const searchUsers = async (req, res) => {
    try {
        const { query } = req.query;

        // If the search query is not provided
        if (!query) {
            return res.status(400).json({ message: 'Search query is required.' });
        }

        // Perform a case-insensitive regex search on both 'username' and 'email'
        const users = await User.find({
            $or: [
                { username: { $regex: query, $options: 'i' } }, // Case-insensitive search on username
                { email: { $regex: query, $options: 'i' } }    // Case-insensitive search on email
            ]
        }).select('-password -verificationToken'); // Exclude sensitive fields

        if (users.length === 0) {
            return res.status(404).json({ message: 'No users found.' });
        }

        res.status(200).json({ users });
    } catch (error) {
        console.error('Search Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Verify Email
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;
        const decoded = verifyToken(token);

        const user = await User.findOneAndUpdate(
            { email: decoded.email },
            { isEmailVerified: true, verificationToken: null },
            { new: true }
        );

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired token.' });
        }

        res.status(200).json({ message: 'Email verified successfully.' });
    } catch (error) {
        console.error('Email Verification Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get User Profile
export const getProfile = async (req, res) => {
    try {
        const userId = req.user.userId;
        const user = await User.findById(userId).select('-password -verificationToken');
        
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.status(200).json({ user });
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

//group
