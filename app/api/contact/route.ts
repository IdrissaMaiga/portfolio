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

function escapeHtml(str: string): string {
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

export async function POST(req: Request) {
  try {
    let body: ContactForm;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
    }

    const validationError = validateInput(body);
    if (validationError) {
      return NextResponse.json({ error: validationError }, { status: 400 });
    }

    const { name, email, subject, message } = body;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return NextResponse.json({ error: 'Server configuration error' }, { status: 500 });
    }

    let transporter;
    try {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
      });
    } catch {
      return NextResponse.json({ error: 'Email service unavailable' }, { status: 500 });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeSubject = subject ? escapeHtml(subject) : '';
    const safeMessage = escapeHtml(message);

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: 'maigadrisking@gmail.com',
      subject: subject ? `Portfolio Contact: ${subject}` : 'New message from portfolio',
      replyTo: email,
      text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #3b82f6;">New Contact Message</h2>
          <p><strong>From:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          ${safeSubject ? `<p><strong>Subject:</strong> ${safeSubject}</p>` : ''}
          <div style="margin-top: 20px; padding: 15px; background-color: #f9fafb; border-radius: 5px;">
            <p style="white-space: pre-line;">${safeMessage}</p>
          </div>
          <p style="margin-top: 20px; font-size: 12px; color: #6b7280;">Sent from portfolio contact form.</p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
    } catch (err) {
      console.error('Email send failed:', err);
      return NextResponse.json({ error: 'Failed to send. Try again later.' }, { status: 500 });
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