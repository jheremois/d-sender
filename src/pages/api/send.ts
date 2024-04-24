// pages/api/send.ts
import nodemailer from 'nodemailer';
import { NextApiRequest, NextApiResponse } from 'next';
import type { SendMailOptions } from 'nodemailer';

export default async function sendMail(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  const {
    email,
    password,
    title,
    recipient,
    body
  } = req.body;

  if (!email || !password || !title || !recipient || !body) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: 'smtp.mailgun.org',
      port: 587,
      secure: false, // upgrade later with STARTTLS
      auth: {
        user: email,
        pass: password
      }
    });

    const mailOptions: SendMailOptions = {
      from: email,
      to: recipient,
      subject: title,
      html: body
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Message sent: %s', info.messageId);
    return res.status(200).json({
      message: 'Email sent successfully',
      messageId: info.messageId
    });
  } catch (error: any) {
    console.error('Failed to send email:', error);
    return res.status(500).json({
      message: 'Failed to send email',
      error: error.message
    });
  }
}
