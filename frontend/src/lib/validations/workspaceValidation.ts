import { z } from "zod";

export const worksSpaceSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined ? "Name is required" : "Invalid text format",
    })
    .min(2, "Workspace name should be atleast 2 character long")
    .max(66, "Workspace name is too long"),
  description: z.string().optional(),
});

export const workspaceMembersSchema = z.object({
  email: z
    .email({
      error: (issue) =>
        issue.input === undefined ? "Email is required" : "Invalid text format",
    })
    .trim()
    .max(322, "Email is too long")
    .toLowerCase(),

  role: z.enum(["ADMIN", "MEMBER"], {
    error: (issue) =>
      issue.input === undefined
        ? "Role must be exactly ADMIN or MEMBER"
        : "Invalid Text format",
  }),
});

export type WorkSpaceSchema = z.infer<typeof worksSpaceSchema>;
export type WorkspaceMembersSchema = z.infer<typeof workspaceMembersSchema>;

export const addWorkspaceMember = workspaceMembersSchema.pick({ email: true });
export type AddWorkspaceMember = z.infer<typeof addWorkspaceMember>;

export const addWorkspaceMemberRole = workspaceMembersSchema.pick({
  role: true,
});
export type AddWorkspaceMemberRole = z.infer<typeof addWorkspaceMemberRole>;
