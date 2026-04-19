import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default async function StudentsPage() {
  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    include: {
      enrollments: {
        include: { course: { select: { title: true } }, moduleAccesses: true },
      },
    },
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Alumnos ({students.length})</h1>

      {students.length === 0 ? (
        <p className="text-gray-500">No hay alumnos registrados aún</p>
      ) : (
        <div className="grid gap-3">
          {students.map((student) => (
            <Card key={student.id}>
              <CardContent className="flex items-center justify-between py-4">
                <div>
                  <p className="font-medium text-gray-800">{student.name}</p>
                  <p className="text-sm text-gray-500">{student.email}</p>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                  {student.enrollments.length === 0 ? (
                    <span className="text-xs text-gray-400">Sin cursos</span>
                  ) : (
                    student.enrollments.map((e) => (
                      <Badge key={e.id} variant="secondary" className="text-xs">
                        {e.course.title} · {e.moduleAccesses.length} módulos
                      </Badge>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
