This document describes how to build and run the application as well as how to maintain it.

The application is under development and this document may get obsolete. For a known working build description, see the description of the continuous integration (CI) at `.github/workflows/ci.yml`.

### Build and run locally

Install Node.js version 10, by either downloading it from the official website: https://nodejs.org/en/download/, or by using [nvm](https://github.com/nvm-sh/nvm). We don't recommend using Node.js from the package manager of your operating system, and neither from conda or other sources. The `npm` command should be included with the distribution.

Run the following commands:

```bash
# Prepare environment by creating `.env` file and filling values in it according to example in `.env.example`.
# In simple case, you can just use the example file itself:
cp .env.example .env

# Install required npm packages
npm install

# Cleanup existing outputs
npm run clean

# Build the app
npm run build

# Serve the app using local static file server
npm run start
```

The last command will start server on `http://localhost:8000` by default.

The directory `public/` contains build results and is ready to be deployed to any static file hosting as a web root.
