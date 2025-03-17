import { useQuery } from "@tanstack/react-query"
import { getUserInfo } from "../actions";

export const useGetUserInfo = (userId: string) => {
  return useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const userInfo = await getUserInfo(userId);
      return userInfo;
    },
    // refetchInterval: 60000, // refetch every minute
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}