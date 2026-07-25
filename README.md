<div align="center">

# 💰 SplitLog

**Split shared expenses with friends, roommates, and groups — without the spreadsheet.**

SplitLog tracks who paid for what, calculates who owes whom, and simplifies group debts down to the fewest possible payments.

[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)](https://react.dev)
[![Vite](https://img.shields.io/badge/Vite-Frontend-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Backend-339933?logo=node.js&logoColor=white)](https://nodejs.org)
[![Express](https://img.shields.io/badge/Express-API-000000?logo=express&logoColor=white)](https://expressjs.com)
[![MongoDB](https://img.shields.io/badge/MongoDB-Database-47A248?logo=mongodb&logoColor=white)](https://www.mongodb.com)
[![JWT](https://img.shields.io/badge/Auth-JWT-black?logo=jsonwebtokens)](https://jwt.io)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
  - [Running the App](#running-the-app)
- [API Reference](#api-reference)
- [Data Models](#data-models)
- [How Settlement Simplification Works](#how-settlement-simplification-works)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

---

## Overview

SplitLog is a full-stack expense-splitting application in the spirit of Splitwise. Users create or join groups via a shareable invite code, log shared expenses, and SplitLog automatically works out each member's balance. Instead of everyone paying everyone back individually, a debt-simplification engine collapses all of a group's debts into the minimum number of payments needed to settle up.

## Features

- 💎 **Premium UI/UX** — responsive, custom-built design system with glassmorphism, dynamic avatar stacks, dark/light modes, and micro-animations
- 🔐 **Secure authentication** — email/password signup and login, passwords hashed with bcrypt, sessions handled via httpOnly JWT cookies
- 👥 **Groups with invite codes** — create a group and invite others with a short, shareable code
- 🧾 **Expense tracking** — log an expense and split it across any subset of group members
- ⚖️ **Automatic balance calculation** — per-group and account-wide summaries of what you're owed vs. what you owe
- 🤝 **Debt simplification** — a greedy creditor/debtor matching algorithm reduces a group's debts to the fewest possible transactions
- ✅ **Settle up** — mark a debt as paid and it's recorded to settlement history
- 📜 **Settlement history** — a full log of past settlements across all your groups
- 🧭 **Protected, data-loader–driven routing** — pages fetch their data before rendering via React Router loaders

## Tech Stack

**Frontend**
- [React](https://react.dev) (via [Vite](https://vitejs.dev))
- [React Router](https://reactrouter.com) v6 — data routers, loaders, protected routes
- [Axios](https://axios-http.com) — cookie-based (`withCredentials`) API calls
- Hand-rolled CSS design system (custom properties, light/dark theming — no UI framework)

**Backend**
- [Node.js](https://nodejs.org) + [Express](https://expressjs.com)
- [MongoDB](https://www.mongodb.com) + [Mongoose](https://mongoosejs.com)
- [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken) — JWT auth via httpOnly cookies
- [bcrypt](https://www.npmjs.com/package/bcrypt) — password hashing
- [Zod](https://zod.dev) — request validation
- `cookie-parser`, `cors`, `dotenv`

## Project Structure

```
src/
├── App.jsx                  # Root component, router setup, protected layout & nav
├── index.css                 # Global design system (colors, typography, components)
├── App.css                   # App-level style overrides
├── server.js                  # Express app entry point
│
├── pages/                    # Route-level React components
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── DashBoard.jsx
│   ├── CreateGroups.jsx
│   ├── JoinGroup.jsx
│   ├── ViewGroup.jsx
│   ├── AddExpense.jsx
│   ├── PastSettlement.jsx
│   └── ErrorPage.jsx
│
├── loaders/                  # React Router data loaders (fetch-before-render)
│   ├── dashBoardLoader.jsx
│   ├── fetchParticipant.jsx
│   ├── indiviualGroupLoader.jsx
│   └── pastSettlementLoader.jsx
│
├── routes/                   # Express routers
│   ├── authRoutes.js
│   ├── groupRoutes.js
│   └── expenseRoutes.js
│
├── controllers/               # Express route handlers
│   ├── authController.js
│   ├── groupController.js
│   ├── expenseController.js
│   └── settlementController.js
│
├── models/                    # Mongoose schemas + Zod validation
│   ├── User.js
│   ├── Group.js
│   ├── Expense.js
│   ├── SettlementDetails.js
│   └── Validation.js
│
├── middleware/
│   ├── authMiddleware.js       # JWT issuance & verification
│   └── groupIdCheck.js         # Validates :groupId route params
│
├── config/
│   ├── db.js                   # MongoDB connection
│   ├── verification.js         # Session check endpoint logic
│   └── balanceCalc.js          # Core balance-calculation engine
│
└── assets/
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (LTS recommended)
- npm
- A MongoDB instance — local, or a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster

### Installation

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
npm install
```

### Environment Variables

Create a `.env` file at the project root with the following:

```bash
# Server
PORT=3000
CORS_ALLOWED_SITE=http://localhost:5173

# Database
MONGO_URI=your_mongodb_connection_string

# Auth
JWT_SECRET_KEY=your_long_random_secret
```

The frontend needs its own `.env` (or `.env.local`) pointing at the API:

```bash
VITE_BACKEND_URL=http://localhost:3000
```

> Cookies are set with `secure: true` and `sameSite: "none"`, which requires HTTPS in production. For local development over plain `http://localhost`, you may need to relax these flags in `middleware/authMiddleware.js`.

### Running the App

```bash
# Start the API server
node src/server.js

# In a separate terminal, start the frontend
npm run dev
```

> Exact script names depend on your `package.json` — adjust if you've defined custom `dev`/`start` scripts (e.g. with `nodemon` for the backend).

## API Reference

All protected routes require a valid `token` httpOnly cookie, issued on signup/login.

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET`  | `/api/verify` | Public | Checks whether the current session cookie is valid |
| `POST` | `/api/auth/signup` | Public | Register a new user |
| `POST` | `/api/auth/login` | Public | Log in; sets the JWT auth cookie |
| `GET`  | `/api/home` | Protected | Authenticated landing endpoint |
| `POST` | `/api/groups/create` | Protected | Create a new group |
| `GET`  | `/api/groups/my-groups` | Protected | List groups the user belongs to |
| `GET`  | `/api/groups/show/:groupId` | Protected | Get group details (members, invite code, creator) |
| `GET`  | `/api/groups/join/:inviteCode` | Protected | Join a group using its invite code |
| `GET`  | `/api/summary` | Protected | Aggregate balance summary across all of the user's groups |
| `GET`  | `/api/past_settlements` | Protected | The user's full settlement history |
| `POST` | `/api/:groupId/expenses` | Protected, group member | Add an expense to a group |
| `GET`  | `/api/:groupId/expenses` | Protected, group member | List a group's expenses |
| `GET`  | `/api/:groupId/balances` | Protected, group member | The logged-in user's balance within that group |
| `GET`  | `/api/:groupId/settlements` | Protected, group member | Simplified settlement suggestions for the group |
| `POST` | `/api/:groupId/settlements` | Protected, group member | Record a settlement ("mark as paid") |

## Data Models

| Model | Key Fields |
|---|---|
| **User** | `firstName`, `lastName`, `email` (unique), `password` (hashed) |
| **Groups** | `groupName`, `createdBy` (ref User), `members` (ref User[]), `inviteCode` (unique) |
| **Expense** | `description`, `amount`, `paidBy` (ref User), `splitAmong` (ref User[]), `groupId` (ref Groups) |
| **SettlementData** | `groupId`, `from` (ref User), `to` (ref User), `amount`, `status`, `settledAt` |

## How Settlement Simplification Works

Instead of naively settling every pairwise debt, SplitLog:

1. Calculates each member's net balance in a group (total paid − their share of total spend, adjusted for past settlements).
2. Splits members into **creditors** (net positive) and **debtors** (net negative).
3. Greedily matches the largest debtor against the largest creditor, repeating until every balance is zero.

This produces the minimum number of transactions needed to settle the whole group — instead of everyone paying everyone.

## Screenshots

*(Add screenshots of your application here, e.g., the dashboard, group details, and expense forms)*

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m "Add your feature"`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

No license has been set for this project yet. If you'd like it to be open source, consider adding a [LICENSE](https://choosealicense.com/) file (MIT is a common, permissive default).

---

<div align="center">

Built with ❤️ to make splitting the bill less painful.

</div>
