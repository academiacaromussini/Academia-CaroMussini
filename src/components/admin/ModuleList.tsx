"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Plus, ChevronDown, ChevronUp, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { LessonManager } from "./LessonManager"

interface Lesson {
  id: string
  title: string
  videoUrl: string | null
  pdfUrl: string | null
  order: number
}

interface Module {
  id: string
  title: string
  description: string | null
  order: number
  lessons: Lesson[]
}

export function ModuleList({ courseId, modules }: { courseId: string; modules: Module[] }) {
  const router = useRouter()
  const [expanded, setExpanded] = useState<string | null>(null)
  const [adding, setAdding] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleAddModule(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const res = await fetch(`/api/courses/${courseId}/modules`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.get("title"),
        description: form.get("description"),
        order: modules.length + 1,
      }),
    })

    setLoading(false)
    if (!res.ok) { toast.error("Error al crear módulo"); return }
    toast.success("Módulo creado")
    setAdding(false)
    router.refresh()
  }

  async function handleDelete(moduleId: string) {
    if (!confirm("¿Eliminar este módulo?")) return
    const res = await fetch(`/api/courses/${courseId}/modules/${moduleId}`, { method: "DELETE" })
    if (!res.ok) { toast.error("Error al eliminar"); return }
    toast.success("Módulo eliminado")
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {modules.map((mod) => (
        <Card key={mod.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div
              className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
              onClick={() => setExpanded(expanded === mod.id ? null : mod.id)}
            >
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="text-xs">Módulo {mod.order}</Badge>
                <div>
                  <p className="font-medium text-gray-800">{mod.title}</p>
                  <p className="text-xs text-gray-500">{mod.lessons.length} lecciones</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={(e) => { e.stopPropagation(); handleDelete(mod.id) }}>
                  <Trash2 size={14} className="text-red-400" />
                </Button>
                {expanded === mod.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {expanded === mod.id && (
              <div className="border-t p-4 bg-gray-50">
                <LessonManager courseId={courseId} moduleId={mod.id} lessons={mod.lessons} />
              </div>
            )}
          </CardContent>
        </Card>
      ))}

      {adding ? (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handleAddModule} className="space-y-3">
              <div className="space-y-1">
                <Label>Título del módulo</Label>
                <Input name="title" required placeholder="Ej: Módulo 1 - Introducción" />
              </div>
              <div className="space-y-1">
                <Label>Descripción</Label>
                <Textarea name="description" rows={2} placeholder="Descripción opcional..." />
              </div>
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="bg-purple-700 hover:bg-purple-800" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar módulo"}
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setAdding(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      ) : (
        <Button variant="outline" className="w-full border-dashed" onClick={() => setAdding(true)}>
          <Plus size={16} className="mr-2" /> Agregar módulo
        </Button>
      )}
    </div>
  )
}
