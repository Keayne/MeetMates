/* Autor: Valentin Lieberknecht */

import fetch from 'node-fetch';
import { BrowserContext } from 'playwright';
import { v4 as uuidv4 } from 'uuid';
import config from './config.js';

export class UserSession {
  name: string;
  firstname: string;
  email: string;
  birthday: string;
  gender: string;
  image: string;
  password: string;
  token?: string;

  constructor(public context: BrowserContext) {
    const uuid = uuidv4();
    this.name = `name_${uuid}`;
    this.firstname = `firstname_${uuid}`;
    this.email = `email_${uuid}@example.org`;
    this.birthday = '2022-04-26';
    this.gender = 'diverse';
    this.image = 'data:image/png;base64,iV';
    this.password = `pw_${uuid}A`;
  }

  signInData() {
    return { email: this.email, password: this.password };
  }

  signUpData() {
    return {
      name: this.name,
      firstname: this.firstname,
      email: this.email,
      birthday: this.birthday,
      gender: this.gender,
      image: this.image,
      password: this.password,
      passwordCheck: this.password,
      interests: [],
      descriptions: []
    };
  }

  async registerUser() {
    const response = await fetch(config.serverUrl('sign-up'), {
      method: 'POST',
      body: JSON.stringify(this.signUpData()),
      headers: { 'Content-Type': 'application/json' }
    });

    const cookie = response.headers.raw()['set-cookie'].find(cookie => cookie.startsWith('jwt-token'));
    if (!cookie) {
      throw new Error('Failed to extract jwt-token');
    }
    this.token = cookie.split('=')[1].split(';')[0];

    await this.context.addCookies([
      { name: 'jwt-token', value: this.token!, domain: new URL(config.serverUrl('')).hostname, path: '/' }
    ]);
  }

  //TODO ...
  async registerMeetForUser() {
    await fetch(config.serverUrl('sign-up'), {
      method: 'POST',
      body: JSON.stringify(this.signUpData()),
      headers: { 'Content-Type': 'application/json' }
    });
  }

  async deleteUser() {
    const response = await fetch(config.serverUrl('delete'), {
      method: 'DELETE',
      headers: { Cookie: `jwt-token=${this.token}` }
    });
    if (response.status !== 200) {
      throw new Error('Failed to delete user for token ' + this.token);
    }
    await this.context.clearCookies();
  }
}
