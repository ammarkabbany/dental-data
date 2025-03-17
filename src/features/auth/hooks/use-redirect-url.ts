"use client"

import { useSearchParams } from "next/navigation";

export const useRedirectUrl = () => {
  const params = useSearchParams();
  return params.get('redirect') as string;
}