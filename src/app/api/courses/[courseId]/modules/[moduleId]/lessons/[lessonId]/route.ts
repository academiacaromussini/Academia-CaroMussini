export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function DELETE(
  _: NextRequest,
  { params }: { params: Promise<{ lessonId: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { lessonId } = await params
  await prisma.lesson.delete({ where: { id: lessonId } })
  return NextResponse.json({ ok: true })
}
