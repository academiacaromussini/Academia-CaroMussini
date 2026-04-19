import { CourseForm } from "@/components/admin/CourseForm"

export default function NewCoursePage() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Nuevo curso</h1>
      <CourseForm />
    </div>
  )
}
