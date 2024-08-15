import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

@Injectable()
export class OidcOktaService {
  private readonly oktaDomain = this.config.get('OKTA_ORG_URL');
  private readonly oktaApiToken = this.config.get('OKTA_API_TOKEN');
  private readonly clientId = this.config.get('OKTA_APP_ID');
  private readonly clientSecret = this.config.get('OKTA_APP_SECRET');

  constructor(private readonly config: ConfigService) {}
  async getIdToken(username: string, password: string) {
    const params = new URLSearchParams();
    params.append('grant_type', 'password');
    params.append('username', username);
    params.append('password', password);
    params.append('scope', 'openid');
    params.append('client_id', this.clientId);
    params.append('client_secret', this.clientSecret);
    const response = await axios.post(
      `${this.oktaDomain}/oauth2/v1/token`,
      params,
    );

    return response.data.id_token;
  }
  async introspectIdToken(idToken: string) {
    const response = await axios.post(
      `${this.oktaDomain}/oauth2/v1/introspect`,
      {
        token: idToken,
        token_type_hint: 'id_token',
      },
      {
        headers: {
          Authorization: `Basic`,
          'Content-Type': 'application/x-www-form-urlencoded',
          Accept: '*/*',
        },
        auth: { password: this.clientSecret, username: this.clientId },
      },
    );

    return response.data;
  }
}
