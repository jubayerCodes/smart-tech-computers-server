const nodemailer = require("nodemailer");

const EmailSend = async (EmailTo, EmailHtml, EmailSubject) => {
    try {
        let transporter = nodemailer.createTransport({
            host: "mail.abcpabnabd.com",
            port: 587, // or 465 for SSL
            secure: false, // Set to true if using port 465
            auth: {
                user: "order@abcpabnabd.com",
                pass: 'i,cWRhyUdnBO', // Move to environment variable!
            },
            pool: true,
            tls: {
                rejectUnauthorized: false, // Use only if facing SSL issues
            }
        });

        let mailOptions = {
            from: '"ABC Computers Pabna" <order@abcpabnabd.com>',
            to: EmailTo,
            subject: EmailSubject,
            html: EmailHtml, // Use 'html' instead of 'text' for HTML emails
        };

        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Email sent successfully:", info.messageId);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error("❌ Error sending email:", error);
        return { success: false, error: error.message };
    }
};

module.exports = EmailSend;