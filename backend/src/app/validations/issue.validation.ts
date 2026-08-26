import { z } from "zod";

export const issueSchema = z.object({
  title: z
    .string({
      error: (issue) =>
        issue === undefined ? "Issue name is required" : "Issue name not given",
    })
    .trim()
    .min(2, "Issue name should be atleast 2 char long")
    .max(166, "Issue name too long"),
  description: z
    .string({ error: "Description have issue" })
    .max(500, "Description too long")
    .optional(),
  priority: z.enum(["LOW", "MEDIUM", "HIGH"], {
    error: (issue) =>
      issue === undefined
        ? "Issue priority does not match"
        : "Invalid issue priority",
  }),
});

export const patchIssueSchema = issueSchema
  .extend({
    status: z
      .enum(["TODO", "IN_PROGRESS", "DONE"], {
        error: (issue) =>
          issue === undefined
            ? "Issue status does not match"
            : "Invalid issue status",
      })
      .optional(),
    assignee: z.string().nullable().optional(),
  })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    error:
      "At least one field (title, description,priority, or status) must be provided for an update",
  });

export type IssueSchema = z.infer<typeof issueSchema>;
export type PatchissueSchema = z.infer<typeof patchIssueSchema>;
