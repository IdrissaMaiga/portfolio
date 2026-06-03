// File path: app/api/contact/route.ts
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

// Define interface for request body
interface ContactForm {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

// Simple input validation function
const validateInput = (body: ContactForm) => {
  const errors = [];
  
  if (!body.name || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('Name is required');
  }
  
  if (!body.email || typeof body.email !== 'string' || body.email.trim() === '') {
    errors.push('Email is required');
  } else if (!/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.push('Invalid email address');
  }
  
  if (!body.message || typeof body.message !== 'string' || body.message.trim() === '') {
    errors.push('Message is required');
  }
  
  return errors.length > 0 ? errors[0] : null;
};

export async function POST(req: Request) {
  try {
    // Debug: Log environment variables (without exposing values)
    console.log('API route called at', new Date().toISOString());
    console.log('EMAIL_USER exists:', !!process.env.EMAIL_USER);
    console.log('EMAIL_PASS exists:', !!process.env.EMAIL_PASS);
    
    // Parse request body
    let body: ContactForm;
    try {
      body = await req.json();
      console.log('Request body parsed successfully');
    } catch (e) {
      console.error('Error parsing JSON:', e);
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    
    // Validate input
    const validationError = validateInput(body);
    if (validationError) {
      console.log('Validation error:', validationError);
      return NextResponse.json(
        { error: validationError },
        { status: 400 }
      );
    }
    
    const { name, email, subject, message } = body;
    console.log('Validated input:', { name, email, subject: subject || '[No subject]' });
    
    // Check email configuration
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.error('Email configuration missing');
      return NextResponse.json(
        { error: 'Server configuration error - contact the site administrator' },
        { status: 500 }
      );
    }
    
    // Create a nodemailer transporter
    let transporter;
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });
      console.log('Transporter created successfully');
    } catch (e) {
      console.error('Error creating transporter:', e);
      return NextResponse.json(
        { error: 'Error setting up email service' },
        { status: 500 }
      );
    }

    // Email content
    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: 'maigadrisking@gmail.com',
      subject: subject ? `Portfolio Contact: ${subject}` : 'New message from portfolio',
      replyTo: email,
      text: `
        Name: ${name}
        Email: ${email}
        
        Message:
        ${message}
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Contact Message</h2>
          <p><strong>From:</strong> ${name}</p>
          <p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
          ${subject ? `<p><strong>Subject:</strong> ${subject}</p>` : ''}
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
            <p style="white-space: pre-line;">${message}</p>
          </div>
          <div style="margin-top: 20px; font-size: 12px; color: #6b7280;">
            <p>This message was sent from your portfolio contact form.</p>
          </div>
        </div>
      `,
    };

    // Send email with error handling
    try {
      console.log('Attempting to send email...');
      await transporter.sendMail(mailOptions);
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      return NextResponse.json(
        { error: 'Failed to send email. Please try again later or contact me directly at idrissa.maiga@iditechs.com' },
        { status: 500 }
      );
    }

    // Return success response
    return NextResponse.json({ 
      success: true,
      message: 'Message sent successfully! I\'ll get back to you soon.'
    });
  } catch (error) {
    console.error('Contact form error:', error);
    
    // Generic error response
    return NextResponse.json(
      { error: 'Something went wrong. Please try again later.' },
      { status: 500 }
    );
  }
}