"use client"

import { signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export function SignOutButton() {
  return (
    <Button
      variant="ghost"
      size="sm"
      className="w-full justify-start text-gray-600 hover:text-red-600"
      onClick={() => signOut({ callbackUrl: "/login" })}
    >
      <LogOut size={16} className="mr-2" /> Cerrar sesión
    </Button>
  )
}
