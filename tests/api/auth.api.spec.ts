import { test, expect } from '@playwright/test';
import { ApiClient } from '../../src/services/ApiClient';
import { apiTestData, baseUrls } from '../../src/data/test-data';

let api: ApiClient;

test.beforeEach(async ({ request }) => {
  api = new ApiClient(request, baseUrls.api);
});

test.describe('Posts API', () => {
  test('GET list of posts', { tag: ['@smoke'] }, async () => {
    const response = await api.get('/posts');
    expect(response.status(), 'GET /posts should return 200').toBe(200);

    const body = await response.json();
    expect(body.length, 'Response should contain 100 posts').toBe(100);
    expect(body[0], 'Each post should have a title property').toHaveProperty('title');
    expect(body[0], 'Each post should have a body property').toHaveProperty('body');
  });

  test('GET single post', { tag: ['@smoke'] }, async () => {
    const response = await api.get('/posts/1');
    expect(response.status(), 'GET /posts/1 should return 200').toBe(200);

    const body = await response.json();
    expect(body.id, 'Post ID should be 1').toBe(1);
    expect(body.userId, 'Post should belong to userId 1').toBe(1);
    expect(body.title, 'Post title should be present').toBeTruthy();
  });

  test('GET posts filtered by userId', { tag: ['@regression'] }, async () => {
    const response = await api.get('/posts?userId=1');
    expect(response.status(), 'Filtered GET should return 200').toBe(200);

    const body = await response.json();
    expect(body.length, 'Filtered results should return at least one post').toBeGreaterThan(0);
    for (const post of body) {
      expect(post.userId, 'Every returned post should belong to userId 1').toBe(1);
    }
  });

  test('POST create new post', { tag: ['@regression'] }, async () => {
    const response = await api.post('/posts', apiTestData.newPost);
    expect(response.status(), 'POST /posts should return 201 Created').toBe(201);

    const body = await response.json();
    expect(body.title, 'Created post title should match request').toBe(apiTestData.newPost.title);
    expect(body.body, 'Created post body should match request').toBe(apiTestData.newPost.body);
    expect(body.userId, 'Created post userId should match request').toBe(apiTestData.newPost.userId);
    expect(body.id, 'Response should include a generated ID').toBeTruthy();
  });

  test('PUT update existing post', { tag: ['@regression'] }, async () => {
    const response = await api.put('/posts/1', apiTestData.updatedPost);
    expect(response.status(), 'PUT /posts/1 should return 200').toBe(200);

    const body = await response.json();
    expect(body.title, 'Updated post title should match request').toBe(apiTestData.updatedPost.title);
    expect(body.body, 'Updated post body should match request').toBe(apiTestData.updatedPost.body);
  });

  test('PATCH partial update post', { tag: ['@regression'] }, async () => {
    const response = await api.patch('/posts/1', { title: 'Patched Title' });
    expect(response.status(), 'PATCH /posts/1 should return 200').toBe(200);

    const body = await response.json();
    expect(body.title, 'Patched post title should be "Patched Title"').toBe('Patched Title');
  });

  test('DELETE post', { tag: ['@regression'] }, async () => {
    const response = await api.delete('/posts/1');
    expect(response.status(), 'DELETE /posts/1 should return 200').toBe(200);
  });

  test('GET comments for a post (nested resource)', { tag: ['@regression'] }, async () => {
    const response = await api.get('/posts/1/comments');
    expect(response.status(), 'GET /posts/1/comments should return 200').toBe(200);

    const body = await response.json();
    expect(body.length, 'Post should have at least one comment').toBeGreaterThan(0);
    expect(body[0], 'Each comment should have an email property').toHaveProperty('email');
    expect(body[0], 'Each comment should have a body property').toHaveProperty('body');
    expect(body[0].postId, 'Each comment should reference postId 1').toBe(1);
  });
});
