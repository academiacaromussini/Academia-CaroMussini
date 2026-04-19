export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ postId: string }> }) {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { postId } = await params
  const { content } = await req.json()

  const reply = await prisma.forumReply.create({
    data: { content, postId, userId: session.user.id },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
  })
  return NextResponse.json(reply, { status: 201 })
}
