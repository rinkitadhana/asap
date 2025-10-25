import { useQuery } from "@tanstack/react-query"
import api from "@/shared/lib/axiosInstance"

export const useGetMe = () => {
  return useQuery({
    queryKey: ["get-me"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me")
      return data.user
    },
    staleTime: 1000 * 60 * 5,
  })
}


