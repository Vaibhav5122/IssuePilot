import z from "zod";

export const commentSchema = z.object({
  content: z
    .string()
    .min(2, "Min 2 char required to make comment")
    .max(600, "Comment too long"),
});

export type CommentSchema = z.infer<typeof commentSchema>;
