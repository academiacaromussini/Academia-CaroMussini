export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET(_: NextRequest, { params }: { params: Promise<{ courseId: string; moduleId: string }> }) {
  const { moduleId } = await params
  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { orderBy: { order: "asc" } } },
  })
  if (!module) return NextResponse.json({ error: "No encontrado" }, { status: 404 })
  return NextResponse.json(module)
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ courseId: string; moduleId: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { moduleId } = await params
  const data = await req.json()
  const module = await prisma.module.update({ where: { id: moduleId }, data })
  return NextResponse.json(module)
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ courseId: string; moduleId: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { moduleId } = await params
  await prisma.module.delete({ where: { id: moduleId } })
  return NextResponse.json({ ok: true })
}
