import nodemailer from 'nodemailer';

// Create transporter with Gmail
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
    },
});

interface SendEmailParams {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailParams) {
    try {
        const info = await transporter.sendMail({
            from: `"SMIU Lost & Found" <${process.env.GMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html,
        });

        console.log('✅ Email sent successfully:', info.messageId);
        return { success: true, data: info };
    } catch (error) {
        console.error('❌ Email error:', error);
        return { success: false, error: 'Failed to send email' };
    }
}

// Email Templates
export const emailTemplates = {
    // When someone reports a found ID card
    idCardFound: (ownerName: string, rollNumber: string, location: string, finderEmail: string) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
                .highlight { background: #fef3c7; padding: 15px; border-left: 4px solid #f59e0b; margin: 20px 0; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎉 Good News! Your ID Card Has Been Found!</h1>
                </div>
                <div class="content">
                    <p>Dear ${ownerName},</p>
                    
                    <p>Great news! Someone has found and reported your ID card on the SMIU Lost & Found system.</p>
                    
                    <div class="highlight">
                        <strong>📍 Details:</strong><br>
                        <strong>Roll Number:</strong> ${rollNumber}<br>
                        <strong>Found At:</strong> ${location}<br>
                        <strong>Reported By:</strong> ${finderEmail}
                    </div>
                    
                    <p><strong>What to do next:</strong></p>
                    <ol>
                        <li>Contact the finder at: <a href="mailto:${finderEmail}">${finderEmail}</a></li>
                        <li>Arrange to collect your ID card</li>
                        <li>Verify your identity when collecting</li>
                    </ol>
                    
                    <a href="http://localhost:3000" class="button">View on SMIU Lost & Found</a>
                    
                    <p>If you have any questions, please contact us.</p>
                </div>
                <div class="footer">
                    <p>SMIU Lost & Found System | Sindh Madressatul Islam University</p>
                </div>
            </div>
        </body>
        </html>
    `,

    // When someone's item is found (general notification)
    itemFound: (ownerEmail: string, itemTitle: string, location: string, finderEmail: string) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #059669; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f0fdf4; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #059669; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>✨ Your Item May Have Been Found!</h1>
                </div>
                <div class="content">
                    <p>Hello,</p>
                    
                    <p>Someone has reported finding an item that might be yours:</p>
                    
                    <p><strong>Item:</strong> ${itemTitle}<br>
                    <strong>Location:</strong> ${location}<br>
                    <strong>Contact:</strong> <a href="mailto:${finderEmail}">${finderEmail}</a></p>
                    
                    <a href="http://localhost:3000" class="button">View Details</a>
                    
                    <p>Please verify if this is your item and contact the finder.</p>
                </div>
                <div class="footer">
                    <p>SMIU Lost & Found System</p>
                </div>
            </div>
        </body>
        </html>
    `,

    // Welcome email after onboarding
    welcomeEmail: (userName: string, rollNumber: string) => `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                .header { background: #1e3a8a; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
                .content { background: #f8fafc; padding: 30px; border-radius: 0 0 8px 8px; }
                .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
                .footer { text-align: center; margin-top: 20px; color: #64748b; font-size: 14px; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🎓 Welcome to SMIU Lost & Found!</h1>
                </div>
                <div class="content">
                    <p>Dear ${userName},</p>
                    
                    <p>Thank you for completing your profile! Your account is now fully set up.</p>
                    
                    <p><strong>Your Details:</strong><br>
                    Roll Number: ${rollNumber}</p>
                    
                    <p><strong>What you can do now:</strong></p>
                    <ul>
                        <li>Report lost items</li>
                        <li>Report found items</li>
                        <li>Search for your lost belongings</li>
                        <li>Get notified when your items are found</li>
                    </ul>
                    
                    <a href="http://localhost:3000" class="button">Start Using SMIU Lost & Found</a>
                    
                    <p>If you ever lose your ID card, we'll automatically notify you when someone finds it!</p>
                </div>
                <div class="footer">
                    <p>SMIU Lost & Found System | Sindh Madressatul Islam University</p>
                </div>
            </div>
        </body>
        </html>
    `,
};
