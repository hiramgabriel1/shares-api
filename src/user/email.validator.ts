import * as nodemailer from 'nodemailer';
import * as dotenv from "dotenv"

dotenv.config()
export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_PROVIDER,
    pass: process.env.PASSWORD_EMAIL_PROVIDER,
  },
});

transporter.verify().then(() => {
  console.log('ready for send emails');
});