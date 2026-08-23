import z from "zod";

export const createProjectSchema = z.object({
  name: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Project name must be required"
          : "Invalid text format",
    })
    .trim()
    .min(2, "Project name should be atleast 2 char long")
    .max(166, "Project name length too long"),

  description: z
    .string({
      error: (issue) =>
        issue.input === undefined
          ? "Description is not provided"
          : "Invalid text format",
    })
    .max(500, "Project description too long")
    .optional(),
  status: z
    .enum(["ACTIVE", "ARCHIVED"], {
      error: (issue) =>
        issue.input === undefined
          ? "Status must be ACTIVE or ARCHIVED"
          : "Invalid status",
    })
    .optional(),
});

export const updateProjectSchema = createProjectSchema
  .partial()
  .refine((data) => Object.values(data).some((value) => value !== undefined), {
    error:
      "At least one field (name, description, or status) must be provided for an update",
  });

export type CreateProjectSchema = z.infer<typeof createProjectSchema>;
export type UpdateProjectSchema = z.infer<typeof updateProjectSchema>;
