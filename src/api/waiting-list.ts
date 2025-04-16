import { Request, Response } from 'express';
import nodemailer from 'nodemailer';
import { storageService } from '@/lib/storage';

// Email configuration - would typically come from environment variables
const emailConfig = {
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: Boolean(process.env.SMTP_SECURE),
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
};

export async function sendWaitingListHandler(req: Request, res: Response) {
  try {
    const { email, name, interests, message } = req.body;

    // Validate required fields
    if (!email) {
      throw new Error('Email is required');
    }

    // Save to storage service
    const waitingListEntry = await storageService.addWaitingListEntry({
      email,
      name,
      interests,
      message
    });

    // Initialize email transporter
    const transporter = nodemailer.createTransport(emailConfig);

    // Send confirmation email
    await transporter.sendMail({
      from: emailConfig.auth.user,
      to: email,
      subject: 'Welcome to Our Waiting List',
      html: `
        <h1>Welcome to Our Waiting List!</h1>
        <p>Dear ${name || 'Valued Customer'},</p>
        <p>Thank you for joining our waiting list. We're excited to have you on board!</p>
        <p>We'll keep you updated about:</p>
        <ul>
          ${interests?.map(interest => `<li>${interest}</li>`).join('') || ''}
        </ul>
        <p>Stay tuned for exclusive updates and early access opportunities.</p>
        <p>Best regards,<br>The Team</p>
      `
    });

    // Return success response
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: true,
      message: 'Successfully added to waiting list',
      data: { id: waitingListEntry.id }
    }));

  } catch (error) {
    console.error('Error processing waiting list submission:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    }));
  }
}