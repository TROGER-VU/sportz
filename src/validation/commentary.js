import { z } from 'zod';

// listCommentary query schema: optional limit (coerced positive int, max 100)
export const listCommentaryQuerySchema = z.object({
  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

// createCommentary schema
export const createCommentarySchema = z.object({
  minute: z.coerce.number().int().min(0),
  sequence: z.coerce.number().int().min(0),
  period: z.string().min(1, { message: 'period is required' }).trim(),
  eventType: z.string().min(1, { message: 'eventType is required' }).trim(),
  actor: z.string().min(1, { message: 'actor is required' }).trim(),
  team: z.string().min(1, { message: 'team is required' }).trim(),
  message: z.string().min(1, { message: 'message is required' }).trim(),
  metadata: z.record(z.string(), z.any()).optional(),
  tags: z.array(z.string()).optional(),
});
