import sgMail from '@sendgrid/mail';

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY || '';

// Only set the API key if it exists
if (SENDGRID_API_KEY) {
  sgMail.setApiKey(SENDGRID_API_KEY);
} else {
  console.warn("⚠️ SENDGRID_API_KEY is not set. Emails will not be sent.");
}

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
  if (!SENDGRID_API_KEY) {
    console.error("Cannot send email: SENDGRID_API_KEY is missing.");
    return false;
  }

  try {
    const msg: sgMail.MailDataRequired = {
      to: params.to,
      from: params.from,
      subject: params.subject,
      text: params.text || '',
      html: params.html || ''
    };

    if (params.attachments?.length) {
      msg.attachments = params.attachments;
    }

    await sgMail.send(msg);
    console.log(`✅ Email sent successfully to ${params.to}`);
    return true;
  } catch (error) {
    console.error('❌ SendGrid email error:', error);
    return false;
  }
}
