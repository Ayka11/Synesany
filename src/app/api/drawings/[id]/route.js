export async function DELETE(req, { params }) {
  const [{ auth }, { default: sql }] = await Promise.all([
    import('../../../../auth.js'),
    import('../../utils/sql.js'),
  ]);
  const session = await auth();
  if (!session?.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const [deletedDrawing] = await sql`
    DELETE FROM drawings
    WHERE id = ${id} AND user_id = ${session.user.id}
    RETURNING id
  `;

  if (!deletedDrawing) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  return Response.json({ success: true });
}
