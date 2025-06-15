const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/send', async (req, res) => {
  const { name, email, message } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_RECEIVE,
    subject: `New message from ${name}`,
    html: `<p><strong>Email:</strong> ${email}</p><p>${message}</p>`
  });

  await transporter.sendMail({
    from: `"Support Team" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: `We received your message`,
    html: `<p>Hello ${name},<br>We received your request and will get back to you soon.</p>`
  });

  res.send("✅ Message sent successfully!");
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));
