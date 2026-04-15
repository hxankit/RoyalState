import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const createTransporter = () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD environment variable.');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
};

const transporter = createTransporter();

export const sendEmail = async (mailOptions) => {
  return await transporter.sendMail(mailOptions);
};

export const checkEmailHealth = async () => {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    return { status: 'error', message: 'GMAIL_USER or GMAIL_APP_PASSWORD not configured' };
  }
  return { status: 'healthy', message: 'Email service is operational via Gmail SMTP' };
};

export default transporter;