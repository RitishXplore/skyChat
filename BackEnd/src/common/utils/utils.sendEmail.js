import nodemailer from 'nodemailer';

/**
 * @desc Send an email using Nodemailer
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} html - Email HTML content
 */
const sendEmail = async (to, subject, html) => {
    try {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to,
            subject,
            html
        });

        console.log('Email sent successfully');
    } catch (error) {
        console.error('Failed to send email:', error.message);
        throw new Error('Failed to send email');
    }
};

export default sendEmail;
