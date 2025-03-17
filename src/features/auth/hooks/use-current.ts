import { getCurrent } from "@/features/auth/queries";
import { useQuery } from "@tanstack/react-query"


export const useCurrent = () => {
  const query = useQuery<any>({
    queryKey: ["current"],
    queryFn: async () => {
      const user = await getCurrent();

      return user;
    },
  })

  return query;
}