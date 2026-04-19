export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { moduleId } = await params
  const { title, description, videoUrl, pdfUrl, order } = await req.json()

  const lesson = await prisma.lesson.create({
    data: { title, description, videoUrl, pdfUrl, order: parseInt(order), moduleId },
  })
  return NextResponse.json(lesson, { status: 201 })
}
