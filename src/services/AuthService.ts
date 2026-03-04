import { type APIRequestContext } from '@playwright/test';
import { ApiClient } from './ApiClient';

interface DemoQAAuthResponse {
  userId: string;
  username: string;
  token: string;
  expires: string;
  created_date: string;
  isActive: boolean;
}

interface DemoQATokenResponse {
  token: string;
  expires: string;
  status: string;
  result: string;
}

/**
 * AuthService handles authentication via the DemoQA Account API.
 * Useful when tests need a pre-authenticated state without going through the UI login flow.
 */
export class AuthService {
  private client: ApiClient;

  constructor(request: APIRequestContext) {
    this.client = new ApiClient(request, 'https://demoqa.com');
  }

  async login(username: string, password: string): Promise<DemoQAAuthResponse> {
    const response = await this.client.post('/Account/v1/Login', {
      userName: username,
      password: password,
    });
    return response.json();
  }

  async generateToken(username: string, password: string): Promise<DemoQATokenResponse> {
    const response = await this.client.post('/Account/v1/GenerateToken', {
      userName: username,
      password: password,
    });
    return response.json();
  }

  async isAuthorized(username: string, password: string): Promise<boolean> {
    const response = await this.client.post('/Account/v1/Authorized', {
      userName: username,
      password: password,
    });
    return response.json();
  }

  async getUser(userId: string, token: string) {
    const response = await this.client.get(`/Account/v1/User/${userId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.json();
  }
}
