// mailer.js
const nodemailer = require('nodemailer');

// Reusable transporter object using SMTP
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'natarajyalavarthi50@gmail.com',        // Your email
    pass: 'nyyb hyvb kqls keku'            // App password or email password
  }
});

/**
 * Send email to multiple users
 * @param {string[]} recipients - array of email addresses
 * @param {string} subject - subject of email
 * @param {string} message - body (HTML/text) of email
 */
const sendEmails = async (recipients, subject, message) => {
  for (const email of recipients) {
    try {
      await transporter.sendMail({
        from: '"Job Portal Admin" <natarajyalavarthi50@gmail.com>',
        to: email,
        subject,
        html: `<p>${message}</p>`,
      });
      console.log(`Email sent to ${email}`);
    } catch (err) {
      console.error(`Failed to send email to ${email}:`, err.message);
    }
  }
};

module.exports = sendEmails;
