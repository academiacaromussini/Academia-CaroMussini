import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

export default async function StudentDashboard() {
  const session = await auth()

  const courses = await prisma.course.findMany({
    where: { published: true },
    include: { modules: { orderBy: { order: "asc" } } },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-1">
          Bienvenida, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-gray-500">Explorá los cursos disponibles</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardContent className="pt-5">
              {course.image && (
                <img src={course.image} alt={course.title} className="w-full h-36 object-cover rounded-lg mb-4" />
              )}
              <h3 className="font-semibold text-gray-800">{course.title}</h3>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{course.description}</p>
              <p className="text-xs text-gray-400 mt-2">{course.modules.length} módulos</p>
              <Link href={`/dashboard/courses/${course.id}`} className="block mt-3">
                <Button size="sm" className="w-full bg-purple-700 hover:bg-purple-800">
                  Ver curso
                </Button>
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
