import "dotenv/config";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { User } from "../app/models/user.model.js";
import { Workspace } from "../app/models/workspace.model.js";
import { WorkspaceMember } from "../app/models/workspace-member.model.js";
import { Project } from "../app/models/project.model.js";
import { Issue } from "../app/models/issue.model.js";
import { Comment } from "../app/models/comment.model.js";
import { IssueActivity } from "../app/models/issueActivity.model.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendRoot = path.resolve(__dirname, "../../..");

const DEFAULT_PASSWORD = "Password@123";

// 20 Realistic Users
const rawUsers = [
  { name: "Alex Mercer", email: "alex.mercer@issuepilot.dev" },
  { name: "Sarah Connor", email: "sarah.connor@issuepilot.dev" },
  { name: "Michael Chen", email: "michael.chen@issuepilot.dev" },
  { name: "Priya Sharma", email: "priya.sharma@issuepilot.dev" },
  { name: "David Miller", email: "david.miller@issuepilot.dev" },
  { name: "Emma Watson", email: "emma.watson@issuepilot.dev" },
  { name: "Lucas Silva", email: "lucas.silva@issuepilot.dev" },
  { name: "Elena Rostova", email: "elena.rostova@issuepilot.dev" },
  { name: "Marcus Vance", email: "marcus.vance@issuepilot.dev" },
  { name: "Sophia Martinez", email: "sophia.martinez@issuepilot.dev" },
  { name: "Liam O'Connor", email: "liam.oconnor@issuepilot.dev" },
  { name: "Olivia Zhang", email: "olivia.zhang@issuepilot.dev" },
  { name: "Noah Kim", email: "noah.kim@issuepilot.dev" },
  { name: "Isabella Rossi", email: "isabella.rossi@issuepilot.dev" },
  { name: "Ethan Wright", email: "ethan.wright@issuepilot.dev" },
  { name: "Mia Patel", email: "mia.patel@issuepilot.dev" },
  { name: "Benjamin Scott", email: "benjamin.scott@issuepilot.dev" },
  { name: "Charlotte Lee", email: "charlotte.lee@issuepilot.dev" },
  { name: "Alexander White", email: "alexander.white@issuepilot.dev" },
  { name: "Amelia Davis", email: "amelia.davis@issuepilot.dev" },
];

// 20 Workspaces
const rawWorkspaces = [
  {
    name: "Stripe Payments Core",
    description: "Global financial infrastructure, payments pipeline & billing engine.",
  },
  {
    name: "Vercel Frontend Platform",
    description: "Next.js ecosystem, edge runtime & deployment automation tooling.",
  },
  {
    name: "Linear High-Velocity",
    description: "Product management, roadmaps, and cycle issue tracking system.",
  },
  {
    name: "Supabase Cloud Squad",
    description: "Open source Firebase alternative, serverless Postgres, and Auth.",
  },
  {
    name: "Shopify Merchant Hub",
    description: "E-commerce platform tools, point-of-sale systems, and checkout UI.",
  },
  {
    name: "Canva Design Systems",
    description: "Collaborative canvas engine, web assembly rendering, and UI tokens.",
  },
  {
    name: "Datadog APM & Logs",
    description: "Observability platform, anomaly detection, and distributed tracing.",
  },
  {
    name: "Figma Canvas Engine",
    description: "Multiplayer real-time vector canvas and collaborative design system.",
  },
  {
    name: "Airbnb Host Operations",
    description: "Host onboarding, listing verifications, and automated pricing engine.",
  },
  {
    name: "Discord Realtime Voice",
    description: "Low latency WebRTC audio servers, gateway clusters, and chat bot API.",
  },
  {
    name: "Cloudflare Edge Engine",
    description: "Workers serverless computing, DDoS mitigations, and global CDN.",
  },
  {
    name: "GitHub Actions & Runner",
    description: "CI/CD orchestration, secrets vault, and distributed runner fleets.",
  },
  {
    name: "Notion Knowledge Workspace",
    description: "Block-based editor, hierarchical databases, and collaborative sync.",
  },
  {
    name: "Postman API Platform",
    description: "API testing collections, mock servers, and OpenAPI schema generators.",
  },
  {
    name: "Docker Engine & Hub",
    description: "Container virtualization, BuildKit engine, and image registry.",
  },
  {
    name: "GitLab DevSecOps Hub",
    description: "Automated vulnerability scanning, SAST/DAST, and compliance audits.",
  },
  {
    name: "Ramp Finance & Cards",
    description: "Smart corporate cards, real-time expense approvals, and ERP sync.",
  },
  {
    name: "Retool Internal Studio",
    description: "Low-code app builder connecting SQL databases and internal workflows.",
  },
  {
    name: "Miro Infinite Board",
    description: "Enterprise interactive whiteboarding, widgets, and sync engine.",
  },
  {
    name: "Loom Video Services",
    description: "Instant screen recording, transcode pipeline, and AI video summaries.",
  },
];

// 22 Projects across the workspaces
const rawProjects = [
  {
    name: "Billing & Proration Engine v2",
    description: "Automate mid-month subscription tier upgrades, downgrades, and tax rules.",
    workspaceIndex: 0,
    status: "ACTIVE",
  },
  {
    name: "Turbopack Bundler Integration",
    description: "Migrate webpack core plugins to Rust-based Turbopack compiler.",
    workspaceIndex: 1,
    status: "ACTIVE",
  },
  {
    name: "Roadmap Milestones & Cycles",
    description: "Deliver multi-quarter strategic roadmap timeline views and progress metrics.",
    workspaceIndex: 2,
    status: "ACTIVE",
  },
  {
    name: "Postgres 16 Logical Replication",
    description: "Multi-region live replication and low-latency follower read replicas.",
    workspaceIndex: 3,
    status: "ACTIVE",
  },
  {
    name: "One-Click Checkout Optimization",
    description: "Streamline mobile checkout funnel to achieve sub-400ms time to purchase.",
    workspaceIndex: 4,
    status: "ACTIVE",
  },
  {
    name: "WebGL Shader Filter Studio",
    description: "Hardware accelerated photo and graphic filter effects in canvas.",
    workspaceIndex: 5,
    status: "ACTIVE",
  },
  {
    name: "Continuous Profiler Agent",
    description: "Low-overhead CPU and memory profiling agent for containerized microservices.",
    workspaceIndex: 6,
    status: "ACTIVE",
  },
  {
    name: "Multiplayer Conflict Resolution",
    description: "Operational transform & CRDT algorithm upgrades for simultaneous edits.",
    workspaceIndex: 7,
    status: "ACTIVE",
  },
  {
    name: "Dynamic Smart Pricing Model",
    description: "Machine learning forecasting model for seasonal vacation rental pricing.",
    workspaceIndex: 8,
    status: "ACTIVE",
  },
  {
    name: "WebRTC Opus Audio Codec Tuning",
    description: "Packet loss recovery and dynamic jitter buffer for low-bandwidth users.",
    workspaceIndex: 9,
    status: "ACTIVE",
  },
  {
    name: "Workers KV Distributed Storage",
    description: "Sub-millisecond key-value storage at 300+ edge datacenter POPs.",
    workspaceIndex: 10,
    status: "ACTIVE",
  },
  {
    name: "Self-Hosted Runner Auto-scaler",
    description: "Kubernetes operator for dynamic ephemeral GitHub Actions runner provisioning.",
    workspaceIndex: 11,
    status: "ACTIVE",
  },
  {
    name: "Formula 2.0 & Relation Rollups",
    description: "Advanced formula syntax parser with deep multi-table database rollups.",
    workspaceIndex: 12,
    status: "ACTIVE",
  },
  {
    name: "GraphQL Schema Linting Engine",
    description: "Automated breaking change detection on API collection commits.",
    workspaceIndex: 13,
    status: "ACTIVE",
  },
  {
    name: "BuildKit Remote Cache Daemon",
    description: "Distributed build layer caching over S3 and local high-speed SSDs.",
    workspaceIndex: 14,
    status: "ACTIVE",
  },
  {
    name: "Secrets Scanning in Git Commits",
    description: "Zero-latency pre-receive Git hook to detect leaked private API tokens.",
    workspaceIndex: 15,
    status: "ACTIVE",
  },
  {
    name: "Real-time Fraud & Expense Guard",
    description: "Instant transaction risk scoring and automatic manager approval routing.",
    workspaceIndex: 16,
    status: "ACTIVE",
  },
  {
    name: "Custom React Component SDK",
    description: "Enables customers to inject proprietary UI components into Retool apps.",
    workspaceIndex: 17,
    status: "ACTIVE",
  },
  {
    name: "Infinite Canvas Spatial Indexing",
    description: "R-Tree spatial partitioning for silky smooth rendering of 50k+ board nodes.",
    workspaceIndex: 18,
    status: "ACTIVE",
  },
  {
    name: "AI Video Summaries & Action Items",
    description: "Extract meeting decisions and auto-generate issue drafts from transcriptions.",
    workspaceIndex: 19,
    status: "ACTIVE",
  },
  {
    name: "Passkeys & WebAuthn Auth Rollout",
    description: "Passwordless authentication using TouchID, FaceID, and hardware YubiKeys.",
    workspaceIndex: 0,
    status: "ACTIVE",
  },
  {
    name: "Dark Mode & Contrast WCAG 2.1",
    description: "Accessibility audit and high-contrast color scheme implementation across UI.",
    workspaceIndex: 1,
    status: "ACTIVE",
  },
] as const;

// 25 Issues across projects
const rawIssues = [
  {
    title: "Implement 3DS 2.0 Strong Customer Authentication",
    description: "Handle mandatory European payment regulations with seamless in-app challenge flow.",
    projectIndex: 0,
    status: "IN_PROGRESS",
    priority: "URGENT",
    type: "FEATURE",
    dueDays: 5,
  },
  {
    title: "Fix memory leak in Turbopack watch mode",
    description: "File descriptor leaks on macOS when monitoring large monorepo node_modules.",
    projectIndex: 1,
    status: "IN_REVIEW",
    priority: "HIGH",
    type: "BUG",
    dueDays: 3,
  },
  {
    title: "Add drag-and-drop support to Sprint board",
    description: "Allow agile teams to reorder tasks between Todo, In Progress, and Done lanes.",
    projectIndex: 2,
    status: "DONE",
    priority: "MEDIUM",
    type: "FEATURE",
    dueDays: -2,
  },
  {
    title: "Upgrade Postgres connection pooler to PgBouncer 1.22",
    description: "Improve serverless connection spikes and graceful TLS renegotiations.",
    projectIndex: 3,
    status: "TODO",
    priority: "HIGH",
    type: "IMPROVEMENT",
    dueDays: 8,
  },
  {
    title: "Apple Pay button failing on Safari 17.2",
    description: "PaymentRequest session fails initialization when cross-origin iframe is loaded.",
    projectIndex: 4,
    status: "IN_PROGRESS",
    priority: "URGENT",
    type: "BUG",
    dueDays: 2,
  },
  {
    title: "Add Gaussian Blur and Sharpening filter kernels",
    description: "Implement custom WebGL fragment shaders for image adjustment tool panel.",
    projectIndex: 5,
    status: "DONE",
    priority: "MEDIUM",
    type: "FEATURE",
    dueDays: -4,
  },
  {
    title: "Profile eBPF overhead on Linux 6.5 kernels",
    description: "Benchmark CPU overhead when tracing socket write throughput on production node.",
    projectIndex: 6,
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    type: "TASK",
    dueDays: 7,
  },
  {
    title: "Cursor position offset desync during collaborative typing",
    description: "Text selection ranges drift when remote user pastes multi-line code block.",
    projectIndex: 7,
    status: "IN_REVIEW",
    priority: "HIGH",
    type: "BUG",
    dueDays: 1,
  },
  {
    title: "Incorporate localized holiday seasonality weights",
    description: "Adjust listing price prediction curve during Thanksgiving and Christmas periods.",
    projectIndex: 8,
    status: "TODO",
    priority: "LOW",
    type: "IMPROVEMENT",
    dueDays: 14,
  },
  {
    title: "Mitigate robotic audio artifact on UDP packet loss",
    description: "Increase forward error correction (FEC) ratio on jitter exceeding 45ms.",
    projectIndex: 9,
    status: "IN_PROGRESS",
    priority: "HIGH",
    type: "BUG",
    dueDays: 4,
  },
  {
    title: "Implement Cache-Control: stale-while-revalidate",
    description: "Serve cached responses while asynchronously refreshing upstream origin.",
    projectIndex: 10,
    status: "DONE",
    priority: "HIGH",
    type: "FEATURE",
    dueDays: -6,
  },
  {
    title: "Ephemeral runner pods terminating before job logs upload",
    description: "Add SIGTERM grace period hook to ensure workflow logs reach storage bucket.",
    projectIndex: 11,
    status: "IN_PROGRESS",
    priority: "URGENT",
    type: "BUG",
    dueDays: 2,
  },
  {
    title: "Support regex matching inside Database Rollup filter",
    description: "Allow users to match complex text patterns across linked table rows.",
    projectIndex: 12,
    status: "TODO",
    priority: "MEDIUM",
    type: "FEATURE",
    dueDays: 10,
  },
  {
    title: "Deprecate legacy REST v1 export endpoint",
    description: "Add sunset header and send migration warnings to active API clients.",
    projectIndex: 13,
    status: "DONE",
    priority: "LOW",
    type: "TASK",
    dueDays: -1,
  },
  {
    title: "Cache miss rate spike during parallel multi-arch builds",
    description: "Investigate hash key mismatch between arm64 and amd64 base image stages.",
    projectIndex: 14,
    status: "IN_PROGRESS",
    priority: "MEDIUM",
    type: "BUG",
    dueDays: 6,
  },
  {
    title: "Detect AWS access keys and private PEM certs in commits",
    description: "Add high-entropy regex rules and Shannon entropy calculator to scan engine.",
    projectIndex: 15,
    status: "DONE",
    priority: "HIGH",
    type: "FEATURE",
    dueDays: -3,
  },
  {
    title: "Auto-categorize Uber and Lyft receipts using OCR",
    description: "Parse merchant metadata, tax amounts, and dates from uploaded PDF invoices.",
    projectIndex: 16,
    status: "IN_PROGRESS",
    priority: "HIGH",
    type: "FEATURE",
    dueDays: 4,
  },
  {
    title: "Fix PostgreSQL table column sorting in table grid",
    description: "Clicking column header loses active row selection state in query view.",
    projectIndex: 17,
    status: "TODO",
    priority: "MEDIUM",
    type: "BUG",
    dueDays: 9,
  },
  {
    title: "Optimize sticky note rendering at 20% zoom level",
    description: "Use level-of-detail (LOD) simplification to render simplified bounding rects.",
    projectIndex: 18,
    status: "IN_REVIEW",
    priority: "MEDIUM",
    type: "IMPROVEMENT",
    dueDays: 3,
  },
  {
    title: "Auto-detect speaker changes in transcript timeline",
    description: "Use acoustic voice diarization embeddings to label speakers automatically.",
    projectIndex: 19,
    status: "DONE",
    priority: "HIGH",
    type: "FEATURE",
    dueDays: -5,
  },
  {
    title: "Register WebAuthn credential in user security settings",
    description: "Allow pairing hardware keys via navigator.credentials.create().",
    projectIndex: 20,
    status: "IN_PROGRESS",
    priority: "HIGH",
    type: "FEATURE",
    dueDays: 4,
  },
  {
    title: "Audit color contrast ratios for primary CTA buttons",
    description: "Ensure button background to text contrast reaches 4.5:1 ratio minimum.",
    projectIndex: 21,
    status: "DONE",
    priority: "LOW",
    type: "IMPROVEMENT",
    dueDays: -7,
  },
  {
    title: "Webhook delivery retry exponential backoff",
    description: "Retry failed customer webhooks up to 5 times with jittered intervals.",
    projectIndex: 0,
    status: "TODO",
    priority: "HIGH",
    type: "FEATURE",
    dueDays: 12,
  },
  {
    title: "Edge middleware response streaming support",
    description: "Allow streaming chunked HTML responses directly to clients.",
    projectIndex: 1,
    status: "TODO",
    priority: "MEDIUM",
    type: "FEATURE",
    dueDays: 11,
  },
  {
    title: "Add dark mode theme preview in settings modal",
    description: "Real-time preview of theme accents before applying globally.",
    projectIndex: 21,
    status: "IN_PROGRESS",
    priority: "LOW",
    type: "TASK",
    dueDays: 5,
  },
] as const;

// 25 Comments on issues
const rawComments = [
  "Verified the 3DS test cards against the sandbox gateway. The challenge modal prompts correctly on mobile browsers.",
  "Root caused the file descriptor leak: chokidar watcher wasn't closing handles on rebuild. Submitting fix now.",
  "The drag and drop animation is super smooth on touch devices! Tested with 60fps on iPad Air.",
  "PgBouncer configs updated in staging. Max connections raised to 250 with transaction pooling.",
  "Safari 17.2 issue reproduced on macOS Sonoma. The merchantIdentifier validation failed due to domain mismatch.",
  "Filter shaders look gorgeous! Running benchmarks on Intel integrated GPUs to verify performance.",
  "eBPF tracing overhead measured at 0.8% CPU under 100k req/sec load. Completely safe for production.",
  "Found the race condition in OT engine. The transform matrix wasn't updating cursor index for delete operations.",
  "Holiday seasonality dataset refreshed with 2024-2025 dates for US, UK, and European regions.",
  "FEC packet tuning resolved the distortion! Tested on 12% packet loss simulation with crisp audio.",
  "Stale-while-revalidate tested with origin timeout scenarios. TTFB dropped from 420ms to 18ms for cached routes!",
  "Added a 15-second grace period in runner daemon. No more truncated log uploads during scale down.",
  "Regex rollup syntax drafted. Need to make sure ReDoS vulnerabilities are prevented with timeout bounds.",
  "Sent deprecation email to registered API consumers. 92% of traffic already migrated to v2.",
  "Found it! The base image digest differed between arch manifests. Pinned sha256 to guarantee reproducible builds.",
  "Secrets scanner passed testing against synthetic private key dataset with 99.8% precision.",
  "OCR processing time is down to 450ms per receipt page using the new quantized model.",
  "Investigating the column sorting issue. It's resetting the TanStack Table state on each sort action.",
  "Spatial indexing PR is up. Zooming out on 50,000 sticky notes maintains constant 60fps now.",
  "Diarization model successfully distinguishes between 5 distinct speakers in 45-minute recording.",
  "WebAuthn registration tested on macOS TouchID and Chrome on Android. UX flow is seamless.",
  "Contrast ratios adjusted in Tailwind color palette. Accessibility score improved from 78 to 100 on Lighthouse!",
  "Exponential backoff implemented with 1m, 5m, 15m, 1h, and 6h retry intervals.",
  "Edge streaming prototype works! Early chunks render above-the-fold content immediately.",
  "Theme preview toggle added to user settings with smooth color transition animations.",
];

// 25 Activities for issues
const rawActivities = [
  { type: "ISSUE_CREATED", details: { message: "Issue created by lead engineer" } },
  { type: "STATUS_CHANGED", details: { from: "TODO", to: "IN_PROGRESS" } },
  { type: "PRIORITY_CHANGED", details: { from: "MEDIUM", to: "URGENT" } },
  { type: "ASSIGNEE_CHANGED", details: { note: "Assigned to principal specialist" } },
  { type: "COMMENT_ADDED", details: { excerpt: "Verified test cases in staging environment." } },
  { type: "STATUS_CHANGED", details: { from: "IN_PROGRESS", to: "IN_REVIEW" } },
  { type: "STATUS_CHANGED", details: { from: "IN_REVIEW", to: "DONE" } },
  { type: "PRIORITY_CHANGED", details: { from: "LOW", to: "HIGH" } },
  { type: "COMMENT_ADDED", details: { excerpt: "Attached profiling FlameGraph trace." } },
  { type: "STATUS_CHANGED", details: { from: "TODO", to: "IN_PROGRESS" } },
  { type: "COMMENT_ADDED", details: { excerpt: "Reproduced under simulated 15% packet loss." } },
  { type: "STATUS_CHANGED", details: { from: "IN_PROGRESS", to: "DONE" } },
  { type: "ISSUE_CREATED", details: { message: "Automated issue triage via GitHub action" } },
  { type: "STATUS_CHANGED", details: { from: "TODO", to: "DONE" } },
  { type: "PRIORITY_CHANGED", details: { from: "MEDIUM", to: "HIGH" } },
  { type: "ASSIGNEE_CHANGED", details: { note: "Assigned to security response team" } },
  { type: "COMMENT_ADDED", details: { excerpt: "Synthetic test vectors passed validation." } },
  { type: "STATUS_CHANGED", details: { from: "TODO", to: "IN_PROGRESS" } },
  { type: "STATUS_CHANGED", details: { from: "IN_PROGRESS", to: "IN_REVIEW" } },
  { type: "COMMENT_ADDED", details: { excerpt: "Performance benchmarks validated on benchmark suite." } },
  { type: "STATUS_CHANGED", details: { from: "IN_REVIEW", to: "DONE" } },
  { type: "STATUS_CHANGED", details: { from: "TODO", to: "IN_PROGRESS" } },
  { type: "COMMENT_ADDED", details: { excerpt: "Lighthouse accessibility audit score: 100." } },
  { type: "PRIORITY_CHANGED", details: { from: "LOW", to: "MEDIUM" } },
  { type: "STATUS_CHANGED", details: { from: "TODO", to: "IN_PROGRESS" } },
] as const;

async function seed() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    console.error("❌ MONGO_URI is not set in your .env file!");
    process.exit(1);
  }

  console.log("🚀 Connecting to MongoDB...");
  await mongoose.connect(mongoUri);
  console.log("✅ Connected successfully.");

  console.log("\n🧹 Cleaning existing collections for fresh seed...");
  await Promise.all([
    User.deleteMany({}),
    Workspace.deleteMany({}),
    WorkspaceMember.deleteMany({}),
    Project.deleteMany({}),
    Issue.deleteMany({}),
    Comment.deleteMany({}),
    IssueActivity.deleteMany({}),
  ]);
  console.log("✅ Existing data cleared.");

  console.log("\n👤 1. Creating 20 Users...");
  const createdUsers: any[] = [];
  for (const u of rawUsers) {
    // Pass DEFAULT_PASSWORD directly so userSchema.pre("save") hook hashes it once
    const userDoc = await User.create({
      name: u.name,
      email: u.email,
      password: DEFAULT_PASSWORD,
    });
    createdUsers.push(userDoc);
  }
  console.log(`✅ Created ${createdUsers.length} Users (Default password: "${DEFAULT_PASSWORD}")`);

  console.log("\n🏢 2. Creating 20 Workspaces...");
  const createdWorkspaces: any[] = [];
  for (let i = 0; i < rawWorkspaces.length; i++) {
    const ws = rawWorkspaces[i]!;
    const creator = createdUsers[i % createdUsers.length]!;
    const workspaceDoc = await Workspace.create({
      name: ws.name,
      description: ws.description,
      createdBy: creator._id,
    });
    createdWorkspaces.push(workspaceDoc);
  }
  console.log(`✅ Created ${createdWorkspaces.length} Workspaces`);

  console.log("\n👥 3. Creating Workspace Memberships (Creators as ADMIN + Team Members)...");
  const createdMembers: any[] = [];
  for (let i = 0; i < createdWorkspaces.length; i++) {
    const ws = createdWorkspaces[i]!;
    const creator = createdUsers[i % createdUsers.length]!;

    // Creator as ADMIN
    const adminMember = await WorkspaceMember.create({
      workspace: ws._id,
      user: creator._id,
      role: "ADMIN",
    });
    createdMembers.push(adminMember);

    // Add 1-2 additional members to every workspace
    const member1 = createdUsers[(i + 1) % createdUsers.length]!;
    const member2 = createdUsers[(i + 2) % createdUsers.length]!;

    const m1 = await WorkspaceMember.create({
      workspace: ws._id,
      user: member1._id,
      role: "MEMBER",
    });
    createdMembers.push(m1);

    const m2 = await WorkspaceMember.create({
      workspace: ws._id,
      user: member2._id,
      role: i % 3 === 0 ? "ADMIN" : "MEMBER",
    });
    createdMembers.push(m2);
  }
  console.log(`✅ Created ${createdMembers.length} Workspace Memberships (Unique constraint respected)`);

  console.log("\n📁 4. Creating 22 Projects...");
  const createdProjects: any[] = [];
  for (let i = 0; i < rawProjects.length; i++) {
    const p = rawProjects[i]!;
    const ws = createdWorkspaces[p.workspaceIndex % createdWorkspaces.length]!;
    const creator = createdUsers[i % createdUsers.length]!;

    const projectDoc = await Project.create({
      name: p.name,
      description: p.description,
      workspace: ws._id,
      createdBy: creator._id,
      status: p.status,
    });
    createdProjects.push(projectDoc);
  }
  console.log(`✅ Created ${createdProjects.length} Projects across Workspaces`);

  console.log("\n📋 5. Creating 25 Issues...");
  const createdIssues: any[] = [];
  const now = new Date();

  for (let i = 0; i < rawIssues.length; i++) {
    const issueDef = rawIssues[i]!;
    const project = createdProjects[issueDef.projectIndex % createdProjects.length]!;
    const creator = createdUsers[i % createdUsers.length]!;
    const assignee = createdUsers[(i + 3) % createdUsers.length]!;

    const dueDate = new Date(now.getTime() + issueDef.dueDays * 24 * 60 * 60 * 1000);

    const issueDoc = await Issue.create({
      title: issueDef.title,
      description: issueDef.description,
      project: project._id,
      createdBy: creator._id,
      assignee: assignee._id,
      status: issueDef.status,
      priority: issueDef.priority,
      type: issueDef.type,
      dueDate,
    });
    createdIssues.push(issueDoc);
  }
  console.log(`✅ Created ${createdIssues.length} Issues`);

  console.log("\n💬 6. Creating 25 Comments on Issues...");
  const createdComments: any[] = [];
  for (let i = 0; i < rawComments.length; i++) {
    const issue = createdIssues[i % createdIssues.length]!;
    const author = createdUsers[(i + 4) % createdUsers.length]!;

    const commentDoc = await Comment.create({
      issue: issue._id,
      author: author._id,
      content: rawComments[i]!,
    });
    createdComments.push(commentDoc);
  }
  console.log(`✅ Created ${createdComments.length} Comments`);

  console.log("\n⚡ 7. Creating 25 Issue Activities...");
  const createdActivities: any[] = [];
  for (let i = 0; i < rawActivities.length; i++) {
    const issue = createdIssues[i % createdIssues.length]!;
    const actor = createdUsers[(i + 2) % createdUsers.length]!;
    const act = rawActivities[i]!;

    const activityDoc = await IssueActivity.create({
      issue: issue._id,
      actor: actor._id,
      type: act.type,
      details: act.details,
    });
    createdActivities.push(activityDoc);
  }
  console.log(`✅ Created ${createdActivities.length} Issue Activities`);

  // Write credentials file for user login testing (gitignored)
  const credentials = {
    generatedAt: new Date().toISOString(),
    defaultPasswordForEveryone: DEFAULT_PASSWORD,
    totalUsers: createdUsers.length,
    users: createdUsers.map((u) => {
      const ownedWorkspaces = createdWorkspaces
        .filter((w) => w.createdBy.toString() === u._id.toString())
        .map((w) => ({ id: w._id, name: w.name }));

      return {
        id: u._id,
        name: u.name,
        email: u.email,
        plainPassword: DEFAULT_PASSWORD,
        ownedWorkspaces,
      };
    }),
  };

  const credentialsFilePath = path.resolve(backendRoot, "seed-credentials.json");
  fs.writeFileSync(credentialsFilePath, JSON.stringify(credentials, null, 2), "utf-8");
  console.log(`\n🔒 Plaintext credentials written to: ${credentialsFilePath} (GITIGNORED)`);

  // Write full dataset summary file (gitignored)
  const seedDataSummary = {
    generatedAt: new Date().toISOString(),
    counts: {
      users: createdUsers.length,
      workspaces: createdWorkspaces.length,
      workspaceMembers: createdMembers.length,
      projects: createdProjects.length,
      issues: createdIssues.length,
      comments: createdComments.length,
      issueActivities: createdActivities.length,
    },
    workspaces: createdWorkspaces.map((ws) => ({
      id: ws._id,
      name: ws.name,
      description: ws.description,
      projects: createdProjects
        .filter((p) => p.workspace.toString() === ws._id.toString())
        .map((p) => ({ id: p._id, name: p.name })),
    })),
  };

  const dataFilePath = path.resolve(backendRoot, "seed-data.json");
  fs.writeFileSync(dataFilePath, JSON.stringify(seedDataSummary, null, 2), "utf-8");
  console.log(`📊 Full seed dataset written to: ${dataFilePath} (GITIGNORED)`);

  // Verify login simulation
  const verifyUser = await User.findOne({ email: "alex.mercer@issuepilot.dev" }).select("+password");
  const isMatch = verifyUser && verifyUser.password ? await bcrypt.compare(DEFAULT_PASSWORD, verifyUser.password) : false;
  if (!isMatch) {
    throw new Error("Password verification check failed!");
  }
  console.log("🔐 Verified: bcrypt password matching confirmed successfully!");

  console.log("\n🎉 Database successfully seeded with rich, realistic data!");
  console.log("==========================================================");
  console.log(`🔑 Try logging in with:`);
  console.log(`   Email:    alex.mercer@issuepilot.dev`);
  console.log(`   Password: ${DEFAULT_PASSWORD}`);
  console.log("==========================================================");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((error) => {
  console.error("❌ Seed failed with error:", error);
  process.exit(1);
});
