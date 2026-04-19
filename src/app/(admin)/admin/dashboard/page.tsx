import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/card"
import { BookOpen, Users } from "lucide-react"

export default async function AdminDashboard() {
  const [totalStudents, totalCourses] = await Promise.all([
    prisma.user.count({ where: { role: "STUDENT" } }),
    prisma.course.count(),
  ])

  const stats = [
    { title: "Alumnos", value: totalStudents, icon: Users, color: "text-blue-600" },
    { title: "Cursos", value: totalCourses, icon: BookOpen, color: "text-purple-600" },
  ]

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stats.map((s) => (
          <Card key={s.title}>
            <CardContent className="flex items-center gap-4 pt-6">
              <s.icon className={`${s.color} shrink-0`} size={32} />
              <div>
                <p className="text-sm text-gray-500">{s.title}</p>
                <p className="text-2xl font-bold text-gray-800">{s.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
