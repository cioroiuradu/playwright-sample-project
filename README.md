# Playwright Sample Project

A test automation sample project built with [Playwright](https://playwright.dev/) demonstrating the **Page Object Model** pattern, **API services**, and **tagged test suites**.

## Tech Stack

- **Playwright** — browser & API test automation
- **TypeScript** — type-safe test code
- **demoqa.com** — UI test target (login, book store, elements)
- **jsonplaceholder.typicode.com** — REST API test target

## Project Structure

```
├── .github/workflows/
│   ├── regression.yml          # Runs @regression on PRs → publishes report to S3
│   └── deployment-smoke.yml    # Runs @smoke on deploy → Slack notifications + S3 report
├── scripts/
│   └── loadSecrets.sh          # Populate .env from AWS Secrets Manager
├── playwright.config.ts        # Playwright configuration
├── src/
│   ├── pages/                  # Page Object Model classes
│   │   ├── BasePage.ts         # Shared page utilities
│   │   ├── LoginPage.ts        # Login page selectors & actions
│   │   ├── BookStorePage.ts    # Book Store page selectors & actions
│   │   └── ElementsPage.ts    # Elements page (text box, checkbox, radio)
│   ├── utils.ts                # Shared helpers (delay)
│   ├── services/               # Service layer
│   │   ├── ApiClient.ts        # Generic HTTP client wrapper
│   │   ├── AuthService.ts      # DemoQA auth API (alternative to UI login)
│   │   └── MailService.ts      # Email service (nodemailer / Ethereal)
│   ├── fixtures/
│   │   └── test-fixtures.ts    # Custom Playwright fixtures with POM
│   └── data/
│       └── test-data.ts        # Test data constants
├── tests/
│   ├── ui/                     # UI / E2E spec files
│   │   ├── login.spec.ts
│   │   ├── bookstore.spec.ts
│   │   └── elements.spec.ts
│   └── api/                    # REST API spec files
│       ├── users.api.spec.ts
│       ├── auth.api.spec.ts
│       └── mail.spec.ts
```

## Getting Started

```bash
# Install dependencies
npm install

# Install Playwright browsers
npx playwright install
```

## Environment Variables

The project uses a `.env` file for secrets and configuration. Copy the example and fill in your values:

```bash
cp .env.example .env
```

| Variable | Description | Default |
|---|---|---|
| `BASE_URL` | UI test base URL | `https://demoqa.com` |
| `API_BASE_URL` | API test base URL | `https://jsonplaceholder.typicode.com` |
| `DEMOQA_USERNAME` | DemoQA login username | `testuser2024` |
| `DEMOQA_PASSWORD` | DemoQA login password | `Test@12345` |

### Loading secrets from AWS Secrets Manager

If your secrets are stored in AWS Secrets Manager, run the provided script to populate `.env` automatically:

```bash
./scripts/loadSecrets.sh
```

Override the defaults via environment variables:

```bash
AWS_SECRET_ID=my/secret AWS_PROFILE=dev AWS_REGION=us-east-1 ./scripts/loadSecrets.sh
```

| Variable | Description | Default |
|---|---|---|
| `AWS_SECRET_ID` | Secrets Manager secret ID | `your-secret-id` |
| `AWS_PROFILE` | AWS CLI profile name | `your-aws-profile` |
| `AWS_REGION` | AWS region | `eu-central-1` |

> **Note:** `.env` is git-ignored. Only `.env.example` (with placeholder values) is committed.

## Running Tests

```bash
# Run all tests
npm test

# Run only UI tests
npm run test:ui

# Run only API tests
npm run test:api

# Run smoke tests
npm run test:smoke

# Run regression tests
npm run test:regression

# Run in headed mode (see the browser)
npm run test:headed

# Debug tests
npm run test:debug

# Open HTML report
npm run report
```

## Test Tags

Tests use Playwright's built-in [tag annotation](https://playwright.dev/docs/test-annotations#tag-tests) via `{ tag: ['@smoke'] }`:

- **@smoke** — quick sanity checks for critical flows
- **@regression** — broader coverage including edge cases

### Running by Tag

```bash
# Run only smoke tests
npx playwright test --grep @smoke

# Run only regression tests
npx playwright test --grep @regression

# Run tests that are both smoke AND regression
npx playwright test --grep "(?=.*@smoke)(?=.*@regression)"

# Run everything EXCEPT smoke
npx playwright test --grep-invert @smoke

# Combine with a specific project
npx playwright test --project=api --grep @smoke
npx playwright test --project=chromium --grep @regression
```

Or use the npm scripts:

```bash
npm run test:smoke
npm run test:regression
```

## Selector Strategies

The project showcases various Playwright selector strategies:

| Strategy | Example |
|---|---|
| CSS ID | `page.locator('#userName')` |
| CSS Class | `page.locator('.main-header')` |
| Attribute | `page.locator('label[for="yesRadio"]')` |
| Role | `page.getByRole('button', { name: 'Login' })` |
| Placeholder | `page.getByPlaceholder('Type to search')` |
| Text | `page.getByText('Text Box')` |
| Chained | `page.locator('.rt-tbody .action-buttons a')` |
| nth / first | `.locator('.rct-checkbox').first()` |
| filter | `.filter({ has: page.locator('.action-buttons a') })` |

## Service Layer

### AuthService

Authenticates via the DemoQA API instead of the UI — useful for skipping the login UI, generating auth tokens, or faster test setup.

### MailService

Email service built on nodemailer. Defaults to **Ethereal Email** — a free disposable SMTP provider that captures emails without actually delivering them. Each sent message gets a preview URL you can open in a browser.

```typescript
const mail = await MailService.createEthereal();
const result = await mail.sendMail({
  from: mail.senderAddress,
  to: 'recipient@example.com',
  subject: 'Hello',
  text: 'Test email body',
});
console.log(result.previewUrl); // opens in browser to view the email
mail.close();
```

To use your own SMTP server, set `SMTP_HOST` / `SMTP_PORT` / `SMTP_USER` / `SMTP_PASS` in `.env` and call `MailService.create()` instead.

> Services are **placeholders** — adapt them to your project's needs.

## CI/CD Workflows

### Regression on PRs — `regression.yml`

Triggers on every pull request to `main`.

| Step | Details |
|---|---|
| **Tests** | Runs `@regression` tagged tests on Chromium + API projects |
| **Report** | Uploads Playwright HTML report as a GitHub artifact |
| **S3 publish** | On failure, uploads the report to S3 and adds a link to the job summary |

Required repo vars: `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_IAM_ROLE`

### Deployment Smoke — `deployment-smoke.yml`

Triggers via `repository_dispatch` when a deployment completes.

| Step | Details |
|---|---|
| **Trigger** | `repository_dispatch` with a payload containing `clustername`, `appname`, `author`, `initiator` |
| **Tests** | Always runs the `@smoke` suite (Chromium + API) |
| **Slack** | Posts a message when tests start, updates it on finish, and replies with run details (duration, status, link) |
| **S3 publish** | Uploads the report to S3 and posts the link in the Slack thread |
| **Concurrency** | Grouped by environment — only one run per cluster at a time |

Required repo vars: `AWS_REGION`, `AWS_S3_BUCKET`, `AWS_IAM_ROLE`, `SLACK_CHANNEL`
Required secrets: `SLACK_BOT_TOKEN`

#### Triggering a deployment smoke run

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{
    "event_type": "deployment",
    "client_payload": {
      "clustername": "stage",
      "appname": "my-service",
      "author": "Jane Doe",
      "initiator": "janedoe",
      "initiatorIsAutoSync": "false"
    }
  }'
```
