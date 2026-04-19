"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

interface CourseFormProps {
  course?: {
    id: string
    title: string
    description: string
    image?: string | null
    published: boolean
  }
}

export function CourseForm({ course }: CourseFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState(course?.image || "")

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    let imageUrl = course?.image || ""

    if (imageFile) {
      const uploadData = new FormData()
      uploadData.append("file", imageFile)
      uploadData.append("type", "image")
      const uploadRes = await fetch("/api/upload", { method: "POST", body: uploadData })
      if (uploadRes.ok) {
        const { url } = await uploadRes.json()
        imageUrl = url
      }
    }

    const payload = {
      title: form.get("title"),
      description: form.get("description"),
      image: imageUrl,
      published: form.get("published") === "on",
    }

    const url = course ? `/api/courses/${course.id}` : "/api/courses"
    const method = course ? "PATCH" : "POST"

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })

    setLoading(false)

    if (!res.ok) {
      toast.error("Error al guardar el curso")
      return
    }

    const saved = await res.json()
    toast.success(course ? "Curso actualizado" : "Curso creado")
    router.push(`/admin/courses/${saved.id}`)
    router.refresh()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{course ? "Editar curso" : "Nuevo curso"}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1">
            <Label>Título</Label>
            <Input name="title" defaultValue={course?.title} required placeholder="Nombre del curso" />
          </div>
          <div className="space-y-1">
            <Label>Descripción</Label>
            <Textarea name="description" defaultValue={course?.description} required rows={4} placeholder="Descripción del curso..." />
          </div>
          <div className="space-y-1">
            <Label>Imagen de portada</Label>
            {imagePreview && (
              <img src={imagePreview} alt="preview" className="w-full h-40 object-cover rounded-lg mb-2" />
            )}
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) {
                  setImageFile(f)
                  setImagePreview(URL.createObjectURL(f))
                }
              }}
            />
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="published" name="published" defaultChecked={course?.published} className="rounded" />
            <Label htmlFor="published">Publicar curso</Label>
          </div>
          <div className="flex gap-3">
            <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={loading}>
              {loading ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
