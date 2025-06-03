export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { name, email, subject, message } = req.body;

    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({ 
        error: 'Missing required fields: name, email, message' 
      });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Brevo API configuration
    const BREVO_API_KEY = process.env.BREVO_API_KEY;
    const RECIPIENT_EMAIL = process.env.RECIPIENT_EMAIL || 'fordonthego2008@yahoo.com';

    if (!BREVO_API_KEY) {
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Prepare email data
    const emailData = {
      sender: {
        name: "Contact Form",
        email: "noreply@yourdomain.com" // Use your verified domain
      },
      to: [
        {
          email: RECIPIENT_EMAIL,
          name: "Admin"
        }
      ],
      subject: subject || `New Contact Form Submission from ${name}`,
      htmlContent: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Contact Form Submission</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subject || 'No subject'}</p>
          </div>
          <div style="background: #fff; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
            <h3 style="color: #333; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6;">${message.replace(/\n/g, '<br>')}</p>
          </div>
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>This email was sent from your website contact form.</p>
            <p>Sent at: ${new Date().toLocaleString()}</p>
          </div>
        </div>
      `,
      textContent: `
New Contact Form Submission

Name: ${name}
Email: ${email}
Subject: ${subject || 'No subject'}

Message:
${message}

---
This email was sent from your website contact form.
Sent at: ${new Date().toLocaleString()}
      `
    };

    // Send email via Brevo API
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'api-key': BREVO_API_KEY
      },
      body: JSON.stringify(emailData)
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Brevo API Error:', errorData);
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: errorData.message || 'Unknown error'
      });
    }

    const result = await response.json();
    
    // Success response
    return res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Server Error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}