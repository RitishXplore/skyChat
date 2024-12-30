import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/auth.model.js';
import crypto from 'crypto';
import sendEmail from '../../../common/utils/utils.sendEmail.js';

/**
 * @desc Register a new user and send verification email
 * @route POST /api/auth/register
 */
export const registerUser = async (req, res) => {
    try {
        const { userName, email, password } = req.body;

        // Check if the user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists.' });

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate verification token
        const verificationToken = crypto.randomBytes(32).toString('hex');

        

        // Create user
        const newUser = await User.create({
            userName,
            email,
            password: hashedPassword,
            verificationToken
        });

        // Send verification email
        const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;
        await sendEmail(email, 'Email Verification', `<p>Verify your email <a href="${verificationLink}">here</a></p>`);

        res.status(201).json({ message: 'User registered. Please verify your email.' });
    } catch (error) {
        res.status(500).json({ message: 'Registration failed.', error: error.message });
    }
};

/**
 * @desc Login user and generate JWT token
 * @route POST /api/auth/login
 */
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found.' });
        if (!user.isEmailVerified) return res.status(400).json({ message: 'Please verify your email first.' });

        // Compare password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) return res.status(400).json({ message: 'Invalid credentials.' });

        // Generate JWT Token
        const token = jwt.sign(
            { id: user._id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict'
        });

        res.status(200).json({ message: 'Login successful.' });
    } catch (error) {
        res.status(500).json({ message: 'Login failed.', error: error.message });
    }
};

/**
 * @desc Forgot password and send reset email
 * @route POST /api/auth/forgot-password
 */
export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found.' });

        // Generate password reset token
        const resetToken = crypto.randomBytes(32).toString('hex');
        user.verificationToken = resetToken;
        await user.save();

        // Send reset email
        const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${resetToken}`;
        await sendEmail(email, 'Password Reset', `<p>Reset your password <a href="${resetLink}">here</a></p>`);

        res.status(200).json({ message: 'Password reset email sent.' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to send reset email.', error: error.message });
    }
};
