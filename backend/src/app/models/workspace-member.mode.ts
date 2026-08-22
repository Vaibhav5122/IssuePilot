import mongoose from "mongoose";

const workspaceMembersSchema = new mongoose.Schema(
  {
    workspace: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workspace",
      required: [true, "Workspace id required for add members in it"],
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User is required to add in workspace"],
    },
    role: {
      type: String,
      enum: ["ADMIN", "MEMBER"],
      default: "Member",
      required: true,
    },
  },
  { timestamps: true },
);

workspaceMembersSchema.index({ workspace: 1, user: 1 }, { unique: true });

export const WorkspaceMember = mongoose.model(
  "WorkspaceMember",
  workspaceMembersSchema,
);
