import nodemailer from 'nodemailer';

export default class EmailService {
    static async sendActivationLink({ email, activationId }) {
        const link = `${process.env.CLIENT_URL}${process.env.ACCOUNT_ACTIVATION_PATH}?activationId=${activationId}`;

        const transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: true,
            auth: {
                user: process.env.SMTP_LOGIN,
                pass: process.env.SMTP_PASSWORD,
            },
        });

        await transporter.sendMail({
            from: process.env.SMTP_LOGIN,
            to: email,
            subject: 'Account activation in Smart Feeder',
            html: `
            <div>
                <h1>Follow the link for account activation</h1>
                <a href="${link}">${link}</a>
            </div>
        `,
        });
    }
}
