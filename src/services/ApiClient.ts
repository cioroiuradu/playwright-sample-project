import { type APIRequestContext } from '@playwright/test';

export class ApiClient {
  private request: APIRequestContext;
  private baseURL: string;

  constructor(request: APIRequestContext, baseURL: string) {
    this.request = request;
    this.baseURL = baseURL;
  }

  async get(endpoint: string, options?: { headers?: Record<string, string> }) {
    return this.request.get(`${this.baseURL}${endpoint}`, {
      headers: options?.headers,
    });
  }

  async post(endpoint: string, data?: unknown, options?: { headers?: Record<string, string> }) {
    return this.request.post(`${this.baseURL}${endpoint}`, {
      data,
      headers: options?.headers,
    });
  }

  async put(endpoint: string, data?: unknown, options?: { headers?: Record<string, string> }) {
    return this.request.put(`${this.baseURL}${endpoint}`, {
      data,
      headers: options?.headers,
    });
  }

  async patch(endpoint: string, data?: unknown, options?: { headers?: Record<string, string> }) {
    return this.request.patch(`${this.baseURL}${endpoint}`, {
      data,
      headers: options?.headers,
    });
  }

  async delete(endpoint: string, options?: { headers?: Record<string, string> }) {
    return this.request.delete(`${this.baseURL}${endpoint}`, {
      headers: options?.headers,
    });
  }
}
