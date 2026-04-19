export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { modules: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  })
  return NextResponse.json(courses)
}

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { title, description, image } = await req.json()
  const course = await prisma.course.create({
    data: { title, description, image },
  })
  return NextResponse.json(course, { status: 201 })
}
