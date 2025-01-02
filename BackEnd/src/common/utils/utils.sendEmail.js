import nodemailer from 'nodemailer';

/**
 * @desc Send an email using Nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email
 * @param {string} options.subject - Email subject
 * @param {string} options.html - Email HTML content
 * @param {string} [options.text] - Plain text version of the email
 */
const sendEmail = async ({ to, subject, html, text }) => {
    try {
        if (!to || !subject || !html) {
            throw new Error('Missing required email parameters: to, subject, or html');
        }

        if (!/\S+@\S+\.\S+/.test(to)) {
            throw new Error('Invalid email address');
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST || 'smtp.gmail.com',
            port: Number(process.env.EMAIL_PORT) || 587,
            secure: process.env.EMAIL_SECURE === 'true', // true for port 465, false for others
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const info = await transporter.sendMail({
            from: `<${process.env.EMAIL_USER}>`,
            to,
            subject : "Email Verification for SkyChat",
            text,
            html,
        });

        console.log(`✅ Email sent successfully to ${to}. Message ID: ${info.messageId}`);
        return info;
    } catch (error) {
        console.error('❌ Failed to send email:', error.message);
        throw new Error(`Failed to send email: ${error.message}`);
    }
};

export default sendEmail;
