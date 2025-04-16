// E:\Desktop\te\src\api\contact.ts
import type { Request, Response } from 'express';
import nodemailer from "nodemailer";
import "dotenv/config";

let submissions: Record<string, { date: string }> = {};

// Express handler to process contact form submissions.
export async function sendContactHandler(req: Request, res: Response) {
  console.log("[Contact API] Starting contact form submission handler");
  
  if (req.method !== "POST") {
    res.writeHead(405, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  try {
    // Validate email configuration first
    console.log("[Contact API] Checking email configuration...");
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('[Contact API] Email configuration missing');
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Email configuration error',
        details: 'Server email configuration is incomplete.'
      }));
      return;
    }

    // Log the received data
    console.log("[Contact API] Received form data:", 
      JSON.stringify({ 
        ...req.body, 
        email_user: process.env.EMAIL_USER?.substring(0, 5) + '...' 
      }, null, 2)
    );

    // Destructure the request body
    const { 
      name, 
      email, 
      phone, 
      subject, 
      message, 
      appointment, 
      preferredContact,
      urgency 
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !subject || !message) {
      console.error('[Contact API] Missing required fields');
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Required fields are missing.' }));
      return;
    }

    console.log("[Contact API] Creating email transporter...");
    // Set up the Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      debug: true, // Enable debug logs
      logger: true  // Enable logger
    });

    // Test the connection
    console.log("[Contact API] Verifying email connection...");
    await transporter.verify();
    console.log("[Contact API] Email connection verified successfully");

    // Build the internal notification email content
    const internalMailOptions = {
      from: process.env.EMAIL_USER,
      to: "ahmadalkhalid533@gmail.com, shehab2231996@gmail.com",
      subject: `[${urgency.toUpperCase()}] New Contact Request: ${subject}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #2563eb; margin-top: 0;">New Contact Request</h2>
    <p style="margin: 0;"><strong>Urgency Level:</strong> <span style="color: ${
      urgency === 'high' ? '#dc2626' : 
      urgency === 'medium' ? '#d97706' : 
      '#059669'
    };">${urgency.toUpperCase()}</span></p>
  </div>

  <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
    <h3 style="color: #374151; margin-top: 0;">Contact Details</h3>
    <ul style="list-style: none; padding-left: 0;">
      <li><strong>Name:</strong> ${name}</li>
      <li><strong>Email:</strong> ${email}</li>
      <li><strong>Phone:</strong> ${phone}</li>
      <li><strong>Preferred Contact Method:</strong> ${preferredContact}</li>
      <li><strong>Subject:</strong> ${subject}</li>
      ${appointment ? `<li><strong>Requested Appointment:</strong> ${new Date(appointment).toLocaleString()}</li>` : ''}
    </ul>

    <h3 style="color: #374151; margin-top: 20px;">Message</h3>
    <p style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin: 0;">${message}</p>
  </div>
</body>
</html>
      `,
    };

    // Build the confirmation email content for the client
    const clientMailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Thank you for contacting Trojan Envoy - ${subject}`,
      html: `
<!DOCTYPE html>
<html>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
    <h2 style="color: #2563eb; margin-top: 0;">Thank You for Contacting Us!</h2>
    <p>Dear ${name},</p>
    <p>We have received your message regarding "${subject}". Thank you for reaching out to Trojan Envoy.</p>
  </div>

  <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; border: 1px solid #e5e7eb;">
    <h3 style="color: #374151; margin-top: 0;">What Happens Next?</h3>
    <ol style="padding-left: 20px;">
      <li>Our team will review your inquiry within the next few hours.</li>
      <li>You'll receive a response within 24 business hours.</li>
      <li>We'll schedule a detailed discussion based on your requirements${appointment ? ` (requested time: ${new Date(appointment).toLocaleString()})` : ''}.</li>
    </ol>

    <div style="background-color: #f8f9fa; padding: 15px; border-radius: 6px; margin-top: 20px;">
      <h4 style="color: #374151; margin-top: 0;">Your Message Summary</h4>
      <p style="margin-bottom: 0;"><strong>Subject:</strong> ${subject}</p>
      <p style="margin-bottom: 0;"><strong>Message:</strong> ${message}</p>
    </div>
  </div>

  <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
    <p style="color: #6b7280; font-size: 14px;">
      If you need immediate assistance, please contact us at:<br>
      Phone: +1 (555) 123-4567<br>
      Email: support@trojanenvoy.com
    </p>
    <p style="color: #6b7280; font-size: 14px;">Best regards,<br>The Trojan Envoy Team</p>
  </div>
</body>
</html>
      `,
    };

    // Send both emails
    console.log("[Contact API] Sending emails...");
    const [internalResult, clientResult] = await Promise.all([
      transporter.sendMail(internalMailOptions),
      transporter.sendMail(clientMailOptions)
    ]);
    
    console.log("[Contact API] Internal notification email sent:", internalResult.messageId);
    console.log("[Contact API] Client confirmation email sent:", clientResult.messageId);

    // Record the submission
    if (email) {
      submissions[email] = { date: new Date().toISOString().split("T")[0] };
    }

    console.log('[Contact API] Contact form processed successfully');
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: true, 
      message: 'Your message has been sent successfully!' 
    }));

  } catch (error) {
    console.error('[Contact API] Error:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Failed to send message',
      details: error instanceof Error ? error.message : 'Unknown error occurred'
    }));
  }
}
