import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';
import { CreateUserDto } from 'src/users/dto/create-user.dto';

@Injectable()
export class UserOktaService {
  private readonly domain = this.config.get('OKTA_ORG_URL');
  private readonly oktaApiToken = this.config.get('OKTA_API_TOKEN');
  private readonly appId = this.config.get('OKTA_APP_ID');

  constructor(private readonly config: ConfigService) {}
  async create(dto: CreateUserDto) {
    // * send a post req to okta to create a user in our application
    const response = await axios.post(
      `${this.domain}/api/v1/users`,
      {
        profile: {
          firstName: dto.firstName,
          lastName: dto.lastName,
          email: dto.email,
          mobilePhone: dto.mobilePhone,
          login: dto.email,
        },
        credentials: {
          password: {
            value: dto.password,
          },
        },
      },
      {
        headers: {
          Authorization: `SSWS ${this.oktaApiToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );

    //* assign user to owr okta application
    await this.assignToApp(response.data.id);

    return response.data;
  }
  async getOne(id: string) {
    const response = await axios.get(`${this.domain}/api/v1/users/${id}`, {
      headers: {
        Authorization: `SSWS ${this.oktaApiToken}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
    return response.data;
  }
  private async assignToApp(id: string) {
    const response = await axios.post(
      `${this.domain}/api/v1/apps/${this.appId}/users`,
      {
        id,
      },
      {
        headers: {
          Authorization: `SSWS ${this.oktaApiToken}`,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      },
    );
    return response.data;
  }
}