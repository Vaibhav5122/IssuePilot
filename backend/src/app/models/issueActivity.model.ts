import mongoose from "mongoose";

const issueActivitySchema = new mongoose.Schema(
  {
    issue: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Issue",
      required: true,
      index: true,
    },
    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    type: {
      type: String,
      enum: [
        "ISSUE_CREATED",
        "STATUS_CHANGED",
        "PRIORITY_CHANGED",
        "ASSIGNEE_CHANGED",
        "COMMENT_ADDED",
      ],
      default: "ISSUE_CREATED",
      required: true,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true },
);

export const IssueActivity = mongoose.model(
  "IssueActivity",
  issueActivitySchema,
);
