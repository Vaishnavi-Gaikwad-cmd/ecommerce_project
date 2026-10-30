import express from 'express';
import nodemailer from 'nodemailer';

const router = express.Router();

router.post('/confirmation', async (req, res) => {
  const { email, orderNumber, trackingNumber, total, paymentMethod, shipping } = req.body;
  if (!email || !orderNumber || !trackingNumber || total === undefined) return res.status(400).json({ message: 'Email, order number, tracking number, and total are required.' });
  if (!process.env.ORDER_EMAIL_FROM || (!process.env.RESEND_API_KEY && (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASSWORD))) {
    return res.status(503).json({ message: 'Email service is not configured. Add SMTP or Resend settings to server/.env.' });
  }

  const text = `Thanks for your order.\n\nOrder: ${orderNumber}\nTracking number: ${trackingNumber}\nPayment method: ${paymentMethod || 'Online payment'}\nTotal: INR ${Number(total).toLocaleString('en-IN')}\nShipping status: Processing\nDelivery: ${shipping?.address || 'Your saved delivery address'}, ${shipping?.city || ''} ${shipping?.postal || ''}\n\nTrack your order with tracking number ${trackingNumber}. We will email you again when your tee ships.`;

  try {
    if (process.env.RESEND_API_KEY) {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ from: process.env.ORDER_EMAIL_FROM, to: [email], subject: `THREADFORM order ${orderNumber} confirmed`, text }),
      });
      if (!response.ok) throw new Error(`Resend returned ${response.status}`);
    } else {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT || 587),
        secure: process.env.SMTP_SECURE === 'true',
        auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
      });
      await transporter.sendMail({ from: process.env.ORDER_EMAIL_FROM, to: email, subject: `THREADFORM order ${orderNumber} confirmed`, text });
    }
    return res.json({ sent: true });
  } catch (error) {
    console.error('Order email failed:', error.message);
    return res.status(502).json({ message: 'The order was saved, but the confirmation email could not be sent.' });
  }
});

export default router;
