export async function GET(req) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../auth.js'),
    import('../utils/sql.js'),
  ]);
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const drawings = await sql`
    SELECT * FROM drawings 
    WHERE user_id = ${session.user.id} 
    ORDER BY created_at DESC
  `;
  return Response.json(drawings);
}

export async function POST(req) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../auth.js'),
    import('../utils/sql.js'),
  ]);
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, content_json, image_url } = await req.json();

  const [drawing] = await sql`
    INSERT INTO drawings (user_id, title, content_json, image_url)
    VALUES (${session.user.id}, ${title}, ${content_json}, ${image_url})
    RETURNING *
  `;

  return Response.json(drawing);
}
