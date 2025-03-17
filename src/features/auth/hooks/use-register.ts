import { useMutation } from "@tanstack/react-query"


export const useRegister = () => {
  const mutation = useMutation({
    mutationFn: async ({ data }: {data: unknown}) => {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();
      if (!response.ok) {
        throw new Error(result.message);
      }
      return result;
    },
  })

  return mutation;
}