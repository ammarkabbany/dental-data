import { useQuery } from "@tanstack/react-query"
import { GetTemplateById } from "../actions"

export const useGetTemplateById = (id: string) => {
  return useQuery({
    queryKey: ['template', id],
    queryFn: async () => {
      const template = await GetTemplateById(id);
      return template;
    },
  })
}