export const dynamic = "force-dynamic"
import { NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { uploadFile } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN")
    return NextResponse.json({ error: "No autorizado" }, { status: 403 })

  const formData = await req.formData()
  const file = formData.get("file") as File
  const type = (formData.get("type") as string) || "raw"

  if (!file) return NextResponse.json({ error: "No se recibió archivo" }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())
  const folder = type === "video" ? "academia-mi/videos" : type === "image" ? "academia-mi/images" : "academia-mi/pdfs"
  const resourceType = type === "video" ? "video" : type === "image" ? "image" : "raw"

  const result = await uploadFile(buffer, folder, resourceType)
  return NextResponse.json(result)
}
