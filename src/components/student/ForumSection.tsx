"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Send } from "lucide-react"
import { toast } from "sonner"
import { formatDistanceToNow } from "date-fns"
import { es } from "date-fns/locale"

interface Reply {
  id: string
  content: string
  createdAt: string
  user: { id: string; name: string | null; role: string }
}

interface Post {
  id: string
  title: string
  content: string
  createdAt: string
  user: { id: string; name: string | null; role: string }
  replies: Reply[]
}

export function ForumSection({ courseId, userId }: { courseId: string; userId: string }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [newPost, setNewPost] = useState(false)
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetch(`/api/forum?courseId=${courseId}`)
      .then((r) => r.json())
      .then(setPosts)
  }, [courseId])

  async function handlePost(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const res = await fetch("/api/forum", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: form.get("title"), content: form.get("content"), courseId }),
    })
    setLoading(false)
    if (!res.ok) { toast.error("Error al publicar"); return }
    const post = await res.json()
    setPosts([post, ...posts])
    setNewPost(false)
    toast.success("Publicación creada")
  }

  async function handleReply(e: React.FormEvent<HTMLFormElement>, postId: string) {
    e.preventDefault()
    setLoading(true)
    const form = new FormData(e.currentTarget)
    const res = await fetch(`/api/forum/${postId}/replies`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: form.get("content") }),
    })
    setLoading(false)
    if (!res.ok) { toast.error("Error al responder"); return }
    const reply = await res.json()
    setPosts(posts.map((p) => p.id === postId ? { ...p, replies: [...p.replies, reply] } : p))
    setReplyingTo(null)
    toast.success("Respuesta enviada")
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-sm text-gray-500">{posts.length} publicaciones</p>
        <Button size="sm" className="bg-purple-700 hover:bg-purple-800" onClick={() => setNewPost(!newPost)}>
          <MessageSquare size={14} className="mr-1" /> Nueva pregunta
        </Button>
      </div>

      {newPost && (
        <Card>
          <CardContent className="pt-4">
            <form onSubmit={handlePost} className="space-y-3">
              <Input name="title" required placeholder="Título de tu pregunta" />
              <Textarea name="content" required rows={3} placeholder="Describí tu duda..." />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="bg-purple-700 hover:bg-purple-800" disabled={loading}>
                  Publicar
                </Button>
                <Button type="button" size="sm" variant="outline" onClick={() => setNewPost(false)}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {posts.length === 0 ? (
        <p className="text-center text-gray-400 py-8">Sé el primero en hacer una pregunta</p>
      ) : (
        posts.map((post) => (
          <Card key={post.id}>
            <CardContent className="pt-4 space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-medium text-sm">{post.user.name}</span>
                  {post.user.role === "ADMIN" && <Badge className="text-xs bg-purple-100 text-purple-700">Profesora</Badge>}
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: es })}
                  </span>
                </div>
                <p className="font-semibold text-gray-800">{post.title}</p>
                <p className="text-sm text-gray-600 mt-1">{post.content}</p>
              </div>

              {post.replies.length > 0 && (
                <div className="border-l-2 border-purple-100 pl-4 space-y-2">
                  {(expanded === post.id ? post.replies : post.replies.slice(0, 2)).map((reply) => (
                    <div key={reply.id}>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-medium">{reply.user.name}</span>
                        {reply.user.role === "ADMIN" && <Badge className="text-xs bg-purple-100 text-purple-700">Profesora</Badge>}
                      </div>
                      <p className="text-sm text-gray-600">{reply.content}</p>
                    </div>
                  ))}
                  {post.replies.length > 2 && (
                    <button className="text-xs text-purple-600 hover:underline" onClick={() => setExpanded(expanded === post.id ? null : post.id)}>
                      {expanded === post.id ? "Ver menos" : `Ver ${post.replies.length - 2} respuestas más`}
                    </button>
                  )}
                </div>
              )}

              {replyingTo === post.id ? (
                <form onSubmit={(e) => handleReply(e, post.id)} className="flex gap-2">
                  <Input name="content" required placeholder="Tu respuesta..." className="flex-1 h-8 text-sm" />
                  <Button type="submit" size="sm" disabled={loading}><Send size={13} /></Button>
                  <Button type="button" size="sm" variant="outline" onClick={() => setReplyingTo(null)}>✕</Button>
                </form>
              ) : (
                <button className="text-xs text-purple-600 hover:underline" onClick={() => setReplyingTo(post.id)}>
                  Responder
                </button>
              )}
            </CardContent>
          </Card>
        ))
      )}
    </div>
  )
}
