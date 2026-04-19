"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const res = await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })

    setLoading(false)

    if (res?.error) {
      toast.error("Email o contraseña incorrectos")
      return
    }

    const meRes = await fetch("/api/auth/session")
    const session = await meRes.json()
    router.push(session?.user?.role === "ADMIN" ? "/admin/dashboard" : "/dashboard")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="text-4xl font-bold text-purple-700 mb-1">MI</div>
        <CardTitle className="text-xl text-gray-600">Iniciar sesión</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required placeholder="••••••••" />
          </div>
          <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={loading}>
            {loading ? "Ingresando..." : "Ingresar"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿No tenés cuenta?{" "}
          <Link href="/register" className="text-purple-700 hover:underline font-medium">
            Registrate
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
