import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { BookOpen, LayoutDashboard, Users } from "lucide-react"
import { SignOutButton } from "@/components/shared/SignOutButton"

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (session?.user?.role !== "ADMIN") redirect("/login")

  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 bg-white border-r flex flex-col">
        <div className="p-6 border-b">
          <div className="text-3xl font-bold text-purple-700">MI</div>
          <p className="text-xs text-gray-500 mt-1">Panel de Administración</p>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link href="/admin/dashboard" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
            <LayoutDashboard size={18} /> Dashboard
          </Link>
          <Link href="/admin/courses" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
            <BookOpen size={18} /> Cursos
          </Link>
          <Link href="/admin/students" className="flex items-center gap-3 px-3 py-2 rounded-lg text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors">
            <Users size={18} /> Alumnos
          </Link>
        </nav>
        <div className="p-4 border-t">
          <p className="text-sm text-gray-600 mb-2 truncate">{session.user?.name}</p>
          <SignOutButton />
        </div>
      </aside>
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
