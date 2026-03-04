export const credentials = {
  valid: {
    username: process.env.DEMOQA_USERNAME ?? 'testuser2024',
    password: process.env.DEMOQA_PASSWORD ?? 'Test@12345',
  },
  invalid: {
    username: 'invaliduser',
    password: 'wrongpassword',
  },
};

export const baseUrls = {
  ui: process.env.BASE_URL ?? 'https://demoqa.com',
  api: process.env.API_BASE_URL ?? 'https://jsonplaceholder.typicode.com',
};

export const textBoxData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  currentAddress: '123 Main St, Springfield',
  permanentAddress: '456 Oak Ave, Shelbyville',
};

export const apiTestData = {
  newPost: {
    title: 'Sample Post Title',
    body: 'This is a sample post body for testing.',
    userId: 1,
  },
  updatedPost: {
    title: 'Updated Post Title',
    body: 'This post body has been updated.',
    userId: 1,
  },
  newUser: {
    name: 'Jane Smith',
    username: 'janesmith',
    email: 'jane.smith@example.com',
  },
};
