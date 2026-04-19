import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function HomePage() {
  const session = await auth()

  if (session?.user?.role === "ADMIN") redirect("/admin/dashboard")
  if (session?.user) redirect("/dashboard")

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex flex-col">
      <header className="px-8 py-5 flex items-center justify-between">
        <span className="text-3xl font-bold text-purple-700">MI</span>
        <div className="flex gap-3">
          <Link href="/login">
            <Button variant="ghost" className="text-purple-700">Ingresar</Button>
          </Link>
          <Link href="/register">
            <Button className="bg-purple-700 hover:bg-purple-800">Registrarse</Button>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center text-center px-4 space-y-6">
        <h1 className="text-5xl font-bold text-gray-800 max-w-2xl leading-tight">
          Tu camino hacia el <span className="text-purple-700">bienestar holístico</span>
        </h1>
        <p className="text-lg text-gray-500 max-w-xl">
          Accedé a cursos de terapia holística, aprendé a tu ritmo y transformá tu vida.
        </p>
        <div className="flex gap-4">
          <Link href="/register">
            <Button size="lg" className="bg-purple-700 hover:bg-purple-800 px-8">
              Comenzar ahora
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="border-purple-300 text-purple-700 hover:bg-purple-50 px-8">
              Ya tengo cuenta
            </Button>
          </Link>
        </div>
      </main>
    </div>
  )
}
