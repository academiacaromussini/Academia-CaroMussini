"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { signIn } from "next-auth/react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export default function RegisterPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name"),
        email: form.get("email"),
        password: form.get("password"),
      }),
    })

    if (!res.ok) {
      const data = await res.json()
      toast.error(data.error || "Error al registrarse")
      setLoading(false)
      return
    }

    await signIn("credentials", {
      email: form.get("email"),
      password: form.get("password"),
      redirect: false,
    })

    router.push("/dashboard")
    router.refresh()
  }

  return (
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="text-4xl font-bold text-purple-700 mb-1">MI</div>
        <CardTitle className="text-xl text-gray-600">Crear cuenta</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <Label htmlFor="name">Nombre completo</Label>
            <Input id="name" name="name" required placeholder="Tu nombre" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required placeholder="tu@email.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="password">Contraseña</Label>
            <Input id="password" name="password" type="password" required placeholder="Mínimo 8 caracteres" minLength={8} />
          </div>
          <Button type="submit" className="w-full bg-purple-700 hover:bg-purple-800" disabled={loading}>
            {loading ? "Creando cuenta..." : "Registrarse"}
          </Button>
        </form>
        <p className="text-center text-sm text-gray-500 mt-4">
          ¿Ya tenés cuenta?{" "}
          <Link href="/login" className="text-purple-700 hover:underline font-medium">
            Iniciá sesión
          </Link>
        </p>
      </CardContent>
    </Card>
  )
}
