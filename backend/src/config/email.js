import nodemailer from 'nodemailer';
import config from './config.js';
import { logError, logInfo } from './logger.js';

class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: config.smtpConfig.host,
      port: config.smtpConfig.port,
      secure: config.smtpConfig.port === 465,
      auth: {
        user: config.smtpConfig.auth.user,
        pass: config.smtpConfig.auth.pass,
      },
    });
  }

  async verifyConnection() {
    try {
      await this.transporter.verify();
      logInfo('Email service connection verified');
      return true;
    } catch (error) {
      logError('Email service connection error:', error);
      return false;
    }
  }

  async sendEmail(options) {
    try {
      const mailOptions = {
        from: config.emailFrom,
        to: options.to,
        subject: options.subject,
        html: options.html,
        text: options.text,
        attachments: options.attachments,
      };

      const info = await this.transporter.sendMail(mailOptions);
      logInfo('Email sent successfully:', info.messageId);
      return info;
    } catch (error) {
      logError('Error sending email:', error);
      throw error;
    }
  }

  // Email templates
  async sendWelcomeEmail(user) {
    const html = `
      <h1>Welcome to Wurana!</h1>
      <p>Dear ${user.username},</p>
      <p>Thank you for joining Wurana. We're excited to have you as part of our community!</p>
      <p>To get started:</p>
      <ul>
        <li>Complete your profile</li>
        <li>Connect your Solana wallet</li>
        <li>Verify your identity with Civic</li>
      </ul>
      <p>If you have any questions, feel free to contact our support team.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Welcome to Wurana',
      html,
      text: html.replace(/<[^>]*>/g, ''),
    });
  }

  async sendVerificationEmail(user, verificationToken) {
    const verificationUrl = `${config.frontendUrl}/verify-email?token=${verificationToken}`;
    
    const html = `
      <h1>Verify Your Email</h1>
      <p>Dear ${user.username},</p>
      <p>Please click the button below to verify your email address:</p>
      <a href="${verificationUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>If the button doesn't work, copy and paste this link into your browser:</p>
      <p>${verificationUrl}</p>
      <p>This link will expire in 24 hours.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Verify Your Email - Wurana',
      html,
      text: html.replace(/<[^>]*>/g, ''),
    });
  }

  async sendPasswordResetEmail(user, resetToken) {
    const resetUrl = `${config.frontendUrl}/reset-password?token=${resetToken}`;
    
    const html = `
      <h1>Reset Your Password</h1>
      <p>Dear ${user.username},</p>
      <p>You requested to reset your password. Click the button below to proceed:</p>
      <a href="${resetUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Reset Password
      </a>
      <p>If you didn't request this, please ignore this email.</p>
      <p>This link will expire in 1 hour.</p>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'Password Reset - Wurana',
      html,
      text: html.replace(/<[^>]*>/g, ''),
    });
  }

  async sendOrderNotification(user, order) {
    const orderUrl = `${config.frontendUrl}/orders/${order._id}`;
    
    const html = `
      <h1>New Order Notification</h1>
      <p>Dear ${user.username},</p>
      <p>You have a new order for your gig "${order.gig.title}".</p>
      <p>Order Details:</p>
      <ul>
        <li>Order ID: ${order._id}</li>
        <li>Package: ${order.package.name}</li>
        <li>Price: ${order.package.price} SOL</li>
        <li>Delivery Time: ${order.package.deliveryTime} days</li>
      </ul>
      <a href="${orderUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        View Order
      </a>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'New Order - Wurana',
      html,
      text: html.replace(/<[^>]*>/g, ''),
    });
  }

  async sendOrderStatusUpdate(user, order) {
    const orderUrl = `${config.frontendUrl}/orders/${order._id}`;
    
    const html = `
      <h1>Order Status Update</h1>
      <p>Dear ${user.username},</p>
      <p>Your order status has been updated to: ${order.status}</p>
      <p>Order Details:</p>
      <ul>
        <li>Order ID: ${order._id}</li>
        <li>Gig: ${order.gig.title}</li>
        <li>Updated: ${new Date(order.updatedAt).toLocaleString()}</li>
      </ul>
      <a href="${orderUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        View Order
      </a>
    `;

    return this.sendEmail({
      to: user.email,
      subject: `Order ${order.status} - Wurana`,
      html,
      text: html.replace(/<[^>]*>/g, ''),
    });
  }

  async sendNFTMintNotification(user, review) {
    const reviewUrl = `${config.frontendUrl}/reviews/${review._id}`;
    
    const html = `
      <h1>NFT Badge Minted!</h1>
      <p>Dear ${user.username},</p>
      <p>Congratulations! Your 5-star review has been minted as an NFT badge.</p>
      <p>Review Details:</p>
      <ul>
        <li>Gig: ${review.gig.title}</li>
        <li>Rating: ⭐⭐⭐⭐⭐</li>
        <li>NFT Mint Address: ${review.nftBadge.mintAddress}</li>
      </ul>
      <a href="${reviewUrl}" style="padding: 10px 20px; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        View Review
      </a>
    `;

    return this.sendEmail({
      to: user.email,
      subject: 'NFT Badge Minted - Wurana',
      html,
      text: html.replace(/<[^>]*>/g, ''),
    });
  }
}

// Create and export email service instance
const emailService = new EmailService();
export default emailService;