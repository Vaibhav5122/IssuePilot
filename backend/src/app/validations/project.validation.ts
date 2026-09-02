import z from "zod";

export const createProjectSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Project name should be at least 2 characters long")
    .max(166, "Project name length is too long"),
  description: z.string().max(500, "Project description too long").optional(),
});

export const updateProjectSchema = createProjectSchema
  .extend({
    status: z
      .enum(["ACTIVE", "ARCHIVED"], {
        error: (issue) =>
          issue.input === undefined
            ? "Status must be ACTIVE or ARCHIVED"
            : "Invalid status",
      })
      .optional(),
  })
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    error:
      "At least one field (name, description, or status) must be provided for an update",
  });

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
