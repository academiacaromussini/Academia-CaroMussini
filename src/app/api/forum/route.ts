export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(req: NextRequest) {
  const courseId = req.nextUrl.searchParams.get("courseId")
  const posts = await prisma.forumPost.findMany({
    where: courseId ? { courseId } : undefined,
    include: {
      user: { select: { id: true, name: true, image: true, role: true } },
      replies: {
        include: { user: { select: { id: true, name: true, image: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(posts)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (!session?.user?.id)
    return NextResponse.json({ error: "No autenticado" }, { status: 401 })

  const { title, content, courseId } = await req.json()
  const post = await prisma.forumPost.create({
    data: { title, content, courseId, userId: session.user.id },
    include: { user: { select: { id: true, name: true, image: true, role: true } } },
  })
  return NextResponse.json(post, { status: 201 })
}
