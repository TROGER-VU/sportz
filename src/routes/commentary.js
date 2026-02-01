import { Router } from 'express';
import { desc, eq } from 'drizzle-orm';
import { db } from '../db/db.js';
import { commentary } from '../db/schema.js';
import { matchIdParamSchema } from '../validation/matches.js';
import { createCommentarySchema } from '../validation/commentary.js';
import { listCommentaryQuerySchema } from '../validation/commentary.js';

export const commentaryRouter = Router({ mergeParams: true });

const MAX_LIMIT = 100;

// GET /matches/:id/commentary - List commentary for a match
commentaryRouter.get('/', async (req, res) => {
  try {
    // Validate params
    const paramValidation = matchIdParamSchema.safeParse(req.params);
    if (!paramValidation.success) {
      return res.status(400).json({ error: paramValidation.error.errors });
    }

    // Validate query
    const queryValidation = listCommentaryQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({ error: queryValidation.error.errors });
    }

    const matchId = paramValidation.data.id;
    const limit = Math.min(queryValidation.data.limit || MAX_LIMIT, MAX_LIMIT);

    // Fetch commentary for the match, ordered by createdAt descending
    const results = await db
      .select()
      .from(commentary)
      .where(eq(commentary.matchId, matchId))
      .orderBy(desc(commentary.createdAt))
      .limit(limit);

    return res.status(200).json({ data: results });
  } catch (error) {
    console.error('Error fetching commentary:', error);
    return res.status(500).json({ error: 'Failed to fetch commentary' });
  }
});

// POST /matches/:id/commentary
commentaryRouter.post('/', async (req, res) => {
  const paramValidation = matchIdParamSchema.safeParse(req.params);
  if (!paramValidation.success) {
    return res.status(400).json({ error: paramValidation.error.errors });
  }

  const bodyValidation = createCommentarySchema.safeParse(req.body);
  if (!bodyValidation.success) {
    return res.status(400).json({ error: bodyValidation.error.errors });
  }

  try {
    const { minute, ...rest } = bodyValidation.data;

    const [result] = await db
      .insert(commentary)
      .values({
        matchId: paramValidation.data.id,
        minute,
        ...rest
      })
      .returning();

      if(res.app.locals.broadcastCommentary) {
        res.app.locals.broadcastCommentary(result.matchId, result);
      }

    res.status(201).json({ data: result });
  } catch (e) {
    console.error('Failed to create commentary:', e);
    res.status(500).json({ error: 'Failed to create commentary.' });
  }
});
