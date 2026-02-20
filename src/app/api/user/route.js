export async function POST(req) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../auth.js'),
    import('../utils/sql.js'),
  ]);
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { tier } = await req.json(); // 'free' or 'pro'

  await sql`
    UPDATE users 
    SET tier = ${tier} 
    WHERE id = ${session.user.id}
  `;

  return Response.json({ success: true, tier });
}

export async function GET(req) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../auth.js'),
    import('../utils/sql.js'),
  ]);
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [user] = await sql`SELECT * FROM users WHERE id = ${session.user.id}`;
  if (!user) {
    // Sync with auth_users if first time
    const [authUser] =
      await sql`SELECT * FROM auth_users WHERE id = ${session.user.id}`;
    const [newUser] = await sql`
      INSERT INTO users (id, email)
      VALUES (${authUser.id}, ${authUser.email})
      RETURNING *
    `;
    return Response.json(newUser);
  }

  return Response.json(user);
}
