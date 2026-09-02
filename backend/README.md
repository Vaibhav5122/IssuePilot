# IssuePilot — Backend API

Backend REST API for **IssuePilot**, a project management and issue tracking system. Built with Node.js, Express 5, TypeScript, MongoDB, and Zod.

---

## 🛠 Tech Stack

- **Runtime & Language**: [Node.js](https://nodejs.org/) (>= 20), [TypeScript](https://www.typescriptlang.org/)
- **Framework**: [Express 5](https://expressjs.com/)
- **Database & ODM**: [MongoDB](https://www.mongodb.com/) via [Mongoose](https://mongoosejs.com/)
- **Validation**: [Zod 4](https://zod.dev/)
- **Authentication**: JSON Web Tokens ([jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)), [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **Execution & Development**: [tsx](https://github.com/privatenumber/tsx) (TypeScript execute & watch), [pnpm](https://pnpm.io/)

---

## 📁 Architecture & Directory Structure

```
backend/
├── src/
│   ├── app/
│   │   ├── app.ts                     # Express application setup, routes & middleware registration
│   │   ├── configs/
│   │   │   └── db.config.ts           # Mongoose MongoDB connection
│   │   ├── controllers/
│   │   │   ├── comment.controller.ts   # Issue comments controller
│   │   │   ├── issue.controller.ts     # Issues & activity controller
│   │   │   ├── project.controller.ts   # Workspace projects controller
│   │   │   ├── user.controller.ts      # Authentication & user profile controller
│   │   │   └── workspace.controller.ts # Workspaces & members controller
│   │   ├── middlewares/
│   │   │   ├── auth.middleware.ts      # JWT extraction & authentication checks
│   │   │   ├── issue.middleware.ts     # Issue existence & workspace verification
│   │   │   ├── project.middleware.ts   # Project existence verification
│   │   │   ├── validate.middleware.ts  # Zod schema request body validator
│   │   │   └── workspace.middleware.ts # Workspace membership & admin role verification
│   │   ├── models/
│   │   │   ├── comment.model.ts        # Issue comment schema
│   │   │   ├── issue.model.ts          # Issue schema (status, priority, type, assignee)
│   │   │   ├── issueActivity.model.ts  # Audit log for issue changes
│   │   │   ├── project.model.ts        # Project schema (key, name, workspace)
│   │   │   ├── user.model.ts           # User accounts & hashed credentials
│   │   │   ├── workspace-member.model.ts # Workspace membership with roles (ADMIN/MEMBER)
│   │   │   └── workspace.model.ts      # Workspace schema
│   │   ├── routes/
│   │   │   ├── comment.route.ts        # Routes for issue comments
│   │   │   ├── issue.route.ts          # Routes for issues & activity
│   │   │   ├── project.route.ts        # Routes for workspace projects
│   │   │   ├── user.route.ts           # Routes for auth (register, login, me)
│   │   │   └── workspace.route.ts      # Routes for workspaces & members
│   │   ├── utils/
│   │   │   ├── envSanitizations.ts     # Environment variable validation
│   │   │   └── jwtToken.ts             # JWT token sign & verify
│   │   └── validations/
│   │       ├── comment.validation.ts   # Zod validations for comments
│   │       ├── issue.validation.ts     # Zod validations for issues
│   │       ├── project.validation.ts   # Zod validations for projects
│   │       ├── user.validation.ts      # Zod validations for registration & login
│   │       └── workspace.validation.ts # Zod validations for workspaces & members
│   ├── common/
│   │   └── utils/
│   │       ├── ApiError.ts             # Custom operational error class
│   │       ├── ApiResponse.ts          # Standardized JSON response envelope
│   │       └── GlobalErrorHandler.ts   # Express centralized error handler
│   ├── index.ts                        # Server entrypoint
│   └── types/                          # Global Express request declarations
├── tsconfig.json
└── package.json
```

---

## ⚙️ Environment Variables

Create a `.env` file in `backend/` with the following variables:

```env
PORT=8000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.example.mongodb.net/IssuePilot
JWT_SECRET=your_super_secret_jwt_key
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `PORT` | Port number the HTTP server listens on | `8000` |
| `MONGO_URI` | MongoDB connection string (local or MongoDB Atlas) | Required |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens | Required |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd backend
pnpm install
```

### 2. Run Development Server
```bash
pnpm run dev
```
Starts the server with `tsx watch` for auto-reloading on file changes.

### 3. Run in Production
```bash
pnpm run start
```

---

## 🚢 Production Deployment Guide

Deploying to platforms like **Render**, **Railway**, or **Fly.io**:

### Step 1: MongoDB Atlas Preparation
1. Ensure your MongoDB Atlas cluster allows connections from cloud providers:
   - Go to **Network Access** in MongoDB Atlas.
   - Click **Add IP Address** -> Select **Allow Access From Anywhere** (`0.0.0.0/0`).
2. Get your connection string (e.g. `mongodb+srv://user:pass@cluster0.mongodb.net/IssuePilot`).

### Step 2: Configure Service in Hosting Dashboard (e.g. Render / Railway)
- **Root Directory**: `backend`
- **Environment**: Node.js (>= 20)
- **Build Command**: `pnpm install` (or `npm install`)
- **Start Command**: `pnpm run start` (or `npm start`)
- **Health Check Path**: `/health`

### Step 3: Set Production Environment Variables
| Key | Value | Notes |
| :--- | :--- | :--- |
| `MONGO_URI` | `mongodb+srv://...` | MongoDB connection URI |
| `JWT_SECRET` | `your_secret_production_key` | Secret string for signing JWT tokens |
| `PORT` | `8000` | Typically injected automatically by the host |
| `NODE_ENV` | `production` | Enables production optimizations |

### Step 4: Verify Deployment
Once deployed, verify:
- `GET https://your-backend-app.com/` returns `{ "success": true, "message": "IssuePilot API is running" }`
- `GET https://your-backend-app.com/health` returns `{ "success": true, "message": "IssuePilot API is healthy" }`

---

## 🔒 Security & Middlewares

1. **Authentication (`restrictUserMiddleware`)**:
   - Reads `Authorization: Bearer <token>` header.
   - Decodes token and sets `req.user = { id: ... }`.
2. **Workspace Membership (`requireWorkspaceMember`)**:
   - Ensures `:workspaceId` exists and the authenticated user is an enrolled member.
   - Sets `res.locals.workspace` and `res.locals.membership`.
3. **Workspace Admin Access (`requireWorkspaceAdmin`)**:
   - Ensures the user holds the `ADMIN` role in the active workspace before performing restricted actions (e.g. changing roles, adding members, deleting workspace resources).
4. **Member ID Guard (`requireMemberId`)**:
   - Validates that the targeted `:memberId` (User Mongo ID) is an enrolled member in the workspace.
5. **Request Validation (`validateBody`)**:
   - Executes Zod schema parsing on incoming request bodies.
   - Rejects invalid payloads with 400 and structured error feedback.

---

## 📡 API Endpoints

All endpoints are mounted under `/api/v1`. Protected endpoints require header:
`Authorization: Bearer <jwt_token>`

### 1. Authentication (`/api/v1/auth`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/auth/register` | Public | Register new user account (`name`, `email`, `password`) |
| `POST` | `/auth/login` | Public | Authenticate user & receive JWT token |
| `GET` | `/auth/me` | Protected | Fetch profile (`name`, `email`) of current user |

### 2. Workspaces (`/api/v1/workspaces`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/workspaces/create` | Protected | Create a new workspace (creator gets `ADMIN` role) |
| `GET` | `/workspaces` | Protected | Get all workspaces the authenticated user belongs to |
| `GET` | `/workspaces/:workspaceId` | Member | Get details of a single workspace |
| `GET` | `/workspaces/:workspaceId/members` | Member | List all members in the workspace |
| `POST` | `/workspaces/:workspaceId/members` | Admin | Invite/add a member by email (`email`, `role`) |
| `PATCH` | `/workspaces/:workspaceId/members/:memberId` | Admin | Update member role (`role`: `"ADMIN"` \| `"MEMBER"`) |
| `DELETE` | `/workspaces/:workspaceId/members/:memberId` | Admin | Remove member from workspace |

### 3. Projects (`/api/v1/workspaces/:workspaceId/projects`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/projects/create` | Member | Create a new project (`name`, `key`) in workspace |
| `GET` | `/projects` | Member | Get all projects in the workspace |
| `GET` | `/projects/:projectId` | Member | Get details of a single project |
| `DELETE` | `/projects/:projectId` | Admin | Delete a project and its associated issues |

### 4. Issues (`/api/v1/workspaces/:workspaceId/projects/:projectId/issues`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/issues/create` | Member | Create an issue (`title`, `description`, `priority`, `type`) |
| `GET` | `/issues` | Member | List issues (supports filter queries: `status`, `priority`, `type`, `search`) |
| `GET` | `/issues/:issueId` | Member | Get details of a single issue |
| `PATCH` | `/issues/:issueId` | Member | Update issue status (`TODO`, `IN_PROGRESS`, `IN_REVIEW`, `DONE`), priority, assignee |
| `DELETE` | `/issues/:issueId` | Member | Delete an issue |
| `GET` | `/issues/:issueId/activity` | Member | Get chronological activity log for an issue |

### 5. Comments (`/api/v1/workspaces/:workspaceId/projects/:projectId/issues/:issueId/comments`)

| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/comments/create` | Member | Add a comment to an issue (`content`) |
| `GET` | `/comments` | Member | List all comments on an issue |
| `DELETE` | `/comments/:commentId` | Member | Delete a comment (author or admin) |

---

## 📦 Standard API Response Envelope

Successful responses:
```json
{
  "success": true,
  "message": "Workspace created successfully",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Workspace name should be atleast 2 character long",
  "data": null
}
```
