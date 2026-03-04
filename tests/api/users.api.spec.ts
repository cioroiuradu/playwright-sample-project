import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/services/ApiClient';
import { apiTestData, baseUrls } from '../../src/data/test-data';

let api: ApiClient;
let lastResponseStatus: number;

test.beforeEach(async ({ request }) => {
  api = new ApiClient(request, baseUrls.api);
});

test.afterEach(async ({}, testInfo) => {
  console.log(`[${testInfo.title}] finished with status ${lastResponseStatus}`);
});

test.describe('Users API', () => {
  test('GET list of users', { tag: ['@smoke'] }, async () => {
    const response = await api.get('/users');
    lastResponseStatus = response.status();
    expect(response.status(), 'GET /users should return 200').toBe(200);

    const body = await response.json();
    expect(body.length, 'Response should contain 10 users').toBe(10);
    expect(body[0], 'Each user should have a name property').toHaveProperty('name');
    expect(body[0], 'Each user should have an email property').toHaveProperty('email');
  });

  test('GET single user by ID', { tag: ['@smoke'] }, async () => {
    const response = await api.get('/users/1');
    lastResponseStatus = response.status();
    expect(response.status(), 'GET /users/1 should return 200').toBe(200);

    const body = await response.json();
    expect(body.id, 'User ID should be 1').toBe(1);
    expect(body.name, 'User name should be Leanne Graham').toBe('Leanne Graham');
    expect(body.email, 'User email should be present').toBeTruthy();
  });

  test('GET user not found returns 404', { tag: ['@regression'] }, async () => {
    const response = await api.get('/users/999');
    lastResponseStatus = response.status();
    expect(response.status(), 'Non-existent user should return 404').toBe(404);
  });

  test('POST create user', { tag: ['@regression'] }, async () => {
    const response = await api.post('/users', apiTestData.newUser);
    lastResponseStatus = response.status();
    expect(response.status(), 'POST /users should return 201 Created').toBe(201);

    const body = await response.json();
    expect(body.name, 'Created user name should match request').toBe(apiTestData.newUser.name);
    expect(body.email, 'Created user email should match request').toBe(apiTestData.newUser.email);
    expect(body.id, 'Response should include a generated ID').toBeTruthy();
  });

  test('PUT update user', { tag: ['@regression'] }, async () => {
    const response = await api.put('/users/1', apiTestData.newUser);
    lastResponseStatus = response.status();
    expect(response.status(), 'PUT /users/1 should return 200').toBe(200);

    const body = await response.json();
    expect(body.name, 'Updated user name should match request').toBe(apiTestData.newUser.name);
  });

  test('PATCH partial update user', { tag: ['@regression'] }, async () => {
    const response = await api.patch('/users/1', { name: 'Updated Name' });
    lastResponseStatus = response.status();
    expect(response.status(), 'PATCH /users/1 should return 200').toBe(200);

    const body = await response.json();
    expect(body.name, 'Patched user name should be "Updated Name"').toBe('Updated Name');
  });

  test('DELETE user', { tag: ['@regression'] }, async () => {
    const response = await api.delete('/users/1');
    lastResponseStatus = response.status();
    expect(response.status(), 'DELETE /users/1 should return 200').toBe(200);
  });
});
