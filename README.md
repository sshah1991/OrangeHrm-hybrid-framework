# OrangeHRM Playwright Hybrid Framework

> A maintainable Playwright + TypeScript test automation framework for the
> OrangeHRM demo application. Includes API helpers, page objects and test suites
> for authentication and administration flows.

---

## Quick Start

Prerequisites:

- Node.js (LTS recommended)
- npm (bundled with Node.js)

Clone the repo and install dependencies:

```bash
git clone <repo-url>
cd OrangeHrm-hybrid-framework
npm install
```

Install Playwright browsers (required once):

```bash
npx playwright install
```

Create a local environment file `.env` at the project root with the following
variables (do not commit secrets):

```
BASE_URL=https://opensource-demo.orangehrmlive.com
Valid_AdminUserName=Admin
Valid_AdminPassword=admin123
InValid_AdminUserName=invalidUser
InValid_AdminPassword=invalidPass
```

The repository already ignores `.env` in `.gitignore`.

## Running Tests

Run the full test suite:

```bash
npx playwright test
```

Run in headed mode:

```bash
npm run test:headed
```

Run the Playwright UI runner:

```bash
npm run test:ui
```

Run a single spec file:

```bash
npx playwright test tests/auth/Auth.spec.ts
```

Run with debugging:

```bash
npm run test:debug
```

## Reports

- Allure results are written to `allure-results/` by the test reporter.
- Playwright artifacts (screenshots, videos) are in `test-results/`.

To generate and open the Allure report (requires `allure` installed):

```bash
npm run allure:report
```

## Configuration

- Test runner settings are in `playwright.config.ts`.
- `baseURL` is sourced from `process.env.BASE_URL` so `page.goto('/')` resolves
  relative to the configured value.
- CI pipeline is defined in `.github/workflows/playwright.yml` and expects the
  required secrets (see the workflow for variable names).

## Project Structure (high level)

- `src/pages/` - Page Objects
- `src/api/` - API controllers and models used for setup/teardown
- `tests/` - Playwright test suites (grouped by feature)
- `playwright.config.ts` - Playwright configuration

## Troubleshooting

- If `page.goto('/')` errors with "Cannot navigate to invalid URL", ensure
  `BASE_URL` is set in your `.env` or environment when running tests.
- If Playwright cannot find `@playwright/test`, run `npm install` and
  `npx playwright install`.

## Contributing

Feel free to open issues or pull requests. Keep tests small, deterministic and
independent. Add fixtures or helpers in `src/` when sharing functionality
between tests.

## License

This project does not include a license file. Add a `LICENSE` if you intend to
open-source it.

---

If you want, I can also add a `.env.example` with these variables (recommended).
