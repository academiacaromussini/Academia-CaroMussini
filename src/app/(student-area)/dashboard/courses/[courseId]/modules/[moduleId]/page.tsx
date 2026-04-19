import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { FileText } from "lucide-react"
import { Badge } from "@/components/ui/badge"

export default async function ModulePage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>
}) {
  const { moduleId } = await params

  const module = await prisma.module.findUnique({
    where: { id: moduleId },
    include: { lessons: { orderBy: { order: "asc" } } },
  })

  if (!module) notFound()

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <Badge variant="outline" className="mb-2">Módulo {module.order}</Badge>
        <h1 className="text-2xl font-bold text-gray-800">{module.title}</h1>
        {module.description && <p className="text-gray-500 mt-1">{module.description}</p>}
      </div>

      <div className="space-y-8">
        {module.lessons.map((lesson) => (
          <div key={lesson.id} className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">
              {lesson.order}. {lesson.title}
            </h2>

            {lesson.videoUrl && (
              <div className="rounded-xl overflow-hidden bg-black aspect-video">
                <video
                  controls
                  className="w-full h-full"
                  controlsList="nodownload"
                  src={lesson.videoUrl}
                />
              </div>
            )}

            {lesson.pdfUrl && (
              <a
                href={lesson.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 p-3 border rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-colors w-fit"
              >
                <FileText size={18} className="text-purple-600" />
                <span className="text-sm font-medium text-purple-700">Descargar material PDF</span>
              </a>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
