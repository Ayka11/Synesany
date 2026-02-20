export async function GET(req) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../auth.js'),
    import('../utils/sql.js'),
  ]);
  const session = await auth();
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const tickets =
    await sql`SELECT * FROM support_tickets WHERE user_id = ${session.user.id} ORDER BY created_at DESC`;
  return Response.json(tickets);
}

export async function POST(req) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../auth.js'),
    import('../utils/sql.js'),
  ]);
  const session = await auth();
  if (!session?.user?.id)
    return Response.json({ error: "Unauthorized" }, { status: 401 });

  const { subject, initialMessage } = await req.json();
  const messages = JSON.stringify([
    { role: "user", text: initialMessage, date: new Date().toISOString() },
  ]);

  const [ticket] = await sql`
    INSERT INTO support_tickets (user_id, subject, messages)
    VALUES (${session.user.id}, ${subject}, ${messages})
    RETURNING *
  `;
  return Response.json(ticket);
}
