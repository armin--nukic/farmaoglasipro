import { Router } from "express";
import { z } from "zod";
import { query } from "../db/pool.js";
import { asyncRoute } from "../lib/async-route.js";
import { requireAuth } from "../lib/auth.js";

export const forumRouter = Router();

const postSchema = z.object({
  title: z.string().min(4).max(140),
  body: z.string().min(10).max(4000),
  tags: z.array(z.string()).default([])
});

forumRouter.get("/posts", asyncRoute(async (_request, response) => {
  const result = await query(
    `SELECT p.*, json_build_object('id', u.id, 'fullName', u.full_name, 'role', u.role, 'verified', u.verified) AS author,
      coalesce((SELECT count(*)::int FROM forum_comments c WHERE c.post_id = p.id),0) AS comment_count,
      coalesce((
        SELECT json_agg(row_to_json(item))
        FROM (
          SELECT c.id, c.body, c.created_at, json_build_object('fullName', cu.full_name, 'role', cu.role) AS author
          FROM forum_comments c
          JOIN users cu ON cu.id = c.user_id
          WHERE c.post_id = p.id
          ORDER BY c.created_at DESC
          LIMIT 3
        ) item
      ), '[]'::json) AS latest_comments
     FROM forum_posts p
     JOIN users u ON u.id = p.user_id
     ORDER BY p.created_at DESC
     LIMIT 100`
  );
  response.json({ data: result.rows });
}));

forumRouter.post("/posts", requireAuth, asyncRoute(async (request, response) => {
  const payload = postSchema.parse(request.body);
  const result = await query(
    "INSERT INTO forum_posts (user_id, title, body, tags) VALUES ($1,$2,$3,$4) RETURNING *",
    [request.user!.id, payload.title, payload.body, payload.tags]
  );
  response.status(201).json({ data: result.rows[0] });
}));

forumRouter.get("/posts/:id/comments", asyncRoute(async (request, response) => {
  const result = await query(
    `SELECT c.*, json_build_object('id', u.id, 'fullName', u.full_name, 'role', u.role, 'verified', u.verified) AS author
     FROM forum_comments c
     JOIN users u ON u.id = c.user_id
     WHERE c.post_id = $1
     ORDER BY c.created_at DESC
     LIMIT 100`,
    [request.params.id]
  );
  response.json({ data: result.rows });
}));

forumRouter.post("/posts/:id/comments", requireAuth, asyncRoute(async (request, response) => {
  const body = z.object({ body: z.string().min(2).max(2000) }).parse(request.body).body;
  const post = await query<{ user_id: string; title: string }>("SELECT user_id, title FROM forum_posts WHERE id = $1", [request.params.id]);
  if (!post.rowCount) return response.status(404).json({ error: "Forum post not found" });
  const result = await query(
    "INSERT INTO forum_comments (post_id, user_id, body) VALUES ($1,$2,$3) RETURNING *",
    [request.params.id, request.user!.id, body]
  );
  if (post.rows[0]!.user_id !== request.user!.id) {
    await query(
      "INSERT INTO notifications (user_id, title, body, channel) VALUES ($1,'Novi forum komentar',$2,'REALTIME')",
      [post.rows[0]!.user_id, `Neko je komentarisao forum temu: ${post.rows[0]!.title}`]
    );
  }
  response.status(201).json({ data: result.rows[0] });
}));
