require('dotenv').config();
const nodemailer = require('nodemailer');

(async () => {
  try {
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = process.env.SMTP_PORT ? Number(process.env.SMTP_PORT) : 587;
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    console.log('SMTP host:', host);
    console.log('SMTP port:', port);
    console.log('EMAIL_USER:', !!user);

    if (!user || !pass) {
      console.error('ERROR: EMAIL_USER and/or EMAIL_PASS not set in environment. Please add them to your .env file');
      process.exit(1);
    }

    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465, // true for 465, false for other ports
      auth: { user, pass },
    });

    console.log('Verifying SMTP configuration...');
    await transporter.verify();
    console.log('SMTP configuration verified. Attempting to send test email...');

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || user,
      to: user,
      subject: 'Test email from Parus-kitchen backend',
      text: 'This is a test email sent by test-send-email.js',
    });

    console.log('Test email sent successfully!');
    console.log('MessageId:', info.messageId);
    console.log(info);
    process.exit(0);
  } catch (err) {
    console.error('SMTP test failed:');
    console.error(err);
    process.exit(1);
  }
})();
