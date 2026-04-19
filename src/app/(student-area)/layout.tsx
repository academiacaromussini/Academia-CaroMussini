import Link from "next/link"
import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Home, BookOpen } from "lucide-react"
import { SignOutButton } from "@/components/shared/SignOutButton"

export default async function StudentLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="text-2xl font-bold text-purple-700">MI</Link>
          <nav className="flex items-center gap-6">
            <Link href="/dashboard" className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-purple-700 transition-colors">
              <Home size={16} /> Inicio
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{session.user.name}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
