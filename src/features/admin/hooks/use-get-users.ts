import { useQuery } from "@tanstack/react-query";
import { getUsers } from "../admin-service";

export const useGetUsers = () => {
  return useQuery({
    queryKey: ["users"],
    queryFn: async () => {
      const users = await getUsers();
      return users;
    },
  });
};
