import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, BookOpen } from "lucide-react"

export default async function AdminCoursesPage() {
  const courses = await prisma.course.findMany({
    include: { _count: { select: { modules: true, enrollments: true } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Cursos</h1>
        <Link href="/admin/courses/new">
          <Button className="bg-purple-700 hover:bg-purple-800">
            <Plus size={16} className="mr-2" /> Nuevo curso
          </Button>
        </Link>
      </div>

      {courses.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16 text-gray-400">
            <BookOpen size={48} className="mb-4" />
            <p>No hay cursos todavía</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="flex items-center justify-between py-4">
                <div className="flex items-center gap-4">
                  {course.image ? (
                    <img src={course.image} alt={course.title} className="w-16 h-16 rounded-lg object-cover" />
                  ) : (
                    <div className="w-16 h-16 rounded-lg bg-purple-100 flex items-center justify-center">
                      <BookOpen className="text-purple-400" size={24} />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-gray-800">{course.title}</h3>
                    <p className="text-sm text-gray-500">
                      {course._count.modules} módulos · {course._count.enrollments} alumnos
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={course.published ? "default" : "secondary"}>
                    {course.published ? "Publicado" : "Borrador"}
                  </Badge>
                  <Link href={`/admin/courses/${course.id}`}>
                    <Button variant="outline" size="sm">Editar</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
