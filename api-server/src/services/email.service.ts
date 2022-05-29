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
        pass: '3Qybu3P6QryQyJf'
      }
    });
  }

  sendEmail = async (email: string, token: { token: string; mateid: string }) => {
    try {
      await this.transporter.sendMail({
        from: 'meeetmates@gmail.com',
        to: email,
        subject: 'E-Mail Verification',
        text: 'http://localhost:3000/api/confirm/' + token.mateid + '/' + token.token
      });
      console.log('email sent sucessfully');
    } catch (error) {
      console.log('email not sent');
      console.log(error);
    }
  };
}

export const emailService = new EMailService();
