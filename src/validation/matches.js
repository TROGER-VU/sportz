import { z } from 'zod';

// ISO 8601 regex (allows fractional seconds and timezone Z or ±hh:mm)
const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+\-]\d{2}:\d{2})$/;

// limit: optional coerced positive integer, max 100
export const listMatchesQuerySchema = z.object({
  limit: z
    .coerce
    .number()
    .int()
    .positive()
    .max(100)
    .optional(),
});

// Constant mapping for match status (lowercase values)
export const MATCH_STATUS = Object.freeze({
  SCHEDULED: 'scheduled',
  LIVE: 'live',
  FINISHED: 'finished',
});

// matchId param schema: required coerced positive integer
export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// createMatch schema
export const createMatchSchema = z
  .object({
    sport: z.string().min(1, { message: 'sport is required' }).trim(),
    homeTeam: z.string().min(1, { message: 'homeTeam is required' }).trim(),
    awayTeam: z.string().min(1, { message: 'awayTeam is required' }).trim(),
    startTime: z
      .string()
      .refine((val) => isoRegex.test(val) && !isNaN(Date.parse(val)), {
        message: 'startTime must be a valid ISO 8601 date string',
      }),
    endTime: z
      .string()
      .refine((val) => isoRegex.test(val) && !isNaN(Date.parse(val)), {
        message: 'endTime must be a valid ISO 8601 date string',
      }),
    homeScore: z.coerce.number().int().min(0).optional(),
    awayScore: z.coerce.number().int().min(0).optional(),
  })
  .superRefine((data, ctx) => {
    const start = Date.parse(data.startTime);
    const end = Date.parse(data.endTime);
    if (isNaN(start) || isNaN(end)) {
      // refinement messages already handled above
      return;
    }
    if (end <= start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'endTime must be after startTime',
        path: ['endTime'],
      });
    }
  });

// updateScore schema: requires homeScore and awayScore as coerced non-negative integers
export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().min(0),
  awayScore: z.coerce.number().int().min(0),
});
