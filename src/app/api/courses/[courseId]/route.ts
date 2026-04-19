export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: {
      modules: {
        orderBy: { order: "asc" },
        include: { lessons: { orderBy: { order: "asc" } } },
      },
    },
  })
  if (!course) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(course)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { courseId } = await params
  const data = await req.json()
  const course = await prisma.course.update({ where: { id: courseId }, data })
  return NextResponse.json(course)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { courseId } = await params
  await prisma.course.delete({ where: { id: courseId } })
  return NextResponse.json({ ok: true })
}
