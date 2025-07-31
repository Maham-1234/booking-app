const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVICE_HOST,
  port: process.env.EMAIL_SERVICE_PORT,
  secure: process.env.EMAIL_SERVICE_PORT == 465, 
  auth: {
    user: process.env.EMAIL_SERVICE_USER,
    pass: process.env.EMAIL_SERVICE_PASS,
  },
});

const sendBookingConfirmationEmail = async (userEmail, bookingDetails) => {
  const {
    userName,
    eventName,
    eventDate,
    eventLocation,
    numberOfTickets,
    totalPrice,
    bookingId,
    bookingReference,
  } = bookingDetails;

  const mailOptions = {
    from: `"Booking API" <${process.env.EMAIL_SERVICE_USER}>`,
    to: userEmail,
    subject: `Your Booking Confirmation for ${eventName}`,
    html: `
      <h1>Booking Confirmation for ${eventName}</h1>
      <p>Dear ${userName},</p>
      <p>Thank you for your booking! Your reservation for <strong>${eventName}</strong> has been successfully confirmed.</p>
      <p>Here are your booking details:</p>
      <ul>
        <li><strong>Booking ID:</strong> ${bookingId}</li>
        <li><strong>Booking Reference:</strong> ${bookingReference}</li>
        <li><strong>Event:</strong> ${eventName}</li>
        <li><strong>Date:</strong> ${new Date(
          eventDate
        ).toLocaleDateString()}</li>
        <li><strong>Location:</strong> ${eventLocation}</li>
        <li><strong>Number of Tickets:</strong> ${numberOfTickets}</li>
        <li><strong>Total Price:</strong> $${Number(totalPrice).toFixed(2)}</li>
      </ul>
      <p>Please keep this email for your records. We look forward to seeing you there!</p>
      <p>Best regards,</p>
      <p>The Booking API Team</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Confirmation email sent to ${userEmail} for booking ${bookingId} (Ref: ${bookingReference})`
    );
  } catch (error) {
    console.error(`Error sending confirmation email to ${userEmail}:`, error);
  }
};

module.exports = {
  sendBookingConfirmationEmail,
};
