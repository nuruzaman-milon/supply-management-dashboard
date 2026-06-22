// app/api/me/route.ts
import { getSession } from "@/lib/session";

export async function GET() {
  const user = await getSession();

  if (!user) {
    return Response.json(null, { status: 401 });
  }

  return Response.json(user);
}
