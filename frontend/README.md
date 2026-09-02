# IssuePilot — Frontend Web Application

Frontend user interface for **IssuePilot**, a modern project management, issue tracking, and team collaboration dashboard. Built with Next.js 16 App Router, React 19, Tailwind CSS v4, and TanStack React Query.

---

## 🛠 Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/postcss` & `tw-animate-css`
- **Headless UI**: [@base-ui/react](https://base-ui.com/), Shadcn UI design conventions
- **State Management & Server State**: [TanStack React Query v5](https://tanstack.com/query/latest)
- **Theming**: [next-themes](https://github.com/pacocoursey/next-themes) (Dark & Light modes)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **Form Handling & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/) with interceptors

---

## 📁 Architecture & Directory Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── layout.tsx             # Auth layout centered card
│   │   │   ├── login/page.tsx         # Sign in page
│   │   │   └── register/page.tsx      # Sign up page
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx             # Protected layout with Sidebar & Header
│   │   │   ├── overview/page.tsx      # Global workspaces overview & statistics
│   │   │   ├── workspaces/page.tsx    # Workspaces management grid & selection
│   │   │   ├── projects/page.tsx      # Projects listing & creation in active workspace
│   │   │   ├── issues/page.tsx        # Kanban board & List view for issues
│   │   │   ├── members/page.tsx       # Workspace team members & role management
│   │   │   └── settings/page.tsx      # User profile & preferences
│   │   ├── globals.css                # Tailwind v4 theme, colors & dark mode variables
│   │   ├── layout.tsx                 # Root layout with Fonts & Providers
│   │   └── page.tsx                   # Public marketing landing page & product showcase
│   ├── components/
│   │   ├── auth/
│   │   │   ├── authGuard.tsx          # Protects private dashboard routes
│   │   │   └── guestGuard.tsx         # Redirects authenticated users from login/register
│   │   ├── dashboard/
│   │   │   └── Sidebar.tsx            # Navigation sidebar with workspace context dropdown
│   │   ├── issues/
│   │   │   ├── createIssue.tsx        # Issue creation modal
│   │   │   └── issueDetail.tsx        # Issue details drawer with comments & audit logs
│   │   ├── members/
│   │   │   ├── addMember.tsx          # Invite member modal
│   │   │   └── dropDown.tsx           # Member role change & removal actions
│   │   ├── projects/
│   │   │   └── createProject.tsx      # Project creation modal
│   │   ├── theme-toggle.tsx           # Dark / Light theme switcher
│   │   ├── ui/                        # Reusable UI primitives (Button, Input, Dropdown, etc.)
│   │   └── workspace/
│   │       └── createWorkspace.tsx    # Workspace creation modal
│   └── lib/
│       ├── api/
│       │   └── axios-client.ts        # Axios client with JWT authorization header interceptor
│       ├── auth/
│       │   └── token.ts               # LocalStorage JWT token management
│       ├── context/
│       │   └── WorkspaceContext.tsx   # Global active workspace synchronization context
│       ├── hooks/
│       │   ├── useActiveWorkspace.ts  # Hook to access and switch active workspace
│       │   ├── useAuth.ts             # Authentication hooks (login, register, logout, me)
│       │   ├── useComments.ts         # Issue comments query & mutation hooks
│       │   ├── useIssues.ts           # Issues query, filters & update mutation hooks
│       │   ├── useMembers.ts          # Workspace members & role modification hooks
│       │   ├── useProjects.ts         # Projects CRUD mutation hooks
│       │   └── useWorkspace.ts        # Workspace query & creation hooks
│       └── providers/
│           └── providers.tsx          # QueryClientProvider, ThemeProvider, WorkspaceProvider, Toaster
├── tsconfig.json
└── package.json
```

---

## 🌟 Key Features

1. **Global Active Workspace State (`WorkspaceContext`)**:
   - Centralized workspace selection that instantly synchronizes across all navigation, sidebar, and page components.
   - Automatically invalidates caches (`workspaces`, `members`, `projects`, `issues`) upon switching to prevent stale data.
   - Preserves active workspace ID across page reloads via `localStorage`.

2. **Dark Mode & Light Mode**:
   - Full dark theme support configured with Tailwind v4 semantic CSS variables (`bg-background`, `bg-card`, `text-foreground`, `border-border`).
   - Theme toggle available in the header bar and settings page.

3. **Kanban Board & List View**:
   - Issues categorized into stages: `TODO`, `IN_PROGRESS`, `IN_REVIEW`, and `DONE`.
   - Filter by status, priority (`LOW`, `MEDIUM`, `HIGH`, `URGENT`), and issue type (`TASK`, `BUG`, `FEATURE`, `IMPROVEMENT`).
   - Real-time status update with automatic query cache invalidation.

4. **Issue Details, Activity Log & Comments**:
   - Dedicated issue detail modal with assignee management and priority selectors.
   - Activity audit trail logging creation, status transitions, and reassignments.
   - Comment threads allowing team members to communicate per issue.

5. **Role-Based Access Control (RBAC)**:
   - Dynamic UI adjustments for `ADMIN` vs `MEMBER` roles.
   - Admins can create projects, add members, change member roles, and delete resources.
   - Members can participate, create and manage issues, and post comments.

---

## ⚙️ Environment Variables

Create a `.env` or `.env.local` file in `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

| Variable | Description | Default |
| :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | Base URL pointing to the IssuePilot Backend REST API | `http://localhost:8000/api/v1` |

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
cd frontend
pnpm install
```

### 2. Run Development Server
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) with your browser.

### 3. Build for Production
```bash
pnpm run build
```

### 4. Start Production Server
```bash
pnpm start
```
