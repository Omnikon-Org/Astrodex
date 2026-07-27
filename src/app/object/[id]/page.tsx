"use client"

import { useParams } from "next/navigation"
import Home from "@/app/page"

export default function ObjectDetailPage() {
  const params = useParams<{ id: string }>()
  return <Home initialObjectId={params?.id} />
}