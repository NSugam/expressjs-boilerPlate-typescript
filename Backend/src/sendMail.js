const nodemailer = require('nodemailer');

require('dotenv').config();
const gmail_address = process.env.GMAIL_ADDRESS
const gmail_password = process.env.GMAIL_APP_PASSWORD

async function sendMail(sendTo, subject, htmlBody) {

    // Create a transporter object using your Gmail credentials
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: gmail_address,
            pass: gmail_password
        }
    });

    // Set up email data
    const mailOptions = {
        from: 'MotoMate Server <forwardtechnical.official@gmail.com>',
        to: sendTo,
        subject: subject,
        html: htmlBody
    };

    // Send mail with defined transport object
    try {
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent: ' + info.response);
        return

    } catch (error) {
        throw new Error('Failed to send email');
    }


}

module.exports = sendMail;
