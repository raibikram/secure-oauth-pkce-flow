
# Secure Google OAuth 2.0 API with PKCE, OpenID Connect, and CSRF Protection (Node.js + MongoDB)"

A robust, production-ready Node.js API featuring Google OAuth 2.0 authentication, secure JWT handling, and MongoDB integration. 

## Features

- **Google OAuth 2.0**: Secure OpenID Connect flow via Arctic.
- **Token Management**: Short-lived Access Tokens (JWT) and long-lived Refresh Tokens stored in HttpOnly, secure cookies.
- **Unified User Model**: Mongoose schema handling both OAuth and local users in a single collection.
- **TypeScript**: Strictly typed environment.

## Tech Stack

- Node.js (Express.js)
- MongoDB (Mongoose)
- Google OAuth 2.0 (Arctic) + JWT
- TypeScript


## Why this stack?

- **Arctic over Passport.js**: Arctic provides a modern, lightweight, and framework-agnostic approach to OAuth 2.0 without the heavy abstractions and global state mutation that Passport.js relies on.
- **HttpOnly Cookies over LocalStorage**: Storing tokens in cookies mitigates Cross-Site Scripting (XSS) attacks, while proper `SameSite` configurations prevent Cross-Site Request Forgery (CSRF).
- **Unified Mongoose Model**: Combining OAuth and local users into a single model allows for seamless account linking (e.g., logging in with Google on an existing email/password account) without complex relational table structures.

## Security Concepts Used

### PKCE (Proof Key for Code Exchange)
PKCE is an OAuth 2.0 extension that protects public clients (like SPAs and mobile apps) from authorization code interception attacks. It works by generating a one-time code verifier and code challenge for each login attempt, ensuring that only the app that initiated the login can complete the flow. This is especially important for browser-based and mobile applications where client secrets cannot be securely stored.

### OpenID Connect (OIDC)
OpenID Connect is an identity layer on top of OAuth 2.0. It allows applications to verify the identity of users and obtain basic profile information in a secure and standardized way. By requesting the `openid` scope, the app ensures it receives an ID token and can trust the user's identity as verified by Google.

### CSRF Protection
Cross-Site Request Forgery (CSRF) is a type of attack where unauthorized commands are transmitted from a user that the web application trusts. In the OAuth flow, a random `state` parameter is generated and stored in a secure cookie before redirecting to Google. When Google redirects back, the app verifies that the returned `state` matches the stored value, ensuring the request was not tampered with or initiated by a malicious site.

## Setup and Installation

### 1. Prerequisites
- Node.js (v18+)
- pnpm
- MongoDB instance
- Google Cloud Console OAuth credentials

### 2. Clone and Install
```bash
git clone <your-repo-url>
cd server
pnpm install
```

### 3. Environment Variables
Copy the provided `.env.example` file to `.env` and fill in your credentials:
```bash
cp .env.example .env
```

### 4. Running the App

**Development Mode:**
```bash
pnpm run dev
```

**Production Build:**
```bash
pnpm run build
pnpm start
```

## API Endpoints

### Auth `(/api/auth)`
- `GET /google` - Initiates Google OAuth sequence.
- `GET /google/callback` - Callback URL for Google OAuth to exchange code for session.
- `GET /me` - Returns currently authenticated user profile.
- `POST /refresh` - Refreshes JWT access token using refresh cookie.
- `POST /logout` - Clears authentication cookies.
