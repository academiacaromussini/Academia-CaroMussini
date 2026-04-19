import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ForumSection } from "@/components/student/ForumSection"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default async function CourseDetailPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const session = await auth()
  const userId = session!.user!.id!

  const course = await prisma.course.findUnique({
    where: { id: courseId },
    include: { modules: { orderBy: { order: "asc" }, include: { lessons: { orderBy: { order: "asc" } } } } },
  })

  if (!course) notFound()

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        {course.image && (
          <img src={course.image} alt={course.title} className="w-full h-56 object-cover rounded-xl" />
        )}
        <h1 className="text-2xl font-bold text-gray-800">{course.title}</h1>
        <p className="text-gray-600">{course.description}</p>
      </div>

      <Tabs defaultValue="modules">
        <TabsList>
          <TabsTrigger value="modules">Módulos</TabsTrigger>
          <TabsTrigger value="forum">Foro</TabsTrigger>
        </TabsList>

        <TabsContent value="modules" className="mt-4 space-y-3">
          {course.modules.map((mod) => (
            <Card key={mod.id}>
              <CardContent className="py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-800">{mod.title}</p>
                    <p className="text-xs text-gray-500">{mod.lessons.length} lecciones</p>
                  </div>
                  <Link href={`/dashboard/courses/${courseId}/modules/${mod.id}`}>
                    <Badge className="bg-purple-700 hover:bg-purple-800 cursor-pointer">Ver módulo</Badge>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="forum" className="mt-4">
          <ForumSection courseId={courseId} userId={userId} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
