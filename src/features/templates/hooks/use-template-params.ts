"use client"

import { useSearchParams } from "next/navigation"

export const useTemplateParams = () => {
  const searchParams = useSearchParams();

  return {
    templateId: searchParams.get('templateId'),
    doctorId: searchParams.get('doctor'),
    materialId: searchParams.get('material'),
    note: searchParams.get('note'),
    shade: searchParams.get('shade')
  }
}