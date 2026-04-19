export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest, { params }: { params: Promise<{ courseId: string }> }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const { courseId } = await params
  const { title, description, order } = await req.json()

  const module = await prisma.module.create({
    data: { title, description, order: parseInt(order), courseId },
  })
  return NextResponse.json(module, { status: 201 })
}
