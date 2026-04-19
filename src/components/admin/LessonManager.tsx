"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2, FileVideo, FileText } from "lucide-react"
import { toast } from "sonner"

interface Lesson {
  id: string
  title: string
  videoUrl: string | null
  pdfUrl: string | null
  order: number
}

export function LessonManager({
  courseId,
  moduleId,
  lessons,
}: {
  courseId: string
  moduleId: string
  lessons: Lesson[]
}) {
  const router = useRouter()
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [pdfFile, setPdfFile] = useState<File | null>(null)

  async function uploadFile(file: File, type: "video" | "raw") {
    const fd = new FormData()
    fd.append("file", file)
    fd.append("type", type)
    const res = await fetch("/api/upload", { method: "POST", body: fd })
    if (!res.ok) throw new Error("Error al subir archivo")
    return res.json() as Promise<{ url: string }>
  }

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    try {
      let videoUrl = ""
      let pdfUrl = ""

      if (videoFile) {
        toast.info("Subiendo video...")
        const r = await uploadFile(videoFile, "video")
        videoUrl = r.url
      }
      if (pdfFile) {
        toast.info("Subiendo PDF...")
        const r = await uploadFile(pdfFile, "raw")
        pdfUrl = r.url
      }

      const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.get("title"),
          description: form.get("description"),
          order: lessons.length + 1,
          videoUrl: videoUrl || null,
          pdfUrl: pdfUrl || null,
        }),
      })

      if (!res.ok) throw new Error()
      toast.success("Lección agregada")
      setAdding(false)
      setVideoFile(null)
      setPdfFile(null)
      router.refresh()
    } catch {
      toast.error("Error al guardar la lección")
    } finally {
      setLoading(false)
    }
  }

  async function handleDelete(lessonId: string) {
    if (!confirm("¿Eliminar esta lección?")) return
    const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}/lessons/${lessonId}`, {
      method: "DELETE",
    })
    if (!res.ok) { toast.error("Error al eliminar"); return }
    toast.success("Lección eliminada")
    router.refresh()
  }

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-600">Lecciones</p>

      {lessons.map((lesson) => (
        <div key={lesson.id} className="flex items-center justify-between bg-white rounded-lg p-3 border">
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 w-5">{lesson.order}.</span>
            <div>
              <p className="text-sm font-medium">{lesson.title}</p>
              <div className="flex gap-2 mt-1">
                {lesson.videoUrl && <Badge variant="secondary" className="text-xs gap-1"><FileVideo size={10} /> Video</Badge>}
                {lesson.pdfUrl && <Badge variant="secondary" className="text-xs gap-1"><FileText size={10} /> PDF</Badge>}
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => handleDelete(lesson.id)}>
            <Trash2 size={13} className="text-red-400" />
          </Button>
        </div>
      ))}

      {adding ? (
        <form onSubmit={handleAdd} className="bg-white rounded-lg p-4 border space-y-3">
          <div className="space-y-1">
            <Label className="text-xs">Título de la lección</Label>
            <Input name="title" required placeholder="Ej: Clase 1 - Bienvenida" className="h-8 text-sm" />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">Video (MP4, MOV)</Label>
            <Input type="file" accept="video/*" className="h-8 text-sm" onChange={(e) => setVideoFile(e.target.files?.[0] || null)} />
          </div>
          <div className="space-y-1">
            <Label className="text-xs">PDF</Label>
            <Input type="file" accept=".pdf" className="h-8 text-sm" onChange={(e) => setPdfFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" className="bg-purple-700 hover:bg-purple-800 text-xs" disabled={loading}>
              {loading ? "Subiendo..." : "Guardar lección"}
            </Button>
            <Button type="button" size="sm" variant="outline" className="text-xs" onClick={() => setAdding(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      ) : (
        <Button variant="ghost" size="sm" className="w-full text-xs border border-dashed" onClick={() => setAdding(true)}>
          <Plus size={12} className="mr-1" /> Agregar lección
        </Button>
      )}
    </div>
  )
}
