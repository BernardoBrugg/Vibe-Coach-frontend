import { useQuery } from "@tanstack/react-query";
import { getAllUsers } from "../services/api";
import { QUERY_KEYS } from "../constants/queryKeys";

export const useAllUsers = () => {
  const {
    data: users,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: [QUERY_KEYS.USER, "all"],
    queryFn: getAllUsers,
  });

  return {
    users: users || [],
    isLoading,
    error,
    refetch,
  };
};
