import { z } from "zod";

export const issueSchema = z.object({
  title: z
    .string()
    .trim()
    .min(2, "Issue name should be at least 2 characters long")
    .max(166, "Issue name is too long"),
  description: z.string().max(500, "Description is too long").optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]).optional(),
  status: z.enum(["TODO", "IN_PROGRESS", "IN_REVIEW", "DONE"]).optional(),
  assignee: z.string().nullable().optional(),
  type: z.enum(["TASK", "BUG", "FEATURE", "IMPROVEMENT"]).optional(),
  dueDate: z.string().optional(),
});

export const patchIssueSchema = issueSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    error:
      "At least one field (title, description, priority, status, assignee, type, or dueDate) must be provided for an update",
  });

export type IssueSchema = z.infer<typeof issueSchema>;
export type PatchissueSchema = z.infer<typeof patchIssueSchema>;
