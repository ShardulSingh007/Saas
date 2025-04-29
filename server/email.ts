import sgMail from '@sendgrid/mail';

// Ensure the API key is set
const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
if (!SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

sgMail.setApiKey(SENDGRID_API_KEY);

interface EmailParams {
  to: string;
  from: string;
  subject: string;
  text?: string;
  html?: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: 'attachment';
  }[];
}

export async function sendEmail(params: EmailParams): Promise<boolean> {
  try {
    // Create the email message
    const msg: sgMail.MailDataRequired = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || ''
    };
    
    // Add attachments if they exist
    if (params.attachments && params.attachments.length > 0) {
      msg.attachments = params.attachments;
    }
    
    await sgMail.send(msg);
    console.log(`Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}