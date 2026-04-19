import { notFound } from "next/navigation"
import { prisma } from "@/lib/prisma"
import { CourseForm } from "@/components/admin/CourseForm"
import { ModuleList } from "@/components/admin/ModuleList"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function EditCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  })

  if (!course) notFound()

  return (
    <div className="max-w-3xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
      <Tabs defaultValue="info">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="modules">Módulos ({course.modules.length})</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="mt-4">
          <CourseForm course={course} />
        </TabsContent>
        <TabsContent value="modules" className="mt-4">
          <ModuleList courseId={courseId} modules={course.modules} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
