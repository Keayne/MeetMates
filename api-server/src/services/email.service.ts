/* Autor: Valentin Lieberknecht */

import nodemailer from 'nodemailer';

class EMailService {
  transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      port: 587,
      secure: true,
      auth: {
        user: 'meeetmates@gmail.com',
        pass: 'sydoapmvafdsxpti'
      }
    });
  }

  sendEmail = async (email: string, message: { subject: string; text: string }) => {
    try {
      await this.transporter.sendMail({
        from: 'meeetmates@gmail.com',
        to: email,
        subject: message.subject,
        text: message.text
      });
      console.log('email sent sucessfully');
    } catch (error) {
      console.log('email not sent');
      console.log(error);
    }
  };
}

export const emailService = new EMailService();
